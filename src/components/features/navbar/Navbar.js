'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { HiOutlineViewGrid } from 'react-icons/hi';
import Input from '@/components/ui/Input';
import IconButton from '@/components/ui/IconButton';
import Button from '@/components/ui/Button';
import { SPORTS_CATEGORIES, BRANDS, NAVIGATION_ITEMS } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import CartDrawer from '@/components/features/cartDrawer/CartDrawer';

export default function Navbar({ user }) {
  const [isLoggedIn, setIsLoggedIn] = useState(user);
  const [cartCount, setCartCount] = useState(3);
  const [openCart, setOpenCart] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [hoveredSport, setHoveredSport] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    const items = stored ? JSON.parse(stored) : []
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    setCartCount(totalItems)
  }, [openCart])

  const handleCategoryToggle = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 z-50 bg-gradient-to-b from-[#fff] to-[#aa4725]/30 backdrop-blur-md border-b border-[#aa4725]/80">
        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          {/* Top Row */}
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <div className="flex-shrink-0">
                <a href="/" className="text-2xl font-bold hover:text-[#ffbf00] transition-colors">
                  <Image src="/logo/logo.svg" alt="logo" width={100} height={100} />
                </a>
              </div>

              {/* Search Bar */}
              <div className="flex-grow max-w-2xl">
                <Input
                  className='rounded-[var(--radius)] text-[--color-text)]'
                  type="search"
                  placeholder="جستجو در محصولات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<FiSearch size={20} />}
                />
              </div>

              {/* Auth & Cart */}
              <div className="flex items-center gap-3">
                {isLoggedIn ? (
                  <Link href={"/p-user"}>
                    <Button className="flex items-center gap-1 rounded-[var(--radius)] cursor-pointer" variant="outline" size="sm">
                      <FiUser className="ml-2" />
                      ورود به داشبورد
                    </Button>
                  </Link>
                ) : (
                  <Link href={"/login-register"}>
                    <Button className="flex items-center gap-1 rounded-[var(--radius)] cursor-pointer" variant="outline" size="sm">
                      <FiUser className="ml-2" />
                      ورود | ثبت‌نام
                    </Button>
                  </Link>
                )}

                <div className="relative" onClick={() => setOpenCart(true)}>
                  <IconButton variant="default">
                    <FiShoppingCart className='text-[var(--color-text)] cursor-pointer' size={24} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#aa4725] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </IconButton>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Categories */}
          <div className="border-t border-white/10">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-6 py-3">
                {/* Categories Dropdown */}
                <div className="relative">
                  <button
                    onClick={handleCategoryToggle}
                    onMouseEnter={() => setIsCategoryOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#aa4725] text-white hover:bg-[#aa4725]/90 transition-colors rounded-[var(--radius)]"
                  >
                    <HiOutlineViewGrid size={20} />
                    <span>دسته‌بندی محصولات</span>
                  </button>

                  {isCategoryOpen && (
                    <div
                      className="absolute top-full right-0 mt-2 w-[600px] bg-[var(--color-background)]/90 border border-black/10 shadow-2xl rounded-[var(--radius)]"
                      onMouseLeave={() => {
                        setIsCategoryOpen(false);
                        setHoveredSport(null);
                      }}
                    >
                      <div className="flex h-[400px]">
                        {/* Right Column - Sports */}
                        <div className="w-1/2 border-l border-white/10 p-4 rounded-[var(--radius)]">
                          <h3 className="text-sm font-semibold text-gray-600 mb-3">رشته‌های ورزشی</h3>
                          <ul className="space-y-2">
                            {SPORTS_CATEGORIES.map((sport) => (
                              <li key={sport.id}>
                                <a
                                  href={`/category/${sport.slug}`}
                                  className={`block rounded-[var(--radius)] px-4 py-3 transition-all ${hoveredSport === sport.slug
                                    ? 'bg-[#aa4725] text-white'
                                    : 'text-black hover:bg-white/5'
                                    }`}
                                  onMouseEnter={() => setHoveredSport(sport.slug)}
                                >
                                  {sport.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Left Column - Brands */}
                        <div className="w-1/2 p-4">
                          {hoveredSport ? (
                            <>
                              <h3 className="text-sm font-semibold text-gray-600 mb-3">برندها</h3>
                              <ul className="space-y-2">
                                {BRANDS[hoveredSport]?.map((brand, index) => (
                                  <li key={index}>
                                    <a
                                      href={`/brand/${brand}`}
                                      className="block rounded-[var(--radius)] px-4 py-2 text-gray-800 hover:text-[#aa4725] hover:bg-black/10 transition-all"
                                    >
                                      {brand}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                              یک رشته ورزشی را انتخاب کنید
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                  {NAVIGATION_ITEMS.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      className="text-[#0d0d0d] hover:text-[#aa4725] transition-colors font-medium"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              {/* Logo */}
              <div className="flex-shrink-0">
                <a href="/" className="text-2xl font-bold text-[#aa4725] hover:text-[#ffbf00] transition-colors">
                  <Image src="/logo/logo.svg" alt="logo" width={100} height={100} />
                </a>
              </div>

              {/* Search */}
              <div className="flex-grow max-w-xs">
                <Input
                  type="search"
                  placeholder="جستجو..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<FiSearch size={18} />}
                  className="text-sm py-2"
                />
              </div>

              {/* Cart */}
              <div className="relative" onClick={() => setOpenCart(true)}>
                <IconButton variant="primary">
                  <FiShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -left-1 bg-[#aa4725] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {!isHomePage && <div className='h-[120px] lg:h-[140px]'></div>}
      <CartDrawer
        isOpen={openCart}
        onClose={() => setOpenCart(false)}
      />
    </>
  );
}
