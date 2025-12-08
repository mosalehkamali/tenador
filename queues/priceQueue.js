// queues/priceQueue.js
import { Queue } from "bullmq";
import { redisQueue } from "base/lib/redis";

export const priceQueue = new Queue("priceQueue", {
  connection: redisQueue,
});

export function enqueuePriceJob(productId) {
  return priceQueue.add(
    "computePrice",
    { productId },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 3000 },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
}
