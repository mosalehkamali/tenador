'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/admin/Button';
import Input from '@/components/admin/Input';
import Textarea from '@/components/admin/Textarea';
import Select from '@/components/admin/Select';
import ImageUpload from '@/components/admin/ImageUpload';
import { showToast } from '@/lib/toast';
import { showError } from '@/lib/swal';

export default function ProductCreateForm({ initialData = {} }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    ...initialData, // 🔥 autofill from AI JSON
  });

  // ---------------------------
  // Fetch base data
  // ---------------------------
  useEffect(() => {
    fetchBaseData();
  }, []);

  useEffect(() => {
    if (formData.sport) fetchAthletes(formData.sport);
  }, [formData.sport]);

  async function fetchBaseData() {
    const [sportsRes, brandsRes, categoriesRes] = await Promise.all([
      fetch('/api/sports'),
      fetch('/api/brands'),
      fetch('/api/categories'),
    ]);

    const sportsData = await sportsRes.json();
    const brandsData = await brandsRes.json();
    const categoriesData = await categoriesRes.json();

    setSports(sportsData.sports || []);
    setBrands(brandsData.brands || []);
    setCategories(categoriesData.categories || []);
  }

  async function fetchAthletes(sportId) {
    const res = await fetch('/api/athletes');
    const data = await res.json();
    setAthletes(
      (data.athletes || []).filter(
        a => a.sport?._id === sportId || a.sport === sportId
      )
    );
  }

  // ---------------------------
  // Helpers
  // ---------------------------
  const selectedCategory = categories.find(c => c._id === formData.category);
  const categoryAttributes = selectedCategory?.attributes || [];

  function updateField(key, value) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  function updateAttribute(key, value) {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: value,
      },
    }));
  }

  // ---------------------------
  // Submit
  // ---------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice) || 0,
        tag: formData.tag
          ? Array.isArray(formData.tag)
            ? formData.tag
            : formData.tag.split(',').map(t => t.trim())
          : [],
        athlete: formData.athlete || null,
      };

      const res = await fetch('/api/product/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      showToast.success('محصول ساخته شد');
      router.push(`/p-admin/admin-categories/category-products/${selectedCategory._id}`);
    } catch (err) {
      showError('خطا', err.message || 'خطا در ایجاد محصول');
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow">

      <div className="grid md:grid-cols-2 gap-6">
        <Input label="نام محصول" value={formData.name} onChange={e => updateField('name', e.target.value)} />
        <Input label="مدل" value={formData.modelName} onChange={e => updateField('modelName', e.target.value)} />
      </div>

      <Textarea label="توضیح کوتاه" rows={3} value={formData.shortDescription} onChange={e => updateField('shortDescription', e.target.value)} />
      <Textarea label="توضیح کامل" rows={6} value={formData.longDescription} onChange={e => updateField('longDescription', e.target.value)} />

      <div className="grid md:grid-cols-3 gap-6">
        <Select label="برند" value={formData.brand} onChange={e => updateField('brand', e.target.value)}
          options={brands.map(b => ({ value: b._id, label: b.name }))} />

        <Select label="ورزش" value={formData.sport} onChange={e => updateField('sport', e.target.value)}
          options={sports.map(s => ({ value: s._id, label: s.name }))} />

        <Select label="ورزشکار" value={formData.athlete} onChange={e => updateField('athlete', e.target.value)}
          options={athletes.map(a => ({ value: a._id, label: a.name }))} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Select label="دسته‌بندی" value={formData.category} onChange={e => updateField('category', e.target.value)}
          options={categories.map(c => ({ value: c._id, label: c.title }))} />

        <Input label="قیمت پایه" type="number" value={formData.basePrice} onChange={e => updateField('basePrice', e.target.value)} />
      </div>

 {/* ATTRIBUTES TABLE */}
{categoryAttributes.length > 0 && (
  <div className="border-t pt-6">
    <h3 className="font-bold mb-4">ویژگی‌ها</h3>

    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-right p-3 border-b">ویژگی</th>
            <th className="text-right p-3 border-b">مقدار</th>
          </tr>
        </thead>

        <tbody>
          {categoryAttributes.map(attr => (
            <tr key={attr.name} className="border-b last:border-b-0">
              {/* LABEL */}
              <td className="px-3 text-gray-700 bg-blue-100 font-medium whitespace-nowrap">
                {attr.label}
                {attr.required && (
                  <span className="text-red-500 mr-1">*</span>
                )}
              </td>

              {/* VALUE */}
              <td>
                {attr.type === 'select' ? (
                  <Select
                    value={formData.attributes?.[attr.name] || ''}
                    onChange={e =>
                      updateAttribute(attr.name, e.target.value)
                    }
                    options={attr.options.map(opt => ({
                      value: opt,
                      label: opt,
                    }))}
                    placeholder="انتخاب کنید"
                  />
                ) : (
                  <Input
                        type={attr.type === 'number' ? 'number' : 'text'}
                    value={formData.attributes?.[attr.name] || ''}
                    onChange={e =>
                      updateAttribute(attr.name, e.target.value)
                    }
                    placeholder={`مقدار ${attr.label}`}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


      <Input label="مناسب برای" value={formData.suitableFor} onChange={e => updateField('suitableFor', e.target.value)} />
      <Input label="تگ‌ها" value={formData.tag} onChange={e => updateField('tag', e.target.value)} />

      <ImageUpload label="تصویر اصلی" value={formData.mainImage} onChange={v => updateField('mainImage', v)} folder="products" />
      <ImageUpload label="گالری" multiple value={formData.gallery} onChange={v => updateField('gallery', v)} folder="products" />

      <Button type="submit" loading={loading}>
        ایجاد محصول
      </Button>
    </form>
  );
}
