// app/api/product/[productId]/route.js
import connectToDB from "base/configs/db";
import Product from "base/models/Product";
import Brand from "base/models/Brand";
import Sport from "base/models/Sport";
import Athlete from "base/models/Athlete";
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

  try {
    const u = new URL(url);
    const pathname = u.pathname;

    const uploadIndex = pathname.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    let publicPath = pathname.slice(uploadIndex + 8); // بعد از /upload/

    // حذف version اگه بود
    publicPath = publicPath.replace(/^v\d+\//, "");

    // حذف extension
    publicPath = publicPath.replace(/\.[^/.]+$/, "");

    return publicPath;
  } catch {
    return null;
  }
}



const REDIS_PREFIX = "pricecache:product:";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const resolvedParams = await params;
    const productId = resolvedParams.productId || resolvedParams.id;
    
    const product = await Product.findById(productId)
    .populate('brand')
    .populate('sport')
    .populate('athlete')
    .populate('category')
    .lean();
    
    if (!product) {
      return NextResponse.json({ error: "محصول پیدا نشد" }, { status: 404 });
    }
    
    // fallback to DB cache
    const priceDoc = await PriceCache.findOne({ productId }).lean();
    const price = priceDoc || { finalPrice: product.basePrice, bestDiscount: 0 };
    
    return NextResponse.json({ product, price });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDB();

    const resolvedParams = await params;
    const productId = resolvedParams.productId || resolvedParams.id;
    console.log(productId);
    
    const body = await req.json();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "محصول پیدا نشد" },
        { status: 404 }
      );
    }

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

    // -------------------------
    // Validate Category + Attributes
    // -------------------------
    let finalCategoryId = category || product.category;

    if (category) {
      const foundCategory = await Category.findById(category);
      if (!foundCategory) {
        return NextResponse.json(
          { error: "دسته‌بندی پیدا نشد" },
          { status: 404 }
        );
      }
    }

    if (attributes !== undefined) {
      if (typeof attributes !== "object" || Array.isArray(attributes)) {
        return NextResponse.json(
          { error: "فرمت attributes نامعتبر است" },
          { status: 400 }
        );
      }

      const foundCategory = await Category.findById(finalCategoryId);
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

    // -------------------------
    // Validate Relations
    // -------------------------
    if (brand) {
      const exists = await Brand.findById(brand);
      if (!exists)
        return NextResponse.json({ error: "برند نامعتبر است" }, { status: 400 });
    }

    if (sport) {
      const exists = await Sport.findById(sport);
      if (!exists)
        return NextResponse.json({ error: "ورزش نامعتبر است" }, { status: 400 });
    }

    if (athlete !== undefined && athlete !== null) {
      const exists = await Athlete.findById(athlete);
      if (!exists)
        return NextResponse.json({ error: "ورزشکار نامعتبر است" }, { status: 400 });
    }

    // -------------------------
    // Update Fields
    // -------------------------
    if (name !== undefined) product.name = name.trim();
    if (modelName !== undefined) product.modelName = modelName.trim();
    if (shortDescription !== undefined)
      product.shortDescription = shortDescription.trim();
    if (longDescription !== undefined)
      product.longDescription = longDescription.trim();
    if (suitableFor !== undefined)
      product.suitableFor = suitableFor.trim();

    if (basePrice !== undefined) {
      const parsedPrice = Number(basePrice);
      if (isNaN(parsedPrice))
        return NextResponse.json(
          { error: "قیمت نامعتبر است" },
          { status: 400 }
        );
      product.basePrice = parsedPrice;
    }

    if (category !== undefined) product.category = category;

    if (tag !== undefined) {
      if (Array.isArray(tag)) {
        product.tag = tag;
      } else if (typeof tag === "string") {
        product.tag = tag
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      } else {
        return NextResponse.json(
          { error: "فرمت tag نامعتبر است" },
          { status: 400 }
        );
      }
    }

    if (mainImage !== undefined) product.mainImage = mainImage;
    if (gallery !== undefined) {
      if (!Array.isArray(gallery))
        return NextResponse.json(
          { error: "gallery باید آرایه باشد" },
          { status: 400 }
        );
      product.gallery = gallery;
    }

    if (brand !== undefined) product.brand = brand;
    if (athlete !== undefined) product.athlete = athlete || null;
    if (sport !== undefined) product.sport = sport;

    if (attributes !== undefined) product.attributes = attributes;

    await product.save(); // middleware slug اجرا میشه

    const populatedProduct = await Product.findById(product._id)
      .populate("brand")
      .populate("sport")
      .populate("athlete")
      .populate("category")
      .lean();

    return NextResponse.json({
      message: "محصول با موفقیت به‌روزرسانی شد",
      product: populatedProduct,
    });
  } catch (error) {
    console.error(error);
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

