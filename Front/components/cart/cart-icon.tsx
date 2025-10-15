"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import { getUserIdFromToken, getBasketByCustomerId, getCustomerIdByUserId } from "@/services/api"
import { useState } from "react"

export function CartIcon() {
  const { getTotalItems, loadBasketFromAPI } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const totalItems = getTotalItems()

  const handleCartClick = async () => {
    try {
      setLoading(true)
      
      // Получаем customerId из JWT токена
      const userId = getUserIdFromToken()
      
      if (!userId) {
        console.warn("ID не найден в JWT токене")
        router.push("/login")
        return
      }

      // Получаем customerId для этого пользователя
      const customerId = await getCustomerIdByUserId(userId)
      
      if (!customerId) {
        console.warn("CustomerId не найден для пользователя")
        router.push("/login")
        return
      }
      
      console.log("Используем customerId:", customerId)

      console.log("Загружаем корзину для customerId:", customerId)
      
      // Загружаем корзину из API используя GetBasketByCustomerId
      const basketData = await getBasketByCustomerId(customerId)
      
      // Обновляем локальную корзину данными из API
      if (loadBasketFromAPI) {
        loadBasketFromAPI(basketData)
      }
      
      // Переходим на страницу корзины
      router.push("/cart")
    } catch (error) {
      console.error("Ошибка загрузки корзины:", error)
      // В случае ошибки все равно переходим на страницу корзины
      router.push("/cart")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      className="relative bg-transparent" 
      onClick={handleCartClick}
      disabled={loading}
    >
      <span className="text-lg">🛒</span>
      {totalItems > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
          {totalItems}
        </Badge>
      )}
    </Button>
  )
}
