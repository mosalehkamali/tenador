'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    title: 'داشبورد',
    href: '/p-admin',
    icon: '📊',
  },
  {
    title: 'ورزش‌ها',
    href: '/p-admin/admin-sports',
    icon: '⚽',
  },
  {
    title: 'برندها',
    href: '/p-admin/admin-brands',
    icon: '🏷️',
  },
  {
    title: 'ورزشکاران',
    href: '/p-admin/admin-athletes',
    icon: '👤',
  },
  {
    title: 'دسته‌بندی‌ها',
    href: '/p-admin/admin-categories',
    icon: '📁',
  },
  {
    title: 'محصولات',
    href: '/p-admin/admin-products',
    icon: '📦',
  },
  {
    title: 'کاربران',
    href: '/p-admin/users',
    icon: '👥',
  },
];

export default function AdminLayout({ children, title = 'پنل مدیریت' }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarWidth = sidebarOpen ? '16rem' : '5rem';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className="bg-white shadow-lg transition-all duration-300 fixed right-0 top-0 h-screen z-40 overflow-hidden"
        style={{ width: sidebarWidth }}
      >
        <div className="p-4 border-b border-gray-200 h-16 flex items-center justify-between">
          {sidebarOpen && (
            <h2 className="text-xl font-bold text-gray-800 whitespace-nowrap">پنل مدیریت</h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={sidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                } ${!sidebarOpen ? 'justify-center' : ''}`}
                title={!sidebarOpen ? item.title : ''}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                {sidebarOpen && (
                  <span className="font-medium whitespace-nowrap">{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className="transition-all duration-300 min-w-0"
        style={{
          marginRight: sidebarWidth,
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
