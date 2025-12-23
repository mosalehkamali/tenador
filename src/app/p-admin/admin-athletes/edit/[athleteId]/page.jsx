'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditAthlete() {
  const router = useRouter();
  const params = useParams();
  const athleteId = params.athleteId;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sports, setSports] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    birthDate: '',
    nationality: '',
    bio: '',
    photo: '',
  });

  useEffect(() => {
    fetchSports();
    fetchAthlete();
  }, [athleteId]);

  const fetchSports = async () => {
    try {
      const res = await fetch('/api/sports');
      const data = await res.json();
      setSports(data.sports || []);
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };

  const fetchAthlete = async () => {
    try {
      const res = await fetch(`/api/athletes/${athleteId}`);
      const data = await res.json();
      if (res.ok) {
        const athlete = data.athlete;
        setFormData({
          name: athlete.name || '',
          sport: athlete.sport?._id || athlete.sport || '',
          birthDate: athlete.birthDate ? new Date(athlete.birthDate).toISOString().split('T')[0] : '',
          nationality: athlete.nationality || '',
          bio: athlete.bio || '',
          photo: athlete.photo || '',
        });
      }
    } catch (error) {
      console.error('Error fetching athlete:', error);
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
    formData.append('folder', 'athletes');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, photo: data.url }));
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
        birthDate: formData.birthDate || null,
      };

      const res = await fetch(`/api/athletes/${athleteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/p-admin/admin-athletes');
      } else {
        alert(data.error || 'خطا در ویرایش ورزشکار');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('خطا در ویرایش ورزشکار');
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
            href="/p-admin/admin-athletes"
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← بازگشت به لیست ورزشکاران
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">ویرایش ورزشکار</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نام ورزشکار <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ورزش <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.sport}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sport: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">انتخاب ورزش</option>
                {sports.map((sport) => (
                  <option key={sport._id} value={sport._id}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاریخ تولد
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, birthDate: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملیت
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nationality: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                بیوگرافی
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عکس
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {uploading && (
                  <p className="text-sm text-gray-500">در حال آپلود...</p>
                )}
                {formData.photo && (
                  <div className="mt-4">
                    <img
                      src={formData.photo}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-full border border-gray-300"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </button>
              <Link
                href="/p-admin/admin-athletes"
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