export function createSlug(text) {
  if (!text) return "";

  return text
    .toString()
    .trim()
    .toLowerCase()
    // حذف کاراکترهای اضافی اما نه حروف فارسی
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "")
    // تبدیل فاصله‌ها به خط تیره
    .replace(/\s+/g, "-")
    // یکی کردن خط‌تیره‌های تکراری
    .replace(/-+/g, "-")
    // حذف خط‌تیره از ابتدا/انتهای اسلاگ
    .replace(/^-+|-+$/g, "");
}
