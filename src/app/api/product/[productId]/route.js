// app/api/product/[productId]/route.js
import connectToDB from "base/configs/db";
import Product from "base/models/Product";
import Category from "base/models/Category";
import PriceCache from "base/models/PriceCache";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
function extractPublicId(url) {
  if (!url) return null;
  const parts = url.split("/upload/")[1];
  const withoutVersion = parts.replace(/v\d+\//, "");
  return withoutVersion.replace(/\.[^/.]+$/, "");
}


const REDIS_PREFIX = "pricecache:product:";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const resolvedParams = await params();
    const productId = resolvedParams.productId || resolvedParams.id;
    const rKey = `${REDIS_PREFIX}${productId}`;
    // const cached = await redis.get(rKey);
    const product = await Product.findById(productId)
      .populate('brand')
      .populate('sport')
      .populate('athlete')
      .populate('category')
      .lean();
    
    if (!product) {
      return NextResponse.json({ error: "محصول پیدا نشد" }, { status: 404 });
    }

    if (cached) {
      return NextResponse.json({ product, price: JSON.parse(cached) });
    }

    // fallback to DB cache
    const priceDoc = await PriceCache.findOne({ productId }).lean();
    const price = priceDoc || { finalPrice: product.basePrice, bestDiscount: 0 };
    // optionally warm redis
    // await redis.set(rKey, JSON.stringify(price), "EX", parseInt(process.env.PRICE_CACHE_TTL || "300", 10));
    return NextResponse.json({ product, price });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const resolvedParams = await params();
    const productId = resolvedParams.productId || resolvedParams.id;
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

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "محصول پیدا نشد" },
        { status: 404 }
      );
    }

    // Validate category if provided
    if (category) {
      const foundCategory = await Category.findById(category);
      if (!foundCategory) {
        return NextResponse.json(
          { error: "دسته‌بندی پیدا نشد" },
          { status: 404 }
        );
      }

      // Validate attributes if category changed
      if (attributes && typeof attributes === "object") {
        const allowedAttrs = foundCategory.attributes.map((a) => a.name);
        for (const key of Object.keys(attributes)) {
          if (!allowedAttrs.includes(key)) {
            return NextResponse.json(
              { error: `ویژگی "${key}" برای این دسته‌بندی مجاز نیست` },
              { status: 400 }
            );
          }
        }
      }
    }

    // Update fields
    if (name) product.name = name;
    if (modelName) product.modelName = modelName;
    if (shortDescription) product.shortDescription = shortDescription;
    if (longDescription) product.longDescription = longDescription;
    if (suitableFor) product.suitableFor = suitableFor;
    if (basePrice !== undefined) product.basePrice = basePrice;
    if (category) product.category = category;
    if (tag !== undefined) product.tag = Array.isArray(tag) ? tag : tag.split(',').map(t => t.trim());
    if (mainImage) product.mainImage = mainImage;
    if (gallery !== undefined) product.gallery = gallery;
    if (brand) product.brand = brand;
    if (athlete !== undefined) product.athlete = athlete || null;
    if (sport) product.sport = sport;
    if (attributes !== undefined) product.attributes = attributes;

    await product.save();

    return NextResponse.json({
      message: "محصول با موفقیت به‌روزرسانی شد",
      product,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const resolvedParams =await params;
    const productId = resolvedParams.productId || resolvedParams.id;

    const product = await Product.findById(productId).lean();
    if (!product) {
      return NextResponse.json(
        { error: "محصول پیدا نشد" },
        { status: 404 }
      );
    }

    /* -------------------------------
       Collect images public_ids
    ------------------------------- */
    const publicIds = [];

    if (product.mainImage) {
      const pid = extractPublicId(product.mainImage);
      if (pid) publicIds.push(pid);
    }

    if (Array.isArray(product.gallery)) {
      for (const img of product.gallery) {
        const pid = extractPublicId(img);
        if (pid) publicIds.push(pid);
      }
    }

    /* -------------------------------
       Delete images from Cloudinary
    ------------------------------- */
    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds, {
        resource_type: "image",
      });
    }

    /* -------------------------------
       Delete product from DB
    ------------------------------- */
    await Product.findByIdAndDelete(productId);

    return NextResponse.json({
      message: "محصول و تصاویر آن با موفقیت حذف شدند",
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

