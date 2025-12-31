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
    } catch {
      toast.error('خطا در اتصال')
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId) => {
    const result = await Swal.fire({
      title: 'حذف از علاقه‌مندی‌ها',
      text: 'مطمئن هستید؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'حذف',
      cancelButtonText: 'لغو',
    })

    if (result.isConfirmed) {
      try {
        const res = await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        })
        if (res.ok) {
          setWishlist(wishlist.filter((item) => item._id !== productId))
          toast.success('حذف شد')
        } else toast.error('خطا در حذف')
      } catch {
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
      if (res.ok) toast.success('به سبد خرید اضافه شد')
      else toast.error('خطا در افزودن')
    } catch {
      toast.error('خطا در اتصال')
    }
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
      <h1 className="flex items-center gap-2 text-lg font-semibold">
        <FaHeart className="text-sm opacity-70" />
        لیست علاقه‌مندی‌ها
      </h1>

      {wishlist.length === 0 ? (
        <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-white p-8 text-center">
          <FaHeart className="mx-auto mb-3 text-3xl opacity-30" />
          <p className="text-sm text-[hsl(var(--foreground)/0.6)]">
            لیست علاقه‌مندی‌های شما خالی است
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="
                overflow-hidden
                rounded-[var(--radius)]
                border border-[hsl(var(--border))]
                bg-white
              "
            >
              <div className="relative">
                <img
                  src={item.images?.[0] || '/placeholder.jpg'}
                  alt={item.name}
                  className="h-44 w-full object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="
                    absolute top-2 right-2
                    rounded-[var(--radius)]
                    bg-white/90 p-2
                    text-red-600
                    hover:bg-white
                  "
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <p className="text-sm font-medium line-clamp-1">
                    {item.name}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[hsl(var(--primary))]">
                    {item.price?.toLocaleString('fa-IR')} تومان
                  </p>
                </div>

                <button
                  onClick={() => addToCart(item)}
                  className="
                    flex w-full items-center justify-center gap-2
                    rounded-[var(--radius)]
                    bg-[hsl(var(--primary))]
                    py-2 text-sm text-white
                    hover:bg-[hsl(var(--primary)/0.9)]
                  "
                >
                  <FaShoppingCart className="text-xs" />
                  افزودن به سبد خرید
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default WishlistModule
