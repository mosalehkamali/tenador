'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddBrand() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({
    logo: false,
    icon: false,
    image: false,
  });

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    country: '',
    foundedYear: '',
    description: '',
    logo: '',
    icon: '',
    image: '',
  });

  /* ---------- upload ---------- */
  const uploadImage = async (file, field) => {
    if (!file) return;

    setUploading((p) => ({ ...p, [field]: true }));

    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'brands');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFormData((p) => ({ ...p, [field]: data.url }));
    } catch (err) {
      alert('آپلود تصویر ناموفق بود');
    } finally {
      setUploading((p) => ({ ...p, [field]: false }));
    }
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        foundedYear: formData.foundedYear
          ? Number(formData.foundedYear)
          : null,
      };

      const res = await fetch('/api/brands/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push('/p-admin/admin-brands');
    } catch {
      alert('ذخیره برند انجام نشد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/p-admin/admin-brands" className="text-blue-600">
            ← بازگشت
          </Link>
          <h1 className="text-2xl font-bold mt-2">افزودن برند</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* name */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                نام انگلیسی برند (name)
              </label>
              <input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* title */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                عنوان نمایشی برند (title)
              </label>
              <input
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* country + year */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">کشور</label>
                <input
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  سال تأسیس
                </label>
                <input
                  type="number"
                  value={formData.foundedYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      foundedYear: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
            </div>

            {/* description */}
            <div>
              <label className="block mb-1 text-sm font-medium">توضیحات</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div className='lg:flex w-full gap-5'>
              {/* logo */}
              <UploadField
                label="لوگوی برند"
                url={formData.logo}
                loading={uploading.logo}
                onSelect={(f) => uploadImage(f, 'logo')}
              />

              {/* icon */}
              <UploadField
                label="آیکن برند"
                url={formData.icon}
                loading={uploading.icon}
                onSelect={(f) => uploadImage(f, 'icon')}
              />
            </div>

            {/* image */}
            <UploadField
              label="تصویر بنر برند"
              url={formData.image}
              loading={uploading.image}
              onSelect={(f) => uploadImage(f, 'image')}
            />

            <button
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg"
            >
              {loading ? 'در حال ذخیره…' : 'ذخیره برند'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

/* ---------- upload field ---------- */
function UploadField({ label, url, loading, onSelect }) {
  return (
    <div className='w-full'>
      <label className="block mb-2 text-sm font-medium">{label}</label>
      <label className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer hover:border-purple-500">
        {url ? (
          <img src={url} className="max-h-32 object-contain" />
        ) : (
          <span className="text-gray-500">
            {loading ? 'در حال آپلود…' : 'برای آپلود کلیک کنید'}
          </span>
        )}
        <input
          type="file"
          hidden
          accept="image/*"
          disabled={loading}
          onChange={(e) => onSelect(e.target.files[0])}
        />
      </label>
    </div>
  );
}
