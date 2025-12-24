const ProductAttributesTable = ({ attributes }) => {
  return (
    <div className="animate-fade-in">
      <table className="w-full">
        <tbody>
          {attributes.map((attr, index) => (
            <tr
              key={index}
              className={`border-b border-border last:border-b-0 ${
                index % 2 === 0 ? "bg-muted/30" : ""
              }`}
            >
              <td className="px-4 py-3 text-sm font-medium text-foreground w-1/3">
                {attr.key}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {attr.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductAttributesTable;