import connectToDB from "base/configs/db";
import Category from "base/models/Category";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { title, parent, attributes } = body;

    // Title required
    if (!title || title.trim() === "") {
      return Response.json(
        { error: "عنوان کتگوری الزامی است" },
        { status: 400 }
      );
    }

    // Duplicate check
    const exists = await Category.findOne({ title });
    if (exists) {
      return Response.json(
        { error: "این کتگوری قبلاً ثبت شده است" },
        { status: 409 }
      );
    }

    // Validate attributes
    if (attributes && Array.isArray(attributes)) {
      for (const attr of attributes) {
        if (!attr.name || !attr.label) {
          return Response.json(
            { error: "هر ویژگی باید name و label داشته باشد." },
            { status: 400 }
          );
        }

        if (
          attr.type &&
          !["string", "number", "select"].includes(attr.type)
        ) {
          return Response.json(
            { error: `نوع ویژگی '${attr.name}' معتبر نیست.` },
            { status: 400 }
          );
        }
      }
    }

    // Create category
    const created = await Category.create({
      title,
      parent: parent || null,
      attributes: attributes || [],
    });

    return Response.json(
      {
        message: "کتگوری با موفقیت ایجاد شد",
        category: created,
      },
      { status: 201 }
    );

  } catch (err) {
    console.log("CATEGORY API ERROR:", err);
    return Response.json(
      { error: "مشکلی در سرور رخ داد", detail: err.message },
      { status: 500 }
    );
  }
}
