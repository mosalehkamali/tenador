"use client"
import { useState } from "react";

const ProductGallery = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="aspect-square w-full overflow-hidden rounded-sm bg-muted">
        <img
          src={images[activeIndex]}
          alt="تصویر محصول"
          className="h-full w-full object-cover transition-opacity duration-350"
          key={activeIndex}
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`gallery-thumb ${
              activeIndex === index ? "gallery-thumb-active" : ""
            }`}
          >
            <img
              src={image}
              alt={`تصویر ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;