// ===============================
// app/products/ProductListClient.jsx (Client Component)
// ===============================

'use client';

import { useState } from "react";
import ProductList from "./ProductList";

export default function ProductListClient({ products: initialProducts }) {
  const [products, setProducts] = useState(initialProducts);

  const handleQuickView = (product) => {
    console.log("Quick view:", product);
  };

  const handleAddToCart = (product) => {
    console.log("Add to cart:", product.id);
  };

  const handleToggleWishlist = (product) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? { ...p, isWishlisted: !p.isWishlisted }
          : p
      )
    );
  };

  return (
    <ProductList
      products={products}
      onQuickView={handleQuickView}
      onAddToCart={handleAddToCart}
      onToggleWishlist={handleToggleWishlist}
    />
  );
}
