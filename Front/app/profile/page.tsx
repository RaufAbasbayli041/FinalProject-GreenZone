"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { User, Shield, LogOut, Package, Truck, Calendar, MapPin, Phone, Mail } from 'lucide-react'
import { getCustomerOrders, getCustomerDeliveries } from '@/services/api'
import { Order, Delivery } from '@/lib/types'
import { Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      loadUserData()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, isAdmin])

  const loadUserData = async () => {
    try {
      setLoading(true)
      // Загружаем заказы и доставки пользователя
      const [ordersData, deliveriesData] = await Promise.all([
        getCustomerOrders().catch(() => []),
        getCustomerDeliveries().catch(() => [])
      ])
      
      setOrders(ordersData)
      setDeliveries(deliveriesData)
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
      'Pending': { variant: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
      'Processing': { variant: 'default', color: 'bg-blue-100 text-blue-800' },
      'Shipped': { variant: 'outline', color: 'bg-green-100 text-green-800' },
      'Delivered': { variant: 'default', color: 'bg-green-100 text-green-800' },
      'Cancelled': { variant: 'destructive', color: 'bg-red-100 text-red-800' },
    }

    const statusConfig = statusMap[status] || { variant: 'outline', color: 'bg-gray-100 text-gray-800' }

    return (
      <Badge variant={statusConfig.variant} className={statusConfig.color}>
        {status}
      </Badge>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Не авторизован</CardTitle>
            <CardDescription>Войдите в систему для просмотра профиля</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/login')} className="w-full">
              Войти
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Основная информация */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Профиль пользователя
            </CardTitle>
            <CardDescription>Основная информация о вашем аккаунте</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold mb-4">Личная информация</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Имя пользователя</label>
                      <p className="text-lg font-medium">{user?.name || 'Не указано'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-lg font-medium">{user?.email || 'Не указано'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Телефон</label>
                      <p className="text-lg font-medium">{user?.phoneNumber || 'Не указано'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Роль и права</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Роль</label>
                    <div className="mt-1">
                      <Badge variant={isAdmin ? "default" : "secondary"} className="text-sm">
                        {isAdmin ? 'Администратор' : 'Клиент'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Статус</label>
                    <div className="mt-1">
                      <Badge variant="outline" className="text-sm">
                        Активный пользователь
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Кнопка для админа */}
            {isAdmin && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Административные функции</h3>
                <Button 
                  onClick={() => router.push('/admin')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Перейти в админ панель
                </Button>
              </div>
            )}

            {/* Действия */}
            <div className="border-t pt-6 flex gap-4">
              <Button 
                onClick={handleLogout} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Выйти
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Заказы */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Мои заказы
            </CardTitle>
            <CardDescription>История ваших заказов</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">Заказ #{order.id.slice(-6)}</h4>
                        <p className="text-sm text-gray-500">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {new Date(order.orderDate).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{order.totalAmount.toLocaleString()} ₽</p>
                        {getStatusBadge(order.status?.name || 'Неизвестно')}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Адрес доставки:</p>
                        <p className="font-medium">{order.shippingAddress || 'Не указан'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Количество товаров:</p>
                        <p className="font-medium">{order.items?.length || 0} шт.</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>У вас пока нет заказов</p>
                <Button 
                  onClick={() => router.push('/catalog')} 
                  className="mt-4"
                >
                  Перейти к каталогу
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Доставки */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Доставки
            </CardTitle>
            <CardDescription>Информация о доставках ваших заказов</CardDescription>
          </CardHeader>
          <CardContent>
            {deliveries.length > 0 ? (
              <div className="space-y-4">
                {deliveries.map((delivery) => (
                  <div key={delivery.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">Доставка #{delivery.id.slice(-6)}</h4>
                        <p className="text-sm text-gray-500">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {new Date(delivery.deliveryDate).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(delivery.status || 'В обработке')}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Адрес доставки:</p>
                        <p className="font-medium flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {delivery.deliveryAddress || 'Не указан'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Номер заказа:</p>
                        <p className="font-medium">{delivery.orderNumber || 'Не указан'}</p>
                      </div>
                    </div>
                    {delivery.notes && (
                      <div className="mt-3">
                        <p className="text-gray-500">Примечания:</p>
                        <p className="font-medium">{delivery.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Информация о доставках появится после оформления заказов</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}