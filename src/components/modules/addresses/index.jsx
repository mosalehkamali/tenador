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
      } else toast.error('خطا در بارگذاری آدرس‌ها')
    } catch {
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
      } else toast.error('خطا در ذخیره آدرس')
    } catch {
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
      confirmButtonText: 'حذف',
      cancelButtonText: 'لغو'
    })

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/addresses/${addressId}`, { method: 'DELETE' })
        if (res.ok) {
          setAddresses(addresses.filter(a => a._id !== addressId))
          toast.success('آدرس حذف شد')
        } else toast.error('خطا در حذف')
      } catch {
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
      <div className="flex h-56 items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-lg font-semibold">
          <FaMapMarkerAlt className="text-sm opacity-70" />
          آدرس‌های من
        </h1>

        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingAddress(null)
            resetForm()
          }}
          className="
            flex items-center gap-2
            rounded-[var(--radius)]
            bg-[hsl(var(--primary))]
            px-3 py-2
            text-sm text-white
            hover:opacity-90
          "
        >
          <FaPlus className="text-xs" />
          آدرس جدید
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            rounded-[var(--radius)]
            border border-[hsl(var(--border))]
            bg-white
            p-4
          "
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                ['title', 'عنوان آدرس'],
                ['province', 'استان'],
                ['city', 'شهر'],
                ['postalCode', 'کد پستی'],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="mb-1 block text-xs opacity-70">{label}</label>
                  <input
                    value={formData[key]}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                    className="
                      w-full rounded-[var(--radius)]
                      border border-[hsl(var(--border))]
                      px-3 py-2
                      focus:outline-none
                      focus:ring-1 focus:ring-[hsl(var(--primary))]
                    "
                    required
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="mb-1 block text-xs opacity-70">آدرس کامل</label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="
                  w-full rounded-[var(--radius)]
                  border border-[hsl(var(--border))]
                  px-3 py-2
                  focus:outline-none
                  focus:ring-1 focus:ring-[hsl(var(--primary))]
                "
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs opacity-70">شماره تلفن</label>
              <input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="
                  w-full rounded-[var(--radius)]
                  border border-[hsl(var(--border))]
                  px-3 py-2
                "
                required
              />
            </div>

            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
              />
              آدرس پیش‌فرض
            </label>

            <div className="flex gap-2 pt-2">
              <button className="rounded-[var(--radius)] bg-[hsl(var(--primary))] px-4 py-2 text-white text-sm">
                {editingAddress ? 'بروزرسانی' : 'ذخیره'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="rounded-[var(--radius)] border px-4 py-2 text-sm"
              >
                لغو
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* List */}
      {addresses.length === 0 ? (
        <div className="rounded-[var(--radius)] border bg-white p-8 text-center text-sm opacity-60">
          <FaMapMarkerAlt className="mx-auto mb-3 text-3xl opacity-30" />
          آدرسی ثبت نشده
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <motion.div
              key={address._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                relative rounded-[var(--radius)]
                border border-[hsl(var(--border))]
                bg-white p-4
              "
            >
              {address.isDefault && (
                <span className="absolute top-2 right-2 rounded bg-[hsl(var(--primary))] px-2 py-0.5 text-xs text-white">
                  پیش‌فرض
                </span>
              )}

              <div className="flex items-start justify-between">
                <p className="font-medium">{address.title}</p>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(address)} className="p-1 opacity-60 hover:opacity-100">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(address._id)} className="p-1 text-red-500 opacity-60 hover:opacity-100">
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="mt-2 space-y-1 text-xs opacity-70">
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
