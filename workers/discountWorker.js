// workers/discountWorker.js
import { Worker } from "bullmq";
import { redisWorker } from "base/lib/redis";
import DiscountRule from "base/models/DiscountRule";
import Product from "base/models/Product";
import { enqueuePriceJob } from "base/queues/priceQueue";

const worker = new Worker(
  "discountQueue",
  async (job) => {
    const { ruleId } = job.data;
    const rule = await DiscountRule.findById(ruleId).lean();
    if (!rule) return;

    // پیدا کردن محصولاتی که باید دوباره محاسبه شوند
    let affectedProducts = [];

    if (rule.type === "global") {
      affectedProducts = await Product.find({}, "_id");
    } else if (rule.type === "product") {
      affectedProducts = await Product.find({ _id: { $in: rule.targets } }, "_id");
    } else if (rule.type === "category") {
      affectedProducts = await Product.find({ category: { $in: rule.targets } }, "_id");
    } else if (rule.type === "brand") {
      affectedProducts = await Product.find({ brand: { $in: rule.targets } }, "_id");
    }

    for (const item of affectedProducts) {
      await enqueuePriceJob(item._id);
    }
  },
  { connection: redisWorker }
);

worker.on("completed", () => console.log("Discount rule applied"));
worker.on("failed", (job, err) => console.error("Discount worker failed", err));
