"use client"

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

  const renderContent = () => {
    switch (activeTab) {
      case "description":
        return <ProductDescription description={description} />;
      case "attributes":
        return <ProductAttributesTable attributes={attributes} />;
      case "reviews":
        return <ProductReviews reviews={reviews} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Tab Headers */}
      <div className="flex flex-wrap gap-2 border-b border-border sm:gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-item text-sm sm:text-base ${
              activeTab === tab.id ? "tab-item-active" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-6 sm:py-8" key={activeTab}>
        {renderContent()}
      </div>
    </div>
  );
};

export default ProductTabs;