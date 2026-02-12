const ProductDescription = ({ description }) => {
  return (
    <div
      className="
        animate-[fadeIn_0.25s_ease-out]
        text-[hsl(var(--foreground))]
        leading-relaxed
        whitespace-pre-line
        text-sm
        sm:text-base
      "
    >
      <div 
      className="prose prose-blue max-w-none text-justify" 
      dangerouslySetInnerHTML={{ __html: description }} 
    />
    </div>
  );
};

export default ProductDescription;
