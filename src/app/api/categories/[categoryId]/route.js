import connectToDB from "base/configs/db";
import Category from "base/models/Category";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { categoryId } = await params;
    const category = await Category.findById(categoryId).populate('parent');
    
    if (!category) {
      return NextResponse.json(
        { error: "دسته‌بندی پیدا نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { categoryId } = await params;
    const body = await req.json();
    const { title, parent, attributes } = body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: "دسته‌بندی پیدا نشد" },
        { status: 404 }
      );
    }

    if (title && title.trim() !== "") {
      category.title = title.trim();
    }
    if (parent !== undefined) {
      category.parent = parent || null;
    }
    if (attributes !== undefined) {
      category.attributes = attributes;
    }

    await category.save();

    return NextResponse.json({
      message: "دسته‌بندی با موفقیت به‌روزرسانی شد",
      category,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { categoryId } =await params;
    
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: "دسته‌بندی پیدا نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "دسته‌بندی با موفقیت حذف شد",
    });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}










