"use client";

import React, { useState, useEffect } from 'react';
import { fetchOrder, submitPaymentReceipt } from '@/hooks/usePayment';
import OrderSummary from '@/components/payments/OrderSummary';
import BankInfoBox from '@/components/payments/BankInfoBox';
import ReceiptUploader from '@/components/payments/ReceiptUploader';
import EmailBox from '@/components/payments/EmailBox';
import RulesAgreement from '@/components/payments/RulesAgreement';
import SubmitPaymentButton from '@/components/payments/SubmitPaymentButton';
import InstallmentPage from '@/components/payments/InstallmentPage';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import {getProfile,editProfile} from '@/hooks/useProfile';

const PaymentPage = ({ trackingCode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [email, setEmail] = useState('');
  const [rulesChecked, setRulesChecked] = useState(false);
  
  useEffect(() => {
    const loadOrder = async (trackingCode) => {
      setLoading(true);
      if (!trackingCode) {
        router.push('/p-user/404');
        return;
      }
      try {
          const fetchedOrder = await fetchOrder(trackingCode);
          if (!fetchedOrder || fetchedOrder.paymentMethod === 'ONLINE') {
            router.push('/p-user/404');
            return;
          }
          setOrder(fetchedOrder);
          //getUser 
          const profile = await getProfile()
          setUser(profile)
          
        } catch (error) {
          console.log(error);
          
            console.error("Error fetching order:", error);
            router.push('/p-user/404');
            return;
        }
      setLoading(false);
    };
    loadOrder(trackingCode);
  }, [trackingCode]);

  const validateEmail = (email) => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    if (!receiptFile && order.paymentMethod === 'BANK_RECEIPT') {
      toast.error('لطفاً تصویر فیش واریزی را بارگذاری کنید.');
      return;
    }
    if (!rulesChecked) {
      toast.error('پذیرش قوانین الزامی است.');
      return;
    }
    if (email && !validateEmail(email)) {
      toast.error('فرمت ایمیل وارد شده صحیح نیست.');
      return;
    }

    setSubmitLoading(true);
    try {
      if (email) await editProfile(email);
      
      if (order.paymentMethod === 'BANK_RECEIPT') {
        const result = await submitPaymentReceipt({
          orderId: order._id,
          amount: order.totalPrice,
          receiptImageUrl: uploadedImageUrl,
        });
      
        if (!result.success) {
          toast.error(result.error);
          return;
        }
      
        toast.success("رسید شما با موفقیت ثبت شد");
      }

      await Swal.fire({
        title: 'پرداخت با موفقیت ثبت شد',
        text: 'اطلاعات شما در حال بررسی است و نتیجه تا ساعاتی دیگر اعلام خواهد شد.',
        icon: 'success',
        confirmButtonText: 'متوجه شدم',
        confirmButtonColor: '#aa4725',
      });
      
      router.push('/p-user/success');
    } catch (error) {
      toast.error('خطایی در ثبت اطلاعات رخ داد. مجدداً تلاش کنید.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">در حال دریافت اطلاعات سفارش...</p>
      </div>
    );
  }

  if (order.paymentMethod === 'INSTALLMENT') {
    return <InstallmentPage user={user} order={order} />;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col md:flex-row md:flex-row-reverse">
  {/* Left Section - Fixed Order Summary */}
  <div className="md:w-1/3 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
    <OrderSummary order={order} />
  </div>
  
  {/* Right Section - Other Components */}
  <div className="md:w-2/3 flex flex-col gap-6 md:px-6">
    <BankInfoBox />
    
    <ReceiptUploader onFileChange={setReceiptFile} />
    
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
      disabled={!receiptFile || !rulesChecked}
      onClick={handleSubmit}
    />
  </div>
</div>

  );
};

export default PaymentPage;
