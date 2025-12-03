import mongoose from "mongoose";

const SlugRegistrySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      index: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // نوع مدل: category, sport, brand, tag, productType, ...
    type: {
      type: String,
      required: true,
      index: true, // کمک می‌کنه اسلاگ‌ها رو بر اساس نوع فیلتر کنیم
      trim: true,
      lowercase: true,
    },

    // اسم مدل مونگوس مربوطه
    model: {
      type: String,
      required: true,
      trim: true,
    },

    // ID رکورد اصلی (ObjectId)
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true, // کمک برای lookup سریع
    },

    // فیلدی که باید بر اساسش محصول رو فیلتر کنیم (sport, brand, categoryId...)
    filterField: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // ارزش واقعی فیلتر (ممکنه slug باشه، ممکنه ObjectId)
    filterValue: {
      type: mongoose.Schema.Types.Mixed, // چون می‌تونه string یا ObjectId باشه
      required: true,
      index: true,
    },

    // امکان داشتن اسلاگ مرتبط (برای nested filters)
    parentSlug: {
      type: String,
      default: null,
      index: true,
      lowercase: true,
      trim: true,
    },

    // مثلا برای SEO یا نمایش
    label: {
      type: String,
      default: null,
      trim: true,
    },

    // خودش تاریخ ایجاد/آپدیت را ذخیره کند
  },
  { timestamps: true }
);


// ترکیب‌هایی که جستجو را سریع می‌کنند
SlugRegistrySchema.index({ type: 1, slug: 1 });
SlugRegistrySchema.index({ filterField: 1, filterValue: 1 });

export default mongoose.models.SlugRegistry ||
  mongoose.model("SlugRegistry", SlugRegistrySchema);
