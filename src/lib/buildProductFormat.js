
export function buildProductFormat(category) {
    if (!category || !Array.isArray(category.attributes)) {
      throw new Error('Invalid category');
    }
  
    return {
      title: '',
      price: 0,
      category: category._id,
      attributes: category.attributes.map(attr => ({
        attribute: attr._id,
        value: attr.defaultValue ?? null,
      })),
      variants: [],
      isActive: true,
    };
  }
  