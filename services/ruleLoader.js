// services/ruleLoader.js
import DiscountRule from "base/models/DiscountRule";
import redis from "base/lib/redis";

const RULE_TTL = parseInt(process.env.PRICE_CACHE_TTL || "300", 10);

export async function loadRulesForProduct(product) {
  const key = `rules:product:${product._id}`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const now = new Date();
  const queries = [
    { type: "global" },
    { type: "product", targets: product._id },
    { type: "brand", targets: product.brand },
    { type: "category", targets: product.category }
  ];

  const rules = await DiscountRule.find({
    $and: [
      { active: true },
      { startAt: { $lte: now } },
      { endAt: { $gte: now } },
      { $or: queries }
    ]
  }).sort({ priority: 1 }).lean();

  await redis.set(key, JSON.stringify(rules), "EX", RULE_TTL);
  return rules;
}
