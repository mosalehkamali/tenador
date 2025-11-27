import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";

import Product from "@/models/Product";
import Variant from "@/models/Variant";

export async function GET(req, { params }) {
  await connectToDB();

  const { productSlug } = params;

  const product = await Product.findOne({ slug: productSlug })
    .populate("brand sport athlete")
    .lean();

  if (!product) {
    return NextResponse.json(
      { message: "Product Not Found" },
      { status: 404 }
    );
  }

  const variants = await Variant.find({ productId: product._id })
    .select("-__v")
    .lean();

  return NextResponse.json({
    product,
    variants,
  });
}
