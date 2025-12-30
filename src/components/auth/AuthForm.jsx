'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaPhone, FaLock, FaUser } from 'react-icons/fa';
import { showToast } from '@/lib/toast';

const AuthForm = ({ isLogin, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phone) {
      newErrors.phone = 'شماره تلفن الزامی است';
    } else if (!/^09\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'شماره تلفن معتبر نیست';
    }
    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (formData.password.length < 8) {
      newErrors.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'رمز عبور باید شامل حروف بزرگ، کوچک، عدد و کاراکتر ویژه باشد';
    }
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'نام الزامی است';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    await onSubmit(formData);
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {!isLogin && (
        <motion.div
          className="relative"
          variants={fieldVariants}
        >
          <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="name"
            placeholder="نام"
            value={formData.name}
            onChange={handleChange}
            className={`w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white text-right ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 text-right">{errors.name}</p>
          )}
        </motion.div>
      )}
      <motion.div
        className="relative"
        variants={fieldVariants}
      >
        <FaPhone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="tel"
          name="phone"
          placeholder="شماره تلفن"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white text-right ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1 text-right">{errors.phone}</p>
        )}
      </motion.div>
      <motion.div
        className="relative"
        variants={fieldVariants}
      >
        <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="رمز عبور"
          value={formData.password}
          onChange={handleChange}
          className={`w-full pr-10 pl-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white text-right ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1 text-right">{errors.password}</p>
        )}
      </motion.div>
      <motion.button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        variants={fieldVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? 'در حال پردازش...' : isLogin ? 'ورود' : 'ثبت‌نام'}
      </motion.button>
    </motion.form>
  );
};

export default AuthForm;
