import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Product from "base/models/Product";
import  "base/models/Brand";
import  "base/models/Sport";
import  "base/models/Athlete";
import  "base/models/Category";

export async function GET(req) {
  try {
    await connectToDB();
    const products = await Product.find({})
      .populate('brand')
      .populate('sport')
      .populate('athlete')
      .populate('category')
      .lean();
    
    return NextResponse.json({
      products: products || [],
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        error: 'خطا در دریافت محصولات',
        detail: error.message,
        products: [],
      },
      { status: 500 }
    );
  }
}

