import connectToDB from "base/configs/db";
import Product from "base/models/Product";
import Category from "base/models/Category";
import { createSlug } from "base/utils/slugify";

/**
 * Generate unique SKU
 */
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

/**
 * Normalize image names based on SKU
 */
function normalizeImages({ sku, mainImage, gallery }) {
  let main = mainImage;
  let images = [];

  if (mainImage) {
    const ext = mainImage.split(".").pop();
    main = `${sku}-main.${ext}`;
  }

  if (Array.isArray(gallery)) {
    images = gallery.map((img, index) => {
      const ext = img.split(".").pop();
      return `${sku}-gallery-${index + 1}.${ext}`;
    });
  }

  return { mainImage: main, gallery: images };
}

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

    // -------------------------------
    // 1) Validate Required Fields
    // -------------------------------
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
      if (!requiredFields[key] || requiredFields[key].toString().trim() === "") {
        return Response.json(
          { error: `${key} is required` },
          { status: 400 }
        );
      }
    }

    // -------------------------------
    // 2) Validate Category
    // -------------------------------
    const foundCategory = await Category.findById(category);
    if (!foundCategory) {
      return Response.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // -------------------------------
    // 3) Validate Attributes
    // -------------------------------
    const allowedAttrs = foundCategory.attributes.map(a => a.name);

    if (attributes && typeof attributes === "object") {
      for (const key of Object.keys(attributes)) {
        if (!allowedAttrs.includes(key)) {
          return Response.json(
            { error: `Attribute "${key}" is not allowed for this category` },
            { status: 400 }
          );
        }
      }

      // Required attributes check
      for (const attr of foundCategory.attributes) {
        if (attr.required && attributes[attr.name] == null) {
          return Response.json(
            { error: `Attribute "${attr.name}" is required` },
            { status: 400 }
          );
        }
      }
    }

    // -------------------------------
    // 4) Generate SKU
    // -------------------------------
    const sku = await generateUniqueSKU(name);

    // -------------------------------
    // 5) Normalize Images
    // -------------------------------
    const images = normalizeImages({
      sku,
      mainImage,
      gallery,
    });

    // -------------------------------
    // 6) Create Product
    // -------------------------------
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
      mainImage: images.mainImage,
      gallery: images.gallery,
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
