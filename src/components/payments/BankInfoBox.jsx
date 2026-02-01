import React from 'react';
import { MdContentCopy, MdAccountBalance } from 'react-icons/md';
import { toast } from 'react-toastify';

const BANK_DETAILS = {
  accountNumber: "1234567890123",
  cardNumber: "6037997123456789",
  iban: "IR123456789012345678901234",
  ownerName: "فخرالدین صیف الدینی"
};

const BankInfoBox = () => {
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} کپی شد`, {
      style: { fontFamily: 'Vazirmatn' }
    });
  };

  const InfoRow = ({ label, value, fieldName }) => (
    <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-[6px] border border-gray-100 group relative overflow-hidden transition-all hover:border-[var(--color-primary)]/30">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="flex justify-between items-center">
        <span className="font-mono text-gray-800 font-bold tracking-wider">{value}</span>
        <button 
          onClick={() => copyToClipboard(value, label)}
          className="text-gray-400 hover:text-[var(--color-primary)] p-2 rounded-full hover:bg-white transition-colors"
          title={`کپی ${label}`}
        >
          <MdContentCopy />
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-[6px] border border-gray-200 p-6 shadow-md mb-6">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
        <MdAccountBalance className="text-[var(--color-primary)] text-2xl" />
        <h2 className="text-lg font-bold">اطلاعات حساب بانکی</h2>
      </div>

      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        لطفاً مبلغ سفارش را به یکی از حساب‌های زیر واریز نموده و تصویر فیش واریزی را در بخش پایین بارگذاری کنید.
      </p>

      <div className="space-y-4">
        <div className="p-3 bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 rounded text-sm text-gray-800 flex justify-between items-center">
          <span className="font-medium text-gray-600">نام صاحب حساب:</span>
          <span className="font-bold">{BANK_DETAILS.ownerName}</span>
        </div>
        
        <InfoRow label="شماره کارت" value={BANK_DETAILS.cardNumber} fieldName="card" />
        <InfoRow label="شماره حساب" value={BANK_DETAILS.accountNumber} fieldName="account" />
        <InfoRow label="شماره شبا (IBAN)" value={BANK_DETAILS.iban} fieldName="iban" />
      </div>
    </div>
  );
};

export default BankInfoBox;
