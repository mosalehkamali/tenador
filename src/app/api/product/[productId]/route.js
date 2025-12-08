// app/api/products/[id]/route.js
import connectToDB from "base/configs/db";
import Product from "base/models/Product";
import PriceCache from "base/models/PriceCache";
import redis from "base/lib/redis";

const REDIS_PREFIX = "pricecache:product:";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const rKey = `${REDIS_PREFIX}${id}`;
    const cached = await redis.get(rKey);
    const product = await Product.findById(id).lean();
    if (!product) return new Response(JSON.stringify({ error: "not found" }), { status: 404 });

    if (cached) {
      return new Response(JSON.stringify({ product, price: JSON.parse(cached) }), { status: 200 });
    }

    // fallback to DB cache
    const priceDoc = await PriceCache.findOne({ productId: id }).lean();
    const price = priceDoc || { finalPrice: product.basePrice, bestDiscount: 0 };
    // optionally warm redis
    await redis.set(rKey, JSON.stringify(price), "EX", parseInt(process.env.PRICE_CACHE_TTL || "300", 10));
    return new Response(JSON.stringify({ product, price }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
