import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    icon: {
      type: String,
      default: "",
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// تبدیل name به slug
schema.pre("validate", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = this.name.toLowerCase().replace(/\s+/g, "-");

    let slug = baseSlug;
    let counter = 1;

    // تا وقتی slug تکراری بود، شماره اضافه کن
    while (await mongoose.models.Sport.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    this.slug = slug;
  }
});

export default mongoose.models.Sport ||
  mongoose.model("Sport", schema);
