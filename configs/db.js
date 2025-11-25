import mongoose from "mongoose";

const connectToDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect("mongodb://localhost:27017/tenador");
    console.log("<<<🎇 MongoDB Connected Successfully 🎇>>>");
  } catch (err) {
    console.error("MongoDB Error:", err.message);
  }
};

export default connectToDB;
