'use client';

import { useState, useEffect } from 'react';
import { StatCard } from '@/components/admin';

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {statCards.map((card) => (
              <StatCard
                key={card.href}
                title={card.title}
                count={card.count}
                icon={card.icon}
                color={card.color}
                href={card.href}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
