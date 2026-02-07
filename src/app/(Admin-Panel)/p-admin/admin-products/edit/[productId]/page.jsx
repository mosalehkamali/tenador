'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  FiBox,
  FiTag,
  FiImage,
  FiLayers,
  FiDollarSign,
  FiSave,
  FiArrowLeft,
} from 'react-icons/fi';

import AdminLayout from '@/components/admin/Layout';
import Button from '@/components/admin/Button';
import Input from '@/components/admin/Input';
import Textarea from '@/components/admin/Textarea';
import Select from '@/components/admin/Select';
import ImageUpload from '@/components/admin/ImageUpload';
import { showToast } from '@/lib/toast';
import { showError } from '@/lib/swal';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (formData.sport) fetchAthletes();
  }, [formData.sport]);

  const fetchData = async () => {
    try {
      const [sportsRes, brandsRes, categoriesRes] = await Promise.all([
        fetch('/api/sports'),
        fetch('/api/brands'),
        fetch('/api/categories'),
      ]);

      const [sportsData, brandsData, categoriesData] = await Promise.all([
        sportsRes.json(),
        brandsRes.json(),
        categoriesRes.json(),
      ]);

      setSports(sportsData.sports || []);
      setBrands(brandsData.brands || []);
      setCategories(categoriesData.categories || []);
    } catch (error) {
      showToast.error('خطا در بارگذاری اطلاعات');
    }
  };

  const fetchAthletes = async () => {
    try {
      const res = await fetch('/api/athletes');
      const data = await res.json();
      setAthletes(
        (data.athletes || []).filter(
          (a) => a.sport?._id === formData.sport || a.sport === formData.sport
        )
      );
    } catch { }
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/product/${productId}`);
      const data = await res.json();
      if (res.ok && data.product) {
        const p = data.product;
        setFormData({
          name: p.name || '',
          modelName: p.modelName || '',
          shortDescription: p.shortDescription || '',
          longDescription: p.longDescription || '',
          suitableFor: p.suitableFor || '',
          basePrice: p.basePrice?.toString() || '',
          category: p.category?._id || p.category || '',
          tag: p.tag?.join(', ') || '',
          mainImage: p.mainImage || '',
          gallery: p.gallery || [],
          brand: p.brand?._id || p.brand || '',
          athlete: p.athlete?._id || p.athlete || '',
          sport: p.sport?._id || p.sport || '',
          attributes: p.attributes || {},
        });
      }
    } catch {
      showError('خطا', 'خطا در بارگذاری محصول');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        basePrice: parseFloat(formData.basePrice) || 0,
        tag: formData.tag
          ? formData.tag.split(',').map((t) => t.trim())
          : [],
        athlete: formData.athlete || null,
        attributes: formData.attributes || {},
      };

      const res = await fetch(`/api/product/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        showToast.success('محصول با موفقیت به‌روزرسانی شد');
        router.push('/p-admin/admin-products');
      } else {
        showError('خطا', data.error || 'خطا در ویرایش محصول');
      }
    } catch {
      showError('خطا', 'خطا در ویرایش محصول');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-[var(--color-primary)] border-t-transparent"></div>
      </div>
    );
  }

  const selectedCategory = categories.find(
    (c) => c._id === formData.category
  );
  const categoryAttributes = selectedCategory?.attributes || [];

  return (
    <div className="min-h-screen bg-[var(--color-background)] font-[var(--font-sans)] text-[var(--color-text)]">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <FiBox size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">ویرایش محصول</h1>
            <p className="text-sm text-neutral-500">
              اطلاعات محصول را ویرایش و ذخیره کنید
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[var(--radius)] shadow-xl border border-neutral-100 p-8 transition-all duration-300 hover:shadow-2xl">

          <form onSubmit={handleSubmit} className="space-y-10">

            {/* Basic Info */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 font-semibold text-[var(--color-primary)]">
                <FiLayers /> اطلاعات اصلی
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="نام محصول"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
                <Input
                  label="نام مدل"
                  value={formData.modelName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      modelName: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <Textarea
                label="توضیحات کوتاه"
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shortDescription: e.target.value,
                  }))
                }
                rows={3}
                required
              />

              <Textarea
                label="توضیحات کامل"
                value={formData.longDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    longDescription: e.target.value,
                  }))
                }
                rows={5}
                required
              />
            </section>

            {/* Pricing & Category */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 font-semibold text-[var(--color-primary)]">
                <FiDollarSign /> قیمت و دسته‌بندی
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Select
                  label="دسته‌بندی"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                      attributes: {},
                    }))
                  }
                  options={categories.map((c) => ({
                    value: c._id,
                    label: c.title,
                  }))}
                  required
                />

                <Input
                  label="قیمت پایه"
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      basePrice: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </section>

          {/* Attributes - Table Style */}
{categoryAttributes.length > 0 && (
  <section className="space-y-6">
    <div className="flex items-center gap-2 font-semibold text-[var(--color-primary)]">
      <FiTag />
      ویژگی‌های محصول
    </div>

    <div className="overflow-hidden rounded-[var(--radius)] border border-neutral-200 shadow-sm">

      {/* Table Header */}
      <div className="grid grid-cols-3 bg-[var(--color-primary)] text-white text-sm font-semibold">
        <div className="p-4">نام ویژگی</div>
        <div className="p-4 col-span-2">مقدار</div>
      </div>

      {/* Table Body */}
      {categoryAttributes.map((attr, index) => {
        const value = formData.attributes?.[attr.name] || '';

        return (
          <div
            key={attr.name}
            className={`
              grid grid-cols-3 items-center
              transition-all duration-200
              ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}
              hover:bg-[var(--color-secondary)]/10
            `}
          >
            {/* Attribute Label */}
            <div className="p-4 font-medium text-sm flex items-center gap-2">
              {attr.label}
              {attr.required && (
                <span className="text-red-500 text-xs">*</span>
              )}
            </div>

            {/* Attribute Input */}
            <div className="p-4 col-span-2">

              {attr.type === 'select' && attr.options ? (
                <Select
                  value={value}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      attributes: {
                        ...prev.attributes,
                        [attr.name]: e.target.value,
                      },
                    }))
                  }
                  options={attr.options.map((opt) => ({
                    value: opt,
                    label: opt,
                  }))}
                  required={attr.required}
                />
              ) : (
                <Input
                  type={attr.type === 'number' ? 'number' : 'text'}
                  value={value}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      attributes: {
                        ...prev.attributes,
                        [attr.name]: e.target.value,
                      },
                    }))
                  }
                  required={attr.required}
                />
              )}

            </div>
          </div>
        );
      })}
    </div>
  </section>
)}


            {/* Images */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 font-semibold text-[var(--color-primary)]">
                <FiImage /> تصاویر
              </div>

              <ImageUpload
                label="تصویر اصلی"
                value={formData.mainImage}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, mainImage: value }))
                }
                folder="products"
                required
              />

              <ImageUpload
                label="گالری تصاویر"
                value={formData.gallery}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, gallery: value }))
                }
                folder="products"
                multiple
              />
            </section>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t">
              <Button
                type="submit"
                loading={saving}
                className="flex items-center gap-2"
              >
                <FiSave />
                ذخیره تغییرات
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/p-admin/admin-products')}
                className="flex items-center gap-2"
              >
                <FiArrowLeft />
                بازگشت
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
