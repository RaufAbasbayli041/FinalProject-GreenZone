'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react'
import { getBasketByCustomerId, addItemsToBasket, removeItemsFromBasket, updateItemsInBasket, clearBasket } from '@/services/api'
import type { Basket, BasketItem, Product } from '@/lib/types'

interface CartProps {
  customerId: string
  onOrderPlaced?: () => void
}

export const Cart: React.FC<CartProps> = ({ customerId, onOrderPlaced }) => {
  const [basket, setBasket] = useState<Basket | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    loadBasket()
  }, [customerId])

  const loadBasket = async () => {
    try {
      setLoading(true)
      const basketData = await getBasketByCustomerId(customerId)
      setBasket(basketData)
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      setUpdating(productId)
      const item = basket?.items.find(i => i.productId === productId)
      if (!item) return

      await updateItemsInBasket(customerId, {
        productId: productId,
        quantity: newQuantity
      })
      
      await loadBasket() // Перезагружаем корзину
    } catch (error) {
      console.error('Ошибка обновления количества:', error)
    } finally {
      setUpdating(null)
    }
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      setUpdating(productId)
      const item = basket?.items.find(i => i.productId === productId)
      if (!item) return

      await removeItemsFromBasket(customerId, productId, item.quantity)
      await loadBasket() // Перезагружаем корзину
    } catch (error) {
      console.error('Ошибка удаления товара:', error)
    } finally {
      setUpdating(null)
    }
  }

  const handleClearBasket = async () => {
    try {
      await clearBasket(customerId)
      await loadBasket() // Перезагружаем корзину
    } catch (error) {
      console.error('Ошибка очистки корзины:', error)
    }
  }

  const handleCheckout = () => {
    // Здесь можно добавить логику оформления заказа
    if (onOrderPlaced) {
      onOrderPlaced()
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Загрузка корзины...</p>
        </div>
      </div>
    )
  }

  if (!basket || basket.items.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">В корзине нет продуктов</h3>
            <p className="text-muted-foreground mb-6">Добавьте товары в корзину, чтобы продолжить покупки</p>
            <Button onClick={() => window.location.href = '/'}>
              Перейти к покупкам
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Список товаров */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Корзина ({basket.items.length} товаров)</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearBasket}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Очистить
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {basket.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.product?.title || 'Товар'}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.product?.description || 'Описание недоступно'}
                    </p>
                    <p className="text-sm font-medium">
                      {item.product?.pricePerSquareMeter || 0}₽/м²
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      disabled={updating === item.productId || item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                      className="w-16 text-center"
                      disabled={updating === item.productId}
                      min="1"
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      disabled={updating === item.productId}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">
                      {((item.product?.pricePerSquareMeter || 0) * item.quantity).toFixed(2)}₽
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.productId)}
                      disabled={updating === item.productId}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Итого */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Итого</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Товары ({basket.items.length})</span>
                <span>{basket.totalAmount.toFixed(2)}₽</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Общая сумма</span>
                <span>{basket.totalAmount.toFixed(2)}₽</span>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCheckout}
              >
                Оформить заказ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

