import { useState } from "react";

const ProductVariants = ({ variants = [] }) => {
  const [selected, setSelected] = useState({});

  const handleSelect = (type, option) => {
    setSelected((prev) => ({
      ...prev,
      [type]: option,
    }));
  };

  return (
    <div className="mb-6 space-y-4">
      {variants.map((variant,index) => (
        <div key={index}>
          <label
            className="
              mb-2 block text-sm font-medium
              text-[hsl(var(--foreground))]
            "
          >
            {variant.label}:
          </label>

          <div className="flex flex-wrap gap-2">
            {variant.value?.map((val,index) => {
              const isActive = selected[variant.type] === val;

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(variant.type, val)}
                  className={`
                    px-3 py-1.5
                    text-sm
                    border
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? `
                          border-[hsl(var(--primary))]
                          bg-[hsl(var(--primary)/0.1)]
                          text-[hsl(var(--primary))]
                        `
                        : `
                          border-[hsl(var(--border))]
                          text-[hsl(var(--foreground))]
                          hover:border-[hsl(var(--primary))]
                        `
                    }
                  `}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductVariants;
