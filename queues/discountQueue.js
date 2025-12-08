// queues/discountQueue.js
import { Queue } from "bullmq";
import { redisQueue } from "@/lib/redis";

export const discountQueue = new Queue("discountQueue", {
  connection: redisQueue,
});

export function enqueueDiscountJob(ruleId) {
  return discountQueue.add(
    "applyDiscountRule",
    { ruleId },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 3000 },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
}
