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
    } catch (error) {
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
    } catch (error) {
      toast.error('خطا در اتصال')
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-64"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaUser />
          پروفایل کاربری
        </h1>
        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors"
        >
          <FaEdit />
          {editing ? 'لغو' : 'ویرایش'}
        </button>
      </div>

      <div className="bg-white rounded-sm shadow-sm p-6">
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">شماره تلفن</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors"
              >
                ذخیره
              </button>
              <button
                onClick={() => {
                  setFormData(user)
                  setEditing(false)
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-sm hover:bg-gray-600 transition-colors"
              >
                لغو
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">نام:</span>
                <p className="font-medium">{user?.firstName} {user?.lastName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">ایمیل:</span>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">شماره تلفن:</span>
                <p className="font-medium">{user?.phone}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">تاریخ عضویت:</span>
                <p className="font-medium">{new Date(user?.createdAt).toLocaleDateString('fa-IR')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ProfileModule
