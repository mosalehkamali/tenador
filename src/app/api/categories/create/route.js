import connectToDB from "base/configs/db";
import Category from "base/models/Category";
import {registerSlug} from "base/actions/registerSlug";
import { createSlug } from "base/utils/slugify";
  
export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { title,name, parent, prompts, attributes } = body;

    // Title required
    if (!title || title.trim() === "") {
      return Response.json(
        { error: "عنوان کتگوری الزامی است" },
        { status: 400 }
      );
    }

    // Name required and must be English
    if (!name || name.trim() === "") {
      return Response.json(
        { error: "نام کتگوری الزامی است" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
      return Response.json(
        { error: "نام کتگوری باید فقط شامل حروف انگلیسی، اعداد، فاصله، خط تیره و زیرخط باشد" },
        { status: 400 }
      );
    }
console.log(createSlug(name));

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

        // prompt is optional, no validation needed
      }
    }

    // Create category
    const created = await Category.create({
      title,
      name,
      parent: parent || null,
      prompts: prompts || [],
      attributes: attributes || [],
    });

    await registerSlug({
      slug: created.slug,
      type: "category",
      model: "Category",
      refId: created._id,
      filterField: "category",
      filterValue: created._id,
      label: created.title,
      parentSlug: parent || null,
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
