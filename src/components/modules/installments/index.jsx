'use client'

import { motion } from 'framer-motion'
import {
  FaCreditCard,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa'
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
      } else toast.error('خطا در بارگذاری اقساط')
    } catch {
      toast.error('خطا در اتصال')
    } finally {
      setLoading(false)
    }
  }

  const getStatusMeta = (status) => {
    switch (status) {
      case 'paid':
        return {
          text: 'پرداخت شده',
          color: 'text-green-600',
          icon: <FaCheckCircle className="text-green-500 text-sm" />
        }
      case 'pending':
        return {
          text: 'در انتظار پرداخت',
          color: 'text-yellow-600',
          icon: <FaClock className="text-yellow-500 text-sm" />
        }
      case 'overdue':
        return {
          text: 'سررسید گذشته',
          color: 'text-red-600',
          icon: <FaClock className="text-red-500 text-sm" />
        }
      default:
        return {
          text: status,
          color: 'text-gray-600',
          icon: <FaClock className="text-gray-400 text-sm" />
        }
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
      {/* Header */}
      <h1 className="flex items-center gap-2 text-lg font-semibold">
        <FaCreditCard className="text-sm opacity-70" />
        اقساط و بدهی‌ها
      </h1>

      {installments.length === 0 ? (
        <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-white p-8 text-center text-sm opacity-60">
          <FaCreditCard className="mx-auto mb-3 text-3xl opacity-30" />
          قسطی ثبت نشده است
        </div>
      ) : (
        <div className="space-y-3">
          {installments.map((installment) => {
            const status = getStatusMeta(installment.status)

            return (
              <motion.div
                key={installment._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                  rounded-[var(--radius)]
                  border border-[hsl(var(--border))]
                  bg-white
                  p-4
                "
              >
                {/* Top */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                      {status.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        قسط #{installment.installmentNumber}
                      </p>
                      <p className="text-[11px] opacity-60">
                        سفارش #{installment.order?.slice(-8)}
                      </p>
                    </div>
                  </div>

                  <div className="text-left">
                    <p className={`text-sm font-medium ${status.color}`}>
                      {status.text}
                    </p>
                    <p className="text-sm font-semibold text-[hsl(var(--primary))]">
                      {installment.amount?.toLocaleString('fa-IR')}
                      <span className="mr-1 text-xs font-normal opacity-70">تومان</span>
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="opacity-60 mb-1">سررسید</p>
                    <p className="font-medium">
                      {new Date(installment.dueDate).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                  <div>
                    <p className="opacity-60 mb-1">تاریخ پرداخت</p>
                    <p className="font-medium">
                      {installment.paidAt
                        ? new Date(installment.paidAt).toLocaleDateString('fa-IR')
                        : '—'}
                    </p>
                  </div>
                </div>

                {/* Action */}
                {installment.status === 'pending' && (
                  <div className="mt-4 border-t pt-3">
                    <button
                      className="
                        w-full
                        rounded-[var(--radius)]
                        bg-[hsl(var(--primary))]
                        py-2
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:opacity-90
                      "
                    >
                      پرداخت قسط
                    </button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

export default InstallmentsModule
