import mongoose from "mongoose";
import { createSlug } from "base/utils/slugify";
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(v) {
          // بررسی اینکه فقط حروف انگلیسی و اعداد باشد
          return /^[a-zA-Z0-9\s\-_]+$/.test(v);
        },
        message: 'نام باید فقط شامل حروف انگلیسی، اعداد، فاصله، خط تیره و زیرخط باشد'
      }
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    colors:{
      primary:String,
      secondary:String,
    },

    logo: {
      type: String,
      default: "",
    },

    icon: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },
    
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required:true
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
    while (await mongoose.models.Serie.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }
    this.slug = slug;
  }
});

export default mongoose.models.Serie || mongoose.model("Serie", schema);
