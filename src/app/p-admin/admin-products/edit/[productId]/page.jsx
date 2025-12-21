'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
    if (formData.sport) {
      fetchAthletes();
    }
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
      console.error('Error fetching data:', error);
      showToast.error('خطا در بارگذاری اطلاعات');
    }
  };

  const fetchAthletes = async () => {
    try {
      const res = await fetch('/api/athletes');
      const data = await res.json();
      setAthletes((data.athletes || []).filter(a => 
        a.sport?._id === formData.sport || a.sport === formData.sport
      ));
    } catch (error) {
      console.error('Error fetching athletes:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/product/${productId}`);
      const data = await res.json();
      if (res.ok && data.product) {
        const product = data.product;
        setFormData({
          name: product.name || '',
          modelName: product.modelName || '',
          shortDescription: product.shortDescription || '',
          longDescription: product.longDescription || '',
          suitableFor: product.suitableFor || '',
          basePrice: product.basePrice?.toString() || '',
          category: product.category?._id || product.category || '',
          tag: product.tag?.join(', ') || '',
          mainImage: product.mainImage || '',
          gallery: product.gallery || [],
          brand: product.brand?._id || product.brand || '',
          athlete: product.athlete?._id || product.athlete || '',
          sport: product.sport?._id || product.sport || '',
          attributes: product.attributes || {},
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
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
        tag: formData.tag ? formData.tag.split(',').map(t => t.trim()) : [],
        athlete: formData.athlete || null,
        attributes: formData.attributes || {},
      };

      const res = await fetch(`/api/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        showToast.success('محصول با موفقیت به‌روزرسانی شد');
        router.push('/p-admin/admin-products');
      } else {
        showError('خطا', data.error || 'خطا در ویرایش محصول');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('خطا', 'خطا در ویرایش محصول');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="ویرایش محصول">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const selectedCategory = categories.find(c => c._id === formData.category);
  const categoryAttributes = selectedCategory?.attributes || [];

  return (
    <div title="ویرایش محصول">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="نام محصول"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input
                label="نام مدل"
                name="modelName"
                value={formData.modelName}
                onChange={(e) => setFormData((prev) => ({ ...prev, modelName: e.target.value }))}
                required
              />
            </div>

            <Textarea
              label="توضیحات کوتاه"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
              required
              rows={3}
            />

            <Textarea
              label="توضیحات کامل"
              name="longDescription"
              value={formData.longDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, longDescription: e.target.value }))}
              required
              rows={5}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select
                label="برند"
                name="brand"
                value={formData.brand}
                onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                required
                options={brands.map(brand => ({ value: brand._id, label: brand.name }))}
                placeholder="انتخاب برند"
              />
              <Select
                label="ورزش"
                name="sport"
                value={formData.sport}
                onChange={(e) => setFormData((prev) => ({ ...prev, sport: e.target.value, athlete: '' }))}
                required
                options={sports.map(sport => ({ value: sport._id, label: sport.name }))}
                placeholder="انتخاب ورزش"
              />
              <Select
                label="ورزشکار"
                name="athlete"
                value={formData.athlete}
                onChange={(e) => setFormData((prev) => ({ ...prev, athlete: e.target.value }))}
                options={athletes.map(athlete => ({ value: athlete._id, label: athlete.name }))}
                placeholder="انتخاب ورزشکار"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="دسته‌بندی"
                name="category"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value, attributes: {} }))}
                required
                options={categories.map(cat => ({ value: cat._id, label: cat.title }))}
                placeholder="انتخاب دسته‌بندی"
              />
              <Input
                label="قیمت پایه (تومان)"
                name="basePrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) => setFormData((prev) => ({ ...prev, basePrice: e.target.value }))}
                required
              />
            </div>

            {categoryAttributes.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">ویژگی‌های محصول</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryAttributes.map((attr) => (
                    <div key={attr.name}>
                      {attr.type === 'select' && attr.options ? (
                        <Select
                          label={attr.label}
                          name={attr.name}
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
                          required={attr.required}
                          options={attr.options.map(opt => ({ value: opt, label: opt }))}
                          placeholder="انتخاب کنید"
                        />
                      ) : (
                        <Input
                          label={attr.label}
                          name={attr.name}
                          type={attr.type === 'number' ? 'number' : 'text'}
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
                          required={attr.required}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Input
              label="مناسب برای"
              name="suitableFor"
              value={formData.suitableFor}
              onChange={(e) => setFormData((prev) => ({ ...prev, suitableFor: e.target.value }))}
              required
            />

            <Input
              label="تگ‌ها (با کاما جدا کنید)"
              name="tag"
              value={formData.tag}
              onChange={(e) => setFormData((prev) => ({ ...prev, tag: e.target.value }))}
            />

            <ImageUpload
              label="تصویر اصلی"
              value={formData.mainImage}
              onChange={(value) => setFormData((prev) => ({ ...prev, mainImage: value }))}
              folder="products"
              required
            />

            <ImageUpload
              label="گالری تصاویر"
              value={formData.gallery}
              onChange={(value) => setFormData((prev) => ({ ...prev, gallery: value }))}
              folder="products"
              multiple
            />

            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <Button type="submit" loading={saving}>
                ذخیره تغییرات
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/p-admin/admin-products')}
              >
                انصراف
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}








