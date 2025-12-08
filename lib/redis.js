// lib/redis.js
import { Redis } from "ioredis";

// -----------------------------
// MAIN CLIENT (Caching)
// -----------------------------
export const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// -----------------------------
// QUEUE CONNECTION (BullMQ)
// -----------------------------
export const redisQueue = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// -----------------------------
// WORKER CONNECTION (BullMQ)
// -----------------------------
export const redisWorker = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// -----------------------------
// Logging
// -----------------------------
redis.on("connect", () => console.log("Redis (cache) connected"));
redis.on("error", (err) => console.error("Redis (cache) error:", err));

redisQueue.on("connect", () => console.log("Redis (queue) connected"));
redisQueue.on("error", (err) => console.error("Redis (queue) error:", err));

redisWorker.on("connect", () => console.log("Redis (worker) connected"));
redisWorker.on("error", (err) => console.error("Redis (worker) error:", err));

