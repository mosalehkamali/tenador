import mongoose from "mongoose";
import { createSlug } from "base/utils/slugify";
require("./Sport")

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    sport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sport",
      required: true,
    },

    birthDate: {
      type: Date,
      default: null,
    },

    nationality: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    photo: {
      type: String, 
      default: "",
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
    while (await mongoose.models.Athlete.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }
    this.slug = slug;
  }
});

export default mongoose.models.Athlete || mongoose.model("Athlete", schema);


