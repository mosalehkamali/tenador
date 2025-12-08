// models/PriceCache.js
import mongoose from "mongoose";

const PriceCacheSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    index: true,
  },
  basePrice: { type: Number, required: true },
  bestDiscount: { type: Number, default: 0 },
  finalPrice: { type: Number, required: true },
  ruleIds: [{ type: mongoose.Schema.Types.ObjectId }],
  updatedAt: { type: Date, default: Date.now, index: true },
});

export default mongoose.models.PriceCache ||
  mongoose.model("PriceCache", PriceCacheSchema);
