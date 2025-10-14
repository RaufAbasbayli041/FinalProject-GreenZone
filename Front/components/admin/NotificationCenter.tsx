"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Filter,
  MoreHorizontal,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  time: string
  read: boolean
  category: 'order' | 'customer' | 'system' | 'payment'
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Новый заказ',
    message: 'Заказ #GZ-123 успешно создан',
    time: '2 минуты назад',
    read: false,
    category: 'order'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Низкий остаток',
    message: 'Товар "Искусственная трава Premium" заканчивается',
    time: '15 минут назад',
    read: false,
    category: 'system'
  },
  {
    id: '3',
    type: 'info',
    title: 'Новый клиент',
    message: 'Зарегистрирован новый клиент: Иван Петров',
    time: '1 час назад',
    read: true,
    category: 'customer'
  },
  {
    id: '4',
    type: 'error',
    title: 'Ошибка платежа',
    message: 'Не удалось обработать платеж для заказа #GZ-122',
    time: '2 часа назад',
    read: true,
    category: 'payment'
  },
  {
    id: '5',
    type: 'success',
    title: 'Доставка завершена',
    message: 'Заказ #GZ-121 успешно доставлен',
    time: '3 часа назад',
    read: true,
    category: 'order'
  }
]

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread' | 'order' | 'customer' | 'system' | 'payment'>('all')

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'info': return <Info className="h-5 w-5 text-blue-500" />
      default: return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'order': return 'bg-blue-100 text-blue-800'
      case 'customer': return 'bg-green-100 text-green-800'
      case 'system': return 'bg-yellow-100 text-yellow-800'
      case 'payment': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    return notification.category === filter
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Уведомления
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Последние события и обновления системы
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Фильтр
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  Все уведомления
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('unread')}>
                  Непрочитанные
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('order')}>
                  Заказы
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('customer')}>
                  Клиенты
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('system')}>
                  Система
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('payment')}>
                  Платежи
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Отметить все как прочитанные
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg transition-colors ${
                  notification.read 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-blue-200 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`text-sm font-medium ${
                          notification.read ? 'text-gray-600' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h4>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getCategoryColor(notification.category)}`}
                        >
                          {notification.category}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className={`text-sm ${
                        notification.read ? 'text-gray-500' : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-8 w-8 p-0"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                          Отметить как прочитанное
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600"
                        >
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Нет уведомлений для отображения</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
