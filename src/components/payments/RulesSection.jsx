import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';

const RulesSection = ({ checked, onChange }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-custom border border-gray-200 p-6 custom-shadow mb-6">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="w-5 h-5 accent-primary cursor-pointer"
          />
          <span className="text-sm text-gray-700 select-none">
            تمام <button 
              type="button"
              onClick={(e) => { e.preventDefault(); setShowModal(true); }}
              className="text-primary font-bold hover:underline"
            >قوانین و مقررات</button> سایت را می‌پذیرم.
          </span>
        </label>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-custom shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg">قوانین و مقررات</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                <MdClose className="text-xl" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh] text-sm text-gray-600 leading-relaxed space-y-4 text-justify">
              <p>۱. کاربر موظف است تمام اطلاعات هویتی و پرداختی خود را به درستی وارد نماید.</p>
              <p>۲. بارگذاری فیش جعلی پیگرد قانونی دارد و حساب کاربری مسدود خواهد شد.</p>
              <p>۳. بازگشت وجه در سیستم پرداخت‌های بانکی تابع قوانین بانکی جمهوری اسلامی ایران است.</p>
              <p>۴. تایید نهایی پرداخت معمولاً بین ۱ تا ۴ ساعت کاری زمان‌بر است.</p>
              <p>۵. مسئولیت هرگونه اشتباه در واریز وجه به شماره حساب‌های غیر از موارد اعلام شده بر عهده کاربر است.</p>
              <p>۶. استفاده از این سرویس به منزله پذیرش تمام بندهای فوق می‌باشد.</p>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => { onChange(true); setShowModal(false); }}
                className="px-6 py-2 bg-primary text-white rounded-custom font-bold hover:bg-primary/90 transition-colors"
              >
                پذیرفتن و بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RulesSection;
