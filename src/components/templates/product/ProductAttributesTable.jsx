const ProductAttributesTable = ({ attributes }) => {
  return (
    <div
      className="
        overflow-hidden
        border border-[hsl(var(--border))]
        animate-[fadeIn_0.25s_ease-out]
      "
    >
      <table className="w-full text-sm">
        <tbody>
          {attributes.map(
            (attr, index) =>
              attr.type !== "select" && (
                <tr
                  key={index}
                  className={`
                border-b border-[hsl(var(--border))]
                last:border-b-0
                ${index % 2 === 0 ? "bg-black/5" : ""}
              `}
                >
                  <td className="w-1/3 px-4 py-3 font-medium text-[hsl(var(--foreground))]">
                    {attr.label}
                  </td>
                  <td className="px-4 py-3 text-[hsl(var(--foreground))] opacity-70">
                    {attr.value}
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductAttributesTable;
