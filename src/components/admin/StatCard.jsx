'use client';

import Link from 'next/link';

export default function StatCard({ title, count, icon, color, href }) {
  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
            <p className="text-4xl font-bold text-gray-900">{count}</p>
          </div>
          <div className={`${color} w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-inner`}>
            {icon}
          </div>
        </div>
      </div>
    </Link>
  );
}
