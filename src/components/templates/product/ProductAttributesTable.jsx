const ProductAttributesTable = ({ attributes }) => {
  if (!attributes || typeof attributes !== "object") return null;

  const entries = Object.entries(attributes);

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
          {entries.map(([key, value], index) => (
            <tr
              key={key}
              className={`
                border-b border-[hsl(var(--border))]
                last:border-b-0
                ${index % 2 === 0 ? "bg-black/5" : ""}
              `}
            >
              <td className="w-1/3 px-4 py-3 font-medium text-[hsl(var(--foreground))]">
                {key}
              </td>
              <td className="px-4 py-3 text-[hsl(var(--foreground))] opacity-70">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductAttributesTable;
