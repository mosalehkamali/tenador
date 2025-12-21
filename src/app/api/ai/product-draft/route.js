import connectToDB from "base/configs/db";
import Category from "base/models/Category";
import Brand from "base/models/Brand";
import Sport from "base/models/Sport";

import openai from "@/lib/openai";
import { buildProductTemplate } from "@/lib/buildProductTemplate";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { categoryId, rawContent } = body;

    if (!categoryId || !rawContent) {
      return Response.json(
        { error: "categoryId and rawContent are required" },
        { status: 400 }
      );
    }

    // 1. Load category
    const category = await Category.findById(categoryId).lean();
    if (!category) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }

    // 2. Load ALL brands & sports (real behavior)
    const brands = await Brand.find({}, { name: 1 }).lean();
    const sports = await Sport.find({}, { name: 1 }).lean();

    if (!brands.length || !sports.length) {
      return Response.json(
        { error: "Brands or sports not configured" },
        { status: 500 }
      );
    }

    // 3. Build AI prompt
    const prompt = buildProductTemplate({
      category,
      brands,
      sports,
      rawContent,
    });

    // 4. Call ChatGPT
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4.1-mini", // به اندازه کافی دقیق + اقتصادی
    //   temperature: 0.2,      // LOW = دیتای پایدار
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "You generate structured e-commerce product data. Output JSON only.",
    //     },
    //     {
    //       role: "user",
    //       content: prompt,
    //     },
    //   ],
    // });

    // const aiMessage = completion.choices[0]?.message?.content;

    // if (!aiMessage) {
    //   return Response.json(
    //     { error: "AI returned empty response" },
    //     { status: 500 }
    //   );
    // }

    // // 5. Parse JSON safely
    // let parsed;
    // try {
    //   parsed = JSON.parse(aiMessage);
    // } catch (e) {
    //   return Response.json(
    //     {
    //       error: "Invalid JSON returned from AI",
    //       raw: aiMessage,
    //     },
    //     { status: 422 }
    //   );
    // }

    // // 6. Final sanity checks (VERY IMPORTANT)
    // if (
    //   !parsed.name ||
    //   !parsed.brand ||
    //   !parsed.sport ||
    //   !parsed.category
    // ) {
    //   return Response.json(
    //     {
    //       error: "AI response missing required fields",
    //       parsed,
    //     },
    //     { status: 422 }
    //   );
    // }

    // ⚠️ DO NOT SAVE TO DB HERE
    // This is a DRAFT only

    return Response.json(
      {
        draft: prompt,
        meta: {
          category: category.title,
          aiModel: "gpt-4.1-mini",
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
