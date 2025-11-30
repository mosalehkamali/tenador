import mongoose from "mongoose";

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
CategorySchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]/g, "");
  }
});



export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
