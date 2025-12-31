'use client'

import { motion } from 'framer-motion'
import { FaTicketAlt, FaPlus, FaEye, FaReply } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const TicketsModule = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'normal'
  })

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets')
      if (res.ok) {
        const data = await res.json()
        setTickets(data.tickets)
      } else {
        toast.error('خطا در بارگذاری تیکت‌ها')
      }
    } catch (error) {
      toast.error('خطا در اتصال')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchTickets()
        setShowForm(false)
        resetForm()
        toast.success('تیکت ارسال شد')
      } else {
        toast.error('خطا در ارسال تیکت')
      }
    } catch (error) {
      toast.error('خطا در اتصال')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      priority: 'normal'
    })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'normal': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'فوری'
      case 'normal': return 'معمولی'
      case 'low': return 'کم'
      default: return priority
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'closed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'باز'
      case 'pending': return 'در انتظار پاسخ'
      case 'closed': return 'بسته'
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaTicketAlt />
          تیکت‌های پشتیبانی
        </h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setSelectedTicket(null)
            resetForm()
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors"
        >
          <FaPlus />
          تیکت جدید
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-sm shadow-sm p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">عنوان تیکت</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اولویت</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="low">کم</option>
                <option value="normal">معمولی</option>
                <option value="high">فوری</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">پیام</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors"
              >
                ارسال تیکت
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-sm hover:bg-gray-600 transition-colors"
              >
                لغو
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {tickets.length === 0 ? (
        <div className="bg-white rounded-sm shadow-sm p-8 text-center">
          <FaTicketAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">هیچ تیکتی ندارید</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <motion.div
              key={ticket._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-sm shadow-sm p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                    {getPriorityText(ticket.priority)}
                  </span>
                  <span className={`text-sm font-medium ${getStatusColor(ticket.status)}`}>
                    {getStatusText(ticket.status)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{ticket.message}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{new Date(ticket.createdAt).toLocaleDateString('fa-IR')}</span>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 text-primary hover:text-primary/80">
                    <FaEye />
                    مشاهده
                  </button>
                  {ticket.status !== 'closed' && (
                    <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600">
                      <FaReply />
                      پاسخ
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default TicketsModule
