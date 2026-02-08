"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaSave, FaTrophy, FaUser, FaTrash, FaIdCard, FaBullhorn } from "react-icons/fa";
import ImageUpload from "./ImageUpload";
import { useRouter } from "next/navigation";

export default function AthleteCreateForm({ initialData, isEdit = false }) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHonorChange = (index, field, value) => {
    const updatedHonors = [...formData.honors];
    updatedHonors[index][field] = value;
    setFormData((prev) => ({ ...prev, honors: updatedHonors }));
  };

  const addHonor = () => {
    setFormData((prev) => ({
      ...prev,
      honors: [...prev.honors, { title: "", quantity: 1, description: "" }],
    }));
  };

  const removeHonor = (index) => {
    setFormData((prev) => ({
      ...prev,
      honors: prev.honors.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // تشخیص مسیر و متد بر اساس نوع عملیات
      const url = isEdit ? `/api/athletes/${formData._id}` : "/api/athletes";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطایی رخ داد");

      Swal.fire({
        icon: "success",
        title: isEdit ? "به‌روزرسانی موفق" : "ثبت موفق",
        text: isEdit ? "اطلاعات ورزشکار با موفقیت تغییر کرد" : "ورزشکار جدید ساخته شد",
        confirmButtonColor: "var(--color-primary)",
        confirmButtonText: "بازگشت به پنل",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/p-admin/admin-athletes");
          router.refresh();
        }
      });
    } catch (err) {
      toast.error("خطا در برقراری ارتباط");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      {/* بخش اول: تصویر و اطلاعات هویتی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-4 border border-gray-100 rounded-[var(--radius)] shadow-sm">
          <ImageUpload
            label="تصویر ورزشکار"
            value={formData.photo}
            onChange={(url) => setFormData((prev) => ({ ...prev, photo: url }))}
            folder="athletes"
            required={true}
          />
        </div>

        <div className="md:col-span-2 space-y-4 p-4 border border-gray-100 rounded-[var(--radius)] bg-white shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-[var(--color-primary)] border-b pb-2">
            <FaIdCard /> مشخصات اصلی
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600">نام انگلیسی (Slug)</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-[var(--radius)] text-sm outline-none focus:border-[var(--color-primary)]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600">نام کامل فارسی</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-[var(--radius)] text-sm outline-none focus:border-[var(--color-primary)]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600">ملیت</label>
              <input
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-[var(--radius)] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600">تاریخ تولد</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate ? formData.birthDate.split("T")[0] : ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-[var(--radius)] text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* بخش دوم: فیزیک و بیوگرافی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 p-4 border border-gray-100 rounded-[var(--radius)] bg-white shadow-sm space-y-4">
          <h3 className="flex items-center gap-2 font-bold text-[var(--color-primary)] border-b pb-2">
            <FaUser /> ویژگی‌های فیزیکی
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600">قد (سانتی‌متر)</label>
              <input
                type="number"
                name="height"
                value={formData.height || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-[var(--radius)] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600">وزن (کیلوگرم)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-[var(--radius)] text-sm"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 p-4 border border-gray-100 rounded-[var(--radius)] bg-white shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-[var(--color-primary)] border-b pb-2 mb-4">
            بیوگرافی
          </h3>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={6}
            className="w-full p-3 border border-gray-200 rounded-[var(--radius)] text-sm leading-relaxed outline-none focus:ring-1 focus:ring-[var(--color-secondary)]"
          />
        </div>
      </div>

      {/* بخش سوم: افتخارات */}
      <div className="p-4 border border-gray-100 rounded-[var(--radius)] bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="flex items-center gap-2 font-bold text-[var(--color-primary)]">
            <FaTrophy /> افتخارات و دستاوردها
          </h3>
          <button
            type="button"
            onClick={addHonor}
            className="text-xs bg-[var(--color-secondary)] text-black px-4 py-1.5 rounded-full font-bold hover:opacity-80 transition-all"
          >
            + افزودن مورد جدید
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {formData.honors?.map((honor, index) => (
            <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded-[var(--radius)] border border-gray-100 transition-all hover:shadow-inner">
              <input
                placeholder="عنوان (مثلاً قهرمانی آسیا)"
                value={honor.title}
                onChange={(e) => handleHonorChange(index, "title", e.target.value)}
                className="flex-1 p-2 border border-gray-200 rounded text-xs outline-none bg-white"
              />
              <input
                type="number"
                placeholder="تعداد"
                value={honor.quantity}
                onChange={(e) => handleHonorChange(index, "quantity", e.target.value)}
                className="w-16 p-2 border border-gray-200 rounded text-xs text-center bg-white"
              />
              <button
                type="button"
                onClick={() => removeHonor(index)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* دکمه ثبت نهایی */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--color-primary)] text-white py-4 rounded-[var(--radius)] font-bold shadow-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 text-lg"
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <FaSave /> ثبت نهایی ورزشکار
          </>
        )}
      </button>
    </form>
  );
}