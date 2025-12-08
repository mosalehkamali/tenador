// services/discountEngine.js
import { loadRulesForProduct } from "./ruleLoader.js";
import FlashSale from "base/models/FlashSale";

export async function computeBaseDiscountForProduct(product) {
  // 1) Flash sale check (highest precedence)
  const now = new Date();
  const flash = await FlashSale.findOne({
    productId: product._id,
    active: true,
    startsAt: { $lte: now },
    endsAt: { $gte: now }
  }).lean();

  const base = product.basePrice || 0;

  if (flash) {
    const discountAmount = Math.max(0, base - flash.flashPrice);
    return {
      finalPrice: flash.flashPrice,
      bestDiscount: discountAmount,
      applied: [{ type: "flash", id: flash._id }]
    };
  }

  // 2) load discount rules
  const rules = await loadRulesForProduct(product);

  if (!rules || rules.length === 0) {
    return { finalPrice: base, bestDiscount: 0, applied: [] };
  }

  // build candidates amounts
  const candidates = rules.map(r => {
    const amount = (r.discount.kind === "percent")
      ? Math.floor(base * (r.discount.value / 100))
      : r.discount.value;
    return { rule: r, amount };
  });

  // sort by priority (already ordered) but keep safe
  candidates.sort((a,b) => (a.rule.priority - b.rule.priority));

  // pick top + add combinable
  let total = 0;
  const applied = [];
  if (candidates.length > 0) {
    total += candidates[0].amount;
    applied.push(candidates[0].rule._id);
    for (let i = 1; i < candidates.length; i++) {
      if (candidates[i].rule.combinable) {
        total += candidates[i].amount;
        applied.push(candidates[i].rule._id);
      }
    }
  }

  if (total > base) total = base;
  return { finalPrice: base - total, bestDiscount: total, applied };
}
