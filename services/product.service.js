import connectToDB from "base/configs/db";
import Product from "base/models/Product";
import  "base/models/Brand";
import  "base/models/Sport";
import  "base/models/Athlete";
import  "base/models/Category";

export async function getProducts() {
  try {
    await connectToDB();
    const products = await Product.find({})
      .populate('brand')
      .populate('sport')
      .populate('athlete')
      .populate('category')
      .lean();
    
    return JSON.parse(JSON.stringify(products))
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

export async function getProductBySlug(slug) {
  try{
  await connectToDB();
  const product = await Product.findOne({slug})
    .populate('brand')
    .populate('sport')
    .populate('athlete')
    .populate('category')
    .lean();
  
  if (!product) {
    return ({ error: "محصول پیدا نشد" }, { status: 404 });
  }


  return product;
} catch (err) {
  return ({ error: err.message }, { status: 500 });

}}