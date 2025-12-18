'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryCard } from '@/components/admin';
import { showToast } from '@/lib/toast';
import { confirmDelete, showError } from '@/lib/swal';

export default function AdminCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast.error('خطا در بارگذاری دسته‌بندی‌ها');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/product');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const getProductCount = (categoryId) => {
    return products.filter(product => product.category?._id === categoryId).length;
  };

  const handleDelete = async (category) => {
    const confirmed = await confirmDelete(
      'حذف دسته‌بندی',
      `آیا مطمئن هستید که می‌خواهید "${category.title}" را حذف کنید؟`
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/categories/${category._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast.success('دسته‌بندی با موفقیت حذف شد');
        fetchCategories();
        fetchProducts();
      } else {
        const data = await res.json();
        showError('خطا', data.error || 'خطا در حذف دسته‌بندی');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showError('خطا', 'خطا در حذف دسته‌بندی');
    }
  };

  return (
    <div title="مدیریت دسته‌بندی‌ها">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">لیست دسته‌بندی‌ها</h2>
          <button
            onClick={() => router.push('/p-admin/admin-categories/add')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + افزودن دسته‌بندی جدید
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">هیچ دسته‌بندی‌ای ثبت نشده است</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category._id}
                category={category}
                productCount={getProductCount(category._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}





