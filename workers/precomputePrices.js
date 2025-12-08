// workers/precomputeProducer.js
import connectToDB from "base/configs/db";
import Product from "base/models/Product";
import { createQueue } from "./bullmq.js";

const QUEUE_NAME = process.env.BULLMQ_QUEUE || "precompute:products";
const BATCH = parseInt(process.env.BATCH_SIZE || "500", 10);

async function produce() {
  await connectToDB();
  const queue = createQueue(QUEUE_NAME);
  const total = await Product.countDocuments({});
  console.log("Total products:", total);

  for (let skip = 0; skip < total; skip += BATCH) {
    const products = await Product.find({})
      .skip(skip)
      .limit(BATCH)
      .select("_id")
      .lean();
    const ids = products.map(p => p._id.toString());
    // enqueue batch job with ids
    await queue.add("precompute-batch", { ids }, { removeOnComplete: true, removeOnFail: true });
    console.log("Enqueued batch:", skip, skip + BATCH);
  }

  process.exit(0);
}

produce().catch(err => {
  console.error(err);
  process.exit(1);
});
