"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Package,
  Users,
  ShoppingCart,
  Truck,
  FolderOpen,
  Settings,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  Eye,
} from 'lucide-react'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  href: string
  color: string
  bgColor: string
  badge?: string
}

const quickActions: QuickAction[] = [
  {
    id: 'create-order',
    title: 'Создать заказ',
    description: 'Добавить новый заказ для клиента',
    icon: ShoppingCart,
    href: '/admin/orders/create',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    badge: 'Популярно'
  },
  {
    id: 'add-product',
    title: 'Добавить товар',
    description: 'Создать новый товар в каталоге',
    icon: Package,
    href: '/admin/products/create',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'new-customer',
    title: 'Новый клиент',
    description: 'Зарегистрировать нового клиента',
    icon: Users,
    href: '/admin/customers/create',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'create-delivery',
    title: 'Создать доставку',
    description: 'Организовать доставку заказа',
    icon: Truck,
    href: '/admin/deliveries/create',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    id: 'add-category',
    title: 'Новая категория',
    description: 'Создать категорию товаров',
    icon: FolderOpen,
    href: '/admin/categories/create',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    id: 'analytics',
    title: 'Аналитика',
    description: 'Подробные отчеты и метрики',
    icon: BarChart3,
    href: '/admin/analytics',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50'
  }
]

const systemActions = [
  {
    id: 'export-data',
    title: 'Экспорт данных',
    description: 'Выгрузить данные в CSV/Excel',
    icon: Download,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50'
  },
  {
    id: 'import-data',
    title: 'Импорт данных',
    description: 'Загрузить данные из файла',
    icon: Upload,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50'
  },
  {
    id: 'refresh-cache',
    title: 'Обновить кэш',
    description: 'Очистить кэш системы',
    icon: RefreshCw,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50'
  },
  {
    id: 'system-settings',
    title: 'Настройки',
    description: 'Конфигурация системы',
    icon: Settings,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50'
  }
]

interface QuickActionsProps {
  onActionClick?: (action: QuickAction) => void
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const handleActionClick = (action: QuickAction) => {
    if (onActionClick) {
      onActionClick(action)
    } else {
      window.location.href = action.href
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Быстрые действия
          </CardTitle>
          <CardDescription>
            Часто используемые функции для быстрого доступа
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <div
                key={action.id}
                className="relative p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => handleActionClick(action)}
              >
                {action.badge && (
                  <Badge className="absolute -top-2 -right-2 bg-green-500">
                    {action.badge}
                  </Badge>
                )}
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${action.bgColor}`}>
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Системные действия
          </CardTitle>
          <CardDescription>
            Управление системой и данными
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {systemActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-4 justify-start"
                onClick={() => {
                  // Здесь можно добавить логику для каждого действия
                  console.log(`Action clicked: ${action.id}`)
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded ${action.bgColor}`}>
                    <action.icon className={`h-4 w-4 ${action.color}`} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">{action.title}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Краткий обзор
          </CardTitle>
          <CardDescription>
            Быстрый доступ к важной информации
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-blue-800">Новых заказов</div>
              <div className="text-xs text-blue-600 mt-1">За последние 24 часа</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">₽245,000</div>
              <div className="text-sm text-green-800">Выручка сегодня</div>
              <div className="text-xs text-green-600 mt-1">+15% к вчера</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-sm text-purple-800">Активных доставок</div>
              <div className="text-xs text-purple-600 mt-1">В процессе</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
