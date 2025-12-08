// workers/precomputeWorker.js
import connectToDB from "base/configs/db";
import { createWorker } from "./bullmq.js";
import PriceCache from "base/models/PriceCache";
import Product from "base/models/Product";
import { computeBaseDiscountForProduct } from "base/services/discountEngine";
import redis from "base/lib/redis";

const QUEUE_NAME = process.env.BULLMQ_QUEUE || "precompute:products";
const REDIS_PREFIX = "pricecache:product:";

async function processor(job) {
  const ids = job.data.ids || [];
  console.log("Processing batch:", ids.length);
  await connectToDB();

  const products = await Product.find({ _id: { $in: ids } }).lean();
  const bulk = [];
  for (const p of products) {
    const res = await computeBaseDiscountForProduct(p);
    const payload = {
      productId: p._id,
      basePrice: p.basePrice,
      bestDiscount: res.bestDiscount,
      finalPrice: res.finalPrice,
      ruleIds: res.applied || [],
      updatedAt: new Date()
    };
    // upsert into mongo
    bulk.push({
      updateOne: {
        filter: { productId: p._id },
        update: { $set: payload },
        upsert: true
      }
    });
    // update redis
    const key = `${REDIS_PREFIX}${p._id}`;
    await redis.set(key, JSON.stringify(payload), "EX", parseInt(process.env.PRICE_CACHE_TTL || "300", 10));
  }

  if (bulk.length) await PriceCache.bulkWrite(bulk);
  return { processed: ids.length };
}

createWorker(QUEUE_NAME, processor, { concurrency: parseInt(process.env.PRECOMPUTE_CONCURRENCY || "4", 10) });
console.log("Precompute worker is running...");
