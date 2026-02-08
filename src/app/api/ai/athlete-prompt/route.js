import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Sport from "base/models/Sport";
import { buildAthleteAiTemplate } from "@/lib/aiAthleteTemplate";

export async function POST(req) {
  try {
    await connectToDB();
    const { rawContent } = await req.json();

    if (!rawContent) {
      return NextResponse.json({ error: "متن خام الزامی است" }, { status: 400 });
    }

    // دریافت لیست ورزش‌ها برای اینکه AI بتونه ID درست رو انتخاب کنه
    const sports = await Sport.find({}, "_id name");

    // استفاده از تابعی که در مرحله قبل نوشتیم
    const prompt = buildAthleteAiTemplate({ sports, rawContent });

    return NextResponse.json({ prompt });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}