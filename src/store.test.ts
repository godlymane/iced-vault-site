import { describe, expect, it } from 'vitest'
import {
  addToCart,
  filterProducts,
  getCartTotals,
  getStockStatus,
  mergeSavedProducts,
  updateCartQuantity,
  updateInventory,
} from './store'
import type { CartItem, Product } from './store'

const products: Product[] = [
  {
    id: 'tennis-bracelet',
    name: 'Arctic Tennis Bracelet',
    category: 'bracelets',
    price: 420,
    stock: 3,
    certification: 'GRA Certified',
    stone: 'Moissanite',
    image: 'bracelet.jpg',
    description: 'Hand-set stones with a cold white finish.',
    drop: 'Test Drop',
    finish: 'White gold finish',
    specs: ['Test clasp', 'Test stones'],
    tags: ['gra certified', 'tennis', 'white gold'],
  },
  {
    id: 'cuban-chain',
    name: 'Frostline Cuban Link',
    category: 'chains',
    price: 680,
    stock: 0,
    certification: 'GRA Certified',
    stone: 'Moissanite',
    image: 'chain.jpg',
    description: 'Heavy curb profile with handset shine.',
    drop: 'Test Drop',
    finish: 'High polish finish',
    specs: ['Test links', 'Test clasp'],
    tags: ['gra certified', 'chain', 'streetwear'],
  },
]

describe('cart store', () => {
  it('adds an in-stock product to an empty cart', () => {
    expect(addToCart([], products, 'tennis-bracelet')).toEqual<CartItem[]>([
      { productId: 'tennis-bracelet', quantity: 1 },
    ])
  })

  it('clamps cart quantity to the product stock', () => {
    const cart = addToCart([], products, 'tennis-bracelet', 9)

    expect(cart).toEqual<CartItem[]>([
      { productId: 'tennis-bracelet', quantity: 3 },
    ])
  })

  it('does not add sold-out products', () => {
    expect(addToCart([], products, 'cuban-chain')).toEqual([])
  })

  it('updates quantities and removes items at zero', () => {
    const cart = [{ productId: 'tennis-bracelet', quantity: 2 }]

    expect(updateCartQuantity(cart, products, 'tennis-bracelet', 0)).toEqual([])
  })

  it('calculates item count and subtotal', () => {
    const totals = getCartTotals(
      [{ productId: 'tennis-bracelet', quantity: 2 }],
      products,
    )

    expect(totals).toEqual({ itemCount: 2, subtotal: 840 })
  })

  it('labels product urgency from available stock', () => {
    expect(getStockStatus({ ...products[0], stock: 0 })).toEqual({
      label: 'Sold out',
      tone: 'sold-out',
    })
    expect(getStockStatus({ ...products[0], stock: 2 })).toEqual({
      label: 'Final 2',
      tone: 'low',
    })
    expect(getStockStatus({ ...products[0], stock: 6 })).toEqual({
      label: '6 in vault',
      tone: 'ready',
    })
  })
})

describe('inventory and filters', () => {
  it('updates product stock and price without mutating the original list', () => {
    const updated = updateInventory(products, 'cuban-chain', {
      price: 725,
      stock: 5,
    })

    expect(updated.find((product) => product.id === 'cuban-chain')).toMatchObject({
      price: 725,
      stock: 5,
    })
    expect(products.find((product) => product.id === 'cuban-chain')).toMatchObject({
      price: 680,
      stock: 0,
    })
  })

  it('filters by category and search term', () => {
    expect(filterProducts(products, 'bracelets', 'arctic')).toHaveLength(1)
    expect(filterProducts(products, 'chains', 'arctic')).toHaveLength(0)
    expect(filterProducts(products, 'all', 'gra')).toHaveLength(2)
  })

  it('merges saved inventory edits into upgraded seed product data', () => {
    const upgraded = mergeSavedProducts(products, [
      {
        id: 'tennis-bracelet',
        name: 'Old Bracelet',
        category: 'bracelets',
        price: 999,
        stock: 1,
        certification: 'GRA Certified',
        stone: 'Old stone',
        image: 'old.jpg',
        description: 'Old copy',
        tags: ['old'],
      } as Product,
    ])

    expect(upgraded[0]).toMatchObject({
      id: 'tennis-bracelet',
      name: 'Arctic Tennis Bracelet',
      price: 999,
      stock: 1,
      image: 'bracelet.jpg',
    })
  })
})
