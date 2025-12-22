'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminSports() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const res = await fetch('/api/sports');
      const data = await res.json();
      setSports(data.sports || []);
    } catch (error) {
      console.error('Error fetching sports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این ورزش را حذف کنید؟')) {
      return;
    }

    try {
      const res = await fetch(`/api/sports/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchSports();
      } else {
        alert('خطا در حذف ورزش');
      }
    } catch (error) {
      console.error('Error deleting sport:', error);
      alert('خطا در حذف ورزش');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
              <h1 className="text-3xl font-bold text-gray-900">مدیریت ورزش‌ها</h1>
            </div>
            <Link
              href="/p-admin/admin-sports/add"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + افزودن ورزش جدید
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        ) : sports.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">هیچ ورزشی ثبت نشده است</p>
            <Link
              href="/p-admin/admin-sports/add"
              className="text-blue-600 hover:text-blue-800"
            >
              افزودن اولین ورزش
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
                    آیکون
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    توضیحات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sports.map((sport) => (
                  <tr key={sport._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {sport.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sport.icon ? (
                        <img
                          src={sport.icon}
                          alt={sport.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-md truncate">
                        {sport.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/p-admin/admin-sports/edit/${sport._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          ویرایش
                        </Link>
                        <button
                          onClick={() => handleDelete(sport._id)}
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










