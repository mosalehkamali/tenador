// app/api/cart/price/route.js
import connectToDB from "base/configs/db";
    import Product from "base/models/Product";
import { calculateFinalPrice } from "base/services/priceCalculator";

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const items = body.items || []; // [{ productId, quantity }]
    const coupon = body.coupon || null;
    const user = body.user || null;

    const ids = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: ids } }).lean();
    const prodMap = new Map(products.map(p => [p._id.toString(), p]));
    let cartValue = 0;
    items.forEach(it => {
      const p = prodMap.get(it.productId);
      if (p) cartValue += (p.basePrice || 0) * (it.quantity || 1);
    });

    const results = [];
    for (const it of items) {
      const p = prodMap.get(it.productId);
      if (!p) continue;
      const res = await calculateFinalPrice(p, { quantity: it.quantity || 1, couponCode: coupon, cartValue, user });
      results.push({ productId: it.productId, quantity: it.quantity || 1, price: res });
    }

    const total = results.reduce((s, r) => s + r.price.finalPrice, 0);
    return new Response(JSON.stringify({ items: results, total }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
