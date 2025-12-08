// models/DiscountRule.js
import mongoose from "mongoose";

const DiscountRuleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    // type of target: 'product'|'brand'|'category'|'global'|'userSegment'|'cartValue'|'skuList'
    type: { type: String, required: true, index: true },
    // array of target ids (if applicable)
    targets: [{ type: mongoose.Schema.Types.ObjectId, index: true }],
    // discount definition
    discount: {
      kind: { type: String, enum: ["percent", "amount"], required: true },
      value: { type: Number, required: true },
    },
    conditions: {
      minCartValue: { type: Number, default: 0 },
      onlyFirstOrders: { type: Boolean, default: false },
    },
    startAt: { type: Date, required: true, index: true },
    endAt: { type: Date, required: true, index: true },
    priority: { type: Number, default: 1000, index: true },
    combinable: { type: Boolean, default: false },
    source: { type: String, enum: ["platform", "vendor"], default: "platform" },
    active: { type: Boolean, default: true, index: true },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

DiscountRuleSchema.index({ type: 1, active: 1, startAt: 1, endAt: 1 });

export default mongoose.models.DiscountRule ||
  mongoose.model("DiscountRule", DiscountRuleSchema);
