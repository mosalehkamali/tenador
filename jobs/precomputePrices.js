// jobs/precomputePrices.js
import Product from "base/models/Product";
import { enqueuePriceJob } from "base/queues/priceQueue";
import "base/configs/db";

(async function () {
  console.log("Starting batch price recompute...");

  const products = await Product.find({}, "_id");

  for (const p of products) {
    await enqueuePriceJob(p._id);
  }

  console.log("All price jobs queued.");
  process.exit(0);
})();
