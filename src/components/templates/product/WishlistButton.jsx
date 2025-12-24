import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

const WishlistButton = ({ onToggle }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleClick = () => {
    const newState = !isWishlisted;
    setIsWishlisted(newState);
    onToggle?.(newState);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center w-11 h-11 rounded border transition-all duration-200 ${
        isWishlisted
          ? "bg-primary/10 border-primary text-primary"
          : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"
      }`}
      aria-label={isWishlisted ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
    >
      {isWishlisted ? (
        <FaHeart className="h-5 w-5 animate-scale-in" />
      ) : (
        <FiHeart className="h-5 w-5" />
      )}
    </button>
  );
};

export default WishlistButton;
