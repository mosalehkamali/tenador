// services/cacheInvalidation.js
import redis from "base/lib/redis";

export async function invalidateProductCaches(productIds = []) {
  if (!productIds.length) return;
  const keys = productIds.map(id => `pricecache:product:${id}`);
  await redis.del(...keys);
}

export async function invalidateAllRuleCaches() {
  // cautious: pattern delete - can be heavy in prod; for enterprise use keyspace propering or maintained sets
  const keys = await redis.keys("rules:product:*");
  if (keys.length) await redis.del(...keys);
}
