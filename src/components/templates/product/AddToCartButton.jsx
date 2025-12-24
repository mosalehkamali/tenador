"use client";

import { useState } from "react";
import { FiShoppingCart, FiCheck } from "react-icons/fi";

const AddToCartButton = ({ onAddToCart }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsLoading(false);

    setIsAdded(true);
    onAddToCart?.();

    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="
        flex flex-1 items-center justify-center gap-2
        py-2.5 px-4 text-sm font-medium
        bg-[hsl(var(--primary))]
        text-white
        transition-all duration-200 ease-out
        hover:opacity-90
        active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed
      "
    >
      {isLoading ? (
        <span
          className="
            h-4 w-4 animate-spin rounded-full
            border-2 border-white border-t-transparent
          "
        />
      ) : isAdded ? (
        <>
          <FiCheck className="h-4 w-4" />
          <span>به سبد اضافه شد</span>
        </>
      ) : (
        <>
          <FiShoppingCart className="h-4 w-4" />
          <span>افزودن به سبد خرید</span>
        </>
      )}
    </button>
  );
};

export default AddToCartButton;
