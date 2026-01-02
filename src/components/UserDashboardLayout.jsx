'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  FaBars,
  FaTimes,
  FaUser,
  FaHeart,
  FaShoppingBag,
  FaCreditCard,
  FaMapMarkerAlt,
  FaWallet,
  FaTicketAlt,
  FaSignOutAlt,
} from 'react-icons/fa'
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
      window.location.href = '/'
    } catch {
      toast.error('خطا در خروج')
    }
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] rtl">
      {/* Mobile toggle */}
      <div className="fixed top-4 right-4 z-50 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="
            p-2
            rounded-[var(--radius)]
            bg-white
            border border-[hsl(var(--border))]
            text-[hsl(var(--foreground))]
            shadow-sm
          "
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
          <motion.aside
            initial={{ x: 280 }}
            animate={{ x: 0 }}
            exit={{ x: 280 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="
              fixed top-0 right-0 z-40
              h-full w-60
              bg-white
              border-l border-[hsl(var(--border))]
            "
          >
            <div className="flex h-full flex-col p-4">
              <h2 className="mb-6 text-sm font-semibold text-[hsl(var(--foreground)/0.8)]">
                داشبورد کاربر
              </h2>

              <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const active = currentModule === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleModuleChange(item.id)}
                      className={`
                        group flex w-full items-center gap-3
                        rounded-[var(--radius)]
                        px-3 py-2 text-sm
                        transition-colors
                        ${
                          active
                            ? 'bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]'
                            : 'text-[hsl(var(--foreground)/0.8)] hover:bg-[hsl(var(--border)/0.5)]'
                        }
                      `}
                    >
                      <Icon className="text-xs opacity-80" />
                      {item.label}
                    </button>
                  )
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="
                  mt-4 flex items-center gap-3
                  rounded-[var(--radius)]
                  px-3 py-2 text-sm
                  text-red-600
                  hover:bg-red-50
                "
              >
                <FaSignOutAlt className="text-xs" />
                خروج
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="lg:mr-60">
        <motion.main
          key={currentModule}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-4 lg:p-6"
        >
          {children}
        </motion.main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}
    </div>
  )
}

export default UserDashboardLayout
