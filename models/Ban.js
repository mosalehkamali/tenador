const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.models.Ban || mongoose.model("Ban", schema);

module.exports = model;
