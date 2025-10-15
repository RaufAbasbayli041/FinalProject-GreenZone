"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { User, Shield, LogOut, Package, Truck } from 'lucide-react'
import { getUserIdFromToken, getCustomerIdByUserId } from '@/services/api'
import { getCustomerByUserId } from '@/services/customer-api'

export default function ProfilePage() {
  const { user, isAuthenticated, isAdmin, logout, getUserRoleFromToken } = useAuth()
  const router = useRouter()
  
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
      
      // Fetch customer data only (getCurrentUser endpoint doesn't exist)
      const customerDataResult = await Promise.allSettled([
        userId ? getCustomerByUserId(userId).catch((err) => {
          console.log('API клиента недоступен (404):', err.message)
          return null
        }) : Promise.resolve(null)
      ])

      // Get customer data
      const customerData = customerDataResult[0].status === 'fulfilled' ? customerDataResult[0].value : null
      
      // Merge user data (customer data takes priority over context user)
      const mergedUserData = {
        ...user,
        ...customerData,
        // Ensure we have the most complete data
        email: customerData?.email || user?.email,
        firstName: customerData?.firstName || user?.firstName,
        lastName: customerData?.lastName || user?.lastName,
        phoneNumber: customerData?.phoneNumber || user?.phoneNumber
      }

      setUserData(mergedUserData)
      
      // Set empty arrays for orders and deliveries since API endpoints are not available
      setOrders([])
      setDeliveries([])
      
      // Set informational message
      if (customerData) {
        setError('Данные пользователя загружены из API. Заказы и доставки будут доступны после настройки соответствующих endpoints.')
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
                    <p className="text-lg">{userData?.email || user?.email || 'Не указано'}</p>
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

            {/* Информация о статусе API */}
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm">
                      <strong>Информация:</strong> {error}
                    </p>
                    <p className="text-xs mt-1">
                      Данные пользователя загружены из API. Заказы и доставки загружаются по customerId.
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : orders.length > 0 ? (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order, index) => (
                        <div key={order.id || index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Заказ #{order.id}</p>
                              <p className="text-sm text-gray-600">
                                {order.status?.name || 'Статус не указан'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{order.totalAmount || 0} ₼</p>
                              <p className="text-sm text-gray-600">
                                {order.orderDate ? new Date(order.orderDate).toLocaleDateString('ru-RU') : 'Дата не указана'}
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
                        Заказы загружаются по вашему customerId из API.
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
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : deliveries.length > 0 ? (
                    <div className="space-y-3">
                      {deliveries.slice(0, 5).map((delivery, index) => (
                        <div key={delivery.id || index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Доставка #{delivery.id}</p>
                              <p className="text-sm text-gray-600">
                                {delivery.status || 'Статус не указан'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                {delivery.address || 'Адрес не указан'}
                              </p>
                              <p className="text-sm text-gray-600">
                                {delivery.deliveryDate ? new Date(delivery.deliveryDate).toLocaleDateString('ru-RU') : 'Дата не указана'}
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
                        Доставки загружаются по заказам вашего customerId из API.
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