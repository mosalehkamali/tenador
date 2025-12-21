import connectToDB from "base/configs/db";
import Product from "base/models/Product";
import Category from "base/models/Category";
import { createSlug } from "base/utils/slugify";
import { rename, access } from "fs/promises";
import { join } from "path";

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
 * Rename image file based on SKU
 */
async function renameImageBySKU(imageUrl, sku, index = null) {
  if (!imageUrl) return null;

  const parsed = imageUrl.split("/");
  const fileName = parsed.pop();
  const folderPath = parsed.join("/");

  const ext = fileName.split(".").pop();
  const newFileName = index !== null
    ? `${sku}-${index}.${ext}`
    : `${sku}.${ext}`;

  const oldPath = join(process.cwd(), "public", folderPath, fileName);
  const newPath = join(process.cwd(), "public", folderPath, newFileName);

  try {
    await access(oldPath);
    await rename(oldPath, newPath);
  } catch (err) {
    throw new Error(`Image file not found: ${imageUrl}`);
  }

  return `${folderPath}/${newFileName}`;
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
    // Validate Required Fields
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
      if (!requiredFields[key]) {
        return Response.json(
          { error: `${key} is required` },
          { status: 400 }
        );
      }
    }

    // -------------------------------
    // Validate Category
    // -------------------------------
    const foundCategory = await Category.findById(category);
    if (!foundCategory) {
      return Response.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // -------------------------------
    // Validate Attributes
    // -------------------------------
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

    // -------------------------------
    // Generate SKU
    // -------------------------------
    const sku = await generateUniqueSKU(name);

    // -------------------------------
    // Rename Images Physically
    // -------------------------------
    const normalizedMainImage = await renameImageBySKU(mainImage, sku);

    const normalizedGallery = Array.isArray(gallery)
      ? await Promise.all(
          gallery.map((img, i) =>
            renameImageBySKU(img, sku, i + 1)
          )
        )
      : [];

    // -------------------------------
    // Create Product
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
