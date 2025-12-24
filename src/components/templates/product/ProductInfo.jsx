"use client"
import ProductHeader from "./ProductHeader";
import ProductPrice from "./ProductPrice";
import ProductVariants from "./ProductVariants";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";

const ProductInfo = ({ product }) => {
  const handleAddToCart = () => {
    console.log("محصول به سبد خرید اضافه شد:", product.name);
  };

  const handleWishlist = (isWishlisted) => {
    console.log(isWishlisted ? "به علاقه‌مندی‌ها اضافه شد" : "از علاقه‌مندی‌ها حذف شد");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Product Logo */}
      {product.logo && (
        <div className="mb-2">
          <img 
            src={product.logo} 
            alt={`${product.name} logo`} 
            className="h-12 w-auto object-contain"
          />
        </div>
      )}

      <ProductHeader
        name={product.name}
        shortDescription={product.shortDescription}
      />

      <ProductPrice
        originalPrice={product.originalPrice}
        discountedPrice={product.discountedPrice}
        hasDiscount={product.hasDiscount}
      />

      {product.variants && product.variants.length > 0 && (
        <div className="mt-2">
          <ProductVariants variants={product.variants} />
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <AddToCartButton onAddToCart={handleAddToCart} />
        <WishlistButton onToggle={handleWishlist} />
      </div>
    </div>
  );
};

export default ProductInfo;