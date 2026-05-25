export type ProductCategory = 'chains' | 'bracelets' | 'rings' | 'earrings' | 'watches'

export type ProductFilter = ProductCategory | 'all'

export type Product = {
  id: string
  name: string
  category: ProductCategory
  price: number
  stock: number
  certification: 'GRA Certified'
  stone: string
  image: string
  description: string
  drop: string
  finish: string
  certificateId?: string
  certificateDate?: string
  carat?: string
  cut?: string
  clarity?: string
  specs: string[]
  tags: string[]
}

export type CartItem = {
  productId: string
  quantity: number
}

export type CartTotals = {
  itemCount: number
  subtotal: number
}

export type StockStatus = {
  label: string
  tone: 'ready' | 'low' | 'sold-out'
}

export function findProduct(products: Product[], productId: string) {
  return products.find((product) => product.id === productId)
}

export function getStockStatus(product: Pick<Product, 'stock'>): StockStatus {
  if (product.stock < 1) {
    return { label: 'Sold out', tone: 'sold-out' }
  }

  if (product.stock <= 3) {
    return { label: `Final ${product.stock}`, tone: 'low' }
  }

  return { label: `${product.stock} in vault`, tone: 'ready' }
}

export function addToCart(
  cart: CartItem[],
  products: Product[],
  productId: string,
  quantity = 1,
): CartItem[] {
  const product = findProduct(products, productId)

  if (!product || product.stock < 1 || quantity < 1) {
    return cart
  }

  const existing = cart.find((item) => item.productId === productId)
  const nextQuantity = Math.min((existing?.quantity ?? 0) + quantity, product.stock)

  if (!existing) {
    return [...cart, { productId, quantity: nextQuantity }]
  }

  return cart.map((item) =>
    item.productId === productId ? { ...item, quantity: nextQuantity } : item,
  )
}

export function updateCartQuantity(
  cart: CartItem[],
  products: Product[],
  productId: string,
  quantity: number,
): CartItem[] {
  if (quantity < 1) {
    return cart.filter((item) => item.productId !== productId)
  }

  const product = findProduct(products, productId)

  if (!product || product.stock < 1) {
    return cart.filter((item) => item.productId !== productId)
  }

  const nextQuantity = Math.min(quantity, product.stock)

  return cart.map((item) =>
    item.productId === productId ? { ...item, quantity: nextQuantity } : item,
  )
}

export function removeFromCart(cart: CartItem[], productId: string): CartItem[] {
  return cart.filter((item) => item.productId !== productId)
}

export function getCartTotals(cart: CartItem[], products: Product[]): CartTotals {
  return cart.reduce<CartTotals>(
    (totals, item) => {
      const product = findProduct(products, item.productId)

      if (!product) {
        return totals
      }

      return {
        itemCount: totals.itemCount + item.quantity,
        subtotal: totals.subtotal + product.price * item.quantity,
      }
    },
    { itemCount: 0, subtotal: 0 },
  )
}

export function updateInventory(
  products: Product[],
  productId: string,
  patch: Partial<Pick<Product, 'price' | 'stock'>>,
): Product[] {
  return products.map((product) => {
    if (product.id !== productId) {
      return product
    }

    return {
      ...product,
      price:
        patch.price === undefined
          ? product.price
          : Math.max(0, Math.round(patch.price)),
      stock:
        patch.stock === undefined
          ? product.stock
          : Math.max(0, Math.round(patch.stock)),
    }
  })
}

export function mergeSavedProducts(seedProducts: Product[], savedProducts: Product[]): Product[] {
  return seedProducts.map((seedProduct) => {
    const savedProduct = savedProducts.find((product) => product.id === seedProduct.id)

    if (!savedProduct) {
      return seedProduct
    }

    return {
      ...seedProduct,
      price: Number.isFinite(savedProduct.price) ? savedProduct.price : seedProduct.price,
      stock: Number.isFinite(savedProduct.stock) ? savedProduct.stock : seedProduct.stock,
    }
  })
}

export function filterProducts(
  products: Product[],
  filter: ProductFilter,
  searchTerm: string,
): Product[] {
  const query = searchTerm.trim().toLowerCase()

  return products.filter((product) => {
    const categoryMatches = filter === 'all' || product.category === filter
    const searchable = [
      product.name,
      product.category,
      product.certification,
      product.stone,
      product.description,
      ...product.tags,
    ]
      .join(' ')
      .toLowerCase()

    return categoryMatches && (!query || searchable.includes(query))
  })
}
