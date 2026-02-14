"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductDescription from "./ProductDescription";
import ProductAttributesTable from "./ProductAttributesTable";
import ProductReviews from "./ProductReviews";

const tabs = [
  { id: "description", label: "توضیحات تخصصی", icon: "📄" },
  { id: "attributes", label: "مشخصات فنی", icon: "⚙️" },
  { id: "reviews", label: "نظرات کاربران", icon: "💬" },
];

const ProductTabs = ({ description, attributes, reviews }) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-24 w-full rtl text-right" dir="rtl">
      {/* هدر تب‌ها با استایل مدرن */}
      <div className="relative flex items-center gap-8 border-b border-gray-100 pb-px overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-2 py-4 text-sm transition-all duration-300 outline-none shrink-0
                ${isActive ? "font-black text-[#1a1a1a]" : "font-bold text-gray-400 hover:text-gray-600"}
              `}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isActive ? "opacity-100" : "opacity-40"}`}>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>

              {/* نشانگر متحرک هوشمند */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#aa4725] rounded-t-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* محتوای تب‌ها با انیمیشن ورود */}
      <div className="relative py-10 min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {activeTab === "description" && (
              <div className="prose prose-gray max-w-none leading-8">
                <ProductDescription description={description} />
              </div>
            )}
            {activeTab === "attributes" && (
              <div className="bg-gray-50/50 rounded-[6px] p-1 border border-gray-100">
                <ProductAttributesTable attributes={attributes} />
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="px-2">
                <ProductReviews reviews={reviews} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductTabs;