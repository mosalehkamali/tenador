'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/Layout';
import Button from '@/components/admin/Button';
import Input from '@/components/admin/Input';
import Select from '@/components/admin/Select';
import { showToast } from '@/lib/toast';
import { showError } from '@/lib/swal';

export default function AddCategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        parent: formData.parent || null,
        attributes: formData.attributes,
      };

      const res = await fetch('/api/categories/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        showToast.success('دسته‌بندی با موفقیت ایجاد شد');
        router.push('/p-admin/admin-categories');
      } else {
        showError('خطا', data.error || 'خطا در ایجاد دسته‌بندی');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('خطا', 'خطا در ایجاد دسته‌بندی');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="افزودن دسته‌بندی جدید">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="عنوان دسته‌بندی"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
              placeholder="مثال: کفش ورزشی"
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
              <Button type="submit" loading={loading}>
                ذخیره
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
    </AdminLayout>
  );
}






