'use client'

import { motion } from 'framer-motion'
import { FaCreditCard, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const InstallmentsModule = () => {
  const [installments, setInstallments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInstallments()
  }, [])

  const fetchInstallments = async () => {
    try {
      const res = await fetch('/api/installments')
      if (res.ok) {
        const data = await res.json()
        setInstallments(data.installments)
      } else {
        toast.error('خطا در بارگذاری اقساط')
      }
    } catch (error) {
      toast.error('خطا در اتصال')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'overdue': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'پرداخت شده'
      case 'pending': return 'در انتظار پرداخت'
      case 'overdue': return 'سررسید گذشته'
      default: return status
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <FaCheckCircle className="text-green-500" />
      case 'pending': return <FaClock className="text-yellow-500" />
      case 'overdue': return <FaClock className="text-red-500" />
      default: return <FaClock className="text-gray-500" />
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
        اقساط و بدهی‌ها
      </h1>

      {installments.length === 0 ? (
        <div className="bg-white rounded-sm shadow-sm p-8 text-center">
          <FaCreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">هیچ قسطی ندارید</p>
        </div>
      ) : (
        <div className="space-y-4">
          {installments.map((installment) => (
            <motion.div
              key={installment._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-sm shadow-sm p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(installment.status)}
                  <div>
                    <p className="font-medium">قسط #{installment.installmentNumber}</p>
                    <p className="text-sm text-gray-500">
                      سفارش #{installment.order?.slice(-8)}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className={`font-bold ${getStatusColor(installment.status)}`}>
                    {getStatusText(installment.status)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {installment.amount?.toLocaleString('fa-IR')} تومان
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">سررسید:</span>
                  <p className="font-medium">
                    {new Date(installment.dueDate).toLocaleDateString('fa-IR')}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">تاریخ پرداخت:</span>
                  <p className="font-medium">
                    {installment.paidAt
                      ? new Date(installment.paidAt).toLocaleDateString('fa-IR')
                      : '---'
                    }
                  </p>
                </div>
              </div>

              {installment.status === 'pending' && (
                <div className="mt-4 pt-4 border-t">
                  <button className="w-full px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors">
                    پرداخت قسط
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default InstallmentsModule
