'use client';

import { useState } from 'react';
import { FaEye, FaEyeSlash, FaPhone, FaLock, FaUser } from 'react-icons/fa';

export default function AuthForm({ isLogin, onSubmit, loading }) {
  const [form, setForm] = useState({
    phone: '',
    password: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validate = () => {
    const err = {};

    if (!/^09\d{9}$/.test(form.phone)) {
      err.phone = 'شماره تلفن معتبر نیست';
    }

    if (form.password.length < 8) {
      err.password = 'رمز عبور حداقل ۸ کاراکتر';
    }

    if (!isLogin && !form.name.trim()) {
      err.name = 'نام را وارد کنید';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.(form);
  };

  const inputClass = (error) => `
    w-full h-11 pr-10 pl-4 text-sm
    border ${error ? 'border-red-500' : 'border-[hsl(var(--border))]'}
    rounded-[var(--radius)]
    bg-white text-[hsl(var(--foreground))]
    placeholder:text-gray-400
    focus:outline-none
    focus:border-[hsl(var(--primary))]
    transition
  `;

  return (
    <form onSubmit={submit} className="space-y-4 text-right">
      {!isLogin && (
        <div className="relative">
          <FaUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            name="name"
            placeholder="نام"
            value={form.name}
            onChange={update}
            disabled={loading}
            className={inputClass(errors.name)}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
      )}

      <div className="relative">
        <FaPhone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          name="phone"
          placeholder="شماره تلفن"
          value={form.phone}
          onChange={update}
          disabled={loading}
          className={inputClass(errors.phone)}
        />
        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
      </div>

      <div className="relative">
        <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="رمز عبور"
          value={form.password}
          onChange={update}
          disabled={loading}
          className={inputClass(errors.password) + ' pl-10'}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="
          w-full h-11
          bg-[hsl(var(--primary))]
          text-white text-sm font-medium
          rounded-[var(--radius)]
          hover:opacity-90
          transition
          disabled:opacity-50
        "
      >
        {loading ? 'در حال پردازش…' : isLogin ? 'ورود' : 'ثبت‌نام'}
      </button>
    </form>
  );
}
