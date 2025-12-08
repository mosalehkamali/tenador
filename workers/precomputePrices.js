import connectToDB from "base/configs/db";
import Product from "base/models/Product";
import DiscountRule from "base/models/DiscountRule";
import PriceCache from "base/models/FlashSale";
import Redis from "base/lib/redis"; // node-redis client
import { calculateDiscountForProduct } from "base/pricing/precomputeHelpers";

const BATCH_SIZE = 200; // بسته به حافظه/CPU
const REDIS_KEY_PREFIX = "pricecache:product:";

async function workerLoop() {
  await connectToDB();

  const total = await Product.countDocuments({});
  for (let skip = 0; skip < total; skip += BATCH_SIZE) {
    const products = await Product.find({})
      .skip(skip)
      .limit(BATCH_SIZE)
      .select("_id basePrice brand category") // کمترین فیلد لازم
      .lean();

    const ops = [];
    for (const p of products) {
      // محاسبه تخفیف پایه برای محصول (بدون coupon و بدون cart-specific conditions)
      const { finalPrice, bestDiscount, ruleIds } = await calculateDiscountForProduct(p);

      // آپدیت Mongo PriceCache
      ops.push({
        updateOne: {
          filter: { productId: p._id },
          update: {
            $set: {
              productId: p._id,
              basePrice: p.basePrice,
              bestDiscount,
              finalPrice,
              ruleIds,
              updatedAt: new Date()
            }
          },
          upsert: true
        }
      });

      // آپدیت Redis (برای سریع‌ترین reads)
      const redisKey = `${REDIS_KEY_PREFIX}${p._id}`;
      const payload = JSON.stringify({ finalPrice, basePrice: p.basePrice, bestDiscount, ruleIds });
      // set with TTL say 5 minutes
      await Redis.set(redisKey, payload, "EX", 60 * 5);
    }

    if (ops.length) {
      await PriceCache.bulkWrite(ops);
    }
  }

  console.log("Precompute done at", new Date());
}

// run once or in interval
(async () => {
  try {
    await workerLoop();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
