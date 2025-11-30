import { NextResponse } from "next/server";
import connectDB from "base/utils/connectDB";
import Product from "base/models/Product";
import Variant from "base/models/Variant";
import Category from "base/models/Category";

export async function POST(req, { params }) {
  await connectDB();

  try {
    const { productId } = params;
    const body = await req.json();

    const { sku, price, stock = 0, images = [], attributes } = body;

    if (!sku || !price || !attributes) {
      return NextResponse.json(
        { error: "sku, price و attributes الزامی هستند" },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------------------
    // 1) پیدا کردن محصول
    // ----------------------------------------------------------------------
    const product = await Product.findById(productId).lean();
    if (!product) {
      return NextResponse.json(
        { error: "محصول پیدا نشد" },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------------------
    // 2) پیدا کردن کتگوری محصول
    // ----------------------------------------------------------------------
    const category = await Category.findById(product.category).lean();
    if (!category) {
      return NextResponse.json(
        { error: "کتگوری محصول یافت نشد" },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------------------
    // 3) ولیدیشن داینامیک attributes طبق Category.attributes
    // ----------------------------------------------------------------------
    const requiredAttrs = category.attributes
      .filter((a) => a.required)
      .map((a) => a.name);

    const providedAttrs = Object.keys(attributes);

    const missing = requiredAttrs.filter((key) => !providedAttrs.includes(key));

    if (missing.length > 0) {
      return NextResponse.json(
        {
          error: "attributes ناقص است",
          missing,
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------------------
    // 4) ساخت واریانت
    // ----------------------------------------------------------------------
    const variant = await Variant.create({
      productId,
      categoryId: category._id,
      sku,
      price,
      stock,
      images,
      attributes, // مهم: به صورت Map ذخیره می‌شود
    });

    return NextResponse.json(
      {
        message: "واریانت با موفقیت ایجاد شد",
        variant,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "مشکل سمت سرور", detail: err.message },
      { status: 500 }
    );
  }
}
