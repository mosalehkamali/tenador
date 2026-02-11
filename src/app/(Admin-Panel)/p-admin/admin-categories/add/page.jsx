'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiPlus,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiLayers,
  FiTag,
  FiEdit3,
  FiMenu,
  FiX
} from 'react-icons/fi';

// DnD Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import AdminLayout from '@/components/admin/Layout';
import Button from '@/components/admin/Button';
import Textarea from '@/components/admin/Textarea';
import Input from '@/components/admin/Input';
import Select from '@/components/admin/Select';
import { showToast } from '@/lib/toast';
import { showError } from '@/lib/swal';

// --- Sortable Item Component ---
function SortableAttribute({ attr, onRemove, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: attr.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white border rounded-[var(--radius)] p-4 hover:shadow-md transition group ${isDragging ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)] shadow-lg' : 'border-neutral-200'}`}
    >
      <div className="flex items-center gap-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-600 p-2 bg-neutral-50 rounded"
        >
          <FiMenu size={18} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-800">{attr.label}</span>
            {attr.required && <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded border border-red-100">الزامی</span>}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-neutral-500 font-mono">{attr.name}</span>
            <span className="text-xs text-neutral-400">•</span>
            <span className="text-xs text-neutral-500">{attr.type}</span>
            <span className="text-xs text-neutral-400">•</span>
            <span className="text-xs text-neutral-500 font-bold">Priority: {attr.order}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onEdit(attr)}
          className="flex items-center gap-1 h-9 bg-neutral-50"
        >
          <FiEdit3 size={14} />
          ویرایش
        </Button>
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => onRemove(attr.id)}
          className="flex items-center gap-1 h-9"
        >
          <FiTrash2 size={14} />
          حذف
        </Button>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function AddCategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showPromptSection, setShowPromptSection] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const productFields = [
    {
      field: 'name',
      context: `- MUST strictly follow this exact pattern:
  "{Persian product type} {Persian brand name} {Exact model name from raw content}"
- Persian product type MUST be inferred from category and content (e.g. راکت تنیس)
- Persian brand name MUST be the Persian transliteration of the brand
  (e.g. Wilson → ویلسون, Nike → نایکی)
- Model name MUST be copied EXACTLY from raw content in English
- Do NOT translate, shorten, reorder, or modify the model name
- This rule overrides any other naming rule
Example:
Raw content: "Wilson Tour Slam Lite Adult Recreational Tennis Racket"
Correct name output:
"راکت تنیس ویلسون Tour Slam Lite"
      `
    },
    {
      field: 'modelName',
      context: `- Technical or commercial model serie identifier
- Can be English or mixed (e.g. "Air Zoom Pegasus 40")
- mandatory , note that series is not full model , is considered like “T-Fight” and not “T-Fight 300S”
      `
    },
    {
      field: 'shortDescription',
      context: `- Persian
- 3 line concise sentences
- Marketing-friendly
- No emojis
      `
    },
    {
      field: 'longDescription',
      context: `- Persian
- Detailed, structured
- Explain usage, benefits, materials if possible
- SEO-friendly but natural
      `
    },
    {
      field: 'suitableFor',
      context: `- Persian
- Who this product is for (e.g. "مناسب بازیکنان حرفه‌ای تنیس")
      `
    },
    {
      field: 'basePrice',
      context: `- Number ONLY
- If price is missing, estimate realistically based on product type
- DO NOT write strings like "نامشخص"
      `
    },
    {
      field: 'tag',
      context: `- Persian keywords
  - Array of short strings
  - Useful for search
      `
    },
  ];

  const [productPrompts, setProductPrompts] = useState(
    productFields.map((item) => ({ field: item.field,context: item.context }))
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

  // DnD Sensors Configuration
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Avoid accidental drags when clicking buttons
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleParentChange = (parentId) => {
    if (!parentId) {
      // اگر روی حالت "بدون والد" ست شد، فیلدها را پاک نمی‌کنیم (اختیاری) یا ریست می‌کنیم
      setFormData(prev => ({ ...prev, parent: '' }));
      return;
    }

    // ۱. پیدا کردن آبجکت کامل دسته والد از لیست موجود
    const selectedParent = categories.find(cat => cat._id === parentId);

    if (selectedParent) {
      // ۲. کپی کردن اتریبیوت‌ها (با تولید ID جدید برای جلوگیری از تداخل در Drag & Drop)
      const inheritedAttributes = (selectedParent.attributes || []).map(attr => ({
        ...attr,
        id: `attr-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`,
      }));

      // ۳. کپی کردن پرامپت‌ها
      // اگر دسته والد پرامپت داشت، جایگزین پرامپت‌های فعلی می‌کنیم
      if (selectedParent.prompts && selectedParent.prompts.length > 0) {
        const newPrompts = productPrompts.map(p => {
          const parentContext = selectedParent.prompts.find(pp => pp.field === p.field);
          return parentContext ? { ...p, context: parentContext.context } : p;
        });
        setProductPrompts(newPrompts);
      }

      // ۴. بروزرسانی فرم (بدون ذخیره کردن parent ID طبق خواسته شما)
      setFormData(prev => ({
        ...prev,
        parent: '', // خالی می‌ماند تا در دیتابیس ذخیره نشود
        attributes: inheritedAttributes
      }));

      showToast.success(`اطلاعات از دسته "${selectedParent.title}" کپی شد`);
    }
  };

  const normalizeOrders = (attrs) => {
    return attrs.map((attr, index) => ({
      ...attr,
      order: index + 1,
    }));
  };

  const handleAddOrUpdateAttribute = () => {
    if (!currentAttribute.name || !currentAttribute.label) {
      showToast.warning('نام و برچسب ویژگی الزامی است');
      return;
    }

    const attrData = {
      name: currentAttribute.name,
      label: currentAttribute.label,
      type: currentAttribute.type,
      required: currentAttribute.required,
      options: currentAttribute.type === 'select'
        ? currentAttribute.options.split(',').map((opt) => opt.trim()).filter(Boolean)
        : [],
      prompt: currentAttribute.prompt || '',
    };

    if (editingId) {
      // Edit mode
      setFormData((prev) => ({
        ...prev,
        attributes: prev.attributes.map((attr) =>
          attr.id === editingId ? { ...attr, ...attrData } : attr
        ),
      }));
      setEditingId(null);
      showToast.success('ویژگی با موفقیت ویرایش شد');
    } else {
      // Create mode
      const newAttribute = {
        ...attrData,
        id: `attr-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`,
        order: formData.attributes.length + 1,
      };
      setFormData((prev) => ({
        ...prev,
        attributes: [...prev.attributes, newAttribute],
      }));
      showToast.success('ویژگی جدید اضافه شد');
    }

    resetAttributeForm();
  };

  const resetAttributeForm = () => {
    setCurrentAttribute({
      name: '',
      label: '',
      type: 'string',
      required: true,
      options: '',
      prompt: '',
    });
    setEditingId(null);
  };

  const handleEditInit = (attr) => {
    setEditingId(attr.id);
    setCurrentAttribute({
      name: attr.name,
      label: attr.label,
      type: attr.type,
      required: attr.required,
      options: Array.isArray(attr.options) ? attr.options.join(', ') : '',
      prompt: attr.prompt || '',
    });
    // Smooth scroll to builder form
    document.getElementById('attribute-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
  };

  const removeAttribute = (id) => {
    setFormData((prev) => {
      const filtered = prev.attributes.filter((attr) => attr.id !== id);
      return {
        ...prev,
        attributes: normalizeOrders(filtered),
      };
    });
    if (editingId === id) resetAttributeForm();
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setFormData((prev) => {
        const oldIndex = prev.attributes.findIndex((a) => a.id === active.id);
        const newIndex = prev.attributes.findIndex((a) => a.id === over.id);
        const reordered = arrayMove(prev.attributes, oldIndex, newIndex);
        return {
          ...prev,
          attributes: normalizeOrders(reordered),
        };
      });
    }
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
    <div className="min-h-screen bg-[var(--color-background)] font-[var(--font-sans)] text-[var(--color-text)]">
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
                <p className="text-sm text-neutral-500">فیلدها و ساختار داده‌ای دسته‌بندی را مدیریت کنید</p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="عنوان دسته‌بندی (فارسی)"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
                placeholder="مثال: راکت"
              />

              <Input
                label="نام دسته‌بندی (Slug انگلیسی)"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
                placeholder="racket"
                pattern="^[a-zA-Z0-9\s\-_]+$"
              />
            </div>

            <Select
              label="دسته والد"
              name="parent"
              value={formData.parent}
              onChange={(e) => handleParentChange(e.target.value)}
              options={categories.map((cat) => ({ value: cat._id, label: cat.title }))}
              placeholder="بدون والد (دسته اصلی)"
            />

            {/* AI Prompts Section */}
            <div className="border rounded-[var(--radius)] p-6 bg-neutral-50/50">
              <button
                type="button"
                onClick={() => setShowPromptSection((prev) => !prev)}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-2 font-bold text-[var(--color-primary)]">
                  <FiTag />
                  تنظیمات هوش مصنوعی (AI Prompts)
                </div>
                {showPromptSection ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ${showPromptSection ? 'max-h-[2000px] mt-6' : 'max-h-0'
                  }`}
              >
                <div className="grid md:grid-cols-2 gap-5">
                  {productPrompts.map((item, index) => (
                    <Textarea
                      key={item.field}
                      label={`دستورالعمل برای فیلد ${item.field}`}
                      value={item.context}
                      onChange={(e) => {
                        const updated = [...productPrompts];
                        updated[index].context = e.target.value;
                        setProductPrompts(updated);
                      }}
                      placeholder={`توضیح دهید AI چگونه باید مقدار ${item.field} را تولید کند...`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Attributes Section */}
            <div id="attribute-form-anchor" className="border-t pt-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  ساختار ویژگی‌های اختصاصی
                  {editingId && <span className="text-xs font-normal bg-amber-100 text-amber-700 px-2 py-0.5 rounded">در حال ویرایش...</span>}
                </h3>
              </div>

              {/* Attribute Builder Form */}
              <div className={`rounded-[var(--radius)] p-6 space-y-5 transition-all duration-300 border-2 ${editingId ? 'bg-amber-50/30 border-amber-200' : 'bg-neutral-50 border-transparent'}`}>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="نام سیستمی (انگلیسی)"
                    value={currentAttribute.name}
                    onChange={(e) => setCurrentAttribute((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. size"
                  />
                  <Input
                    label="نام نمایشی (فارسی)"
                    value={currentAttribute.label}
                    onChange={(e) => setCurrentAttribute((p) => ({ ...p, label: e.target.value }))}
                    placeholder="مثال: اندازه"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Select
                    label="نوع ورودی"
                    value={currentAttribute.type}
                    onChange={(e) => setCurrentAttribute((p) => ({ ...p, type: e.target.value }))}
                    options={[
                      { value: 'string', label: 'متن کوتاه' },
                      { value: 'number', label: 'عدد' },
                      { value: 'select', label: 'لیست انتخابی (Dropdown)' },
                    ]}
                  />

                  <div className="flex items-center gap-3 h-full mt-8">
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={currentAttribute.required}
                        onChange={(e) => setCurrentAttribute((p) => ({ ...p, required: e.target.checked }))}
                        className="w-5 h-5 rounded accent-[var(--color-primary)]"
                      />
                      فیلد الزامی است
                    </label>
                  </div>
                </div>

                <Textarea
                  label="راهنمای پرامپت ویژگی"
                  value={currentAttribute.prompt}
                  onChange={(e) => setCurrentAttribute((p) => ({ ...p, prompt: e.target.value }))}
                  placeholder="راهنمای اختصاصی برای این ویژگی جهت استفاده در تولید محتوا توسط AI..."
                />

                {currentAttribute.type === 'select' && (
                  <Input
                    label="گزینه‌های لیست (جدا شده با کاما , )"
                    value={currentAttribute.options}
                    onChange={(e) => setCurrentAttribute((p) => ({ ...p, options: e.target.value }))}
                    placeholder="Option 1, Option 2, Option 3"
                  />
                )}

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    onClick={handleAddOrUpdateAttribute}
                    className="flex items-center gap-2"
                  >
                    {editingId ? <><FiEdit3 /> بروزرسانی ویژگی</> : <><FiPlus /> افزودن به لیست</>}
                  </Button>

                  {editingId && (
                    <Button type="button" variant="secondary" onClick={resetAttributeForm} className="flex items-center gap-2">
                      <FiX /> انصراف
                    </Button>
                  )}
                </div>
              </div>

              {/* Draggable Reordering List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm text-neutral-500 font-medium">لیست ویژگی‌ها ({formData.attributes.length})</span>
                  <span className="text-[10px] text-neutral-400">برای تغییر ترتیب، دستگیره را بکشید</span>
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <div className="space-y-2">
                    <SortableContext
                      items={formData.attributes.map((a) => a.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {formData.attributes.map((attr) => (
                        <SortableAttribute
                          key={attr.id}
                          attr={attr}
                          onRemove={removeAttribute}
                          onEdit={handleEditInit}
                        />
                      ))}
                    </SortableContext>
                  </div>
                </DndContext>

                {formData.attributes.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-neutral-100 rounded-xl text-neutral-400 italic">
                    هیچ ویژگی اختصاصی برای این دسته تعریف نشده است.
                  </div>
                )}
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-neutral-100">
              <Button type="submit" loading={loading} className="px-12 text-lg">
                ایجاد نهایی دسته‌بندی
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/p-admin/admin-categories')}
              >
                بازگشت
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}