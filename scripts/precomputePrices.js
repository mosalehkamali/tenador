// scripts/precomputePrices.js
import cron from "node-cron";
import { exec } from "child_process";
import path from "path";

const producerCmd = "node workers/precomputePrices.js";

// every 5 minutes (tweak as needed)
cron.schedule("*/5 * * * *", () => {
  console.log("Cron: enqueue precompute batches");
  exec(producerCmd, (err, stdout, stderr) => {
    if (err) console.error("Producer error", err);
    else console.log(stdout);
    if (stderr) console.error(stderr);
  });
});
