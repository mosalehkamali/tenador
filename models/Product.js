import mongoose from "mongoose";
import { createSlug } from "../utils/slugify.js";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    longDescription: {
      type: String,
      required: true,
    },
    suitableFor: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
      required: false,
    },
    basePrice: {
      type: Number,
      default: 0,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    tag: {
      type: [String],
    },
    mainImage: {
      type: String,
      required: true,
    },
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
    modelName: { type: String, required: true },

    slug: { type: String, unique: true },

    variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variant" }],
  },
  {
    timestamps: true,
  }
);

schema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "product",
});

schema.pre("save", function (next) {
  if (this.isModified("name")) this.slug = createSlug(this.name);
  next();
});

export default mongoose.models.Product || mongoose.model("Product", schema);
