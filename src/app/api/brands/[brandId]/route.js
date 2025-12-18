import connectToDB from "base/configs/db";
import Brand from "base/models/Brand";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { brandId } = await params;
    const brand = await Brand.findById(brandId);
    
    if (!brand) {
      return NextResponse.json(
        { error: "برند پیدا نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({ brand });
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
    const { brandId } = await params;
    const body = await req.json();
    const { name, country, foundedYear, description, logo } = body;

    const brand = await Brand.findById(brandId);
    if (!brand) {
      return NextResponse.json(
        { error: "برند پیدا نشد" },
        { status: 404 }
      );
    }

    if (name && name.trim() !== "") {
      brand.name = name.trim();
    }
    if (country !== undefined) {
      brand.country = country;
    }
    if (foundedYear !== undefined) {
      brand.foundedYear = foundedYear;
    }
    if (description !== undefined) {
      brand.description = description;
    }
    if (logo !== undefined) {
      brand.logo = logo;
    }

    await brand.save();

    return NextResponse.json({
      message: "برند با موفقیت به‌روزرسانی شد",
      brand,
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
    const { brandId } = await params;
    
    const brand = await Brand.findByIdAndDelete(brandId);
    if (!brand) {
      return NextResponse.json(
        { error: "برند پیدا نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "برند با موفقیت حذف شد",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}






