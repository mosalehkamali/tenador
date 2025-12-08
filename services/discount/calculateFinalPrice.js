/* services/discount/calculateFinalPrice.js */

export function calculateFinalPrice(product, discount) {
    if (!product || typeof product.price !== "number") {
      throw new Error("Invalid product data for price calculation");
    }
  
    const basePrice = product.price;
    let finalPrice = basePrice;
  
    if (discount) {
      switch (discount.type) {
        case "percentage":
          finalPrice = basePrice - (basePrice * (discount.value / 100));
          break;
  
        case "fixed":
          finalPrice = basePrice - discount.value;
          break;
  
        case "flash":
          finalPrice = discount.specialPrice;
          break;
  
        case "tiered":
          finalPrice = calculateTieredPrice(basePrice, discount.rules);
          break;
  
        default:
          break;
      }
    }
  
    if (finalPrice < 0) finalPrice = 0;
  
    return Math.round(finalPrice);
  }
  
  function calculateTieredPrice(basePrice, rules = []) {
    if (!rules.length) return basePrice;
  
    let bestPrice = basePrice;
  
    for (const rule of rules) {
      if (rule.type === "percentage") {
        const discounted = basePrice - (basePrice * (rule.value / 100));
        if (discounted < bestPrice) bestPrice = discounted;
      }
      if (rule.type === "fixed") {
        const discounted = basePrice - rule.value;
        if (discounted < bestPrice) bestPrice = discounted;
      }
    }
  
    return bestPrice;
  }
  