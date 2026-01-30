import { useState, useEffect, useCallback } from 'react';

const CART_STORAGE_KEY = 'cart';

// fetch product from api
const fetchProduct = async (id) => {
  const res = await fetch(`/api/product/${id}`);
  if (!res.ok) throw new Error('خطا در دریافت محصول');
  return await res.json();
};

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCart = useCallback(async () => {
    if (typeof window === 'undefined') return;

    setIsLoading(true);
    setError(null);

    try {
      const rawCart = JSON.parse(
        localStorage.getItem(CART_STORAGE_KEY) || '[]'
      );

      const enriched = await Promise.all(
        rawCart.map(async (item) => {
          const product = await fetchProduct(item.productId);

          if (!product) return null;

          return {
            productId: item.productId,
            quantity: item.quantity,
            product,
          };
        })
      );

      setCartItems(enriched.filter(Boolean));
    } catch (e) {
      console.error(e);
      setError('خطا در بارگذاری سبد خرید');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const saveCart = useCallback((items) => {
    const raw = items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
    }));

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(raw));
  }, []);

  const updateQuantity = useCallback(
    (productId, delta) => {
      setCartItems((prev) => {
        const updated = prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        );

        saveCart(updated);
        return updated;
      });
    },
    [saveCart]
  );

  const removeItem = useCallback(
    (productId) => {
      setCartItems((prev) => {
        const updated = prev.filter(
          (item) => item.productId !== productId
        );

        saveCart(updated);
        return updated;
      });
    },
    [saveCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price.finalPrice * item.quantity,
    0
  );

  return {
    cartItems,
    isLoading,
    error,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
    refetch: loadCart,
  };
};
