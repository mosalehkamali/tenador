import mongoose from "mongoose";
import { createSlug } from "base/utils/slugify";
const AttributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // مثل: color, size, weight
      trim: true,
    },

    label: {
      type: String,
      required: true, // برچسب برای UI مثل "رنگ"
    },

    type: {
      type: String,
      enum: ["string", "number", "select"],
      default: "string",
    },

    required: {
      type: Boolean,
      default: true,
    },

    // برای select:
    // ["Red","Blue","Green"]
    options: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);



const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      trim: true,
    },

    // تعریف واریانت ها
    attributes: {
      type: [AttributeSchema],
      default: [],
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null, // برای کتگوری‌های چندسطحی
    },
  },
  { timestamps: true }
);



// ایجاد اسلاگ اتوماتیک
CategorySchema.pre("save", async function () {
  if (this.isModified("title")) {
    const baseSlug = createSlug(this.title);
    let slug = baseSlug;
    let counter = 1;
    while (await mongoose.models.Category.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }
    this.slug = slug;
  }
});



export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
