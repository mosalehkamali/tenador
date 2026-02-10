'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaEdit, FaBox, FaImages, FaTags, FaCogs } from 'react-icons/fa';
import Button from '@/components/admin/Button';
import Input from '@/components/admin/Input';
import Textarea from '@/components/admin/Textarea';
import Select from '@/components/admin/Select';
import ImageUpload from '@/components/admin/ImageUpload';
import { showToast } from '@/lib/toast';
import { showError } from '@/lib/swal';

// ---------------------------
// Helpers
// ---------------------------
function normalizeInitialAttributes(attributes = {}, categoryAttributes = []) {
  const result = {};
  for (const attr of categoryAttributes) {
    const value = attributes[attr.name];
    if (attr.type === 'select') {
      result[attr.name] = Array.isArray(value) ? value.join(', ') : (value ?? '');
    } else {
      result[attr.name] = value ?? '';
    }
  }
  return result;
}

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.productId; // دریافت آیدی از URL
  
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [sports, setSports] = useState([]);
  const [brands, setBrands] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    suitableFor: '',
    basePrice: '',
    category: '',
    tag: '',
    mainImage: '',
    gallery: [],
    brand: '',
    serie: '',
    athlete: '',
    sport: '',
    attributes: {},
  });

  // ---------------------------
  // Fetch Initial Data (Product + Base Data)
  // ---------------------------
  useEffect(() => {
    if (!id) {
      return <div className="p-20 text-center">در حال دریافت شناسه محصول...</div>;
    }
    async function fetchData() {
      try {
        const [sportsRes, brandsRes, categoriesRes, productRes] = await Promise.all([
          fetch('/api/sports'),
          fetch('/api/brands'),
          fetch('/api/categories'),
          fetch(`/api/product/${id}`)
        ]);

        const sportsData = await sportsRes.json();
        const brandsData = await brandsRes.json();
        const categoriesData = await categoriesRes.json();
        const productData = await productRes.json();

        setSports(sportsData.sports || []);
        setBrands(brandsData.brands || []);
        setCategories(categoriesData.categories || []);
        
        if (productData.product) {
          const p = productData.product;
          setFormData({
            ...p,
            brand: p.brand?._id || p.brand,
            serie: p.serie?._id || p.serie,
            sport: p.sport?._id || p.sport,
            athlete: p.athlete?._id || p.athlete,
            category: p.category?._id || p.category,
            tag: Array.isArray(p.tag) ? p.tag.join(', ') : p.tag,
          });
        }
      } catch (err) {
        showError('خطا', 'عدم موفقیت در بارگذاری اطلاعات');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    if (formData.sport) fetchAthletes(formData.sport);
  }, [formData.sport]);

  async function fetchAthletes(sportId) {
    const res = await fetch('/api/athletes');
    const data = await res.json();
    setAthletes((data.athletes || []).filter(a => (a.sport?._id || a.sport) === sportId));
  }

  const selectedCategory = categories.find(c => c._id === formData.category);
  const categoryAttributes = selectedCategory?.attributes || [];

  function updateField(key, value) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  function updateAttribute(key, value) {
    setFormData(prev => ({
      ...prev,
      attributes: { ...prev.attributes, [key]: value },
    }));
  }

  // ---------------------------
  // Submit (Update)
  // ---------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const normalizedAttributes = {};
      for (const attr of categoryAttributes) {
        const rawValue = formData.attributes?.[attr.name];
        if (rawValue === undefined || rawValue === null) continue;

        if (attr.type === 'select') {
          normalizedAttributes[attr.name] = String(rawValue).split(',').map(v => v.trim()).filter(Boolean);
        } else if (attr.type === 'number') {
          normalizedAttributes[attr.name] = Number(rawValue);
        } else {
          normalizedAttributes[attr.name] = rawValue;
        }
      }

      const payload = {
        ...formData,
        attributes: normalizedAttributes,
        basePrice: Number(formData.basePrice) || 0,
        tag: typeof formData.tag === 'string' ? formData.tag.split(',').map(t => t.trim()) : formData.tag,
      };

      const res = await fetch(`/api/product/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      showToast.success('تغییرات با موفقیت ذخیره شد');
      router.push(
        `/p-admin/admin-categories/category-products/${selectedCategory._id}`
      );
      router.refresh();
    } catch (err) {
      showError('خطا', err.message || 'خطا در ویرایش محصول');
    } finally {
      setSubmitLoading(false);
    }
  }

  if (loading) return <div className="p-20 text-center font-bold animate-pulse text-gray-400">در حال بارگذاری اطلاعات محصول...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
            <FaEdit size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">ویرایش محصول</h1>
            <p className="text-gray-400 text-xs mt-1">شناسه: {id}</p>
          </div>
        </div>
        <Button type="submit" loading={submitLoading} className="px-10 rounded-2xl">
          ذخیره تغییرات
        </Button>
      </div>

      {/* General Info */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center gap-2 border-b pb-4 mb-6">
          <FaBox className="text-gray-400" />
          <h2 className="font-black text-gray-800">اطلاعات پایه</h2>
        </div>
        
        <Input
          label="نام محصول"
          value={formData.name}
          onChange={e => updateField('name', e.target.value)}
        />

        <div className="grid md:grid-cols-1 gap-6">
          <Textarea
            label="توضیح کوتاه"
            rows={3}
            value={formData.shortDescription}
            onChange={e => updateField('shortDescription', e.target.value)}
          />
          <Textarea
            label="توضیح کامل"
            rows={3}
            value={formData.longDescription}
            onChange={e => updateField('longDescription', e.target.value)}
          />
        </div>
      </div>

      {/* Relations & Logistics */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 border-b pb-4 mb-6">
          <FaCogs className="text-gray-400" />
          <h2 className="font-black text-gray-800">ارتباطات و قیمت</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Select
            label="برند"
            value={formData.brand}
            onChange={e => { updateField('brand', e.target.value); updateField('serie', ''); }}
            options={brands.map(b => ({ value: b._id, label: b.name }))}
          />
          {formData.brand && (
            <Select
              label="سری"
              value={formData.serie}
              onChange={e => updateField('serie', e.target.value)}
              options={brands.find(b => b._id === formData.brand)?.series?.map(s => ({ value: s._id, label: s.name })) || []}
            />
          )}
          <Input
            label="قیمت پایه"
            type="number"
            value={formData.basePrice}
            onChange={e => updateField('basePrice', e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <Select
            label="ورزش"
            value={formData.sport}
            onChange={e => updateField('sport', e.target.value)}
            options={sports.map(s => ({ value: s._id, label: s.name }))}
          />
          <Select
            label="ورزشکار"
            value={formData.athlete}
            onChange={e => updateField('athlete', e.target.value)}
            options={athletes.map(a => ({ value: a._id, label: a.name }))}
          />
          <Select
            label="دسته‌بندی"
            value={formData.category}
            onChange={e => updateField('category', e.target.value)}
            options={categories.map(c => ({ value: c._id, label: c.title }))}
          />
        </div>
      </div>

      {/* Attributes Table */}
      {categoryAttributes.length > 0 && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 border-b pb-4 mb-6">
            <FaTags className="text-gray-400" />
            <h2 className="font-black text-gray-800">ویژگی‌های فنی</h2>
          </div>
          <div className="overflow-hidden border rounded-2xl">
            <table className="w-full">
              <tbody className="divide-y divide-gray-100">
                {categoryAttributes.map(attr => (
                  <tr key={attr.name}>
                    <td className="p-4 bg-gray-50/50 font-bold text-gray-600 text-sm w-1/3">{attr.label}</td>
                    <td className="p-2">
                      <Input
                        type={attr.type === 'number' ? 'number' : 'text'}
                        value={formData.attributes?.[attr.name] || ''}
                        onChange={e => updateAttribute(attr.name, e.target.value)}
                        placeholder={attr.type === 'select' ? 'مقادیر با کاما جدا شوند' : ''}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Media */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 border-b pb-4 mb-6">
          <FaImages className="text-gray-400" />
          <h2 className="font-black text-gray-800">رسانه و تگ‌ها</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <ImageUpload label="تصویر اصلی محصول" value={formData.mainImage} onChange={v => updateField('mainImage', v)} folder="product" />
          <ImageUpload label="گالری تصاویر" multiple value={formData.gallery} onChange={v => updateField('gallery', v)} folder="product" />
        </div>
        <div className="mt-8">
          <Input label="تگ‌ها (با کاما جدا کنید)" value={formData.tag} onChange={e => updateField('tag', e.target.value)} />
          <div className="mt-4">
            <Input label="مناسب برای" value={formData.suitableFor} onChange={e => updateField('suitableFor', e.target.value)} />
          </div>
        </div>
      </div>

    </form>
  );
}