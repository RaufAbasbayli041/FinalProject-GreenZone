"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { User, Shield, LogOut, Package, Truck } from 'lucide-react'
import { getUserIdFromToken, getCustomerIdByUserId, getOrdersByCustomerId, getDeliveriesByCustomerId } from '@/services/api'
import { getCustomerByUserId } from '@/services/customer-api'

export default function ProfilePage() {
  const { user, isAuthenticated, isAdmin, logout, getUserRoleFromToken } = useAuth()
  const router = useRouter()
  
  // Если пользователь админ, перенаправляем в админ-панель
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      console.log('Admin user detected, redirecting to admin panel')
      router.push('/admin')
    }
  }, [isAuthenticated, isAdmin, router])
  
  // State for orders and deliveries
  const [orders, setOrders] = useState<any[]>([])
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // Function to fetch user data, orders and deliveries
  const fetchUserDataAndOrders = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const userId = getUserIdFromToken()
      
      // Fetch customer data, orders, and deliveries
      const [customerDataResult] = await Promise.allSettled([
        userId ? getCustomerByUserId(userId).catch((err) => {
          console.log('API клиента недоступен (404):', err.message)
          return null
        }) : Promise.resolve(null)
      ])

      // Get customer data
      const customerData = customerDataResult.status === 'fulfilled' ? customerDataResult.value : null
      
      // Try to fetch orders and deliveries using different approaches
      let userOrders: any[] = []
      let userDeliveries: any[] = []
      
      if (customerData?.id) {
        try {
          // Try to get orders by customer ID using the UI endpoint
          console.log('Попытка загрузить заказы по customerId через /api/Order/customer/...')
          userOrders = await getOrdersByCustomerId(customerData.id)
          console.log(`Найдено заказов для клиента: ${userOrders.length}`)
        } catch (orderError) {
          console.log('Не удалось загрузить заказы через getOrdersByCustomerId:', orderError.message)
          userOrders = []
        }
        
        try {
          // Try to get deliveries by customer ID using the UI endpoint
          console.log('Попытка загрузить доставки по customerId через /api/Delivery/customer/...')
          userDeliveries = await getDeliveriesByCustomerId(customerData.id)
          console.log(`Найдено доставок для клиента: ${userDeliveries.length}`)
        } catch (deliveryError) {
          console.log('Не удалось загрузить доставки через getDeliveriesByCustomerId:', deliveryError.message)
          userDeliveries = []
        }
      }
      
      // Merge user data (customer data takes priority over context user)
      const mergedUserData = {
        ...user,
        ...customerData,
        // Ensure we have the most complete data
        email: customerData?.email || user?.email,
        firstName: customerData?.firstName || user?.firstName,
        lastName: customerData?.lastName || user?.lastName,
        phoneNumber: customerData?.phoneNumber || user?.phoneNumber,
        name: user?.name || `${customerData?.firstName || ''} ${customerData?.lastName || ''}`.trim() || 'Пользователь',
        // Create customer username from email or firstName + lastName
        customerUsername: customerData?.email || `${customerData?.firstName || ''}${customerData?.lastName || ''}`.toLowerCase() || user?.name
      }

      setUserData(mergedUserData)
      setOrders(userOrders)
      setDeliveries(userDeliveries)
      
      // Debug logging
      console.log('Profile data loaded:', {
        user: user,
        customerData: customerData,
        mergedUserData: mergedUserData,
        username: mergedUserData.name,
        customerUsername: mergedUserData.customerUsername,
        orders: userOrders,
        deliveries: userDeliveries,
        customerId: customerData?.id
      })
      
      // Set informational message
      if (customerData) {
        setError(`Данные пользователя загружены из API. Найдено заказов: ${userOrders.length}, доставок: ${userDeliveries.length}`)
      } else {
        setError('Данные пользователя загружены из локального хранилища. API клиента недоступен.')
      }
    } catch (error: any) {
      console.error('Общая ошибка загрузки данных:', error)
      setError('Ошибка загрузки данных. Проверьте подключение к серверу.')
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserDataAndOrders()
    }
  }, [isAuthenticated])

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Профиль пользователя
            </CardTitle>
            <CardDescription>Информация о текущем пользователе</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Основная информация */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold mb-4">Основная информация</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Имя пользователя</label>
                    <p className="text-lg">{userData?.name || user?.name || 'Не указано'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg">{userData?.customerUsername || userData?.email || user?.email || 'Не указано'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Имя</label>
                    <p className="text-lg">{userData?.firstName || user?.firstName || 'Не указано'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Фамилия</label>
                    <p className="text-lg">{userData?.lastName || user?.lastName || 'Не указано'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Телефон</label>
                    <p className="text-lg">{userData?.phoneNumber || user?.phoneNumber || 'Не указано'}</p>
                  </div>
                </div>
              </div>

            </div>


            {/* Заказы и доставки */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Заказы */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Мои заказы ({orders.length})
                  </CardTitle>
                  <CardDescription>История ваших заказов</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-gray-500">Загрузка...</p>
                  ) : orders.length > 0 ? (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order, index) => (
                        <div key={order.id || index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Заказ #{order.id?.substring(0, 8) || `#${index + 1}`}</p>
                              <p className="text-sm text-gray-600">
                                {order.orderStatus?.name || order.status?.name || 'Статус не указан'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Адрес: {order.shippingAddress || 'Не указан'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{order.totalAmount || 0} ₼</p>
                              <p className="text-sm text-gray-600">
                                {order.orderDate ? new Date(order.orderDate).toLocaleDateString('ru-RU') : 'Дата не указана'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Товаров: {order.orderItems?.length || 0}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {orders.length > 5 && (
                        <p className="text-sm text-gray-500 text-center">
                          ... и еще {orders.length - 5} заказов
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-2">У вас пока нет заказов</p>
                      <p className="text-xs text-gray-400">
                        Заказы загружаются из API по вашему customerId.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Доставки */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Доставки ({deliveries.length})
                  </CardTitle>
                  <CardDescription>Информация о доставках</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-gray-500">Загрузка...</p>
                  ) : deliveries.length > 0 ? (
                    <div className="space-y-3">
                      {deliveries.slice(0, 5).map((delivery, index) => (
                        <div key={delivery.id || index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Доставка #{delivery.id?.substring(0, 8) || `#${index + 1}`}</p>
                              <p className="text-sm text-gray-600">
                                Статус: {delivery.statusName || 'Статус не указан'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Заказ: #{delivery.orderId?.substring(0, 8) || 'Не указан'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                Создано: {delivery.createdAt ? new Date(delivery.createdAt).toLocaleDateString('ru-RU') : 'Дата не указана'}
                              </p>
                              <p className="text-sm text-gray-600">
                                {delivery.deliveredAt ? `Доставлено: ${new Date(delivery.deliveredAt).toLocaleDateString('ru-RU')}` : 'В процессе'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {deliveries.length > 5 && (
                        <p className="text-sm text-gray-500 text-center">
                          ... и еще {deliveries.length - 5} доставок
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-2">Доставки не найдены</p>
                      <p className="text-xs text-gray-400">
                        Доставки загружаются из API по вашим заказам.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Действия */}
            <div className="flex gap-4">
              {isAdmin && (
                <Button onClick={() => router.push('/admin')} className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Админ-панель
                </Button>
              )}
              <Button variant="outline" onClick={() => router.push('/')} className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Главная страница
              </Button>
              <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Выйти
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}