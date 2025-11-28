import mongoose from "mongoose";
import { createSlug } from "base/utils/slugify";

const VariantSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

    slug: { type: String, unique: true },

    sku: { type: String, unique: true, required: true },

    attributes: {
      size: { type: String },
      color: { type: String },
      material: { type: String },
    },

    price: Number,

    images: [String],

    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

VariantSchema.pre("save", function () {
  if (this.isModified("attributes")) {
    this.slug = createSlug(
      `${this.attributes.size || ""}-${this.attributes.color || ""}`
    );
  }
});

export default mongoose.models.Variant || mongoose.model("Variant", VariantSchema);
