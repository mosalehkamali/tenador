import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Category from "base/models/Category";

export async function GET(req) {
  await connectToDB();
  const categories = await Category.find({}).populate('parent');
  return NextResponse.json({
    categories,
  });
}









