"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, ShoppingCart } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

// Mock data
const mockCustomer = {
  id: 1,
  firstName: 'Иван',
  lastName: 'Петров',
  email: 'ivan@example.com',
  phone: '+7 (495) 123-45-67',
  address: 'Москва, ул. Примерная, 123',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z'
}

const mockCustomerOrders = [
  {
    id: 1,
    orderNumber: 'GZ-001',
    orderDate: '2024-01-15',
    totalAmount: 45000,
    orderStatusName: 'Новый'
  },
  {
    id: 2,
    orderNumber: 'GZ-005',
    orderDate: '2024-01-10',
    totalAmount: 32000,
    orderStatusName: 'Доставлен'
  }
]

export default function CustomerView() {
  const router = useRouter()
  const params = useParams()
  const { isAdmin } = useAuth()
  const customerId = params?.id

  if (!isAdmin) {
    router.push('/')
    return null
  }

  // В реальном приложении здесь будет загрузка данных по customerId
  const customer = mockCustomer
  const customerOrders = mockCustomerOrders

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin/customers')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-gray-600">Информация о клиенте</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Личная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Имя</p>
                  <p className="text-lg font-semibold">{customer.firstName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Фамилия</p>
                  <p className="text-lg font-semibold">{customer.lastName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{customer.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Телефон</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{customer.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          {customer.address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Адрес
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{customer.address}</p>
              </CardContent>
            </Card>
          )}

          {/* Registration Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Информация о регистрации
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Дата регистрации</p>
                  <p className="text-sm">
                    {new Date(customer.createdAt).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {customer.updatedAt && customer.updatedAt !== customer.createdAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Последнее обновление</p>
                    <p className="text-sm">
                      {new Date(customer.updatedAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Статистика клиента</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Всего заказов</span>
                </div>
                <Badge variant="outline">{customerOrders.length}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Общая сумма</span>
                </div>
                <span className="text-sm font-medium">
                  {customerOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()} ₽
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Последние заказы</CardTitle>
            </CardHeader>
            <CardContent>
              {customerOrders.length > 0 ? (
                <div className="space-y-3">
                  {customerOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">#{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.orderDate).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{order.totalAmount.toLocaleString()} ₽</p>
                        <Badge variant="outline" className="text-xs">
                          {order.orderStatusName}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  У клиента пока нет заказов
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
