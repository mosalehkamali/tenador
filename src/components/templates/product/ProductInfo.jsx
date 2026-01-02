"use client"
import ProductHeader from "./ProductHeader";
import ProductPrice from "./ProductPrice";
import ProductVariants from "./ProductVariants";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";
import { addToCart } from "@/lib/cart";
import { toast } from "react-toastify";

const ProductInfo = ({ product }) => {

  const productOptions = product.attributes.filter(
    attr => attr.type === "select"
  );


  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success("به سبد خرید اضافه شد");
  };

  const handleWishlist = (isWishlisted) => {
    console.log(isWishlisted ? "به علاقه‌مندی‌ها اضافه شد" : "از علاقه‌مندی‌ها حذف شد");
  };

  return (
    <div className="flex flex-col  h-full justify-between">
      <div className="w-full flex flex-col">
      {product.brand.logo && (
        <div className="mb-2 self-end">
          <img 
            src={product.brand.logo} 
            alt={`${product.name} logo`} 
            className="h-12 w-auto object-contain"
            />
        </div>
      )}

      <ProductHeader
        name={product.name}
        shortDescription={product.shortDescription}
        />
        </div>

      <ProductPrice
        basePrice={product.basePrice}
        discountedPrice={product.discountedPrice}
        hasDiscount={false}
      />

      {productOptions && productOptions.length > 0 && (
        <div className="mt-2">
          <ProductVariants variants={productOptions} />
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