'use client'

import { motion } from 'framer-motion'
import { FaUser, FaEdit } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const ProfileModule = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        setFormData(data.user)
      } else {
        toast.error('خطا در بارگذاری پروفایل')
      }
    } catch {
      toast.error('خطا در اتصال')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    try {
      const res = await fetch('/api/auth/edit-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setUser(formData)
        setEditing(false)
        toast.success('پروفایل بروزرسانی شد')
      } else {
        toast.error('خطا در بروزرسانی')
      }
    } catch {
      toast.error('خطا در اتصال')
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-48"
      >
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[hsl(var(--border))] border-t-[hsl(var(--primary))]" />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4 text-right"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-[hsl(var(--foreground))]">
          <FaUser className="text-[hsl(var(--primary))]" />
          پروفایل کاربری
        </h1>

        <button
          onClick={() => setEditing(!editing)}
          className="
            inline-flex items-center gap-2
            px-3 py-1.5 text-sm font-medium
            text-white
            bg-[hsl(var(--primary))]
            hover:bg-[hsl(var(--primary)/0.9)]
            rounded-[var(--radius)]
            transition-colors
          "
        >
          <FaEdit className="text-xs" />
          {editing ? 'لغو' : 'ویرایش'}
        </button>
      </div>

      {/* Card */}
      <div
        className="
          bg-[hsl(var(--background))]
          border border-[hsl(var(--border))]
          rounded-[var(--radius)]
          p-4
        "
      >
        {editing ? (
          <div className="space-y-3">
            {[
              { label: 'نام', key: 'name', type: 'text' },
              { label: 'ایمیل', key: 'email', type: 'email' },
              { label: 'شماره تلفن', key: 'phone', type: 'tel' },
            ].map((field) => (
              <div key={field.key}>
                <label className="mb-1 block text-xs text-[hsl(var(--foreground)/0.7)]">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={formData[field.key] || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  className="
                    w-full px-3 py-2 text-sm
                    border border-[hsl(var(--border))]
                    rounded-[var(--radius)]
                    bg-white
                    focus:outline-none
                    focus:ring-1 focus:ring-[hsl(var(--primary))]
                  "
                />
              </div>
            ))}

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleUpdate}
                className="
                  px-4 py-2 text-sm font-medium
                  text-white
                  bg-[hsl(var(--primary))]
                  hover:bg-[hsl(var(--primary)/0.9)]
                  rounded-[var(--radius)]
                "
              >
                ذخیره
              </button>

              <button
                onClick={() => {
                  setFormData(user)
                  setEditing(false)
                }}
                className="
                  px-4 py-2 text-sm font-medium
                  text-[hsl(var(--foreground))]
                  bg-[hsl(var(--border))]
                  hover:bg-[hsl(var(--border)/0.8)]
                  rounded-[var(--radius)]
                "
              >
                لغو
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
            <div>
              <span className="text-[hsl(var(--foreground)/0.6)]">نام</span>
              <p className="font-medium">{user?.name}</p>
            </div>

            <div>
              <span className="text-[hsl(var(--foreground)/0.6)]">ایمیل</span>
              <p className="font-medium">{user?.email}</p>
            </div>

            <div>
              <span className="text-[hsl(var(--foreground)/0.6)]">شماره تلفن</span>
              <p className="font-medium">{user?.phone}</p>
            </div>

            <div>
              <span className="text-[hsl(var(--foreground)/0.6)]">تاریخ عضویت</span>
              <p className="font-medium">
                {new Date(user?.createdAt).toLocaleDateString('fa-IR')}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ProfileModule
