import mongoose from "mongoose";
import { createSlug } from "base/utils/slugify";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    modelName: { type: String, required: true },

    shortDescription: { type: String, required: true },

    longDescription: { type: String, required: true },

    suitableFor: { type: String, required: true },

    score: { type: Number, default: 0 },

    basePrice: { type: Number, default: 0 },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    tag: [String],

    mainImage: { type: String, required: true },

    gallery: [String],

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Athlete",
      default: null,
    },

    sport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sport",
      required: true,
    },

    attributes: {
      type: Object,
      default: {},

    },

    slug: { type: String, unique: true },

    variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variant" }],
  },
  { timestamps: true }
);


// ---------------------
// 🔥 Slug Generator
// ---------------------
ProductSchema.pre("save", function () {
  if (this.isModified("name") || this.isModified("modelName")) {
    this.slug = createSlug(this.name);
  }
});


// ---------------------
// 🔥 Virtual Comment
// ---------------------
ProductSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "product",
});


export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
