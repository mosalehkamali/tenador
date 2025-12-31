'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaUser, FaHeart, FaShoppingBag, FaCreditCard, FaMapMarkerAlt, FaWallet, FaTicketAlt, FaSignOutAlt } from 'react-icons/fa'
import { useState } from 'react'
import { useDashboardStore } from '../lib/store'
import { toast } from 'react-toastify'

const UserDashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { currentModule, setCurrentModule } = useDashboardStore()

  const menuItems = [
    { id: 'profile', label: 'پروفایل', icon: FaUser },
    { id: 'cart', label: 'سبد خرید', icon: FaShoppingBag },
    { id: 'wishlist', label: 'لیست علاقه‌مندی‌ها', icon: FaHeart },
    { id: 'orders', label: 'سفارش‌ها', icon: FaShoppingBag },
    { id: 'payments', label: 'پرداخت‌ها', icon: FaCreditCard },
    { id: 'addresses', label: 'آدرس‌ها', icon: FaMapMarkerAlt },
    { id: 'wallet', label: 'کیف پول', icon: FaWallet },
    { id: 'installments', label: 'اقساط', icon: FaCreditCard },
    { id: 'tickets', label: 'تیکت‌ها', icon: FaTicketAlt },
  ]

  const handleModuleChange = (moduleId) => {
    setCurrentModule(moduleId)
    setSidebarOpen(false)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/auth/login'
    } catch (error) {
      toast.error('خطا در خروج')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-sm shadow-sm text-gray-600 hover:text-gray-900"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'tween', duration: 0.3 }}
            className={`fixed right-0 top-0 h-full w-64 bg-white shadow-lg z-40 ${
              window.innerWidth < 1024 ? 'lg:hidden' : ''
            }`}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-8">داشبورد کاربر</h2>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleModuleChange(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-right transition-colors ${
                        currentModule === item.id
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  )
                })}
              </nav>
              <div className="absolute bottom-6 right-6 left-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FaSignOutAlt />
                  <span className="text-sm">خروج</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:mr-64">
        <motion.main
          key={currentModule}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {children}
        </motion.main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        />
      )}
    </div>
  )
}

export default UserDashboardLayout
