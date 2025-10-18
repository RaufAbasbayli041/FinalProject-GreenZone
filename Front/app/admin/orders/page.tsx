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
import { Plus, Eye, Edit, Trash2, MoreHorizontal, Search, X, Loader2, CheckCircle, Clock, Truck, Package, User, ShoppingCart, Calendar, DollarSign } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { getAdminOrders, updateAdminOrder, setAdminOrderStatus } from '@/services/admin-api'
import { AdminLayout } from '@/components/admin/AdminLayout'
import type { Order } from '@/lib/types'

export default function OrdersList() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  
  // All hooks must be called before any conditional returns
  const [searchTerm, setSearchTerm] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Проверяем токен перед загрузкой
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.warn('Токен недоступен для загрузки заказов')
        router.push('/admin/login')
        return
      }
      
      const ordersData = await getAdminOrders()
      setOrders(ordersData)
    } catch (err: any) {
      console.error('Ошибка загрузки заказов:', err)
      
      // Если ошибка связана с авторизацией, перенаправляем на логин
      if (err.message.includes('No authentication token') || err.message.includes('401')) {
        console.log('Ошибка авторизации, перенаправляем на страницу входа админ-панели')
        router.push('/admin/login')
        return
      }
      
      // Если API эндпоинт не найден (404), показываем пустой список
      if (err.message.includes('404')) {
        console.log('Админ API эндпоинт заказов еще не реализован')
        setOrders([])
        setError(null)
        return
      }
      
      setError(err.message || 'Ошибка загрузки заказов')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only load orders if user is admin
    if (isAdmin) {
      loadOrders()
    } else {
      // Redirect non-admin users in useEffect to avoid render-time navigation
      router.push('/')
    }
  }, [isAdmin, router])

  // Early return for non-admin users after all hooks
  if (!isAdmin) {
    return null
  }

  const updateOrderStatus = async (orderId: string, newStatusId: string) => {
    try {
      setUpdatingStatus(orderId)
      
      // Обновляем статус заказа
      const updatedOrder = await setAdminOrderStatus(orderId, newStatusId)
      
      // Обновляем локальное состояние
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: updatedOrder.status, orderStatusId: newStatusId }
            : order
        )
      )
      
      console.log(`Статус заказа ${orderId} обновлен на ${newStatusId}`)
    } catch (err: any) {
      console.error('Ошибка обновления статуса заказа:', err)
      // Можно добавить уведомление об ошибке
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusBadge = (order: Order) => {
    // Получаем статус из правильного поля согласно Order interface
    const orderStatus = order.status
    const statusName = orderStatus?.name || 'Неизвестно'
    const statusId = orderStatus?.id || order.orderStatusId || 'unknown'
    
    // Маппинг статусов согласно OrderStatusName enum из API документации
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string; label: string; icon: React.ReactNode }> = {
      '1': { variant: 'default', color: 'bg-blue-100 text-blue-800', label: 'Pending', icon: <Clock className="h-3 w-3" /> },
      '2': { variant: 'secondary', color: 'bg-yellow-100 text-yellow-800', label: 'Confirmed', icon: <CheckCircle className="h-3 w-3" /> },
      '3': { variant: 'outline', color: 'bg-orange-100 text-orange-800', label: 'Processing', icon: <Package className="h-3 w-3" /> },
      '4': { variant: 'outline', color: 'bg-purple-100 text-purple-800', label: 'Shipped', icon: <Truck className="h-3 w-3" /> },
      '5': { variant: 'outline', color: 'bg-green-100 text-green-800', label: 'Delivered', icon: <CheckCircle className="h-3 w-3" /> },
      '6': { variant: 'destructive', color: 'bg-red-100 text-red-800', label: 'Cancelled', icon: <X className="h-3 w-3" /> },
    }

    // Если есть статус ID, используем его, иначе ищем по имени
    let status = statusMap[statusId]
    if (!status && statusName) {
      // Ищем по имени статуса
      const foundStatus = Object.values(statusMap).find(s => s.label.toLowerCase() === statusName.toLowerCase())
      if (foundStatus) {
        status = foundStatus
      }
    }

    // Fallback если статус не найден
    status = status || { variant: 'outline', color: 'bg-gray-100 text-gray-800', label: statusName, icon: <Clock className="h-3 w-3" /> }
    
    const isUpdating = updatingStatus === order.id
    
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
              onClick={() => updateOrderStatus(order.id, id)}
              disabled={isUpdating || id === statusId}
              className="flex items-center gap-2"
            >
              {statusInfo.icon}
              <span>{statusInfo.label}</span>
              {id === statusId && <CheckCircle className="h-3 w-3 ml-auto text-green-600" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const filteredOrders = orders.filter(order => {
    const orderNumber = `GZ-${order.id.slice(-3)}`
    const customerName = order.customer?.firstName && order.customer?.lastName 
      ? `${order.customer.firstName} ${order.customer.lastName}`
      : 'Неизвестный клиент'
    
    const orderStatus = order.status
    const statusId = orderStatus?.id || order.orderStatusId || 'unknown'
    
    const matchesSearch = orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        customerName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || statusId === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadOrders}>Попробовать снова</Button>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Заказы</h1>
            <p className="text-gray-600">Управление заказами клиентов</p>
          </div>
          <Button onClick={() => router.push('/admin/orders/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Создать заказ
          </Button>
        </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Всего заказов</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">В обработке</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => {
                    const statusId = order.status?.id || order.orderStatusId || 'unknown'
                    return ['1', '2', '3'].includes(statusId)
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Доставлено</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => {
                    const statusId = order.status?.id || order.orderStatusId || 'unknown'
                    return statusId === '5'
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Общая сумма</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()} ₽
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                placeholder="Поиск по номеру заказа или клиенту..."
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
                  <SelectItem value="2">Confirmed</SelectItem>
                  <SelectItem value="3">Processing</SelectItem>
                  <SelectItem value="4">Shipped</SelectItem>
                  <SelectItem value="5">Delivered</SelectItem>
                  <SelectItem value="6">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список заказов</CardTitle>
          <CardDescription>
            Всего заказов: {filteredOrders.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер заказа</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Товары</TableHead>
                  <TableHead>Дата заказа</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-[100px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">#GZ-{order.id.slice(-3)}</p>
                            <p className="text-xs text-gray-500">ID: {order.id.slice(-8)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">
                              {order.customer?.firstName && order.customer?.lastName 
                                ? `${order.customer.firstName} ${order.customer.lastName}`
                                : 'Неизвестный клиент'
                              }
                            </p>
                            <p className="text-sm text-gray-500">{order.customer?.email || 'Email не указан'}</p>
                            <p className="text-xs text-gray-400">ID: {order.customerId.slice(-8)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {order.items && order.items.length > 0 ? (
                            <div className="space-y-1">
                              {order.items.slice(0, 2).map((item, index) => (
                                <div key={index} className="text-sm">
                                  <p className="font-medium truncate">{item.product?.title || 'Товар'}</p>
                                  <p className="text-xs text-gray-500">
                                    {item.quantity} шт. × {item.unitPrice.toLocaleString()} ₽
                                  </p>
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <p className="text-xs text-gray-400">+{order.items.length - 2} еще</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Товары не загружены</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div className="text-sm">
                            <p>{new Date(order.orderDate).toLocaleDateString('ru-RU')}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.orderDate).toLocaleTimeString('ru-RU', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{order.totalAmount.toLocaleString()} ₽</p>
                            <p className="text-xs text-gray-500">
                              {order.items?.length || 0} товар(ов)
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/admin/orders/${order.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Просмотр
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/orders/${order.id}/edit`)}>
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Нет заказов для отображения
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
