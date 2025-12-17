'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/admin/DataTable';
import Button from '@/components/admin/Button';
import { showToast } from '@/lib/toast';
import { confirmDelete, showError } from '@/lib/swal';

export default function AdminCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
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
      } else {
        const data = await res.json();
        showError('خطا', data.error || 'خطا در حذف دسته‌بندی');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showError('خطا', 'خطا در حذف دسته‌بندی');
    }
  };

  const handleEdit = (category) => {
    router.push(`/p-admin/admin-categories/edit/${category._id}`);
  };

  const columns = [
    {
      header: 'عنوان',
      accessor: 'title',
    },
    {
      header: 'اسلاگ',
      accessor: 'slug',
    },
    {
      header: 'دسته والد',
      accessor: 'parent',
      render: (value) => value?.title || '-',
    },
    {
      header: 'تعداد ویژگی‌ها',
      accessor: 'attributes',
      render: (value) => value?.length || 0,
    },
  ];

  return (
    <div title="مدیریت دسته‌بندی‌ها">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">لیست دسته‌بندی‌ها</h2>
          <Button onClick={() => router.push('/p-admin/admin-categories/add')}>
            + افزودن دسته‌بندی جدید
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          emptyMessage="هیچ دسته‌بندی‌ای ثبت نشده است"
        />
      </div>
    </div>
  );
}




