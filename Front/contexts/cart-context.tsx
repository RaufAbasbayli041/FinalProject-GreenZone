"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { CartItem, Product } from "@/lib/types"
import { storage } from "@/lib/storage"

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, area: number, installationRequired: boolean) => Promise<void>
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateArea: (productId: string, area: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getItemPrice: (item: CartItem, product: Product) => number
  loadBasketFromAPI: (basketData: any) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    // Загружаем корзину при инициализации
    const loadCart = async () => {
      try {
        // Сначала пытаемся загрузить с сервера
        const { getUserIdFromToken, getCustomerIdByUserId, getBasketByCustomerId } = await import('@/services/api')
        const userId = getUserIdFromToken()
        
        if (userId) {
          const customerId = await getCustomerIdByUserId(userId)
          if (customerId) {
            console.log('Загружаем корзину для customerId:', customerId)
            const basket = await getBasketByCustomerId(customerId)
            console.log('Получена корзина с сервера:', basket)
            
            if (basket && basket.basketItems && basket.basketItems.length > 0) {
              const serverItems = basket.basketItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                area: item.quantity, // quantity в API = area в UI
                installationRequired: false
              }))
              console.log('Синхронизируем с серверными данными:', serverItems)
              setItems(serverItems)
              return
            } else {
              console.log('Корзина пуста на сервере')
              setItems([])
              return
            }
          }
        }
      } catch (error) {
        console.log('Не удалось загрузить корзину с сервера, используем локальную:', error)
      }
      
      // Fallback к локальному хранилищу
      const savedCart = storage.getCart()
      setItems(savedCart)
    }
    
    loadCart()
  }, [])

  useEffect(() => {
    // Сохраняем корзину при изменении
    storage.setCart(items)
  }, [items])

  const addToCart = async (product: Product, area: number, installationRequired: boolean) => {
    try {
      // Получаем ID из токена
        const { getUserIdFromToken, getCustomerIdByUserId, addItemsToBasket, getBasketByCustomerId } = await import('@/services/api')
        const userId = getUserIdFromToken()
        
        if (userId) {
          const customerId = await getCustomerIdByUserId(userId)
          if (customerId) {
            console.log('Добавляем в корзину через API:', { customerId, productId: product.id, area })
            
            // Синхронизируем с API - используем area как quantity
            await addItemsToBasket(customerId, {
              basketId: customerId, // Используем customerId как basketId
              productId: product.id,
              quantity: area // area = quantity в API
            })
            
            // Получаем обновленную корзину с сервера
            try {
              const updatedBasket = await getBasketByCustomerId(customerId)
            console.log('Обновленная корзина с сервера:', updatedBasket)
            
            if (updatedBasket && updatedBasket.basketItems) {
              // Синхронизируем локальное состояние с сервером
              const serverItems = updatedBasket.basketItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                area: item.quantity, // quantity в API = area в UI
                installationRequired: false // По умолчанию, можно расширить логику
              }))
              console.log('Синхронизируем локальное состояние:', serverItems)
              setItems(serverItems)
              return // Выходим, так как состояние уже обновлено с сервера
            }
          } catch (basketError) {
            console.log('Не удалось получить обновленную корзину:', basketError)
            // Продолжаем с локальным обновлением
          }
        }
      }
      
      // Обновляем локальное состояние как fallback
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
    } catch (error) {
      console.error("Ошибка добавления в корзину:", error)
      // В случае ошибки API все равно добавляем локально
      setItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.productId === product.id && item.installationRequired === installationRequired,
        )

        if (existingItem) {
          return prevItems.map((item) =>
            item.productId === product.id && item.installationRequired === installationRequired
              ? { ...item, area: item.area + area }
              : item,
          )
        } else {
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
  }

  const removeFromCart = async (productId: string) => {
    try {
      // Получаем ID из токена
      const { getUserIdFromToken, getCustomerIdByUserId, removeItemsFromBasket, getBasketByCustomerId } = await import('@/services/api')
      const userId = getUserIdFromToken()
      
      if (userId) {
        const customerId = await getCustomerIdByUserId(userId)
        if (customerId) {
          console.log('Удаляем из корзины через API:', { customerId, productId })
          
          // Удаляем из API - удаляем все количество товара
          await removeItemsFromBasket(customerId, productId, 999) // Большое число для полного удаления
          
          // Получаем обновленную корзину с сервера
          try {
            const updatedBasket = await getBasketByCustomerId(customerId)
            console.log('Обновленная корзина после удаления:', updatedBasket)
            
            if (updatedBasket && updatedBasket.basketItems) {
              // Синхронизируем локальное состояние с сервером
              const serverItems = updatedBasket.basketItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                area: item.quantity,
                installationRequired: false
              }))
              console.log('Синхронизируем после удаления:', serverItems)
              setItems(serverItems)
              return // Выходим, так как состояние уже обновлено с сервера
            } else {
              // Корзина пуста
              setItems([])
              return
            }
          } catch (basketError) {
            console.log('Не удалось получить обновленную корзину:', basketError)
            // Продолжаем с локальным обновлением
          }
        }
      }
    } catch (error) {
      console.error("Ошибка удаления из корзины:", error)
    }
    
    // Локальное обновление как fallback
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
  }

  const updateArea = async (productId: string, area: number) => {
    if (area <= 0) {
      removeFromCart(productId)
      return
    }

    try {
      // Получаем ID из токена
      const { getUserIdFromToken, getCustomerIdByUserId, updateItemsInBasket, getBasketByCustomerId } = await import('@/services/api')
      const userId = getUserIdFromToken()
      
      if (userId) {
        const customerId = await getCustomerIdByUserId(userId)
        if (customerId) {
          console.log('Обновляем количество через API:', { customerId, productId, area })
          
          // Обновляем через API
          await updateItemsInBasket(customerId, {
            productId: productId,
            quantity: area // area = quantity в API
          })
          
          // Получаем обновленную корзину с сервера
          try {
            const updatedBasket = await getBasketByCustomerId(customerId)
            console.log('Обновленная корзина после изменения количества:', updatedBasket)
            
            if (updatedBasket && updatedBasket.basketItems) {
              // Синхронизируем локальное состояние с сервером
              const serverItems = updatedBasket.basketItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                area: item.quantity,
                installationRequired: false
              }))
              console.log('Синхронизируем после обновления количества:', serverItems)
              setItems(serverItems)
              return // Выходим, так как состояние уже обновлено с сервера
            }
          } catch (basketError) {
            console.log('Не удалось получить обновленную корзину:', basketError)
            // Продолжаем с локальным обновлением
          }
        }
      }
    } catch (error) {
      console.error("Ошибка обновления количества:", error)
    }

    // Локальное обновление как fallback
    setItems((prevItems) => prevItems.map((item) => (item.productId === productId ? { ...item, area } : item)))
  }

  const clearCart = async () => {
    try {
      // Получаем ID из токена
      const { getUserIdFromToken, getCustomerIdByUserId, clearBasket } = await import('@/services/api')
      const userId = getUserIdFromToken()
      
      if (userId) {
        const customerId = await getCustomerIdByUserId(userId)
        if (customerId) {
          console.log('Очищаем корзину через API:', { customerId })
          
          // Очищаем через API
          await clearBasket(customerId)
        }
      }
    } catch (error) {
      console.error("Ошибка очистки корзины:", error)
    }
    
    // Локальная очистка
    setItems([])
  }

  const getTotalItems = () => {
    return items.length
  }

  const getItemPrice = (item: CartItem, product: Product) => {
    const basePrice = product.pricePerSquareMeter * item.area * item.quantity
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

  const loadBasketFromAPI = (basketData: any) => {
    try {
      // Преобразуем данные корзины из API в формат CartItem
      if (basketData && basketData.items) {
        const apiItems: CartItem[] = basketData.items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity || 1,
          area: item.area || 1,
          installationRequired: item.installationRequired || false
        }))
        setItems(apiItems)
      } else {
        // Если корзина пуста или данных нет
        setItems([])
      }
    } catch (error) {
      console.error("Ошибка загрузки корзины из API:", error)
    }
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
        loadBasketFromAPI,
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
