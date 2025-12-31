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
      } else {
        toast.error('خطا در بارگذاری کیف پول')
      }
    } catch (error) {
      toast.error('خطا در اتصال')
    } finally {
      setLoading(false)
    }
  }

  const getTransactionIcon = (type) => {
    return type === 'credit' ? <FaPlus className="text-green-500" /> : <FaMinus className="text-red-500" />
  }

  const getTransactionText = (type) => {
    return type === 'credit' ? 'واریز' : 'برداشت'
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
        <FaWallet />
        کیف پول
      </h1>

      <div className="bg-white rounded-sm shadow-sm p-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">
            {wallet?.balance?.toLocaleString('fa-IR') || 0} تومان
          </div>
          <p className="text-gray-500">موجودی فعلی</p>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">تراکنش‌های اخیر</h2>

        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">هیچ تراکنشی وجود ندارد</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <motion.div
                key={transaction._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-sm"
              >
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium">{getTransactionText(transaction.type)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className={`font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'credit' ? '+' : '-'}{transaction.amount?.toLocaleString('fa-IR')} تومان
                  </p>
                  <p className="text-sm text-gray-500">{transaction.description}</p>
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
