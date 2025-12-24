import Image from "next/image";
import Link from "next/link";
import { FaEye, FaHeart, FaShoppingCart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

export default function ProductCard({
  image,
  name,
  slug,
  description,
  price,
  discountPrice,
  brandLogo,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}) {
  const safePrice = Number(price) || 0;
  const safeDiscount = Number(discountPrice) || null;

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow">
      {/* Brand logo */}
      {brandLogo && (
        <div className="absolute top-3 left-3 z-10 bg-white rounded-md p-1 shadow">
          <Image
          src={brandLogo}
          alt="brand"
          width={32}
          height={32}
          className="object-contain"
        />
        </div>
      )}

      {/* Product image */}
      <Link href={`/products/${slug}`}>
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          />
      </div>
          </Link>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
      <Link href={`/products/${slug}`}>
        <h3 className="font-bold text-[17px] text-[#1a1a1a] line-clamp-1">
          {name}
        </h3>
      </Link>

        <p className="text-sm text-gray-600 line-clamp-2">
          {description}
        </p>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          {safeDiscount ? (
            <>
              <span className="text-sm line-through text-gray-400">
                {safePrice.toLocaleString()} تومان
              </span>
              <span className="font-bold text-[#aa4725]">
                {safeDiscount.toLocaleString()} تومان
              </span>
            </>
          ) : (
            <span className="font-bold text-[#aa4725]">
              {safePrice.toLocaleString()} تومان
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 pt-4">
          {/* Quick view */}
          <div className="relative group">
            <button
              onClick={onQuickView}
              aria-label="نمایش سریع"
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:border-[#aa4725] hover:text-[#aa4725] transition"
            >
              <FaEye />
            </button>
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition bg-[#1a1a1a] text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              نمایش سریع
            </span>
          </div>

          {/* Add to cart */}
          <button
            onClick={onAddToCart}
            className="flex-1 h-10 flex items-center justify-center gap-2 rounded-lg bg-[#aa4725] text-white font-medium hover:opacity-90 transition"
          >
            <FaShoppingCart />
            افزودن به سبد
          </button>

          {/* Wishlist */}
          <div className="relative group">
            <button
              onClick={onToggleWishlist}
              aria-label="افزودن به علاقه‌مندی‌ها"
              className={`w-10 h-10 flex items-center justify-center rounded-lg border transition ${
                isWishlisted
                  ? "border-[#aa4725] text-[#aa4725]"
                  : "border-gray-200 hover:border-[#aa4725] hover:text-[#aa4725]"
              }`}
            >
              {isWishlisted ? <FaHeart /> : <FaRegHeart />}
            </button>
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition bg-[#1a1a1a] text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              افزودن به علاقه‌مندی‌ها
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
