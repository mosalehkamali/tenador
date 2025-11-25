import mongoose from "mongoose";
require("./Sport")

const athleteSchema = new mongoose.Schema(
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

athleteSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});

const model = mongoose.models.Athlete || mongoose.model("Athlete", schema);

module.exports = model;
