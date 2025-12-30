import { useState } from 'react';
import { showToast } from '@/lib/toast';
import Swal from 'sweetalert2';

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const forgotPassword = async () => {
    const { value: phone } = await Swal.fire({
      title: 'بازیابی رمز عبور',
      input: 'tel',
      inputLabel: 'شماره تلفن خود را وارد کنید',
      inputPlaceholder: '09123456789',
      showCancelButton: true,
      confirmButtonText: 'ارسال کد',
      cancelButtonText: 'لغو',
      inputValidator: (value) => {
        if (!value) {
          return 'شماره تلفن الزامی است';
        }
        if (!/^09\d{9}$/.test(value)) {
          return 'شماره تلفن معتبر نیست';
        }
      },
    });

    if (!phone) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast.success('کد بازیابی ارسال شد');
        await verifyOtpAndReset(phone);
      } else {
        showToast.error(data.message || 'خطا در ارسال کد');
      }
    } catch (error) {
      showToast.error('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndReset = async (phone) => {
    const { value: otp } = await Swal.fire({
      title: 'تأیید کد',
      input: 'text',
      inputLabel: 'کد ۶ رقمی ارسال شده را وارد کنید',
      inputPlaceholder: '123456',
      showCancelButton: true,
      confirmButtonText: 'تأیید',
      cancelButtonText: 'لغو',
      inputValidator: (value) => {
        if (!value) {
          return 'کد الزامی است';
        }
        if (!/^\d{6}$/.test(value)) {
          return 'کد باید ۶ رقم باشد';
        }
      },
    });

    if (!otp) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast.success('کد تأیید شد');
        await resetPassword(phone);
      } else {
        showToast.error(data.message || 'کد نامعتبر');
      }
    } catch (error) {
      showToast.error('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (phone) => {
    const { value: newPassword } = await showSwal.fire({
      title: 'رمز عبور جدید',
      input: 'password',
      inputLabel: 'رمز عبور جدید را وارد کنید',
      inputPlaceholder: 'رمز عبور',
      showCancelButton: true,
      confirmButtonText: 'تغییر رمز',
      cancelButtonText: 'لغو',
      inputValidator: (value) => {
        if (!value) {
          return 'رمز عبور الزامی است';
        }
        if (value.length < 8) {
          return 'رمز عبور باید حداقل ۸ کاراکتر باشد';
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value)) {
          return 'رمز عبور باید شامل حروف بزرگ، کوچک، عدد و کاراکتر ویژه باشد';
        }
      },
    });

    if (!newPassword) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast.success('رمز عبور تغییر یافت');
      } else {
        showToast.error(data.message || 'خطا در تغییر رمز');
      }
    } catch (error) {
      showToast.error('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword, loading };
};
