'use client'

import { motion } from 'framer-motion'
import { FaShoppingBag, FaEye, FaTruck } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const OrdersModule = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders)
      } else {
        toast.error('خطا در بارگذاری سفارش‌ها')
      }
    } catch (error) {
      toast.error('خطا در اتصال')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600'
      case 'processing': return 'text-blue-600'
      case 'shipped': return 'text-purple-600'
      case 'delivered': return 'text-green-600'
      case 'cancelled': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'در انتظار'
      case 'processing': return 'در حال پردازش'
      case 'shipped': return 'ارسال شده'
      case 'delivered': return 'تحویل داده شده'
      case 'cancelled': return 'لغو شده'
      default: return status
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
        <FaShoppingBag />
        سفارش‌های من
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-sm shadow-sm p-8 text-center">
          <FaShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">هیچ سفارشی ندارید</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-sm shadow-sm p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FaShoppingBag className="text-primary" />
                  <div>
                    <p className="font-medium">سفارش #{order._id.slice(-8)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className={`font-bold ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.totalAmount?.toLocaleString('fa-IR')} تومان
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items?.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <img
                        src={item.product?.images?.[0] || '/placeholder.jpg'}
                        alt={item.product?.name}
                        className="w-12 h-12 object-cover rounded-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product?.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} عدد × {item.price?.toLocaleString('fa-IR')} تومان
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      +{order.items.length - 3} محصول دیگر
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-sm hover:bg-gray-200 transition-colors">
                      <FaEye className="inline ml-1" />
                      جزئیات
                    </button>
                    {order.status === 'shipped' && (
                      <button className="px-3 py-1 text-sm bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors">
                        <FaTruck className="inline ml-1" />
                        پیگیری ارسال
                      </button>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-500">مجموع</p>
                    <p className="font-bold text-primary">
                      {order.totalAmount?.toLocaleString('fa-IR')} تومان
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default OrdersModule
