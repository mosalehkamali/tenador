'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/Layout';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    sports: 0,
    brands: 0,
    athletes: 0,
    products: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [sportsRes, brandsRes, athletesRes, productsRes, categoriesRes] = await Promise.all([
        fetch('/api/sports'),
        fetch('/api/brands'),
        fetch('/api/athletes'),
        fetch('/api/product'),
        fetch('/api/categories'),
      ]);

      const [sports, brands, athletes, products, categories] = await Promise.all([
        sportsRes.json(),
        brandsRes.json(),
        athletesRes.json(),
        productsRes.json(),
        categoriesRes.json(),
      ]);

      setStats({
        sports: sports.sports?.length || 0,
        brands: brands.brands?.length || 0,
        athletes: athletes.athletes?.length || 0,
        products: products.products?.length || 0,
        categories: categories.categories?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'ورزش‌ها',
      count: stats.sports,
      icon: '⚽',
      color: 'bg-blue-500',
      href: '/p-admin/admin-sports',
    },
    {
      title: 'برندها',
      count: stats.brands,
      icon: '🏷️',
      color: 'bg-purple-500',
      href: '/p-admin/admin-brands',
    },
    {
      title: 'ورزشکاران',
      count: stats.athletes,
      icon: '👤',
      color: 'bg-green-500',
      href: '/p-admin/admin-athletes',
    },
    {
      title: 'دسته‌بندی‌ها',
      count: stats.categories,
      icon: '📁',
      color: 'bg-indigo-500',
      href: '/p-admin/admin-categories',
    },
    {
      title: 'محصولات',
      count: stats.products,
      icon: '📦',
      color: 'bg-orange-500',
      href: '/p-admin/admin-products',
    },
  ];

  return (
    <div title="داشبورد">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="block"
              >
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 p-6 border border-gray-200 hover:border-gray-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">{card.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{card.count}</p>
                    </div>
                    <div className={`${card.color} w-16 h-16 rounded-lg flex items-center justify-center text-3xl`}>
                      {card.icon}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
