import { useState } from "react";
import { FiShoppingCart, FiCheck } from "react-icons/fi";

const AddToCartButton = ({ onAddToCart }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setIsLoading(false);
    setIsAdded(true);
    onAddToCart?.();

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="btn-primary flex-1 text-sm py-2.5 px-4"
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
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