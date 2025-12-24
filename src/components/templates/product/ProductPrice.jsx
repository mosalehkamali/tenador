const ProductPrice = ({
  basePrice,
  discountedPrice,
  hasDiscount,
}) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat("fa-IR").format(price);

  const discountPercent =
    hasDiscount && basePrice > 0
      ? Math.round(((basePrice - discountedPrice) / basePrice) * 100)
      : 0;

  return (
    <div className="mb-6 flex items-center gap-4">
      {hasDiscount ? (
        <>
          {/* Final Price */}
          <span className="text-2xl font-bold text-[hsl(var(--foreground))]">
            {formatPrice(discountedPrice)} تومان
          </span>

          {/* Base Price */}
          <span className="text-lg line-through opacity-60">
            {formatPrice(basePrice)}
          </span>

          {/* Discount Badge */}
          <span
            className="
              px-2 py-1 text-sm font-medium
              border
              border-[hsl(var(--primary))]
              text-[hsl(var(--primary))]
            "
          >
            {discountPercent}% تخفیف
          </span>
        </>
      ) : (
        <span className="text-2xl font-bold text-[hsl(var(--primary))]">
          {formatPrice(basePrice)} تومان
        </span>
      )}
    </div>
  );
};

export default ProductPrice;
