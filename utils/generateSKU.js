import crypto from "crypto";
import { createSlug } from "./slugify";

export function generateSKU(productName) {
  if (!productName) {
    throw new Error("Product name is required to generate SKU");
  }

  const base = createSlug(productName).substring(0, 40);

  const hash = crypto
    .createHash("md5")
    .update(productName + Date.now())
    .digest("hex")
    .substring(0, 4);

  return `${base}-${hash}`;
}
