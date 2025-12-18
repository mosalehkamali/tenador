'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminAthletes() {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAthletes();
  }, []);

  const fetchAthletes = async () => {
    try {
      const res = await fetch('/api/athletes');
      const data = await res.json();
      setAthletes(data.athletes || []);
    } catch (error) {
      console.error('Error fetching athletes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این ورزشکار را حذف کنید؟')) {
      return;
    }

    try {
      const res = await fetch(`/api/athletes/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchAthletes();
      } else {
        alert('خطا در حذف ورزشکار');
      }
    } catch (error) {
      console.error('Error deleting athlete:', error);
      alert('خطا در حذف ورزشکار');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/p-admin"
                className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
              >
                ← بازگشت به پنل
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">مدیریت ورزشکاران</h1>
            </div>
            <Link
              href="/p-admin/admin-athletes/add"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              + افزودن ورزشکار جدید
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        ) : athletes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">هیچ ورزشکاری ثبت نشده است</p>
            <Link
              href="/p-admin/admin-athletes/add"
              className="text-green-600 hover:text-green-800"
            >
              افزودن اولین ورزشکار
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نام
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عکس
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ورزش
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ملیت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {athletes.map((athlete) => (
                  <tr key={athlete._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {athlete.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {athlete.photo ? (
                        <img
                          src={athlete.photo}
                          alt={athlete.name}
                          className="w-12 h-12 object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {athlete.sport?.name || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {athlete.nationality || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/p-admin/admin-athletes/edit/${athlete._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          ویرایش
                        </Link>
                        <button
                          onClick={() => handleDelete(athlete._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}





