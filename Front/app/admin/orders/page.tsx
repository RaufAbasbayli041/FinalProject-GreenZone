"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
} from '@/components/ui/dropdown-menu'
import { Plus, Eye, Edit, Trash2, MoreHorizontal, Search, X, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { getAdminOrders } from '@/services/admin-api'
import { AdminLayout } from '@/components/admin/AdminLayout'
import type { Order } from '@/lib/types'

export default function OrdersList() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAdmin) {
      loadOrders()
    }
  }, [isAdmin])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Проверяем токен перед загрузкой
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.warn('No token available for orders loading')
        router.push('/login')
        return
      }
      
      const ordersData = await getAdminOrders()
      setOrders(ordersData)
    } catch (err: any) {
      console.error('Ошибка загрузки заказов:', err)
      
      // Если ошибка связана с авторизацией, перенаправляем на логин
      if (err.message.includes('No authentication token') || err.message.includes('401')) {
        console.log('Authentication error, redirecting to login')
        router.push('/login')
        return
      }
      
      // Если API эндпоинт не найден (404), показываем пустой список
      if (err.message.includes('404')) {
        console.log('Admin Orders API endpoint not implemented yet')
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
    if (!isAdmin) {
      router.push('/')
    }
  }, [isAdmin, router])

  if (!isAdmin) {
    return null
  }

  const getStatusBadge = (order: Order) => {
    const statusName = order.status?.name || 'Неизвестно'
    const statusId = order.status?.id || 'unknown'
    
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
      '1': { variant: 'default', color: 'bg-blue-100 text-blue-800' },
      '2': { variant: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
      '3': { variant: 'outline', color: 'bg-green-100 text-green-800' },
      '4': { variant: 'outline', color: 'bg-green-100 text-green-800' },
      '5': { variant: 'destructive', color: 'bg-red-100 text-red-800' },
    }

    const status = statusMap[statusId] || { variant: 'outline', color: 'bg-gray-100 text-gray-800' }
    
    return (
      <Badge variant={status.variant} className={status.color}>
        {statusName}
      </Badge>
    )
  }

  const filteredOrders = orders.filter(order => {
    const orderNumber = `GZ-${order.id.slice(-3)}`
    const customerName = order.customer?.firstName && order.customer?.lastName 
      ? `${order.customer.firstName} ${order.customer.lastName}`
      : 'Неизвестный клиент'
    
    return orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customerName.toLowerCase().includes(searchTerm.toLowerCase())
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
                      <TableCell className="font-medium">#GZ-{order.id.slice(-3)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {order.customer?.firstName && order.customer?.lastName 
                              ? `${order.customer.firstName} ${order.customer.lastName}`
                              : 'Неизвестный клиент'
                            }
                          </p>
                          <p className="text-sm text-gray-500">ID: {order.customerId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString('ru-RU')}</TableCell>
                      <TableCell className="font-medium">{order.totalAmount.toLocaleString()} ₽</TableCell>
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
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
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
