const ProductHeader = ({ name, shortDescription }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">
        {name}
      </h1>
      <p className="mt-2 text-muted-foreground leading-relaxed">
        {shortDescription}
      </p>
    </div>
  );
};

export default ProductHeader;