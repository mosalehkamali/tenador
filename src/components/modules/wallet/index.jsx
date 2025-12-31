'use client'

import { motion } from 'framer-motion'
import { FaWallet, FaPlus, FaMinus } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const WalletModule = () => {
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWalletData()
  }, [])

  const fetchWalletData = async () => {
    try {
      const res = await fetch('/api/wallet')
      if (res.ok) {
        const data = await res.json()
        setWallet(data.wallet)
        setTransactions(data.transactions || [])
      } else toast.error('خطا در بارگذاری کیف پول')
    } catch {
      toast.error('خطا در اتصال')
    } finally {
      setLoading(false)
    }
  }

  const getTransactionIcon = (type) =>
    type === 'credit'
      ? <FaPlus className="text-[12px] text-green-500" />
      : <FaMinus className="text-[12px] text-red-500" />

  const getTransactionText = (type) =>
    type === 'credit' ? 'واریز' : 'برداشت'

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
        <FaWallet className="text-sm opacity-70" />
        کیف پول
      </h1>

      {/* Balance */}
      <div
        className="
          rounded-[var(--radius)]
          border border-[hsl(var(--border))]
          bg-white
          px-5 py-6
          text-center
        "
      >
        <p className="text-xs opacity-60 mb-1">موجودی فعلی</p>
        <p className="text-2xl font-semibold text-[hsl(var(--primary))]">
          {wallet?.balance?.toLocaleString('fa-IR') || 0}
          <span className="mr-1 text-sm font-normal opacity-70">تومان</span>
        </p>
      </div>

      {/* Transactions */}
      <div
        className="
          rounded-[var(--radius)]
          border border-[hsl(var(--border))]
          bg-white
          p-4
        "
      >
        <h2 className="mb-4 text-sm font-medium opacity-80">
          تراکنش‌های اخیر
        </h2>

        {transactions.length === 0 ? (
          <p className="py-6 text-center text-sm opacity-60">
            تراکنشی وجود ندارد
          </p>
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <motion.div
                key={transaction._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                  flex items-center justify-between
                  rounded-[var(--radius)]
                  border border-[hsl(var(--border))]
                  px-3 py-2
                  text-sm
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-7 w-7 items-center justify-center
                      rounded-full
                      bg-gray-100
                    "
                  >
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium">
                      {getTransactionText(transaction.type)}
                    </p>
                    <p className="text-[11px] opacity-60">
                      {new Date(transaction.createdAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                </div>

                <div className="text-left">
                  <p
                    className={`font-medium ${
                      transaction.type === 'credit'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'credit' ? '+' : '-'}
                    {transaction.amount?.toLocaleString('fa-IR')}
                  </p>
                  {transaction.description && (
                    <p className="text-[11px] opacity-60">
                      {transaction.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default WalletModule
