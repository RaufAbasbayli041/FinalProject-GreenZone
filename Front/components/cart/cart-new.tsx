'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShoppingCart } from 'lucide-react'
import { useNotification } from '@/components/ui/notification-center'
import { 
  getMockBasket, 
  addMockItemToBasket, 
  removeMockItemFromBasket, 
  updateMockItemQuantity, 
  clearMockBasket,
  type MockBasket,
  type MockBasketItem 
} from '@/lib/mock-data'
import { getBasketByCustomerId } from '@/services/api'
import type { Basket } from '@/lib/types'
import Link from 'next/link'

interface CartNewProps {
  customerId: string
  onOrderPlaced?: () => void
}

export const CartNew: React.FC<CartNewProps> = ({ customerId, onOrderPlaced }) => {
  const [basket, setBasket] = useState<Basket | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    comment: ''
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  const { addNotification } = useNotification()

  useEffect(() => {
    loadBasket()
  }, [customerId])

  const loadBasket = async () => {
    try {
      setLoading(true)
      console.log('Загружаем корзину для customerId:', customerId)
      
      // Сначала пытаемся загрузить с реального API
      try {
        const basketData = await getBasketByCustomerId(customerId)
        console.log('Получена корзина с API:', basketData)
        
        // Загружаем данные о товарах для каждого элемента корзины
        if (basketData && basketData.basketItems) {
          const { fetchProducts, getProductById } = await import('@/services/api')
          const { mockProducts } = await import('@/lib/mock-data')
          
          let products
          try {
            products = await fetchProducts()
            console.log('Загружены продукты с API:', products.length, 'шт.')
            // Всегда добавляем mock продукты к API продуктам для fallback
            const allProducts = [...products, ...mockProducts]
            // Удаляем дубликаты по ID
            products = allProducts.filter((product, index, self) => 
              index === self.findIndex(p => p.id === product.id)
            )
            console.log('Объединенные продукты (API + mock):', products.length, 'шт.')
          } catch (error) {
            console.warn('API продуктов недоступен, используем mock данные:', error)
            products = mockProducts
          }
          
          console.log('ID продуктов:', products.map(p => p.id))
          console.log('Элементы корзины:', basketData.basketItems.map(item => item.productId))
          console.log('Mock продукты:', mockProducts.map(p => p.id))
          
          // Обновляем элементы корзины с данными о товарах
          const updatedBasketItems = await Promise.all(
            basketData.basketItems.map(async (item) => {
              console.log(`Обрабатываем элемент корзины: ${item.productId}`)
              let product = products.find(p => p.id === item.productId)
              console.log(`Поиск в products (${products.length} шт.):`, product ? 'найден' : 'не найден')
              
              // Если товар не найден в общем списке, пытаемся загрузить по ID
              if (!product) {
                console.warn(`Товар с ID ${item.productId} не найден в списке продуктов. Пытаемся загрузить по ID...`)
                try {
                  product = await getProductById(item.productId)
                  console.log(`Товар ${item.productId} успешно загружен по ID:`, product)
                } catch (error) {
                  console.warn(`Не удалось загрузить товар ${item.productId} по ID:`, error)
                  // Fallback: ищем в mock данных
                  console.log(`Ищем в mock данных (${mockProducts.length} шт.):`)
                  product = mockProducts.find(p => p.id === item.productId)
                  if (product) {
                    console.log(`Товар ${item.productId} найден в mock данных:`, product.title)
                  } else {
                    console.warn(`Товар ${item.productId} не найден ни в API, ни в mock данных`)
                    console.log('Доступные mock продукты:', mockProducts.map(p => ({ id: p.id, title: p.title })))
                    // Показываем уведомление пользователю о недоступном товаре
                    addNotification({
                      type: 'warning',
                      title: 'Товар недоступен',
                      message: `Товар с ID ${item.productId} больше не доступен и будет удален из корзины`
                    })
                  }
                }
              } else {
                console.log(`Товар ${item.productId} найден в общем списке:`, product.title)
              }
              
              const totalPrice = product ? product.pricePerSquareMeter * item.quantity : (item.totalPrice || 0)
              return {
                ...item,
                product: product || undefined,
                totalPrice: totalPrice
              }
            })
          )
          
          // Вычисляем общую сумму корзины
          const totalAmount = updatedBasketItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
          
          const updatedBasket = {
            ...basketData,
            basketItems: updatedBasketItems,
            totalAmount: totalAmount
          }
          
          console.log('Корзина с загруженными товарами:', updatedBasket)
          setBasket(updatedBasket)
        } else {
          setBasket(basketData)
        }
        return
      } catch (apiError) {
        console.log('API недоступен, используем mock данные:', apiError)
      }
      
      // Fallback к mock данным
      const mockBasketData = getMockBasket(customerId)
      setBasket(mockBasketData)
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error)
      addNotification({
        type: 'error',
        title: 'Ошибка загрузки',
        message: 'Не удалось загрузить корзину'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 0.1 || newQuantity > 999) return

    try {
      setUpdating(productId)
      console.log('Обновляем количество через API:', { customerId, productId, newQuantity })
      
      // Сначала пытаемся обновить через реальный API
      try {
        const { updateItemsInBasket, getBasketByCustomerId } = await import('@/services/api')
        await updateItemsInBasket(customerId, {
          productId: productId,
          quantity: newQuantity
        })
        
        // Получаем обновленную корзину
        const updatedBasket = await getBasketByCustomerId(customerId)
        setBasket(updatedBasket)
        
        addNotification({
          type: 'success',
          title: 'Количество обновлено',
          message: 'Количество м² изменено'
        })
        return
      } catch (apiError) {
        console.log('API недоступен, используем mock данные:', apiError)
      }
      
      // Fallback к mock данным
      const updatedBasket = updateMockItemQuantity(customerId, productId, newQuantity)
      setBasket(updatedBasket)
      
      addNotification({
        type: 'success',
        title: 'Количество обновлено',
        message: 'Количество м² изменено'
      })
    } catch (error) {
      console.error('Ошибка обновления количества:', error)
      addNotification({
        type: 'error',
        title: 'Ошибка обновления',
        message: 'Не удалось изменить количество'
      })
    } finally {
      setUpdating(null)
    }
  }

  const handleRemoveItem = async (productId: string, productName: string) => {
    try {
      setUpdating(productId)
      console.log('Удаляем товар через API:', { customerId, productId })
      
      // Сначала пытаемся удалить через реальный API
      try {
        const { removeItemsFromBasket, getBasketByCustomerId } = await import('@/services/api')
        await removeItemsFromBasket(customerId, productId, 999) // Большое число для полного удаления
        
        // Получаем обновленную корзину
        const updatedBasket = await getBasketByCustomerId(customerId)
        setBasket(updatedBasket)
        
        addNotification({
          type: 'success',
          title: 'Товар удален',
          message: `${productName} удален из корзины`
        })
        return
      } catch (apiError) {
        console.log('API недоступен, используем mock данные:', apiError)
      }
      
      // Fallback к mock данным
      const updatedBasket = removeMockItemFromBasket(customerId, productId, 1)
      setBasket(updatedBasket)
      
      addNotification({
        type: 'success',
        title: 'Товар удален',
        message: `${productName} удален из корзины`,
        onUndo: () => {
          // Восстанавливаем товар
          const restoredBasket = addMockItemToBasket(customerId, productId, 1)
          setBasket(restoredBasket)
        }
      })
    } catch (error) {
      console.error('Ошибка удаления товара:', error)
      addNotification({
        type: 'error',
        title: 'Ошибка удаления',
        message: 'Не удалось удалить товар'
      })
    } finally {
      setUpdating(null)
    }
  }

  const handleClearBasket = async () => {
    if (!basket || !basket.basketItems || basket.basketItems.length === 0) return
    
    const confirmed = window.confirm('Вы уверены, что хотите очистить корзину?')
    if (!confirmed) return

    try {
      console.log('Очищаем корзину через API:', { customerId })
      
      // Сначала пытаемся очистить через реальный API
      try {
        const { clearBasket, getBasketByCustomerId } = await import('@/services/api')
        await clearBasket(customerId)
        
        // Получаем обновленную корзину
        const clearedBasket = await getBasketByCustomerId(customerId)
        setBasket(clearedBasket)
        
        addNotification({
          type: 'success',
          title: 'Корзина очищена',
          message: 'Все товары удалены из корзины'
        })
        return
      } catch (apiError) {
        console.log('API недоступен, используем mock данные:', apiError)
      }
      
      // Fallback к mock данным
      const clearedBasket = clearMockBasket(customerId)
      setBasket(clearedBasket)
      
      addNotification({
        type: 'success',
        title: 'Корзина очищена',
        message: 'Все товары удалены из корзины'
      })
    } catch (error) {
      console.error('Ошибка очистки корзины:', error)
      addNotification({
        type: 'error',
        title: 'Ошибка очистки',
        message: 'Не удалось очистить корзину'
      })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!orderForm.name.trim()) {
      errors.name = 'Имя обязательно'
    }
    
    if (!orderForm.phone.trim()) {
      errors.phone = 'Телефон обязателен'
    } else if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(orderForm.phone)) {
      errors.phone = 'Неверный формат телефона'
    }
    
    if (!orderForm.email.trim()) {
      errors.email = 'Email обязателен'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderForm.email)) {
      errors.email = 'Неверный формат email'
    }
    
    if (!orderForm.address.trim()) {
      errors.address = 'Адрес обязателен'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      addNotification({
        type: 'error',
        title: 'Ошибка валидации',
        message: 'Пожалуйста, исправьте ошибки в форме'
      })
      return
    }

    try {
      // Имитируем отправку заказа
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      addNotification({
        type: 'success',
        title: 'Заказ оформлен!',
        message: 'Ваш заказ успешно отправлен'
      })
      
      // Очищаем корзину
      const clearedBasket = clearMockBasket(customerId)
      setBasket(clearedBasket)
      setShowOrderForm(false)
      
      if (onOrderPlaced) {
        onOrderPlaced()
      }
    } catch (error) {
      console.error('Ошибка оформления заказа:', error)
      addNotification({
        type: 'error',
        title: 'Ошибка заказа',
        message: 'Не удалось оформить заказ'
      })
    }
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length === 0) return ''
    if (numbers.length <= 1) return `+7 (${numbers.slice(1)}`
    if (numbers.length <= 4) return `+7 (${numbers.slice(1, 4)}`
    if (numbers.length <= 7) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}`
    if (numbers.length <= 9) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}`
    return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setOrderForm(prev => ({ ...prev, phone: formatted }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Загрузка корзины...</p>
        </div>
      </div>
    )
  }

  if (!basket || !basket.basketItems || basket.basketItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5]">
        <div className="container mx-auto px-8 py-8 max-w-4xl">
          <div className="text-center py-16">
            <ShoppingCart className="mx-auto h-24 w-24 text-[#6B7280] mb-6" />
            <h1 className="text-3xl font-bold text-[#1F2937] mb-4">Ваша корзина пуста</h1>
            <p className="text-[#6B7280] mb-8 text-lg">
              Добавьте товары в корзину, чтобы продолжить покупки
            </p>
            <Link href="/catalog">
              <Button className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-3 text-lg">
                Перейти в каталог
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!basket) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6B7280]">Ошибка загрузки корзины</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="container mx-auto px-8 py-8 max-w-6xl">
        {/* Кнопка очистки корзины */}
        <div className="flex justify-end mb-8">
          <Button
            variant="outline"
            onClick={handleClearBasket}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            Очистить корзину
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Список товаров */}
          <div className="lg:col-span-2 space-y-4">
            {basket.basketItems?.map((item) => {
              // Если товар не найден, показываем fallback информацию
              if (!item.product) {
                console.warn('Product not found for basket item:', item)
                return (
                  <Card key={item.id} className="bg-white shadow-sm border-[#E5E7EB] opacity-75">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 bg-[#E5E7EB] rounded-lg flex items-center justify-center">
                            <div className="w-16 h-16 bg-[#6B7280] rounded-full opacity-20"></div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-[#6B7280] mb-2">
                            Товар недоступен
                          </h3>
                          <p className="text-[#6B7280] text-sm mb-3">
                            ID: {item.productId}
                          </p>
                          <p className="text-[#1F2937] font-medium mb-4">
                            Количество: {item.quantity} м²
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-right">
                              <p className="text-xl font-bold text-[#1F2937]">
                                {(item.totalPrice || 0).toLocaleString()}₽
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.productId, 'Товар')}
                              disabled={updating === item.productId}
                              className="text-[#6B7280] hover:text-red-600 hover:bg-red-50 w-8 h-8 p-0"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              }
              
              return (
                <Card key={item.id} className="bg-white shadow-sm border-[#E5E7EB]">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Изображение товара */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 bg-[#E5E7EB] rounded-lg flex items-center justify-center">
                          <div className="w-16 h-16 bg-[#6B7280] rounded-full opacity-20"></div>
                        </div>
                      </div>

                      {/* Информация о товаре */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-[#1F2937] mb-2">
                          {item.product?.title || 'Товар'}
                        </h3>
                        <p className="text-[#6B7280] text-sm mb-3">
                          {item.product?.description || 'Описание недоступно'}
                        </p>
                        <p className="text-[#1F2937] font-medium mb-4">
                          {item.product?.pricePerSquareMeter?.toLocaleString() || '0'}₽/м²
                        </p>
                      
                      {/* Управление количеством */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.productId, Math.max(0.1, item.quantity - 0.1))}
                          disabled={updating === item.productId || item.quantity <= 0.1}
                          className="w-10 h-10 p-0 border-[#E5E7EB] hover:bg-[#FAF8F5]"
                        >
                          −
                        </Button>
                        
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, parseFloat(e.target.value) || 0.1)}
                          className="w-20 text-center border-[#E5E7EB] focus:border-[#10B981]"
                          disabled={updating === item.productId}
                          min="0.1"
                          max="999"
                          step="0.1"
                        />
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.productId, Math.min(999, item.quantity + 0.1))}
                          disabled={updating === item.productId || item.quantity >= 999}
                          className="w-10 h-10 p-0 border-[#E5E7EB] hover:bg-[#FAF8F5]"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Общая стоимость и удаление */}
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.productId, item.product?.title || 'Товар')}
                        disabled={updating === item.productId}
                        className="text-[#6B7280] hover:text-red-600 hover:bg-red-50 w-8 h-8 p-0"
                      >
                        ×
                      </Button>
                      
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#1F2937]">
                          {(item.totalPrice || 0).toLocaleString()}₽
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              )
            })}
          </div>

          {/* Итоговая панель */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm border-[#E5E7EB] sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#1F2937]">Итого</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Товары ({basket.basketItems?.length || 0})</span>
                  <span>{(basket.totalAmount || 0).toLocaleString()}₽</span>
                </div>
                
                <div className="flex justify-between text-[#6B7280]">
                  <span>Доставка</span>
                  <span className="text-[#10B981] font-medium">Бесплатно</span>
                </div>
                
                <div className="border-t border-[#E5E7EB] pt-4">
                  <div className="flex justify-between text-xl font-bold text-[#1F2937]">
                    <span>Общая сумма</span>
                    <span>{(basket.totalAmount || 0).toLocaleString()}₽</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-3 text-lg font-medium"
                  onClick={() => setShowOrderForm(true)}
                >
                  Оформить заказ
                </Button>
                
                <div className="text-center">
                  <Link href="/catalog" className="text-[#6B7280] hover:text-[#1F2937] text-sm">
                    Продолжить покупки
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Форма оформления заказа */}
        {showOrderForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#1F2937]">Оформление заказа</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1F2937] mb-1">
                      Имя *
                    </label>
                    <Input
                      value={orderForm.name}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, name: e.target.value }))}
                      className={formErrors.name ? 'border-red-500' : 'border-[#E5E7EB] focus:border-[#10B981]'}
                      placeholder="Введите ваше имя"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1F2937] mb-1">
                      Телефон *
                    </label>
                    <Input
                      value={orderForm.phone}
                      onChange={handlePhoneChange}
                      className={formErrors.phone ? 'border-red-500' : 'border-[#E5E7EB] focus:border-[#10B981]'}
                      placeholder="+7 (999) 999-99-99"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1F2937] mb-1">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={orderForm.email}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, email: e.target.value }))}
                      className={formErrors.email ? 'border-red-500' : 'border-[#E5E7EB] focus:border-[#10B981]'}
                      placeholder="example@email.com"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1F2937] mb-1">
                      Адрес доставки *
                    </label>
                    <Input
                      value={orderForm.address}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, address: e.target.value }))}
                      className={formErrors.address ? 'border-red-500' : 'border-[#E5E7EB] focus:border-[#10B981]'}
                      placeholder="Введите адрес доставки"
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1F2937] mb-1">
                      Комментарий
                    </label>
                    <textarea
                      value={orderForm.comment}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, comment: e.target.value }))}
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                      rows={3}
                      placeholder="Дополнительные пожелания"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowOrderForm(false)}
                      className="flex-1 border-[#E5E7EB] hover:bg-[#FAF8F5]"
                    >
                      Отмена
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white"
                    >
                      Отправить заказ
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
