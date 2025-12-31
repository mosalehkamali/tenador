'use client'

import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

const AddressesModule = () => {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    province: '',
    city: '',
    address: '',
    postalCode: '',
    phone: '',
    isDefault: false
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/addresses')
      if (res.ok) {
        const data = await res.json()
        setAddresses(data.addresses)
      } else {
        toast.error('خطا در بارگذاری آدرس‌ها')
      }
    } catch (error) {
      toast.error('خطا در اتصال')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingAddress ? `/api/addresses/${editingAddress._id}` : '/api/addresses'
      const method = editingAddress ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchAddresses()
        setShowForm(false)
        setEditingAddress(null)
        resetForm()
        toast.success(editingAddress ? 'آدرس بروزرسانی شد' : 'آدرس اضافه شد')
      } else {
        toast.error('خطا در ذخیره آدرس')
      }
    } catch (error) {
      toast.error('خطا در اتصال')
    }
  }

  const handleEdit = (address) => {
    setEditingAddress(address)
    setFormData({
      title: address.title,
      province: address.province,
      city: address.city,
      address: address.address,
      postalCode: address.postalCode,
      phone: address.phone,
      isDefault: address.isDefault
    })
    setShowForm(true)
  }

  const handleDelete = async (addressId) => {
    const result = await Swal.fire({
      title: 'حذف آدرس',
      text: 'آیا مطمئن هستید؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'بله، حذف کن',
      cancelButtonText: 'لغو'
    })

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/addresses/${addressId}`, { method: 'DELETE' })
        if (res.ok) {
          setAddresses(addresses.filter(addr => addr._id !== addressId))
          toast.success('آدرس حذف شد')
        } else {
          toast.error('خطا در حذف آدرس')
        }
      } catch (error) {
        toast.error('خطا در اتصال')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      province: '',
      city: '',
      address: '',
      postalCode: '',
      phone: '',
      isDefault: false
    })
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
          <FaMapMarkerAlt />
          آدرس‌های من
        </h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingAddress(null)
            resetForm()
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors"
        >
          <FaPlus />
          افزودن آدرس
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-sm shadow-sm p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان آدرس</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">استان</label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">شهر</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">کد پستی</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">آدرس کامل</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">شماره تلفن</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              />
              <label htmlFor="isDefault" className="text-sm">آدرس پیش‌فرض</label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors"
              >
                {editingAddress ? 'بروزرسانی' : 'ذخیره'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingAddress(null)
                  resetForm()
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-sm hover:bg-gray-600 transition-colors"
              >
                لغو
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {addresses.length === 0 ? (
        <div className="bg-white rounded-sm shadow-sm p-8 text-center">
          <FaMapMarkerAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">هیچ آدرسی ثبت نشده است</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <motion.div
              key={address._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-sm shadow-sm p-4 relative"
            >
              {address.isDefault && (
                <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-sm">
                  پیش‌فرض
                </span>
              )}
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-gray-900">{address.title}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-1 text-blue-500 hover:bg-blue-50 rounded-sm transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-sm transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{address.province}، {address.city}</p>
                <p>{address.address}</p>
                <p>کد پستی: {address.postalCode}</p>
                <p>تلفن: {address.phone}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default AddressesModule
