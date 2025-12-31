'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
import GoogleButton from '@/components/auth/GoogleButton';
import { useForgotPassword } from '@/components/auth/useForgotPassword';
import { showToast } from '@/lib/toast';

export default function LoginRegisterPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { forgotPassword } = useForgotPassword();

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(
        mode === 'login' ? '/api/auth/login' : '/api/auth/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        showToast.error(result.message || 'خطا در عملیات');
        return;
      }

      showToast.success(mode === 'login' ? 'ورود موفق' : 'ثبت‌نام موفق');

      if (mode === 'login') {
        router.push('/');
      } else {
        setMode('login');
      }
    } catch {
      showToast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] px-4">
      <div className="w-full max-w-md bg-white border border-[hsl(var(--border))] rounded-md p-6">
        {/* Tabs */}
        <div className="flex justify-center gap-8 mb-5 text-sm font-medium">
          {['login', 'register'].map((item) => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className={`pb-1 transition
                ${
                  mode === item
                    ? 'text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))]'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {item === 'login' ? 'ورود' : 'ثبت‌نام'}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? -40 : 40 }}
              transition={{ duration: 0.2 }}
            >
              <AuthForm
                isLogin={mode === 'login'}
                onSubmit={handleSubmit}
                loading={loading}
              />

              {mode === 'login' && (
                <button
                  onClick={forgotPassword}
                  className="mt-3 text-xs text-[hsl(var(--primary))] hover:opacity-80"
                >
                  فراموشی رمز عبور؟
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <span className="flex-1 h-px bg-[hsl(var(--border))]" />
          <span className="text-xs text-gray-400">یا</span>
          <span className="flex-1 h-px bg-[hsl(var(--border))]" />
        </div>

        {/* Google */}
        <GoogleButton onClick={handleGoogleLogin} disabled={loading} />
      </div>
    </div>
  );
}
