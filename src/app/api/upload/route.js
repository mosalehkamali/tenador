import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folderInput = formData.get("folder");

    if (!file) {
      return NextResponse.json(
        { error: "فایلی ارسال نشده" },
        { status: 400 }
      );
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "حجم فایل نباید بیشتر از ۲ مگابایت باشد" },
        { status: 400 }
      );
    }

    // فولدر پیش‌فرض
    let folder = "product";

    if (folderInput && typeof folderInput === "string") {
      // فقط اجازه حروف، عدد، اسلش و dash
      const sanitized = folderInput.replace(/[^a-zA-Z0-9/_-]/g, "");
      if (sanitized.trim() !== "") {
        folder = sanitized;
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"],
          use_filename: true, 
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      folder,
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      { error: "خطا در آپلود تصویر" },
      { status: 500 }
    );
  }
}
