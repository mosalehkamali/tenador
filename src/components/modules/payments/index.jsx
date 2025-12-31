'use client'

import { motion } from 'framer-motion'
import { FaCreditCard, FaEye } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const PaymentsModule = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/payments')
      if (res.ok) {
        const data = await res.json()
        setPayments(data.payments)
      } else {
        toast.error('خطا در بارگذاری پرداخت‌ها')
      }
    } catch (error) {
      toast.error('خطا در اتصال')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'failed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'تکمیل شده'
      case 'pending': return 'در انتظار'
      case 'failed': return 'ناموفق'
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
        <FaCreditCard />
        پرداخت‌های من
      </h1>

      {payments.length === 0 ? (
        <div className="bg-white rounded-sm shadow-sm p-8 text-center">
          <FaCreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">هیچ پرداختی ندارید</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <motion.div
              key={payment._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-sm shadow-sm p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <FaCreditCard className="text-primary" />
                  <div>
                    <p className="font-medium">پرداخت #{payment._id.slice(-8)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className={`font-bold ${getStatusColor(payment.status)}`}>
                    {getStatusText(payment.status)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {payment.method === 'card' ? 'کارت بانکی' : payment.method}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">مبلغ</p>
                  <p className="font-bold text-primary">
                    {payment.amount?.toLocaleString('fa-IR')} تومان
                  </p>
                </div>
                {payment.order && (
                  <div className="text-left">
                    <p className="text-sm text-gray-500">سفارش</p>
                    <p className="font-medium">#{payment.order.slice(-8)}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default PaymentsModule
