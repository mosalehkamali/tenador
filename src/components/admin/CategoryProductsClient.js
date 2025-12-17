'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCard } from '@/components/admin';
import { showToast } from '@/lib/toast';
import { confirmDelete, showError } from '@/lib/swal';

export default function CategoryProductsClient({ categoryId }) {
  const router = useRouter();
  console.log("catId",categoryId);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const res = await fetch(`/api/categories/${categoryId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCategory(data.category);
    } catch {
      showToast.error('خطا در بارگذاری دسته‌بندی');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/product');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      showToast.error('خطا در بارگذاری محصولات');
    } finally {
      setLoading(false);
    }
  };

  const categoryProducts = products.filter(
    (p) => p.category?._id === categoryId
  );

  const handleDelete = async () => {
    if (!category) return;

    const confirmed = await confirmDelete(
      'حذف دسته‌بندی',
      `آیا مطمئن هستید که می‌خواهید "${category.title}" را حذف کنید؟`
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error();

      showToast.success('دسته‌بندی با موفقیت حذف شد');
      router.push('/p-admin/admin-categories');
    } catch {
      showError('خطا', 'خطا در حذف دسته‌بندی');
    }
  };

  if (!category && !loading) {
    return (
      <div className="flex items-center justify-center h-64">
        دسته‌بندی یافت نشد
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold ">
          محصولات دسته‌بندی {category?.title}
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() =>
              router.push(`/p-admin/admin-categories/category-products/${categoryId}/add-product`)
            }
            className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            افزودن محصول
          </button>

          <button
            onClick={() =>
              router.push(`/p-admin/admin-categories/edit/${categoryId}`)
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            ویرایش دسته‌بندی
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            حذف دسته‌بندی
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center h-64">Loading...</div>
      ) : categoryProducts.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg shadow">
          هیچ محصولی در این دسته‌بندی وجود ندارد
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={() =>
                router.push(`/p-admin/admin-products/edit/${product._id}`)
              }
              onViewVariants={() =>
                router.push(
                  `/p-admin/admin-products/${product._id}/variants`
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
