
import React from 'react';
import { MdOutlineDateRange, MdAccountBalanceWallet, MdOutlineVerifiedUser, MdInfoOutline } from 'react-icons/md';
import OrderSummary from './OrderSummary';

const InstallmentPage = ({ order }) => {
  const formatPrice = (price) => new Intl.NumberFormat('fa-IR').format(price) + ' تومان';

  return (
    <div className="space-y-6">
      <OrderSummary order={order} />
      
        <div className="bg-white rounded-[6px] border border-gray-200 p-6 custom-shadow">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
            <MdAccountBalanceWallet className="text-[var(--color-primary)] text-2xl" />
          <h2 className="text-lg font-bold">جزئیات طرح اقساطی</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-[6px] border border-gray-100 text-center">
            <MdOutlineVerifiedUser className="text-2xl text-green-600 mb-2" />
            <span className="text-xs text-gray-500 mb-1">پیش‌پرداخت</span>
            <span className="font-bold text-gray-800">{formatPrice(order.installmentPlan?.prepayment || 0)}</span>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-[6px] border border-gray-100 text-center">
            <MdOutlineDateRange className="text-2xl text-blue-600 mb-2" />
            <span className="text-xs text-gray-500 mb-1">تعداد اقساط</span>
            <span className="font-bold text-gray-800">{order.installmentPlan?.totalInstallments} ماهه</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-[6px] border border-gray-100 text-center">
            <MdAccountBalanceWallet className="text-2xl text-[var(--color-primary)] text-2xl mb-2" />
            <span className="text-xs text-gray-500 mb-1">مبلغ هر قسط</span>
            <span className="font-bold text-gray-800 text-[var(--color-primary)]">{formatPrice(order.installmentPlan?.monthlyAmount || 0)}</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-[6px] flex gap-3 text-sm text-blue-700 leading-relaxed">
          <MdInfoOutline className="text-2xl shrink-0" />
          <p>
            سفارش شما در حالت «انتظار برای پیش‌پرداخت» قرار دارد. پس از پرداخت قسط اول (پیش‌پرداخت)، برنامه اقساطی شما فعال شده و سفارش وارد مرحله پردازش می‌شود.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstallmentPage;
