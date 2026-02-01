import React, { useState, useRef } from 'react';
import { MdCloudUpload, MdDeleteOutline, MdImage } from 'react-icons/md';
import { toast } from 'react-toastify';

const ReceiptUploader = ({ onFileChange }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('لطفاً فقط فایل تصویر بارگذاری کنید.', { style: { fontFamily: 'Vazirmatn' } });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم فایل نباید بیشتر از ۵ مگابایت باشد.', { style: { fontFamily: 'Vazirmatn' } });
      return;
    }

    // پیش‌نمایش فوری
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'receipts');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'خطا در آپلود');
      }

      toast.success('رسید با موفقیت آپلود شد ✅', { style: { fontFamily: 'Vazirmatn' } });

      // اینجا URL نهایی رو می‌فرستیم بالا
      onFileChange(data.url);

    } catch (err) {
      console.error(err);
      toast.error('آپلود ناموفق بود ❌', { style: { fontFamily: 'Vazirmatn' } });
      setPreview(null);
      onFileChange(null);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onFileChange(null);
  };

  return (
    <div className="bg-white rounded-[6px] border border-gray-200 p-6 shadow-md mb-6">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
        <MdImage className="text-[var(--color-primary)] text-2xl" />
        <h2 className="text-lg font-bold">بارگذاری فیش واریزی</h2>
      </div>

      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-[6px] p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-4
          ${preview ? 'border-[var(--color-primary)]/50 bg-[var(--color-primary)]/5' : 'border-gray-200 hover:border-[var(--color-primary)]/40 bg-gray-50'}`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />

        {preview ? (
          <div className="w-full flex flex-col items-center gap-4">
            <img src={preview} alt="Receipt Preview" className="max-h-64 rounded-[6px] shadow-md object-contain" />
            <button 
              onClick={removeFile}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-[6px] hover:bg-red-100 transition-colors text-sm font-bold"
            >
              <MdDeleteOutline className="text-lg" />
              حذف و تغییر تصویر
            </button>
          </div>
        ) : (
          <>
            <div className="p-4 bg-white rounded-full shadow-sm text-[var(--color-primary)]">
              <MdCloudUpload className="text-4xl" />
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-700">برای انتخاب فایل کلیک کنید</p>
              <p className="text-xs text-gray-400 mt-1">فرمت‌های مجاز: JPG, PNG (حداکثر ۵ مگابایت)</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReceiptUploader;
