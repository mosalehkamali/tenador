'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AuthForm from '@/components/auth/AuthForm';
import GoogleButton from '@/components/auth/GoogleButton';
import { useForgotPassword } from '@/components/auth/useForgotPassword';
import { showToast } from '@/lib/toast';

const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { forgotPassword, loading: forgotLoading } = useForgotPassword();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode === 'register') {
      setIsLogin(false);
    }
  }, []);

  const handleAuth = async (formData) => {
    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showToast.success(isLogin ? 'ورود موفق' : 'ثبت‌نام موفق');
        if (isLogin) {
          router.push('/');
        } else {
          setIsLogin(true);
        }
      } else {
        showToast.error(data.message || 'خطا در عملیات');
      }
    } catch (error) {
      showToast.error('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300 hover:shadow-3xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">خوش آمدید</h1>
          <p className="text-gray-600">برای ادامه لطفاً وارد حساب کاربری خود شوید</p>
        </motion.div>

        <motion.div
          className="flex mb-6 bg-gray-100 rounded-lg p-1"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
              isLogin
                ? 'bg-white text-primary shadow-md transform scale-105'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            whileHover={{ scale: isLogin ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ورود
          </motion.button>
          <motion.button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
              !isLogin
                ? 'bg-white text-primary shadow-md transform scale-105'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            whileHover={{ scale: !isLogin ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ثبت‌نام
          </motion.button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AuthForm isLogin={isLogin} onSubmit={handleAuth} loading={loading} />
        </motion.div>

        {isLogin && (
          <motion.div
            className="text-center mt-4"
            variants={itemVariants}
          >
            <button
              onClick={forgotPassword}
              disabled={forgotLoading}
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors disabled:opacity-50"
            >
              فراموشی رمز عبور؟
            </button>
          </motion.div>
        )}

        <motion.div
          className="mt-6"
          variants={itemVariants}
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">یا</span>
            </div>
          </div>

          <div className="mt-4">
            <GoogleButton onClick={handleGoogleLogin} loading={loading} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginRegisterPage;
