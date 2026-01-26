'use client';

import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import IconButton from '@/components/ui/IconButton';

export default function ProductCard({ product }) {
  const handleAddToCart = () => {
    toast.success(`${product.name} به سبد خرید اضافه شد`, {
      position: 'top-left',
      autoClose: 2000,
    });
  };

  const handleAddToWishlist = () => {
    toast.info(`${product.name} به علاقه‌مندی‌ها اضافه شد`, {
      position: 'top-left',
      autoClose: 2000,
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const discountAmount = product.originalPrice
    ? product.originalPrice - product.price
    : 0;

  return (
    <div className="group relative bg-[#1a1a1a] border border-white/10 hover:border-[#aa4725]/50 transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{
            backgroundImage: `url(${product.image})`,
          }}
        />
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-[#aa4725] text-white px-3 py-1 text-sm font-bold z-10">
            {product.discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton onClick={handleAddToWishlist} className="bg-black/50 backdrop-blur-sm">
            <FiHeart className="text-white" size={20} />
          </IconButton>
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-6 py-3 bg-[#aa4725] text-white hover:bg-[#aa4725]/90 transition-colors"
          >
            <FiShoppingCart size={20} />
            <span>افزودن به سبد</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>{product.brand}</span>
          <span>{product.category}</span>
        </div>

        {/* Product Name */}
        <h3 className="text-white font-medium mb-3 line-clamp-2 min-h-[48px] group-hover:text-[#aa4725] transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <FiStar className="text-[#ffbf00] fill-[#ffbf00]" size={16} />
          <span className="text-sm text-gray-300">{product.rating}</span>
        </div>

        {/* Price Section */}
        <div className="mt-auto">
          {product.originalPrice ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-xs text-[#aa4725] font-bold">
                  {formatPrice(discountAmount)} تومان تخفیف
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                {formatPrice(product.price)} تومان
              </div>
            </div>
          ) : (
            <div className="text-xl font-bold text-white">
              {formatPrice(product.price)} تومان
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
