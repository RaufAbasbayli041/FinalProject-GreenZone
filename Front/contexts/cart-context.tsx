"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { CartItem, Product } from "@/lib/types"
import { storage } from "@/lib/storage"

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, area: number, installationRequired: boolean) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateArea: (productId: string, area: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getItemPrice: (item: CartItem, product: Product) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    // Загружаем корзину при инициализации
    const savedCart = storage.getCart()
    setItems(savedCart)
  }, [])

  useEffect(() => {
    // Сохраняем корзину при изменении
    storage.setCart(items)
  }, [items])

  const addToCart = (product: Product, area: number, installationRequired: boolean) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.productId === product.id && item.installationRequired === installationRequired,
      )

      if (existingItem) {
        // Если товар уже есть в корзине, увеличиваем площадь
        return prevItems.map((item) =>
          item.productId === product.id && item.installationRequired === installationRequired
            ? { ...item, area: item.area + area }
            : item,
        )
      } else {
        // Добавляем новый товар в корзину
        return [
          ...prevItems,
          {
            productId: product.id,
            quantity: 1,
            area,
            installationRequired,
          },
        ]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
  }

  const updateArea = (productId: string, area: number) => {
    if (area <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.productId === productId ? { ...item, area } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getItemPrice = (item: CartItem, product: Product) => {
    const basePrice = product.price * item.area * item.quantity
    const installationPrice = item.installationRequired ? 500 * item.area * item.quantity : 0
    return basePrice + installationPrice
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      // Нужно получить продукт для расчета цены
      const products = storage.getProducts()
      const product = products.find((p) => p.id === item.productId)
      if (!product) return total

      return total + getItemPrice(item, product)
    }, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateArea,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getItemPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
