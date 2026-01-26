'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCard } from '@/components/admin';
import { showToast } from '@/lib/toast';
import { confirmDelete, showError } from '@/lib/swal';

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/product');

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const text = await res.text();
      if (!text) {
        setProducts([]);
        return;
      }

      const data = JSON.parse(text);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast.error('خطا در بارگذاری محصولات');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = await confirmDelete(
      'حذف محصول',
      `آیا مطمئن هستید که می‌خواهید "${product.name}" را حذف کنید؟`
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/product/${product._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast.success('محصول با موفقیت حذف شد');
        fetchProducts();
      } else {
        const data = await res.json();
        showError('خطا', data.error || 'خطا در حذف محصول');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showError('خطا', 'خطا در حذف محصول');
    }
  };

  const handleEdit = (product) => {
    router.push(`/p-admin/admin-products/edit/${product._id}`);
  };

  const handleViewVariants = (product) => {
    router.push(`/p-admin/admin-products/${product._id}/variants`);
  };

  return (
    <div title="مدیریت محصولات">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">لیست محصولات</h2>
          <button
            onClick={() => router.push('/p-admin/admin-products/add')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + افزودن محصول جدید
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">هیچ محصولی ثبت نشده است</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewVariants={handleViewVariants}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
