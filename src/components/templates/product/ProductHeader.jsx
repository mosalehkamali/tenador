const ProductHeader = ({ name, shortDescription }) => {
  return (
    <div className="mb-6">
      <h1
        className="
          text-[hsl(var(--foreground))]
          text-2xl
          md:text-3xl
          font-bold
          leading-tight
        "
      >
        {name}
      </h1>

      {shortDescription && (
        <p
          className="
            mt-3
            text-sm
            leading-relaxed
            text-[hsl(var(--foreground)/0.7)]
          "
        >
          {shortDescription}
        </p>
      )}
    </div>
  );
};

export default ProductHeader;
