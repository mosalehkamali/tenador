'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [sports, setSports] = useState([]);
  const [brands, setBrands] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    modelName: '',
    shortDescription: '',
    longDescription: '',
    suitableFor: '',
    basePrice: '',
    category: '',
    tag: '',
    mainImage: '',
    gallery: [],
    brand: '',
    athlete: '',
    sport: '',
    attributes: {},
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sportsRes, brandsRes, athletesRes, categoriesRes] = await Promise.all([
        fetch('/api/sports'),
        fetch('/api/brands'),
        fetch('/api/athletes'),
        fetch('/api/categories'),
      ]);

      const [sportsData, brandsData, athletesData, categoriesData] = await Promise.all([
        sportsRes.json(),
        brandsRes.json(),
        athletesRes.json(),
        categoriesRes.json(),
      ]);

      setSports(sportsData.sports || []);
      setBrands(brandsData.brands || []);
      setAthletes(athletesData.athletes || []);
      setCategories(categoriesData.categories || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'products');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, mainImage: data.url }));
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

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingGallery(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'products');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok) {
          uploadedUrls.push(data.url);
        }
      }

      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...uploadedUrls],
      }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('خطا در آپلود عکس‌ها');
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        basePrice: parseFloat(formData.basePrice) || 0,
        tag: formData.tag ? formData.tag.split(',').map(t => t.trim()) : [],
        athlete: formData.athlete || null,
        attributes: formData.attributes || {},
      };

      const res = await fetch('/api/product/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/p-admin/admin-products');
      } else {
        alert(data.error || 'خطا در ایجاد محصول');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('خطا در ایجاد محصول');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(c => c._id === formData.category);
  const categoryAttributes = selectedCategory?.attributes || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/p-admin/admin-products"
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← بازگشت به لیست محصولات
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">افزودن محصول جدید</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام محصول <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام مدل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.modelName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, modelName: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات کوتاه <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات کامل <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.longDescription}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, longDescription: e.target.value }))
                }
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  برند <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, brand: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">انتخاب برند</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">انتخاب ورزش</option>
                  {sports.map((sport) => (
                    <option key={sport._id} value={sport._id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ورزشکار
                </label>
                <select
                  value={formData.athlete}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, athlete: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">انتخاب ورزشکار</option>
                  {athletes
                    .filter(a => !formData.sport || a.sport?._id === formData.sport || a.sport === formData.sport)
                    .map((athlete) => (
                      <option key={athlete._id} value={athlete._id}>
                        {athlete.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  دسته‌بندی <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value, attributes: {} }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">انتخاب دسته‌بندی</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  قیمت پایه <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, basePrice: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {categoryAttributes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ویژگی‌ها
                </label>
                <div className="space-y-3 border border-gray-200 rounded-lg p-4">
                  {categoryAttributes.map((attr) => (
                    <div key={attr.name}>
                      <label className="block text-sm text-gray-600 mb-1">
                        {attr.label} {attr.required && <span className="text-red-500">*</span>}
                      </label>
                      {attr.type === 'select' && attr.options ? (
                        <select
                          required={attr.required}
                          value={formData.attributes[attr.name] || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              attributes: {
                                ...prev.attributes,
                                [attr.name]: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="">انتخاب کنید</option>
                          {attr.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={attr.type === 'number' ? 'number' : 'text'}
                          required={attr.required}
                          value={formData.attributes[attr.name] || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              attributes: {
                                ...prev.attributes,
                                [attr.name]: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مناسب برای <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.suitableFor}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, suitableFor: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="مثال: مبتدی، حرفه‌ای"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تگ‌ها (با کاما جدا کنید)
              </label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tag: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="مثال: محبوب، جدید، تخفیف‌دار"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تصویر اصلی <span className="text-red-500">*</span>
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageUpload}
                  disabled={uploading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {uploading && (
                  <p className="text-sm text-gray-500">در حال آپلود...</p>
                )}
                {formData.mainImage && (
                  <div className="mt-4">
                    <img
                      src={formData.mainImage}
                      alt="Preview"
                      className="w-48 h-48 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                گالری تصاویر
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  disabled={uploadingGallery}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {uploadingGallery && (
                  <p className="text-sm text-gray-500">در حال آپلود...</p>
                )}
                {formData.gallery.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {formData.gallery.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-2 left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'در حال ذخیره...' : 'ذخیره'}
              </button>
              <Link
                href="/p-admin/admin-products"
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












