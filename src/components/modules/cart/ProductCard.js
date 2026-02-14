import Image from "next/image";
import Link from "next/link";
import { FaEye, FaRegHeart, FaHeart } from "react-icons/fa";

export default function ProductCard({
  image,
  name,
  slug,
  description,
  price,
  discountPrice,
  brandLogo,
  onQuickView,
  onToggleWishlist,
  isWishlisted = false,
}) {
  const safePrice = Number(price) || 0;
  const safeDiscount = Number(discountPrice) || null;

  return (
    <div className="group relative bg-white border border-gray-100 rounded-[6px] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      
      {/* Brand Logo - Minimalist */}
      {brandLogo && (
        <div className="absolute top-2 left-2 z-10">
          <Image src={brandLogo} alt="brand" width={40} height={40} className="object-contain" />
        </div>
      )}

      {/* Product Image */}
      <Link href={`/products/${slug}`} className="relative w-full aspect-square overflow-hidden bg-[#f9f9f9]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 bg-white">
        <Link href={`/products/${slug}`}>
          <h3 className="font-bold text-[16px] text-[#1a1a1a] line-clamp-1 mb-1 hover:text-[#aa4725] transition-colors">
            {name}
          </h3>
        </Link>
        
        <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed h-10">
          {description}
        </p>

        {/* Price Section */}
        <div className="mt-4 mb-4">
          {safeDiscount ? (
            <div className="flex flex-col">
              <span className="text-[12px] line-through text-gray-400">
                {safePrice.toLocaleString()} تومان
              </span>
              <span className="font-black text-[18px] text-[#aa4725]">
                {safeDiscount.toLocaleString()} <small className="text-[11px] font-medium">تومان</small>
              </span>
            </div>
          ) : (
            <span className="font-black text-[18px] text-[#aa4725]">
              {safePrice.toLocaleString()} <small className="text-[11px] font-medium">تومان</small>
            </span>
          )}
        </div>

        {/* Action Buttons - Modern Glass Style (Fixed) */}
        <div className="flex gap-2 pt-3 border-t border-gray-50">
          {/* Quick View Button - The Primary Action Now */}
          <button
            onClick={onQuickView}
            className="flex-[3] h-11 flex items-center justify-center gap-2 rounded-[6px] bg-[#aa4725]/10 text-[#aa4725] border border-[#aa4725]/20 hover:bg-[#aa4725] hover:text-white transition-all duration-300 font-bold text-sm backdrop-blur-sm"
          >
            <FaEye className="text-lg" />
            مشاهده و خرید
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onToggleWishlist}
            className={`flex-1 h-11 flex items-center justify-center rounded-[6px] border transition-all duration-300 ${
              isWishlisted 
              ? "bg-red-50 border-red-100 text-red-500" 
              : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            }`}
          >
            {isWishlisted ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
      </div>
    </div>
  );
}