'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiLayers, FiTag } from 'react-icons/fi';
import AdminLayout from '@/components/admin/Layout';
import Button from '@/components/admin/Button';
import Textarea from '@/components/admin/Textarea';
import Input from '@/components/admin/Input';
import Select from '@/components/admin/Select';
import { showToast } from '@/lib/toast';
import { showError } from '@/lib/swal';

export default function AddCategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showPromptSection, setShowPromptSection] = useState(false);

  const productFields = [
    'name',
    'modelName',
    'shortDescription',
    'longDescription',
    'suitableFor',
    'basePrice',
    'tag',
  ];

  const [productPrompts, setProductPrompts] = useState(
    productFields.map((field) => ({ field, context: '' }))
  );

  const [formData, setFormData] = useState({
    title: '',
    name: '',
    parent: '',
    attributes: [],
  });

  const [currentAttribute, setCurrentAttribute] = useState({
    name: '',
    label: '',
    type: 'string',
    required: true,
    options: '',
    prompt: '',
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
      options:
        currentAttribute.type === 'select' && currentAttribute.options
          ? currentAttribute.options.split(',').map((opt) => opt.trim())
          : [],
      prompt: currentAttribute.prompt || undefined,
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
      prompt: '',
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
        name: formData.name,
        parent: formData.parent || null,
        attributes: formData.attributes,
        prompts: productPrompts.filter((p) => p.context.trim() !== ''),
      };

      const res = await fetch('/api/categories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div title="افزودن دسته‌بندی جدید" className="min-h-screen bg-[var(--color-background)] font-[var(--font-sans)] text-[var(--color-text)]">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white rounded-[var(--radius)] shadow-xl border border-neutral-100 transition-all duration-300 hover:shadow-2xl">
          <form onSubmit={handleSubmit} className="p-8 space-y-10">

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <FiLayers size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">ایجاد دسته‌بندی جدید</h1>
                <p className="text-sm text-neutral-500">اطلاعات اصلی دسته‌بندی را وارد کنید</p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="عنوان دسته‌بندی"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
                placeholder="مثال: کفش ورزشی"
              />

              <Input
                label="نام دسته‌بندی (انگلیسی)"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
                placeholder="sport-shoes"
                pattern="^[a-zA-Z0-9\s\-_]+$"
              />
            </div>

            <Select
              label="دسته والد (اختیاری)"
              name="parent"
              value={formData.parent}
              onChange={(e) => setFormData((prev) => ({ ...prev, parent: e.target.value }))}
              options={categories.map((cat) => ({ value: cat._id, label: cat.title }))}
              placeholder="انتخاب دسته والد"
            />

            {/* Product Prompt Section */}
            <div className="border rounded-[var(--radius)] p-6 transition-all duration-300 bg-neutral-50">
              <button
                type="button"
                onClick={() => setShowPromptSection((prev) => !prev)}
                className="flex items-center justify-between w-full text-right"
              >
                <div className="flex items-center gap-2 font-semibold text-[var(--color-primary)]">
                  <FiTag />
                  پرامپت فیلدهای محصول (اختیاری)
                </div>
                {showPromptSection ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ${
                  showPromptSection ? 'max-h-[1000px] mt-6' : 'max-h-0'
                }`}
              >
                <div className="grid md:grid-cols-2 gap-5">
                  {productPrompts.map((item, index) => (
                    <Textarea
                      key={item.field}
                      label={`Prompt برای ${item.field}`}
                      value={item.context}
                      onChange={(e) => {
                        const updated = [...productPrompts];
                        updated[index].context = e.target.value;
                        setProductPrompts(updated);
                      }}
                      placeholder="توضیح یا راهنمای AI برای این فیلد"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Attributes Section */}
            <div className="border-t pt-8 space-y-6">
              <h3 className="text-lg font-bold">ویژگی‌های اختصاصی دسته</h3>

              <div className="bg-neutral-50 rounded-[var(--radius)] p-6 space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="نام ویژگی (انگلیسی)"
                    value={currentAttribute.name}
                    onChange={(e) =>
                      setCurrentAttribute((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                  <Input
                    label="برچسب (فارسی)"
                    value={currentAttribute.label}
                    onChange={(e) =>
                      setCurrentAttribute((prev) => ({ ...prev, label: e.target.value }))
                    }
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Select
                    label="نوع"
                    value={currentAttribute.type}
                    onChange={(e) =>
                      setCurrentAttribute((prev) => ({ ...prev, type: e.target.value }))
                    }
                    options={[
                      { value: 'string', label: 'متن' },
                      { value: 'number', label: 'عدد' },
                      { value: 'select', label: 'انتخابی' },
                    ]}
                  />

                  <label className="flex items-center gap-2 text-sm font-medium mt-8 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentAttribute.required}
                      onChange={(e) =>
                        setCurrentAttribute((prev) => ({
                          ...prev,
                          required: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 accent-[var(--color-primary)]"
                    />
                    الزامی
                  </label>
                </div>
                <Textarea
                  label="Prompt (اختیاری)"
                  name="attrPrompt"
                  value={currentAttribute.prompt}
                  onChange={(e) => setCurrentAttribute((prev) => ({ ...prev, prompt: e.target.value }))}
                  placeholder="مثال: سایز کفش را انتخاب کنید"
                />
                {currentAttribute.type === 'select' && (
                  <Input
                    label="گزینه‌ها (با کاما جدا کنید)"
                    value={currentAttribute.options}
                    onChange={(e) =>
                      setCurrentAttribute((prev) => ({
                        ...prev,
                        options: e.target.value,
                      }))
                    }
                  />
                )}

                <Button
                  type="button"
                  onClick={addAttribute}
                  className="flex items-center gap-2"
                >
                  <FiPlus /> افزودن ویژگی
                </Button>
              </div>

              {formData.attributes.length > 0 && (
                <div className="space-y-3">
                  {formData.attributes.map((attr, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white border rounded-[var(--radius)] p-4 hover:shadow-md transition"
                    >
                      <div>
                        <span className="font-semibold">{attr.label}</span>
                        <span className="text-sm text-neutral-500 mr-2">
                          ({attr.name} - {attr.type})
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeAttribute(index)}
                        className="flex items-center gap-1"
                      >
                        <FiTrash2 size={14} />
                        حذف
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button type="submit" loading={loading}>
                ذخیره دسته‌بندی
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
