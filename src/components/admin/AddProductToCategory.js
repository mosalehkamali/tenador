"use client";

import { showToast } from "@/lib/toast";
import { useEffect, useState } from "react";

export default function AddProductToCategory({ categoryId }) {
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${categoryId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCategory(data.category);
      } catch {
        showToast.error("خطا در بارگذاری دسته‌بندی");
      }
    };
    fetchCategory();
  }, [categoryId]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold ">
          افزودن محصول به دسته‌بندی {category?.title}
        </h2>
      </div>
    </div>
  );
}
