"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Plus, Eye, Edit, Trash2, MoreHorizontal, Search, X, Truck, MapPin, Calendar, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getAdminDeliveries, updateDeliveryStatus, getAdminDeliveryStatuses } from '@/services/admin-api'
import type { Delivery } from '@/lib/types'
import { DeliveryStatusType } from '@/lib/types'

export default function DeliveriesList() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  
  // All hooks must be called before any conditional returns
  const [searchTerm, setSearchTerm] = useState('')
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const loadDeliveries = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.warn('Токен недоступен для загрузки доставок')
        router.push('/admin/login')
        return
      }
      
      const deliveriesData = await getAdminDeliveries()
      setDeliveries(deliveriesData)
    } catch (err: any) {
      console.error('Ошибка загрузки доставок:', err)
      
      if (err.message.includes('No authentication token') || err.message.includes('401')) {
        console.log('Ошибка авторизации, перенаправляем на страницу входа админ-панели')
        router.push('/admin/login')
        return
      }
      
      if (err.message.includes('404')) {
        console.log('Админ API эндпоинт доставок еще не реализован')
        setDeliveries([])
        setError(null)
        return
      }
      
      setError(err.message || 'Ошибка загрузки доставок')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only load deliveries if user is admin
    if (isAdmin) {
      loadDeliveries()
    } else {
      // Redirect non-admin users in useEffect to avoid render-time navigation
      router.push('/')
    }
  }, [isAdmin, router])

  // Early return for non-admin users after all hooks
  if (!isAdmin) {
    return null
  }

  const updateDeliveryStatusHandler = async (deliveryId: string, newStatusId: string) => {
    try {
      setUpdatingStatus(deliveryId)
      
      // Обновляем статус доставки
      const updatedDelivery = await updateDeliveryStatus(deliveryId, newStatusId)
      
      // Обновляем локальное состояние
      setDeliveries(prevDeliveries => 
        prevDeliveries.map(delivery => 
          delivery.id === deliveryId 
            ? { ...delivery, deliveryStatusId: newStatusId, deliveryStatus: updatedDelivery.deliveryStatus }
            : delivery
        )
      )
      
      console.log(`Статус доставки ${deliveryId} обновлен на ${newStatusId}`)
    } catch (err: any) {
      console.error('Ошибка обновления статуса доставки:', err)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusBadge = (delivery: Delivery) => {
    // Получаем статус из правильного поля согласно Delivery interface
    const deliveryStatus = delivery.deliveryStatus
    const statusType = deliveryStatus?.statusType || DeliveryStatusType.PENDING
    const statusName = deliveryStatus?.name || 'Неизвестно'
    
    // Маппинг статусов согласно DeliveryStatusType enum
    const statusMap: Record<DeliveryStatusType, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string; label: string; icon: React.ReactNode }> = {
      [DeliveryStatusType.PENDING]: { variant: 'default', color: 'bg-blue-100 text-blue-800', label: 'Pending', icon: <Clock className="h-3 w-3" /> },
      [DeliveryStatusType.IN_TRANSIT]: { variant: 'secondary', color: 'bg-yellow-100 text-yellow-800', label: 'In Transit', icon: <Truck className="h-3 w-3" /> },
      [DeliveryStatusType.DELIVERED]: { variant: 'outline', color: 'bg-green-100 text-green-800', label: 'Delivered', icon: <CheckCircle className="h-3 w-3" /> },
      [DeliveryStatusType.FAILED]: { variant: 'destructive', color: 'bg-red-100 text-red-800', label: 'Failed', icon: <AlertCircle className="h-3 w-3" /> },
    }

    const status = statusMap[statusType] || { variant: 'outline', color: 'bg-gray-100 text-gray-800', label: statusName, icon: <Clock className="h-3 w-3" /> }
    const isUpdating = updatingStatus === delivery.id
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Badge 
            variant={status.variant} 
            className={`${status.color} cursor-pointer hover:opacity-80 transition-opacity ${isUpdating ? 'opacity-50' : ''}`}
          >
            {isUpdating ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              status.icon
            )}
            <span className="ml-1">{status.label}</span>
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5 text-sm font-medium text-gray-500">Изменить статус</div>
          <DropdownMenuSeparator />
          {Object.entries(statusMap).map(([id, statusInfo]) => (
            <DropdownMenuItem
              key={id}
              onClick={() => updateDeliveryStatusHandler(delivery.id, id.toString())}
              disabled={isUpdating || Number(id) === statusType}
              className="flex items-center gap-2"
            >
              {statusInfo.icon}
              <span>{statusInfo.label}</span>
              {Number(id) === statusType && <CheckCircle className="h-3 w-3 ml-auto text-green-600" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const filteredDeliveries = deliveries.filter(delivery => {
    const orderNumber = delivery.order?.id ? `GZ-${delivery.order.id.slice(-3)}` : `Order-${delivery.orderId.slice(-3)}`
    const deliveryAddress = delivery.order?.shippingAddress || 'Адрес не указан'
    
    const deliveryStatus = delivery.deliveryStatus
    const statusType = deliveryStatus?.statusType || DeliveryStatusType.PENDING
    
    const matchesSearch = orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || statusType === Number(statusFilter)
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadDeliveries}>Попробовать снова</Button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Доставки</h1>
          <p className="text-gray-600">Управление доставками заказов</p>
        </div>
        <Button onClick={() => router.push('/admin/deliveries/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Создать доставку
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Поиск по номеру заказа или адресу..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Фильтр по статусу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="1">Pending</SelectItem>
                  <SelectItem value="2">In Transit</SelectItem>
                  <SelectItem value="3">Delivered</SelectItem>
                  <SelectItem value="4">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deliveries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список доставок</CardTitle>
          <CardDescription>
            Всего доставок: {filteredDeliveries.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Заказ</TableHead>
                  <TableHead>Адрес доставки</TableHead>
                  <TableHead>Дата доставки</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-[100px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.length > 0 ? (
                  filteredDeliveries.map((delivery) => {
                    const orderNumber = delivery.order?.id ? `GZ-${delivery.order.id.slice(-3)}` : `Order-${delivery.orderId.slice(-3)}`
                    const deliveryAddress = delivery.order?.shippingAddress || 'Адрес не указан'
                    const customerName = delivery.order?.customer?.firstName && delivery.order?.customer?.lastName 
                      ? `${delivery.order.customer.firstName} ${delivery.order.customer.lastName}`
                      : 'Неизвестный клиент'
                    
                    return (
                      <TableRow key={delivery.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">#{orderNumber}</p>
                            <p className="text-sm text-gray-500">ID: {delivery.orderId}</p>
                            <p className="text-xs text-gray-400">{customerName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{deliveryAddress}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div className="text-sm">
                              <div>Создана: {new Date(delivery.createdAt).toLocaleDateString('ru-RU')}</div>
                              {delivery.deliveredAt && (
                                <div className="text-green-600">Доставлена: {new Date(delivery.deliveredAt).toLocaleDateString('ru-RU')}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(delivery)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/admin/deliveries/${delivery.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Просмотр
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/deliveries/${delivery.id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Нет доставок для отображения
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  )
}
