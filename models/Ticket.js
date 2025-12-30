const mongoose = require("mongoose");
require("./User");
require("./Department");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    department: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    priority: {
      type: Number,
      default: 3,
      enum: [1, 2, 3],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    request: {
      type: mongoose.Types.ObjectId,
      ref:"Ticket",
      required:false,
    },
  },
  {
    timestamps: true,
  }
);

schema.virtual("answer",{
  ref:"Ticket",
  localField:"_id",
  foreignField:"request"
})


const model = mongoose.models.Ticket || mongoose.model("Ticket", schema);

export default model;
