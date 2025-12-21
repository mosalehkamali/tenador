'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditBrand() {
  const router = useRouter();
  const params = useParams();
  const brandId = params.brandId;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    foundedYear: '',
    description: '',
    logo: '',
  });

  useEffect(() => {
    fetchBrand();
  }, [brandId]);

  const fetchBrand = async () => {
    try {
      const res = await fetch(`/api/brands/${brandId}`);
      const data = await res.json();
      if (res.ok) {
        setFormData({
          name: data.brand.name || '',
          country: data.brand.country || '',
          foundedYear: data.brand.foundedYear?.toString() || '',
          description: data.brand.description || '',
          logo: data.brand.logo || '',
        });
      }
    } catch (error) {
      console.error('Error fetching brand:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'brands');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, logo: data.url }));
      } else {
        alert(data.error || 'خطا در آپلود عکس');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('خطا در آپلود عکس');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : null,
      };

      const res = await fetch(`/api/brands/${brandId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/p-admin/admin-brands');
      } else {
        alert(data.error || 'خطا در ویرایش برند');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('خطا در ویرایش برند');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/p-admin/admin-brands"
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← بازگشت به لیست برندها
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">ویرایش برند</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نام برند <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  کشور
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, country: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  سال تأسیس
                </label>
                <input
                  type="number"
                  value={formData.foundedYear}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, foundedYear: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                لوگو
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {uploading && (
                  <p className="text-sm text-gray-500">در حال آپلود...</p>
                )}
                {formData.logo && (
                  <div className="mt-4">
                    <img
                      src={formData.logo}
                      alt="Preview"
                      className="w-32 h-32 object-contain rounded-lg border border-gray-300 bg-white p-2"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </button>
              <Link
                href="/p-admin/admin-brands"
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                انصراف
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}









