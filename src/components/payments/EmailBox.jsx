import React from 'react';
import { MdOutlineMailOutline } from 'react-icons/md';

const EmailBox = ({ email, setEmail, show }) => {
  if (!show) return null;

  return (
    <div className="bg-white rounded-[6px] border border-gray-200 p-6 shadow-md mb-6">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
        <MdOutlineMailOutline className="text-[var(--color-primary)] text-2xl" />
        <h2 className="text-lg font-bold">دریافت تاییدیه از طریق ایمیل</h2>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="user-email" className="text-sm text-gray-600 block">
          دریافت تایید پرداخت از طریق ایمیل (اختیاری)
        </label>
        <input 
          id="user-email"
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@mail.com"
          dir="ltr"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[6px] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all placeholder:text-gray-300"
        />
        <p className="text-[10px] text-gray-400">اطلاعات فاکتور و تایید نهایی به این آدرس ارسال خواهد شد.</p>
      </div>
    </div>
  );
};

export default EmailBox;
