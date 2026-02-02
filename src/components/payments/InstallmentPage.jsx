"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

// Components
import OrderSummary from './OrderSummary.jsx';
import InstallmentCalculator from './InstallmentCalculator.jsx';
import DownPaymentSection from './DownPaymentSection.jsx';
import InstallmentResult from './InstallmentResult.jsx';
import CheckUploadSection from './CheckUploadSection.jsx';
import EmailBox from './EmailBox.jsx';
import RulesAgreement from './RulesAgreement.jsx';
import { editProfile } from '@/hooks/useProfile';
import SubmitPaymentButton from './SubmitPaymentButton.jsx';

const InstallmentPage = ({ order, user }) => {
  const [downPayment, setDownPayment] = useState(0);
  const [installmentCount, setInstallmentCount] = useState(1);
  const [checks, setChecks] = useState([]);
  const [email, setEmail] = useState('');
  const [rulesChecked, setRulesChecked] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  // Dynamic Calculations
  const calculations = useMemo(() => {
    const remaining = Math.max(0, order.totalPrice - downPayment);
    const monthlyInterestRate = 0.04;
    const totalInterest = remaining * monthlyInterestRate * installmentCount;
    const totalWithInterest = remaining + totalInterest;
    const monthlyInstallment = totalWithInterest / installmentCount;

    return {
      remaining,
      totalInterest,
      totalWithInterest,
      monthlyInstallment
    };
  }, [order.totalPrice, downPayment, installmentCount]);

  // Sync check fields with installment count
  useEffect(() => {
    const defaultCheckAmount = Math.floor(calculations.monthlyInstallment);
  
    setChecks(prevChecks => {
      return Array.from({ length: installmentCount }, (_, i) => {
        const existing = prevChecks[i];
  
        // ساخت تاریخ شمسی + ذخیره استاندارد YYYY-MM-DD
        const installmentDate = new DateObject({
          calendar: persian,
          locale: persian_fa
        }).add(i + 1, "month");
  
        return {
          id: existing?.id || Date.now() + i,
          image: existing?.image || null,
          number: existing?.number || '',
          amount: defaultCheckAmount*10, // همیشه sync شود
          date: existing?.date || installmentDate // اگر قبلا داشت نگه دار
        };
      });
    });
  
  }, [installmentCount, calculations.monthlyInstallment]);
  
  

  const handleUpdateCheck = (index, field, value) => {
    
    const updated = [...checks];
    updated[index] = { ...updated[index], [field]: value };
    setChecks(updated);
  };

  const handleRemoveCheck = (index) => {
    if (installmentCount > 1) {
      setInstallmentCount(prev => prev - 1);
    } else {
      toast.error('حداقل یک قسط الزامی است');
    }
  };

  const validateEmail = (email) => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleFinalSubmit = async () => {
    // Validation logic
    if (downPayment > order.totalPrice) {
      return toast.error('مبلغ پیش‌پرداخت نمی‌تواند بیشتر از کل مبلغ سفارش باشد');
    }

    const isAllFilled = checks.every(c => c.image && c.number && c.amount && c.date);
    if (!isAllFilled) {
      return toast.error('لطفا تمامی فیلدهای مربوط به چک‌ها را تکمیل کنید');
    }

    const totalCheckAmount = checks.reduce((acc, curr) => acc + Number(curr.amount), 0);
    // Tolerance for rounding
    if (Math.abs(totalCheckAmount - calculations.totalWithInterest) > 100) {
      return toast.error(`مجموع مبالغ چک‌ها باید برابر با ${calculations.totalWithInterest.toLocaleString()} ریال باشد`);
    }
    if (!rulesChecked) {
      toast.error('پذیرش قوانین الزامی است.');
      return;
    }
    if (email && !validateEmail(email)) {
      toast.error('فرمت ایمیل وارد شده صحیح نیست.');
      return;
    }

    const result = await Swal.fire({
      title: 'آیا از تایید نهایی اطمینان دارید؟',
      text: 'پس از تایید، طرح اقساطی شما ثبت و برای بازبینی ارسال خواهد شد.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'بله، تایید می‌کنم',
      cancelButtonText: 'انصراف',
      confirmButtonColor: 'var(--color-primary)',
    });

    if (result.isConfirmed) {
      setSubmitLoading(true)
      try {
        if (email) await editProfile(email);



        toast.success('طرح اقساطی شما با موفقیت ثبت شد!');
        router.push('/p-user/success');
      } catch (error) {
        toast.error('خطایی در ثبت اطلاعات رخ داد. مجدداً تلاش کنید.');
      } finally {
        setSubmitLoading(false);
      }
      // Simulate API Call
      console.log('Submitting Plan:', { orderId: order.id, downPayment, installmentCount, checks });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto">
        <header className="mb-8 text-center lg:text-right">
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">مدیریت پرداخت اقساطی</h1>
          <p className="text-gray-500">مراحل تنظیم و تایید چک‌های بانکی</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Order Summary */}
          <aside className="lg:col-span-4 h-fit lg:sticky lg:top-8 order-1 lg:order-2">
            <OrderSummary order={order} downPayment={downPayment} />
          </aside>

          {/* Right Column: Configuration */}
          <main className="lg:col-span-8 space-y-6 order-2 lg:order-1">
            <div className="bg-[var(--color-background)] rounded-[var(--radius)] shadow-sm border border-gray-100 p-6 space-y-8">
              <section>
                <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-100">تنظیمات اقساط</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DownPaymentSection
                    value={downPayment}
                    onChange={setDownPayment}
                    max={order.totalPrice}
                  />
                  <InstallmentCalculator
                    count={installmentCount}
                    setCount={setInstallmentCount}
                  />
                </div>
              </section>

              <InstallmentResult calculations={calculations} />

              <CheckUploadSection
                checks={checks}
                onUpdate={handleUpdateCheck}
                onRemove={handleRemoveCheck}
                remainingBalance={calculations.totalWithInterest}
              />

              <EmailBox
                show={!user.email}
                email={email}
                setEmail={setEmail}
              />

              <RulesAgreement
                checked={rulesChecked}
                onChange={setRulesChecked}
              />
              <SubmitPaymentButton
                loading={submitLoading}
                disabled={!checks.length || !rulesChecked}
                onClick={handleFinalSubmit}
              />
            </div>
          </main>
        </div>
      </div>
      <ToastContainer position="bottom-left" rtl />
    </div>
  );
};

export default InstallmentPage