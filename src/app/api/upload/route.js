import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'uploads';

    if (!file) {
      return NextResponse.json(
        { error: 'هیچ فایلی ارسال نشده است' },
        { status: 400 }
      );
    }

    // بررسی نوع فایل
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/svg',
    ];
    
    // بررسی extension برای SVG (چون ممکن است MIME type متفاوت باشد)
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'نوع فایل مجاز نیست. فقط تصاویر (JPG, PNG, WebP, GIF, SVG) مجاز هستند' },
        { status: 400 }
      );
    }

    // بررسی اندازه فایل (حداکثر 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'حجم فایل نباید بیشتر از 5 مگابایت باشد' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ایجاد نام فایل منحصر به فرد
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;

    // مسیر ذخیره‌سازی
    const uploadDir = join(process.cwd(), 'public', folder);
    const filePath = join(uploadDir, fileName);

    // ایجاد پوشه در صورت عدم وجود
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // پوشه ممکن است از قبل وجود داشته باشد
    }

    // ذخیره فایل
    await writeFile(filePath, buffer);

    // URL فایل
    const fileUrl = `/${folder}/${fileName}`;

    return NextResponse.json(
      {
        message: 'فایل با موفقیت آپلود شد',
        url: fileUrl,
        fileName: fileName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('خطا در آپلود فایل:', error);
    return NextResponse.json(
      { error: 'خطا در آپلود فایل', detail: error.message },
      { status: 500 }
    );
  }
}

