
import React from 'react';
import { MdClose } from 'react-icons/md';

const RulesModal = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-[6px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-lg">قوانین و مقررات پرداخت</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <MdClose className="text-xl" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh] text-sm text-gray-600 leading-relaxed space-y-4 text-justify">
          <p>۱. کاربر موظف است تمام اطلاعات هویتی و پرداختی خود را به درستی وارد نماید.</p>
          <p>۲. بارگذاری فیش جعلی پیگرد قانونی دارد و منجر به انسداد حساب می‌شود.</p>
          <p>۳. بازگشت وجه تابع قوانین بانکی و زمان‌بندی پایا/ساتنا است.</p>
          <p>۴. تایید نهایی و فعال‌سازی سفارش پس از بررسی کارشناسان (حداکثر ۴ ساعت) انجام می‌شود.</p>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={() => { onAccept(); onClose(); }}
              className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-[6px] font-bold hover:bg-[var(--color-primary)]/90 transition-colors"
          >
            تایید و پذیرش
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;
