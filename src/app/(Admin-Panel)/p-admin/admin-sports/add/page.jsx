'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const NAME_REGEX = /^[a-zA-Z0-9\s\-_]+$/;

export default function AddSport() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    icon: '',
    image: '',
  });

  const uploadFile = async (file, field) => {
    setUploading(true);

    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'sports');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'خطا در آپلود');
      }

      setFormData((prev) => ({
        ...prev,
        [field]: data.url,
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!NAME_REGEX.test(formData.name)) {
      alert('نام فقط باید شامل حروف انگلیسی، عدد، فاصله یا - و _ باشد');
      return;
    }

    if (!formData.title.trim()) {
      alert('عنوان الزامی است');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/sports/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'خطا در ایجاد ورزش');
      }

      router.push('/p-admin/admin-sports');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/p-admin/admin-sports" className="text-blue-600">
            ← بازگشت
          </Link>
          <h1 className="text-3xl font-bold mt-2">افزودن ورزش جدید</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* name */}
            <div>
              <label className="block mb-1 font-medium">
                نام سیستمی (English) *
              </label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                required
                className="w-full border rounded px-4 py-2"
                placeholder="football"
              />
            </div>

            {/* title */}
            <div>
              <label className="block mb-1 font-medium">
                عنوان نمایشی *
              </label>
              <input
                value={formData.title}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
                required
                className="w-full border rounded px-4 py-2"
                placeholder="فوتبال"
              />
            </div>

            {/* description */}
            <div>
              <label className="block mb-1 font-medium">توضیحات</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                className="w-full border rounded px-4 py-2"
              />
            </div>

            {/* icon */}
            <div>
              <label className="block mb-1 font-medium">آیکون</label>
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) =>
                  uploadFile(e.target.files[0], 'icon')
                }
              />
              {formData.icon && (
                <img src={formData.icon} className="w-20 mt-2" />
              )}
            </div>

            {/* image */}
            <div>
              <label className="block mb-1 font-medium">تصویر اصلی</label>
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) =>
                  uploadFile(e.target.files[0], 'image')
                }
              />
              {formData.image && (
                <img src={formData.image} className="w-40 mt-2 rounded" />
              )}
            </div>

            <div className="flex gap-4">
              <button
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded disabled:opacity-50"
              >
                {loading ? 'در حال ذخیره...' : 'ذخیره'}
              </button>
              <Link
                href="/p-admin/admin-sports"
                className="bg-gray-200 px-6 py-3 rounded"
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
