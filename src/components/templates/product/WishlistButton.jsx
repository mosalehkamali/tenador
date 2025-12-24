import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

const WishlistButton = ({ onToggle }) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    const next = !active;
    setActive(next);
    onToggle?.(next);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={active ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      className={`
        flex items-center justify-center
        w-11 h-11
        border
        transition-all duration-200
        ${
          active
            ? `
              border-[hsl(var(--primary))]
              bg-[hsl(var(--primary)/0.12)]
              text-[hsl(var(--primary))]
            `
            : `
              border-[hsl(var(--border))]
              text-[hsl(var(--foreground))]
              hover:border-[hsl(var(--primary))]
              hover:text-[hsl(var(--primary))]
            `
        }
      `}
    >
      {active ? (
        <FaHeart className="h-5 w-5 scale-110 transition-transform duration-150" />
      ) : (
        <FiHeart className="h-5 w-5 transition-transform duration-150" />
      )}
    </button>
  );
};

export default WishlistButton;
