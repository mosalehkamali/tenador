// Cart management using localStorage

const CART_KEY = 'cart'

export const getCart = () => {
  if (typeof window === 'undefined') return []
  const cart = localStorage.getItem(CART_KEY)
  return cart ? JSON.parse(cart) : []
}

const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export const addToCart = (product, quantity = 1) => {
  const cart = getCart()
  const existing = cart.find(item => item.product._id === product._id)
  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({
      productId: product._id,
      quantity,
      price: product.price,
      product
    })
  }
  saveCart(cart)
}

export const updateQuantity = (productId, quantity) => {
  const cart = getCart()
  const item = cart.find(item => item.product._id === productId)
  if (item) {
    item.quantity = quantity
    saveCart(cart)
  }
}

export const removeFromCart = (productId) => {
  const cart = getCart().filter(item => item.product._id !== productId)
  saveCart(cart)
}
