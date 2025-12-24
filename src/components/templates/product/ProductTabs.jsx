"use client";

import { useState } from "react";
import ProductDescription from "./ProductDescription";
import ProductAttributesTable from "./ProductAttributesTable";
import ProductReviews from "./ProductReviews";

const tabs = [
  { id: "description", label: "توضیحات بیشتر" },
  { id: "attributes", label: "ویژگی‌های محصول" },
  { id: "reviews", label: "نظرات مشتریان" },
];

const ProductTabs = ({ description, attributes, reviews }) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-12">
      {/* Tabs header */}
      <div className="flex border-b border-[hsl(var(--border))]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-4 py-3 text-sm font-medium
                transition-colors duration-200
                ${
                  isActive
                    ? "text-[hsl(var(--primary))]"
                    : "opacity-60 hover:opacity-100"
                }
              `}
            >
              {tab.label}

              {/* Active underline */}
              {isActive && (
                <span
                  className="
                    absolute inset-x-0 -bottom-px h-[2px]
                    bg-[hsl(var(--primary))]
                  "
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div
        key={activeTab}
        className="
          pt-6
          animate-[fadeIn_0.25s_ease-out]
        "
      >
        {activeTab === "description" && (
          <ProductDescription description={description} />
        )}
        {activeTab === "attributes" && (
          <ProductAttributesTable attributes={attributes} />
        )}
        {activeTab === "reviews" && (
          <ProductReviews reviews={reviews} />
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
