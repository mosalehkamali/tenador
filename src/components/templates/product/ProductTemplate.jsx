import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";

const ProductTemplate = ({ product }) => {
  console.log(product);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 lg:px-8">
        {/* Top Section - Two Column Layout */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-12 xl:gap-16">
          {/* Left Column - Gallery (Smaller) */}
          <div className="order-2 lg:order-1">
            <div className="mx-auto max-w-md lg:max-w-none">
              {/* <ProductGallery images={product.images} /> */}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="order-1 lg:order-2">
            {/* <ProductInfo product={product} /> */}
          </div>
        </div>

        {/* Bottom Section - Tabs */}
        <div className="mt-10 sm:mt-12 md:mt-16">
          {/* <ProductTabs
            description={product.description}
            attributes={product.attributes}
            reviews={product.reviews}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default ProductTemplate;