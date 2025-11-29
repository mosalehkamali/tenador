import connectToDB from "base/configs/db";
import Product from "base/models/Product";
import Variant from "base/models/Variant";

export async function POST(req, { params }) {
  try {
    await connectToDB();

    const { productId } = await params;
    const body = await req.json();

    const { sku, price, images, stock, attributes } = body;

    if (!sku) {
      return Response.json(
        { error: "SKU is required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const variant = await Variant.create({
      sku,
      price,
      images,
      stock,
      attributes,
      productId
    });

    product.variants.push(variant._id);
    await product.save();

    return Response.json(
      {
        message: "Variant added successfully",
        variant
      },
      { status: 201 }
    );

  } catch (err) {
    return Response.json(
      {
        error: "مشکلی پیش آمد.",
        detail: err.message
      },
      { status: 500 }
    );
  }
}
