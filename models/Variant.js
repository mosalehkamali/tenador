import mongoose from "mongoose";
import { createSlug } from "base/utils/slugify";

const VariantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      trim: true,
    },

    // -----------------------------
    // DYNAMIC ATTRIBUTE SYSTEM
    // attributes = Map<string, string>
    // مثل: weight, color, gripSize, material ...
    // -----------------------------
    attributes: {
      type: Map,
      of: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    stock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);



// -----------------------------
// 1) Generate slug automatically
// -----------------------------
VariantSchema.pre("save", function () {
  if (this.isModified("sku") || this.isModified("attributes")) {
    const attrString = Array.from(this.attributes.values()).join("-");
    this.slug = createSlug(`${this.sku}-${attrString}`);
  }
});



// -----------------------------------------------
// 2) Validate attributes based on Category schema
// -----------------------------------------------
VariantSchema.pre("validate", async function () {
  const Category = mongoose.model("Category");

  const category = await Category.findById(this.categoryId);
  if (!category) {
    throw new Error("Category not found for this variant");
  }

  const requiredAttributes = category.attributes.map((a) => a.name);
  const variantAttributes = Array.from(this.attributes.keys());

  // Missing required attributes
  const missing = requiredAttributes.filter(
    (attr) => !variantAttributes.includes(attr)
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required attributes: ${missing.join(", ")}`
    );
  }
});



// FINAL EXPORT
export default mongoose.models.Variant ||
  mongoose.model("Variant", VariantSchema);
