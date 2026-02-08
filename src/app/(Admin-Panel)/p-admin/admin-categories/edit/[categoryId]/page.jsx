'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  FiPlus, 
  FiTrash2, 
  FiChevronDown, 
  FiChevronUp, 
  FiLayers, 
  FiTag, 
  FiEdit3, 
  FiMenu, 
  FiX,
  FiSave
} from 'react-icons/fi';

// DnD Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
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
export default function EditCategory() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.categoryId;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showPromptSection, setShowPromptSection] = useState(false);
  const [editingId, setEditingId] = useState(null);

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (categoryId) {
      fetchInitialData();
    }
  }, [categoryId]);

  const fetchInitialData = async () => {
    setFetching(true);
    try {
      // Fetch all categories for the parent dropdown
      const catsRes = await fetch('/api/categories');
      const catsData = await catsRes.json();
      setCategories(catsData.categories || []);

      // Fetch the specific category to edit
      const res = await fetch(`/api/categories/${categoryId}`);
      const data = await res.json();

      if (res.ok && data.category) {
        const cat = data.category;
        
        setFormData({
          title: cat.title || '',
          name: cat.name || '',
          parent: cat.parent?._id || cat.parent || '',
          // Ensure every attribute has a unique ID for DnD-Kit even if DB doesn't provide one
          attributes: (cat.attributes || []).map(attr => ({
            ...attr,
            id: attr.id || attr._id || `attr-${Math.random().toString(36).substr(2, 9)}`,
            options: Array.isArray(attr.options) ? attr.options : []
          })),
        });

        // Fill prompts
        if (cat.prompts) {
          const updatedPrompts = productFields.map(field => {
            const found = cat.prompts.find(p => p.field === field);
            return { field, context: found ? found.context : '' };
          });
          setProductPrompts(updatedPrompts);
        }
      } else {
        showError('خطا', 'دسته‌بندی یافت نشد');
        router.push('/p-admin/admin-categories');
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      showError('خطا', 'خطا در دریافت اطلاعات');
    } finally {
      setFetching(false);
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
        ? (typeof currentAttribute.options === 'string' ? currentAttribute.options.split(',').map(o => o.trim()).filter(Boolean) : currentAttribute.options)
        : [],
      prompt: currentAttribute.prompt || '',
    };

    if (editingId) {
      setFormData((prev) => ({
        ...prev,
        attributes: prev.attributes.map((attr) => 
          attr.id === editingId ? { ...attr, ...attrData } : attr
        ),
      }));
      setEditingId(null);
      showToast.success('ویژگی بروزرسانی شد');
    } else {
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
    setCurrentAttribute({ name: '', label: '', type: 'string', required: true, options: '', prompt: '' });
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
    document.getElementById('attribute-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
  };

  const removeAttribute = (id) => {
    setFormData((prev) => ({
      ...prev,
      attributes: normalizeOrders(prev.attributes.filter((attr) => attr.id !== id)),
    }));
    if (editingId === id) resetAttributeForm();
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setFormData((prev) => {
        const oldIndex = prev.attributes.findIndex((a) => a.id === active.id);
        const newIndex = prev.attributes.findIndex((a) => a.id === over.id);
        return {
          ...prev,
          attributes: normalizeOrders(arrayMove(prev.attributes, oldIndex, newIndex)),
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

      const res = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        showToast.success('تغییرات با موفقیت ذخیره شد');
        router.push('/p-admin/admin-categories');
      } else {
        showError('خطا', data.error || 'خطا در ویرایش دسته‌بندی');
      }
    } catch (error) {
      showError('خطا', 'خطا در برقراری ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex items-center justify-center min-h-screen">در حال بارگذاری...</div>;

  return (
    <div className="min-h-screen bg-[var(--color-background)] font-[var(--font-sans)] text-[var(--color-text)] pb-20">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white rounded-[var(--radius)] shadow-xl border border-neutral-100">
          <form onSubmit={handleSubmit} className="p-8 space-y-10">

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <FiEdit3 size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">ویرایش دسته‌بندی</h1>
                <p className="text-sm text-neutral-500">شناسه: {categoryId}</p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="عنوان دسته‌بندی"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
              <Input
                label="نام (Slug)"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <Select
              label="دسته والد"
              value={formData.parent}
              onChange={(e) => setFormData((prev) => ({ ...prev, parent: e.target.value }))}
              options={categories.filter(c => c._id !== categoryId).map((cat) => ({ value: cat._id, label: cat.title }))}
              placeholder="دسته اصلی"
            />

            {/* AI Prompts Section */}
            <div className="border rounded-[var(--radius)] p-6 bg-neutral-50/50">
              <button
                type="button"
                onClick={() => setShowPromptSection((prev) => !prev)}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-2 font-bold text-[var(--color-primary)]">
                  <FiTag /> تنظیمات هوش مصنوعی
                </div>
                {showPromptSection ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              <div className={`overflow-hidden transition-all duration-500 ${showPromptSection ? 'max-h-[2000px] mt-6' : 'max-h-0'}`}>
                <div className="grid md:grid-cols-2 gap-5">
                  {productPrompts.map((item, index) => (
                    <Textarea
                      key={item.field}
                      label={`دستورالعمل ${item.field}`}
                      value={item.context}
                      onChange={(e) => {
                        const updated = [...productPrompts];
                        updated[index].context = e.target.value;
                        setProductPrompts(updated);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Attributes Section */}
            <div id="attribute-form-anchor" className="border-t pt-8 space-y-6">
              <h3 className="text-lg font-bold">مدیریت ویژگی‌ها</h3>

              <div className={`rounded-[var(--radius)] p-6 space-y-5 border-2 transition-all ${editingId ? 'bg-amber-50/30 border-amber-200' : 'bg-neutral-50 border-transparent'}`}>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="نام انگلیسی" value={currentAttribute.name} onChange={(e) => setCurrentAttribute(p => ({ ...p, name: e.target.value }))} />
                  <Input label="برچسب فارسی" value={currentAttribute.label} onChange={(e) => setCurrentAttribute(p => ({ ...p, label: e.target.value }))} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Select
                    label="نوع ورودی"
                    value={currentAttribute.type}
                    onChange={(e) => setCurrentAttribute(p => ({ ...p, type: e.target.value }))}
                    options={[{ value: 'string', label: 'متن' }, { value: 'number', label: 'عدد' }, { value: 'select', label: 'لیست' }]}
                  />
                  <div className="mt-8">
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                      <input type="checkbox" checked={currentAttribute.required} onChange={(e) => setCurrentAttribute(p => ({ ...p, required: e.target.checked }))} className="w-5 h-5 accent-[var(--color-primary)]" /> الزامی
                    </label>
                  </div>
                </div>
                <Textarea label="پرامپت ویژگی" value={currentAttribute.prompt} onChange={(e) => setCurrentAttribute(p => ({ ...p, prompt: e.target.value }))} />
                {currentAttribute.type === 'select' && (
                  <Input label="گزینه‌ها (کاما ,)" value={currentAttribute.options} onChange={(e) => setCurrentAttribute(p => ({ ...p, options: e.target.value }))} />
                )}
                <div className="flex gap-3">
                  <Button type="button" onClick={handleAddOrUpdateAttribute}>{editingId ? 'بروزرسانی ویژگی' : 'افزودن به لیست'}</Button>
                  {editingId && <Button type="button" variant="secondary" onClick={resetAttributeForm}><FiX /> انصراف</Button>}
                </div>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
                <SortableContext items={formData.attributes.map(a => a.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {formData.attributes.map(attr => (
                      <SortableAttribute key={attr.id} attr={attr} onRemove={removeAttribute} onEdit={handleEditInit} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t">
              <Button type="submit" loading={loading} className="px-12"><FiSave className="ml-2" /> ذخیره تغییرات نهایی</Button>
              <Button type="button" variant="secondary" onClick={() => router.push('/p-admin/admin-categories')}>بازگشت</Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}