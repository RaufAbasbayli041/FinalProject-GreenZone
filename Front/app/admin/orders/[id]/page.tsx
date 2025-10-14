"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit, Calendar, User, MapPin, FileText } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

// Mock data
const mockOrder = {
  id: 1,
  orderNumber: 'GZ-001',
  customerName: 'Иван Петров',
  customerId: 1,
  orderDate: '2024-01-15T10:30:00Z',
  totalAmount: 45000,
  orderStatusId: 1,
  orderStatusName: 'Новый',
  deliveryAddress: 'Москва, ул. Примерная, 123',
  notes: 'Срочная доставка',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z'
}

export default function OrderView() {
  const router = useRouter()
  const params = useParams()
  const { isAdmin } = useAuth()
  const orderId = params?.id

  if (!isAdmin) {
    router.push('/')
    return null
  }

  // В реальном приложении здесь будет загрузка данных по orderId
  const order = mockOrder

  const getStatusBadge = (statusId: number, statusName?: string) => {
    const statusMap: Record<number, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
      1: { variant: 'default', color: 'bg-blue-100 text-blue-800' },
      2: { variant: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
      3: { variant: 'outline', color: 'bg-green-100 text-green-800' },
      4: { variant: 'outline', color: 'bg-green-100 text-green-800' },
      5: { variant: 'destructive', color: 'bg-red-100 text-red-800' },
    }

    const status = statusMap[statusId] || { variant: 'outline', color: 'bg-gray-100 text-gray-800' }
    
    return (
      <Badge variant={status.variant} className={status.color}>
        {statusName || `Статус ${statusId}`}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/orders')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Заказ #{order.orderNumber}
            </h1>
            <p className="text-gray-600">Детальная информация о заказе</p>
          </div>
        </div>
        <Button onClick={() => router.push(`/admin/orders/${order.id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Редактировать
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Информация о заказе
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Номер заказа</p>
                  <p className="text-lg font-semibold">#{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Статус</p>
                  <div className="mt-1">
                    {getStatusBadge(order.orderStatusId, order.orderStatusName)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Дата создания</p>
                  <p className="text-sm">
                    {new Date(order.orderDate).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Общая сумма</p>
                  <p className="text-lg font-semibold text-green-600">
                    {order.totalAmount.toLocaleString()} ₽
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Информация о клиенте
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">ID клиента</p>
                  <p className="text-sm">{order.customerId}</p>
                </div>
                {order.customerName && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Имя клиента</p>
                    <p className="text-sm">{order.customerName}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          {order.deliveryAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Адрес доставки
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.deliveryAddress}</p>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Примечания
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push(`/admin/orders/${order.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Редактировать заказ
              </Button>
              
              {order.orderStatusId === 1 && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    console.log('Processing order', order.id)
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Взять в обработку
                </Button>
              )}
              
              {order.orderStatusId === 2 && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    console.log('Deliver order', order.id)
                  }}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Отправить на доставку
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>История заказа</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Заказ создан</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
                
                {order.createdAt && order.createdAt !== order.orderDate && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Обновлен</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
