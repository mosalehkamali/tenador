// ===============================
// app/products/[slug]/page.jsx (Server Component)
// ===============================

import ProductTemplate from "@/components/templates/product/ProductTemplate";
import { getProductBySlug } from "base/services/product.service";

export default async function ProductPage({ params }) {
  const { productSlug } =await params;

  if (!productSlug) {
    throw new Error("اسلاگ محصول معتبر نیست");
  }

  const product = await getProductBySlug(productSlug);

  if (!product) {
    throw new Error("محصول مورد نظر یافت نشد");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ProductTemplate product={product} />
    </div>
  );
}
