import mongoose from "mongoose";
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

schema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});

export default mongoose.models.Athlete || mongoose.model("Athlete", schema);


