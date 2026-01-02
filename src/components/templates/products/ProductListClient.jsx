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

  const handleToggleWishlist = async (product) => {
    // Check if user is logged in
    try {
      const res = await fetch('/api/auth/profile');
      if (!res.ok) {
        // User not logged in, redirect to login
        window.location.href = '/login-register';
        return;
      }

      // User is logged in, toggle wishlist
      const wishlistRes = await fetch('/api/wishlist', {
        method: product.isWishlisted ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id }),
      });

      if (wishlistRes.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p._id === product._id
              ? { ...p, isWishlisted: !p.isWishlisted }
              : p
          )
        );
      } else {
        console.error('Failed to toggle wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
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
