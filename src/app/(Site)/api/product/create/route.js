import connectToDB from "base/configs/db";
import Product from "base/models/Product";
import Category from "base/models/Category";
import { createSlug } from "base/utils/slugify";
import { v2 as cloudinary } from "cloudinary";

/* ----------------------------------
   Cloudinary config
---------------------------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ----------------------------------
   Generate unique SKU
---------------------------------- */
async function generateUniqueSKU(name) {
  const base = createSlug(name);
  let sku;
  let exists = true;

  while (exists) {
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    sku = `${base}-${rand}`;
    exists = await Product.exists({ sku });
  }

  return sku;
}

/* ----------------------------------
   Cloudinary helpers
---------------------------------- */
function extractPublicId(url) {
  const parts = url.split("/upload/")[1];
  const withoutVersion = parts.replace(/v\d+\//, "");
  return withoutVersion.replace(/\.[^/.]+$/, "");
}

async function renameCloudinaryImage(imageUrl, sku, index = null) {
  if (!imageUrl) return null;

  const oldPublicId = extractPublicId(imageUrl);
  const folder = oldPublicId.split("/").slice(0, -1).join("/");

  const newPublicId =
    index !== null
      ? `${folder}/${sku}-${index}`
      : `${folder}/${sku}`;

  const result = await cloudinary.uploader.rename(
    oldPublicId,
    newPublicId,
    { overwrite: true }
  );

  return result.secure_url;
}

/* ----------------------------------
   POST: Create Product
---------------------------------- */
export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();

    const {
      name,
      modelName,
      shortDescription,
      longDescription,
      suitableFor,
      basePrice,
      category,
      tag,
      mainImage,
      gallery,
      brand,
      athlete,
      sport,
      attributes,
    } = body;

    /* -------------------------------
       Validate Required Fields
    ------------------------------- */
    const requiredFields = {
      name,
      modelName,
      shortDescription,
      longDescription,
      suitableFor,
      category,
      mainImage,
      brand,
      sport,
    };

    for (const key in requiredFields) {
      if (!requiredFields[key]) {
        return Response.json(
          { error: `${key} is required` },
          { status: 400 }
        );
      }
    }

    /* -------------------------------
       Validate Category
    ------------------------------- */
    const foundCategory = await Category.findById(category);
    if (!foundCategory) {
      return Response.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    /* -------------------------------
       Validate Attributes
    ------------------------------- */
    const allowedAttrs = foundCategory.attributes.map(a => a.name);

    if (attributes) {
      for (const key of Object.keys(attributes)) {
        if (!allowedAttrs.includes(key)) {
          return Response.json(
            { error: `Attribute "${key}" is not allowed` },
            { status: 400 }
          );
        }
      }

      for (const attr of foundCategory.attributes) {
        if (attr.required && attributes[attr.name] == null) {
          return Response.json(
            { error: `Attribute "${attr.name}" is required` },
            { status: 400 }
          );
        }
      }
    }

    /* -------------------------------
       Generate SKU
    ------------------------------- */
    const sku = await generateUniqueSKU(name);

    /* -------------------------------
       Rename images in Cloudinary
    ------------------------------- */
    const normalizedMainImage =
      await renameCloudinaryImage(mainImage, sku);

    const normalizedGallery = Array.isArray(gallery)
      ? await Promise.all(
          gallery.map((img, i) =>
            renameCloudinaryImage(img, sku, i + 1)
          )
        )
      : [];

    /* -------------------------------
       Create Product
    ------------------------------- */
    const product = await Product.create({
      name,
      modelName,
      shortDescription,
      longDescription,
      suitableFor,
      sku,
      basePrice: Number(basePrice) || 0,
      category,
      tag: Array.isArray(tag)
        ? tag
        : typeof tag === "string"
        ? tag.split(",").map(t => t.trim())
        : [],
      mainImage: normalizedMainImage,
      gallery: normalizedGallery,
      brand,
      athlete: athlete || null,
      sport,
      attributes: attributes || {},
    });

    return Response.json(
      {
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    );

  } catch (err) {
    console.error(err);
    return Response.json(
      {
        error: "Internal server error",
        detail: err.message,
      },
      { status: 500 }
    );
  }
}
