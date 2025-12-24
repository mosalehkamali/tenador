import ProductCard from "@/components/modules/cart/ProductCard";

export default function ProductList({
  products = [],
  onQuickView,
  onAddToCart,
  onToggleWishlist,
}) {
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        محصولی برای نمایش وجود ندارد
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          slug={product.slug}
          image={product.mainImage}
          name={product.name}
          description={product.shortDescription}
          price={product.basePrice}
          discountPrice={product.discountPrice}
          brandLogo={product.brand.logo}
          isWishlisted={product.isWishlisted}
          onQuickView={() => onQuickView?.(product)}
          onAddToCart={() => onAddToCart?.(product)}
          onToggleWishlist={() => onToggleWishlist?.(product)}
        />
      ))}
    </div>
  );
}
