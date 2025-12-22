'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/Layout';
import Button from '@/components/admin/Button';
import Input from '@/components/admin/Input';
import Select from '@/components/admin/Select';
import { showToast } from '@/lib/toast';
import { showError } from '@/lib/swal';

export default function EditCategory() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.categoryId;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    parent: '',
    attributes: [],
  });
  const [currentAttribute, setCurrentAttribute] = useState({
    name: '',
    label: '',
    type: 'string',
    required: true,
    options: '',
  });

  useEffect(() => {
    fetchCategories();
    fetchCategory();
  }, [categoryId]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories((data.categories || []).filter(c => c._id !== categoryId));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await fetch(`/api/categories/${categoryId}`);
      const data = await res.json();
      if (res.ok && data.category) {
        setFormData({
          title: data.category.title || '',
          parent: data.category.parent?._id || data.category.parent || '',
          attributes: data.category.attributes || [],
        });
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAttribute = () => {
    if (!currentAttribute.name || !currentAttribute.label) {
      showToast.warning('نام و برچسب ویژگی الزامی است');
      return;
    }

    const attribute = {
      name: currentAttribute.name,
      label: currentAttribute.label,
      type: currentAttribute.type,
      required: currentAttribute.required,
      options: currentAttribute.type === 'select' && currentAttribute.options
        ? currentAttribute.options.split(',').map(opt => opt.trim())
        : [],
    };

    setFormData((prev) => ({
      ...prev,
      attributes: [...prev.attributes, attribute],
    }));

    setCurrentAttribute({
      name: '',
      label: '',
      type: 'string',
      required: true,
      options: '',
    });
  };

  const removeAttribute = (index) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        title: formData.title,
        parent: formData.parent || null,
        attributes: formData.attributes,
      };

      const res = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        showToast.success('دسته‌بندی با موفقیت به‌روزرسانی شد');
        router.push('/p-admin/admin-categories');
      } else {
        showError('خطا', data.error || 'خطا در ویرایش دسته‌بندی');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('خطا', 'خطا در ویرایش دسته‌بندی');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div title="ویرایش دسته‌بندی">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div title="ویرایش دسته‌بندی">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="عنوان دسته‌بندی"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />

            <Select
              label="دسته والد (اختیاری)"
              name="parent"
              value={formData.parent}
              onChange={(e) => setFormData((prev) => ({ ...prev, parent: e.target.value }))}
              options={categories.map(cat => ({ value: cat._id, label: cat.title }))}
              placeholder="انتخاب دسته والد"
            />

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">ویژگی‌های دسته‌بندی</h3>

              <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="نام ویژگی (انگلیسی)"
                    name="attrName"
                    value={currentAttribute.name}
                    onChange={(e) => setCurrentAttribute((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="مثال: size"
                  />
                  <Input
                    label="برچسب (فارسی)"
                    name="attrLabel"
                    value={currentAttribute.label}
                    onChange={(e) => setCurrentAttribute((prev) => ({ ...prev, label: e.target.value }))}
                    placeholder="مثال: سایز"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="نوع"
                    name="attrType"
                    value={currentAttribute.type}
                    onChange={(e) => setCurrentAttribute((prev) => ({ ...prev, type: e.target.value }))}
                    options={[
                      { value: 'string', label: 'متن' },
                      { value: 'number', label: 'عدد' },
                      { value: 'select', label: 'انتخابی' },
                    ]}
                  />
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentAttribute.required}
                        onChange={(e) => setCurrentAttribute((prev) => ({ ...prev, required: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">الزامی</span>
                    </label>
                  </div>
                </div>

                {currentAttribute.type === 'select' && (
                  <Input
                    label="گزینه‌ها (با کاما جدا کنید)"
                    name="attrOptions"
                    value={currentAttribute.options}
                    onChange={(e) => setCurrentAttribute((prev) => ({ ...prev, options: e.target.value }))}
                    placeholder="مثال: کوچک, متوسط, بزرگ"
                  />
                )}

                <Button type="button" onClick={addAttribute} variant="outline" size="sm">
                  + افزودن ویژگی
                </Button>
              </div>

              {formData.attributes.length > 0 && (
                <div className="space-y-2">
                  {formData.attributes.map((attr, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
                    >
                      <div>
                        <span className="font-medium text-gray-800">{attr.label}</span>
                        <span className="text-sm text-gray-500 mr-2">
                          ({attr.name} - {attr.type})
                        </span>
                        {attr.required && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded mr-2">
                            الزامی
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeAttribute(index)}
                      >
                        حذف
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <Button type="submit" loading={saving}>
                ذخیره تغییرات
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/p-admin/admin-categories')}
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













