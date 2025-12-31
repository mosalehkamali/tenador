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
      } else toast.error('خطا در بارگذاری تیکت‌ها')
    } catch {
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
      } else toast.error('خطا در ارسال تیکت')
    } catch {
      toast.error('خطا در اتصال')
    }
  }

  const resetForm = () => {
    setFormData({ title: '', message: '', priority: 'normal' })
  }

  const priorityMeta = {
    high: { text: 'فوری', color: 'text-red-600' },
    normal: { text: 'معمولی', color: 'text-yellow-600' },
    low: { text: 'کم', color: 'text-green-600' },
  }

  const statusMeta = {
    open: { text: 'باز', color: 'text-green-600' },
    pending: { text: 'در انتظار پاسخ', color: 'text-yellow-600' },
    closed: { text: 'بسته', color: 'text-red-600' },
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
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-lg font-semibold">
          <FaTicketAlt className="text-sm opacity-70" />
          تیکت‌های پشتیبانی
        </h1>

        <button
          onClick={() => {
            setShowForm(!showForm)
            setSelectedTicket(null)
            resetForm()
          }}
          className="
            flex items-center gap-2
            rounded-[var(--radius)]
            bg-[hsl(var(--primary))]
            px-4 py-2
            text-sm font-medium
            text-white
            transition hover:opacity-90
          "
        >
          <FaPlus className="text-xs" />
          تیکت جدید
        </button>
      </div>

      {/* New Ticket Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="
            rounded-[var(--radius)]
            border border-[hsl(var(--border))]
            bg-white
            p-5
          "
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="mb-1 block opacity-70">عنوان تیکت</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="
                  w-full rounded-[var(--radius)]
                  border border-[hsl(var(--border))]
                  px-3 py-2
                  focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]
                "
                required
              />
            </div>

            <div>
              <label className="mb-1 block opacity-70">اولویت</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="
                  w-full rounded-[var(--radius)]
                  border border-[hsl(var(--border))]
                  px-3 py-2
                "
              >
                <option value="low">کم</option>
                <option value="normal">معمولی</option>
                <option value="high">فوری</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block opacity-70">پیام</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="
                  w-full rounded-[var(--radius)]
                  border border-[hsl(var(--border))]
                  px-3 py-2
                  focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]
                "
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="
                  rounded-[var(--radius)]
                  bg-[hsl(var(--primary))]
                  px-4 py-2
                  text-white text-sm
                  hover:opacity-90
                "
              >
                ارسال
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="
                  rounded-[var(--radius)]
                  bg-gray-200
                  px-4 py-2
                  text-sm
                  hover:bg-gray-300
                "
              >
                لغو
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-white p-8 text-center text-sm opacity-60">
           <FaTicketAlt className="mx-auto mb-3 text-3xl opacity-30" />
          هیچ تیکتی ثبت نشده است
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => {
            const priority = priorityMeta[ticket.priority]
            const status = statusMeta[ticket.status]

            return (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                  rounded-[var(--radius)]
                  border border-[hsl(var(--border))]
                  bg-white
                  p-4
                "
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{ticket.title}</p>
                    <p className="mt-1 text-xs opacity-60 line-clamp-2">
                      {ticket.message}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 text-xs">
                    <span className={priority.color}>{priority.text}</span>
                    <span className={status.color}>{status.text}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs opacity-60">
                  <span>
                    {new Date(ticket.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-1 hover:opacity-80">
                      <FaEye />
                      مشاهده
                    </button>
                    {ticket.status !== 'closed' && (
                      <button className="flex items-center gap-1 text-blue-600 hover:opacity-80">
                        <FaReply />
                        پاسخ
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

export default TicketsModule
