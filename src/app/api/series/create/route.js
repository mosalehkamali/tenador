import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Serie from "base/models/Serie";
import Brand from "base/models/Brand";

export async function POST(req) {
  try {
    // ۱. اتصال امن به دیتابیس
    await connectToDB();

    // ۲. استخراج و پاکسازی داده‌ها
    const body = await req.json();
    const { name, title, description, colors, logo, icon, image, brand } = body;

    // ۳. اعتبارسنجی فیلدهای اجباری (Server-side Validation)
    if (!name || !title || !brand) {
      return NextResponse.json(
        { error: "فیلدهای نام، عنوان و برند الزامی هستند" },
        { status: 422 } // Unprocessable Entity
      );
    }

    // ۴. بررسی وجود برند (Integrity Check)
    // این کار از ایجاد سری برای برندی که وجود ندارد جلوگیری می‌کند
    const existingBrand = await Brand.findById(brand);
    if (!existingBrand) {
      return NextResponse.json(
        { error: "برند انتخاب شده در سیستم یافت نشد" },
        { status: 404 }
      );
    }

    // ۵. بررسی تکراری نبودن نام (Case-insensitive)
    const duplicateSerie = await Serie.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (duplicateSerie) {
      return NextResponse.json(
        { error: "این نام سری قبلاً در سیستم ثبت شده است" },
        { status: 409 } // Conflict
      );
    }

    // ۶. ایجاد رکورد جدید
    // اسلاگ به صورت خودکار توسط Middleware پیش از ذخیره تولید می‌شود
    const newSerie = await Serie.create({
      name,
      title,
      description,
      colors,
      logo,
      icon,
      image,
      brand
    });

    await Brand.findByIdAndUpdate(
        brand, 
        { $push: { series: newSerie._id } }, // اضافه کردن به آرایه بدون حذف مقادیر قبلی
        { new: true }
      );
      
    // ۷. پاسخ موفقیت‌آمیز
    return NextResponse.json(
      { 
        message: "سری جدید با موفقیت ایجاد شد", 
        data: newSerie 
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ Error in Serie Creation:", error);

    // مدیریت خطاهای اختصاصی مونوگوس (مثل ValidationError)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ error: messages[0] }, { status: 400 });
    }

    // خطای عمومی سرور
    return NextResponse.json(
      { error: "خطای داخلی سرور در هنگام ایجاد سری" },
      { status: 500 }
    );
  }
}