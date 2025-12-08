// workers/priceWorker.js
import { Worker } from "bullmq";
import { redisWorker, redis } from "base/lib/redis";
import Product from "base/models/Product";
import { calculateFinalPrice } from "base/services/discount/calculateFinalPrice";

const worker = new Worker(
  "priceQueue",
  async (job) => {
    const { productId } = job.data;

    const product = await Product.findById(productId)
      .populate("brand")
      .populate("category")
      .lean();

    if (!product) return;

    // محاسبه قیمت نهایی
    const result = await calculateFinalPrice(product, {});

    // ذخیره در Redis (برای صفحات محصول)
    await redis.set(
      `product:finalPrice:${productId}`,
      JSON.stringify(result),
      "EX",
      60 * 60 // یک ساعت
    );
  },
  {
    connection: redisWorker,
  }
);

worker.on("completed", (job) => {
  console.log(`Price updated → ${job.data.productId}`);
});

worker.on("failed", (job, err) => {
  console.error("Price worker failed", job.id, err);
});
