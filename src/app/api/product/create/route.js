import connectToDB from "base/configs/db";
import Product from "base/models/Product";
import Variant from "base/models/Variant";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();

    const {
      name,
      shortDescription,
      longDescription,
      suitableFor,
      score,
      basePrice,
      category,
      tag,
      mainImage,
      gallery,
      brand,
      athlete,
      sport,
      modelName,
      variants = []
    } = body;

    // 1) ***** VALIDATION *****
    if (!name || !brand || !sport || !modelName || !mainImage) {
      return Response.json(
        { error: "Required fields are missing!" },
        { status: 400 }
      );
    }

    // Check duplicate product by name
    const exists = await Product.findOne({ name });
    if (exists) {
      return Response.json(
        { error: "Product already exists" },
        { status: 409 }
      );
    }

    // 2) ***** CREATE PRODUCT *****
    const product = await Product.create({
      name,
      shortDescription,
      longDescription,
      suitableFor,
      score,
      basePrice,
      category,
      tag,
      mainImage,
      gallery,
      brand,
      athlete,
      sport,
      modelName,
      variants: [] // initially empty
    });

    // 3) ***** CREATE VARIANTS (if provided) *****
    let variantDocs = [];

    if (variants && variants.length > 0) {
      variantDocs = await Promise.all(
        variants.map(async (v) => {
          if (!v.sku) throw new Error("Each variant must have a SKU");
          return await Variant.create({
            ...v,
            productId: product._id,
          });
        })
      );

      // add variant IDs to product
      product.variants = variantDocs.map(v => v._id);
      await product.save();
    }

    // 4) ***** RESPONSE *****
    return Response.json(
      {
        message: "Product created successfully",
        product,
        variants: variantDocs
      },
      { status: 201 }
    );

  } catch (err) {
    return Response.json(
      { error: "مشکلی پیش آمد.", detail: err.message },
      { status: 500 }
    );
  }
}
