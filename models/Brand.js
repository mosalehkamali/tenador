import mongoose from "mongoose";
import { createSlug } from "base/utils/slugify";
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    country: {
      type: String,
      default: null,
    },

    foundedYear: {
      type: Number,
      default: null,
    },

    description: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },
    
    models: {
      type: [String],
      default: [],
    },

    slug: {
      type: String,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

schema.pre("save", async function () {
  if (this.isModified("name")) {
    const baseSlug = createSlug(this.name);
    let slug = baseSlug;
    let counter = 1;
    while (await mongoose.models.Brand.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }
    this.slug = slug;
  }
});

export default mongoose.models.Brand || mongoose.model("Brand", schema);
