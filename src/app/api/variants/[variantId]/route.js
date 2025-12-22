import connectToDB from "base/configs/db";
import Variant from "base/models/Variant";
import Product from "base/models/Product";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const resolvedParams = await params();
    const variantId = resolvedParams.variantId || resolvedParams.id;
    
    const variant = await Variant.findById(variantId);
    if (!variant) {
      return NextResponse.json(
        { error: "واریانت پیدا نشد" },
        { status: 404 }
      );
    }

    // حذف واریانت از محصول
    await Product.findByIdAndUpdate(variant.productId, {
      $pull: { variants: variantId },
    });

    // حذف واریانت
    await Variant.findByIdAndDelete(variantId);

    return NextResponse.json({
      message: "واریانت با موفقیت حذف شد",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}










