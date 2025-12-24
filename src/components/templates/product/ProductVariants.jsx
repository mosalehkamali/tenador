import { useState } from "react";

const ProductVariants = ({ variants }) => {
  const [selectedVariants, setSelectedVariants] = useState({});

  const handleSelect = (variantType, option) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantType]: option,
    }));
  };

  return (
    <div className="mb-6 space-y-4">
      {variants.map((variant) => (
        <div key={variant.type}>
          <label className="mb-2 block text-sm font-medium text-foreground">
            {variant.label}:
          </label>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(variant.type, option)}
                className={`variant-option ${
                  selectedVariants[variant.type] === option
                    ? "variant-option-active"
                    : ""
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductVariants;