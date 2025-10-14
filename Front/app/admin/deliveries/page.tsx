"use client"

import React, { useState } from 'react'
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
import { Plus, Eye, Edit, Trash2, MoreHorizontal, Search, X, Truck, MapPin, Calendar } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

// Mock data
const mockDeliveries = [
  {
    id: 1,
    orderId: 1,
    orderNumber: 'GZ-001',
    deliveryAddress: 'Москва, ул. Примерная, 123',
    deliveryDate: '2024-01-20',
    status: 1,
    statusName: 'Подготовка',
    notes: 'Срочная доставка',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    orderId: 2,
    orderNumber: 'GZ-002',
    deliveryAddress: 'Санкт-Петербург, пр. Невский, 456',
    deliveryDate: '2024-01-18',
    status: 2,
    statusName: 'В пути',
    notes: '',
    createdAt: '2024-01-14'
  },
  {
    id: 3,
    orderId: 3,
    orderNumber: 'GZ-003',
    deliveryAddress: 'Казань, ул. Баумана, 789',
    deliveryDate: '2024-01-16',
    status: 3,
    statusName: 'Доставлен',
    notes: 'Звонить перед доставкой',
    createdAt: '2024-01-13'
  }
]

export default function DeliveriesList() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [deliveries] = useState(mockDeliveries)

  if (!isAdmin) {
    router.push('/')
    return null
  }

  const getStatusBadge = (status: number, statusName?: string) => {
    const statusMap: Record<number, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
      1: { variant: 'default', color: 'bg-blue-100 text-blue-800' },
      2: { variant: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
      3: { variant: 'outline', color: 'bg-green-100 text-green-800' },
      4: { variant: 'destructive', color: 'bg-red-100 text-red-800' },
    }

    const statusConfig = statusMap[status] || { variant: 'outline', color: 'bg-gray-100 text-gray-800' }
    
    return (
      <Badge variant={statusConfig.variant} className={statusConfig.color}>
        {statusName || `Статус ${status}`}
      </Badge>
    )
  }

  const filteredDeliveries = deliveries.filter(delivery =>
    delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
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
                {filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">#{delivery.orderNumber}</p>
                        <p className="text-sm text-gray-500">ID: {delivery.orderId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{delivery.deliveryAddress}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {delivery.deliveryDate ? new Date(delivery.deliveryDate).toLocaleDateString('ru-RU') : 'Не назначена'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(delivery.status, delivery.statusName)}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
