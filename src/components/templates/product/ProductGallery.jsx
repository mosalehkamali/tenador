"use client";

import { useState } from "react";
import Image from "next/image";

const ProductGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div
        className="
          relative aspect-square w-full overflow-hidden
          border border-[hsl(var(--border))]
          bg-[hsl(var(--card))]
        "
      >
        <Image
          key={activeIndex}
          src={images[activeIndex]}
          alt="تصویر محصول"
          fill
          priority
          className="
            object-cover
            transition-opacity duration-300 ease-out
          "
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3">
        {images.map((image, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`
                relative h-16 w-16 overflow-hidden
                border transition-all duration-200
                ${isActive
                  ? "border-[hsl(var(--primary))]"
                  : "border-[hsl(var(--border))] opacity-70 hover:opacity-100"}
              `}
            >
              <Image
                src={image}
                alt={`تصویر ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGallery;
