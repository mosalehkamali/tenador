// models/FlashSale.js
import mongoose from "mongoose";

const FlashSaleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  flashPrice: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.FlashSale || mongoose.model("FlashSale", FlashSaleSchema);
