'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/admin/Button';
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

  const columns = [
    {
      header: 'تصویر',
      accessor: 'mainImage',
      render: (value) =>
        value ? (
          <img src={value} alt="Product" className="w-16 h-16 object-cover rounded" />
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      header: 'نام محصول',
      accessor: 'name',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.modelName}</div>
        </div>
      ),
    },
    {
      header: 'دسته‌بندی',
      accessor: 'category',
      render: (value) => value?.title || '-',
    },
    {
      header: 'برند',
      accessor: 'brand',
      render: (value) => value?.name || '-',
    },
    {
      header: 'ورزش',
      accessor: 'sport',
      render: (value) => value?.name || '-',
    },
    {
      header: 'قیمت',
      accessor: 'basePrice',
      render: (value) => `${(value || 0).toLocaleString('fa-IR')} تومان`,
    },
  ];

  const customActions = (row) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEdit(row)}
      >
        ویرایش
      </Button>
      <Button
        variant="success"
        size="sm"
        onClick={() => handleViewVariants(row)}
      >
        واریانت‌ها
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={() => handleDelete(row)}
      >
        حذف
      </Button>
    </div>
  );

  return (
    <div title="مدیریت محصولات">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">لیست محصولات</h2>
          <Button onClick={() => router.push('/p-admin/admin-products/add')}>
            + افزودن محصول جدید
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">هیچ محصولی ثبت نشده است</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {column.header}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-gray-600">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      {columns.map((column, colIndex) => (
                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                          {column.render
                            ? column.render(product[column.accessor], product)
                            : product[column.accessor]}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {customActions(product)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
