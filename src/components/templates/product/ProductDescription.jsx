const ProductDescription = ({ description }) => {
  return (
    <div className="animate-fade-in prose prose-neutral max-w-none">
      <div className="text-foreground leading-relaxed whitespace-pre-line">
        {description}
      </div>
    </div>
  );
};

export default ProductDescription;