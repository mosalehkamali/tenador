// ===============================
// app/products/page.jsx (Server Component)
// ===============================
import ProductListClient from "@/components/templates/products/ProductListClient";

export default async function ProductsPage() {
  
  const baseUrl =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/product`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API ERROR:", res.status, text);
    throw new Error("خطا در دریافت محصولات");
  }
  
  const data = await res.json();
  const products = Array.isArray(data) ? data : data.products || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6 text-[#1a1a1a]">
        لیست محصولات
      </h1>

      <ProductListClient products={products} />
    </div>
  );
}

