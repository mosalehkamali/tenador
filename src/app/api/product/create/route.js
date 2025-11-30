import connectToDB from "base/configs/db";
import Product from "base/models/Product";
import Category from "base/models/Category";

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
      category, // ObjectId از سمت کاربر
      tag,
      mainImage,
      gallery,
      brand,
      athlete,
      sport,
      attributes, // object {}
    } = body;

    // -------------------------------
    // 1) Validate Required Fields
    // -------------------------------
    const required = {
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

    for (const key in required) {
      if (!required[key] || required[key].toString().trim() === "") {
        return Response.json(
          { error: `${key} is required` },
          { status: 400 }
        );
      }
    }

    // -------------------------------
    // 2) Check Category Exists
    // -------------------------------
    const foundCategory = await Category.findById(category);
    if (!foundCategory) {
      return Response.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // -------------------------------
    // 3) Validate Attributes Based on Category
    // -------------------------------
    if (attributes && typeof attributes === "object") {
      const allowedAttrs = foundCategory.variantAttributes.map(
        (a) => a.key
      );

      // بررسی اینکه هیچ attribute اضافی ارسال نشده
      for (const key of Object.keys(attributes)) {
        if (!allowedAttrs.includes(key)) {
          return Response.json(
            { error: `Attribute "${key}" is not allowed for this category` },
            { status: 400 }
          );
        }
      }
    }

    // -------------------------------
    // 4) Create Product
    // -------------------------------
    const created = await Product.create({
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
    });

    return Response.json(
      {
        message: "Product created successfully",
        product: created,
      },
      { status: 201 }
    );

  } catch (err) {
    console.error(err);
    return Response.json(
      {
        error: "مشکلی پیش آمد.",
        detail: err.message,
      },
      { status: 500 }
    );
  }
}
