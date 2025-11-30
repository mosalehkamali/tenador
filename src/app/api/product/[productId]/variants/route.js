import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Variant from "base/models/Variant";
import Product from "base/models/Product";
import Category from "base/models/Category";

export async function POST(req, { params }) {
  await connectToDB();

  try {
    const { id: productId } = params;
    const body = await req.json();

    const { sku, price, stock = 0, attributes, images = [] } = body;

    if (!sku || !price || !attributes) {
      return NextResponse.json(
        { error: "sku, price, and attributes are required" },
        { status: 400 }
      );
    }

    // -------------------------------------
    // 1) Find product
    // -------------------------------------
    const product = await Product.findById(productId).populate("category");
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // -------------------------------------
    // 2) Find the category
    // -------------------------------------
    const category = await Category.findById(product.category);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // -------------------------------------
    // 3) Create Variant using your MODEL RULES
    // -------------------------------------
    const variant = await Variant.create({
      productId,
      categoryId: category._id,   // REQUIRED in your model
      sku,
      price,
      stock,
      attributes,  // Map<String, String>
      images
    });

    return NextResponse.json(
      { message: "Variant created", variant },
      { status: 201 }
    );

  } catch (err) {
    return NextResponse.json(
      { error: "Server error", detail: err.message },
      { status: 500 }
    );
  }
}
