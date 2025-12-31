'use client'

import { motion } from 'framer-motion'
import {
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaTrash,
  FaCreditCard,
} from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

const CartModule = () => {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart')
      if (res.ok) {
        const data = await res.json()
        setCart(data.cart?.items || [])
      } else {
        toast.error('خطا در بارگذاری سبد خرید')
      }
    } catch {
      toast.error('خطا در اتصال')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      })
      if (res.ok) fetchCart()
      else toast.error('خطا در بروزرسانی')
    } catch {
      toast.error('خطا در اتصال')
    }
  }

  const removeFromCart = async (productId) => {
    const result = await Swal.fire({
      title: 'حذف از سبد خرید',
      text: 'آیا مطمئن هستید؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'حذف',
      cancelButtonText: 'لغو',
    })

    if (result.isConfirmed) {
      try {
        const res = await fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        })
        if (res.ok) {
          fetchCart()
          toast.success('حذف شد')
        } else toast.error('خطا در حذف')
      } catch {
        toast.error('خطا در اتصال')
      }
    }
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

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
        <FaShoppingCart className="text-sm opacity-70" />
        سبد خرید
      </h1>

      {cart.length === 0 ? (
        <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-white p-8 text-center">
          <FaShoppingCart className="mx-auto mb-3 text-3xl opacity-30" />
          <p className="text-sm text-[hsl(var(--foreground)/0.6)]">
            سبد خرید شما خالی است
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Items */}
          {cart.map((item) => (
            <motion.div
              key={item.product._id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="
                flex items-center gap-4
                rounded-[var(--radius)]
                border border-[hsl(var(--border))]
                bg-white p-4
              "
            >
              <img
                src={item.product.images?.[0] || '/placeholder.jpg'}
                alt={item.product.name}
                className="h-16 w-16 rounded-[var(--radius)] object-cover"
              />

              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  {item.product.name}
                </p>
                <p className="text-xs text-[hsl(var(--foreground)/0.6)]">
                  {item.price.toLocaleString('fa-IR')} تومان
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    updateQuantity(item.product._id, item.quantity - 1)
                  }
                  className="rounded-[var(--radius)] border px-2 py-1 text-xs hover:bg-[hsl(var(--border)/0.5)]"
                >
                  <FaMinus />
                </button>

                <span className="min-w-[32px] text-center text-sm">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateQuantity(item.product._id, item.quantity + 1)
                  }
                  className="rounded-[var(--radius)] border px-2 py-1 text-xs hover:bg-[hsl(var(--border)/0.5)]"
                >
                  <FaPlus />
                </button>
              </div>

              {/* Price & remove */}
              <div className="text-left">
                <p className="text-sm font-semibold text-[hsl(var(--primary))]">
                  {(item.price * item.quantity).toLocaleString('fa-IR')}
                </p>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="mt-1 flex items-center gap-1 text-xs text-red-600 hover:underline"
                >
                  <FaTrash />
                  حذف
                </button>
              </div>
            </motion.div>
          ))}

          {/* Summary */}
          <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-white p-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span>مجموع</span>
              <span className="font-semibold text-[hsl(var(--primary))]">
                {totalAmount.toLocaleString('fa-IR')} تومان
              </span>
            </div>

            <button
              className="
                flex w-full items-center justify-center gap-2
                rounded-[var(--radius)]
                bg-[hsl(var(--primary))]
                py-2.5 text-sm text-white
                hover:bg-[hsl(var(--primary)/0.9)]
              "
            >
              <FaCreditCard className="text-xs" />
              تسویه حساب
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default CartModule
