'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddAthlete() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sports, setSports] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    sport: '',
    birthDate: '',
    nationality: '',
    bio: '',
    photo: '',
  });

  /* ---------- fetch sports ---------- */
  useEffect(() => {
    fetch('/api/sports')
      .then((res) => res.json())
      .then((data) => setSports(data.sports || []))
      .catch(() => {});
  }, []);

  /* ---------- upload photo ---------- */
  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'athletes');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error();

      setFormData((p) => ({ ...p, photo: data.url }));
    } catch {
      alert('آپلود تصویر ناموفق بود');
    } finally {
      setUploading(false);
    }
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        birthDate: formData.birthDate || null,
      };

      const res = await fetch('/api/athletes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push('/p-admin/admin-athletes');
    } catch (err) {
      alert(err.message || 'خطا در ایجاد ورزشکار');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/p-admin/admin-athletes" className="text-blue-600">
            ← بازگشت
          </Link>
          <h1 className="text-2xl font-bold mt-2">افزودن ورزشکار</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* name */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                نام انگلیسی (name) *
              </label>
              <input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            {/* title */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                عنوان نمایشی (title) *
              </label>
              <input
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            {/* sport */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                ورزش *
              </label>
              <select
                required
                value={formData.sport}
                onChange={(e) =>
                  setFormData({ ...formData, sport: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="">انتخاب کنید</option>
                {sports.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.title || s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* birth + nationality */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  تاریخ تولد
                </label>
                <input
                  type="text"
                  value={formData.birthDate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  ملیت
                </label>
                <input
                  value={formData.nationality}
                  onChange={(e) =>
                    setFormData({ ...formData, nationality: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
            </div>

            {/* bio */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                بیوگرافی
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            {/* photo */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                عکس ورزشکار
              </label>
              <label className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer hover:border-green-500">
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    className="h-32 w-32 object-cover rounded-full"
                  />
                ) : (
                  <span className="text-gray-500">
                    {uploading ? 'در حال آپلود…' : 'برای آپلود کلیک کنید'}
                  </span>
                )}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                />
              </label>
            </div>

            <button
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg"
            >
              {loading ? 'در حال ذخیره…' : 'ذخیره ورزشکار'}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}
