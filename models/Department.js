const mongoose = require("mongoose");
require("./Ticket")

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

schema.virtual("tickets", {
  ref: "Ticket",
  localField: "_id",
  foreignField: "department",
});

const model =
  mongoose.models.Department || mongoose.model("Department", schema);

export default model;
