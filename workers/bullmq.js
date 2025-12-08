// workers/bullmq.js
import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL);

export function createQueue(name) {
  return new Queue(name, { connection });
}

export function createWorker(name, processor, opts = {}) {
  const worker = new Worker(name, processor, { connection, concurrency: opts.concurrency || 2 });
  worker.on("failed", (job, err) => console.error("Job failed", job.id, err));
  worker.on("completed", (job) => console.log("Job completed", job.id));
  return worker;
}
