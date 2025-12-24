const ProductPrice = ({ originalPrice, discountedPrice, hasDiscount }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="mb-6 flex items-center gap-4">
      {hasDiscount ? (
        <>
          <span className="text-2xl font-bold text-foreground">
            {formatPrice(discountedPrice)} تومان
          </span>
          <span className="text-lg text-muted-foreground line-through">
            {formatPrice(originalPrice)}
          </span>
          <span className="rounded-sm bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
            {discountPercent}% تخفیف
          </span>
        </>
      ) : (
        <span className="text-2xl font-bold text-foreground">
          {formatPrice(originalPrice)} تومان
        </span>
      )}
    </div>
  );
};

export default ProductPrice;