// services/priceCalculator.js
import { computeBaseDiscountForProduct } from "./discountEngine.js";
import Coupon from "base/models/coupon";

export async function calculateFinalPrice(product, opts = {}) {
  const { quantity = 1, couponCode = null, cartValue = 0, user = null } = opts;
  const base = (product.basePrice || 0) * quantity;

  // base discount (precompute logic) - returns best base discount ignoring coupon/cart rules
  const baseResult = await computeBaseDiscountForProduct(product);
  let totalDiscount = baseResult.bestDiscount * (quantity || 1);
  const applied = [...baseResult.applied.map(id => ({ id, type: "rule" }))];

  // coupon logic
  if (couponCode) {
    const now = new Date();
    const coupon = await Coupon.findOne({
      code: couponCode,
      active: true,
      startAt: { $lte: now },
      endAt: { $gte: now }
    }).lean();

    if (coupon) {
      // check cart min
      if ((coupon.minCartValue || 0) <= cartValue) {
        const cAmount = coupon.discount.kind === "percent"
          ? Math.floor(base * (coupon.discount.value / 100))
          : coupon.discount.value * quantity;
        totalDiscount += cAmount;
        applied.push({ id: coupon._id, type: "coupon" });
      }
    }
  }

  if (totalDiscount > base) totalDiscount = base;
  const finalPrice = base - totalDiscount;
  return { base, discount: totalDiscount, finalPrice, applied };
}
