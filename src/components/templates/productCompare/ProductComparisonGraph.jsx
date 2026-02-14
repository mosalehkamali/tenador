"use client";

import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { FiSearch, FiPlus } from "react-icons/fi";

const ProductComparisonGraph = ({ currentProductAttributes }) => {
  const [comparisonProduct, setComparisonProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // تبدیل اتریبیوت‌های عددی به فرمت نمودار
  const formatData = (product1, product2 = null) => {
    return product1
      .filter(attr => attr.type === "number")
      .map(attr => ({
        subject: attr.label,
        A: attr.value,
        B: product2?.find(a => a.label === attr.label)?.value || 0,
        fullMark: 100, // فرض بر این است که مقادیر از ۱۰۰ هستند
      }));
  };

  const data = formatData(currentProductAttributes, comparisonProduct?.attributes);

  return (
    <div className="bg-[#fcfcfc] rounded-[6px] p-8 border border-gray-100 h-full">
      {/* Search Bar */}
      {/* <div className="relative mb-10">
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="جستجوی محصول برای مقایسه..."
          className="w-full bg-white border border-gray-200 rounded-[6px] py-3 pr-12 pl-4 text-xs font-bold outline-none focus:border-[#aa4725] transition-all"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div> */}

      {/* Graph Area */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 900 }} />
            <Tooltip 
                contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Radar
              name="این محصول"
              dataKey="A"
              stroke="#aa4725"
              fill="#aa4725"
              fillOpacity={0.5}
            />
            {comparisonProduct && (
              <Radar
                name={comparisonProduct.name}
                dataKey="B"
                stroke="#1a1a1a"
                fill="#1a1a1a"
                fillOpacity={0.3}
              />
            )}
            <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 900 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
          تحلیل فنی و مقایسه عملکرد هوشمند
        </p>
      </div>
    </div>
  );
};

export default ProductComparisonGraph;