'use client'

import { motion } from 'framer-motion'
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

const WishlistModule = () => {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist')
      if (res.ok) {
        const data = await res.json()
        setWishlist(data.wishlist)
      } else {
        toast.error('خطا در بارگذاری لیست علاقه‌مندی‌ها')
      }
    } catch (error) {
      toast.error('خطا در اتصال')
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId) => {
    const result = await Swal.fire({
      title: 'حذف از لیست علاقه‌مندی‌ها',
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
        const res = await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        })
        if (res.ok) {
          setWishlist(wishlist.filter(item => item._id !== productId))
          toast.success('از لیست علاقه‌مندی‌ها حذف شد')
        } else {
          toast.error('خطا در حذف')
        }
      } catch (error) {
        toast.error('خطا در اتصال')
      }
    }
  }

  const addToCart = async (product) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      })
      if (res.ok) {
        toast.success('به سبد خرید اضافه شد')
      } else {
        toast.error('خطا در اضافه کردن به سبد')
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
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <FaHeart />
        لیست علاقه‌مندی‌ها
      </h1>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-sm shadow-sm p-8 text-center">
          <FaHeart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">لیست علاقه‌مندی‌های شما خالی است</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-sm shadow-sm overflow-hidden"
            >
              <img
                src={item.images?.[0] || '/placeholder.jpg'}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                <p className="text-primary font-bold mb-4">
                  {item.price?.toLocaleString('fa-IR')} تومان
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors text-sm"
                  >
                    <FaShoppingCart />
                    خرید
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-sm transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default WishlistModule
