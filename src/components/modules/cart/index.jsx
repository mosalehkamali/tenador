'use client'

import { motion } from 'framer-motion'
import { FaShoppingCart, FaPlus, FaMinus, FaTrash, FaCreditCard } from 'react-icons/fa'
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
    } catch (error) {
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
      if (res.ok) {
        fetchCart()
      } else {
        toast.error('خطا در بروزرسانی')
      }
    } catch (error) {
      toast.error('خطا در اتصال')
    }
  }

  const removeFromCart = async (productId) => {
    const result = await Swal.fire({
      title: 'حذف از سبد خرید',
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
        const res = await fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        })
        if (res.ok) {
          fetchCart()
          toast.success('از سبد خرید حذف شد')
        } else {
          toast.error('خطا در حذف')
        }
      } catch (error) {
        toast.error('خطا در اتصال')
      }
    }
  }

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

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
        <FaShoppingCart />
        سبد خرید
      </h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-sm shadow-sm p-8 text-center">
          <FaShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">سبد خرید شما خالی است</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-4">
            {cart.map((item) => (
              <motion.div
                key={item.product._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-sm shadow-sm p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.images?.[0] || '/placeholder.jpg'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-sm"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.price?.toLocaleString('fa-IR')} تومان
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="p-1 bg-gray-100 rounded-sm hover:bg-gray-200 transition-colors"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="px-3 py-1 bg-gray-50 rounded-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="p-1 bg-gray-100 rounded-sm hover:bg-gray-200 transition-colors"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-primary">
                      {(item.price * item.quantity)?.toLocaleString('fa-IR')} تومان
                    </p>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-red-500 hover:text-red-700 text-sm mt-1"
                    >
                      <FaTrash className="inline ml-1" />
                      حذف
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-white rounded-sm shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium">مجموع:</span>
              <span className="text-xl font-bold text-primary">
                {totalAmount?.toLocaleString('fa-IR')} تومان
              </span>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors">
              <FaCreditCard />
              تسویه حساب
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default CartModule
