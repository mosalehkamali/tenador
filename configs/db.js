import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

const connectToDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(url);
    console.log("<<<🎇 MongoDB Connected Successfully 🎇>>>");
  } catch (err) {
    console.error("MongoDB Error:", err.message);
  }
};

export default connectToDB;
