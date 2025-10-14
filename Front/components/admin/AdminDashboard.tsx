"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ShoppingCart,
  Package,
  Users,
  Truck,
  TrendingUp,
  Download,
  Loader2,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { 
  getAdminOrders, 
  getAdminProducts, 
  getAdminCustomers, 
  getAdminDeliveries 
} from '@/services/admin-api'
import type { Order, Product, Customer, Delivery } from '@/lib/types'

interface DashboardStats {
  orders: number
  products: number
  customers: number
  deliveries: number
}

interface ChartData {
  month: string
  orders: number
  revenue: number
}

interface StatusData {
  status: string
  count: number
  color: string
}

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    orders: 0,
    products: 0,
    customers: 0,
    deliveries: 0
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([])
  const [statusData, setStatusData] = useState<StatusData[]>([])

  useEffect(() => {
    // Проверяем, что токен доступен перед загрузкой данных
    const token = localStorage.getItem('auth_token')
    if (token) {
      loadDashboardData()
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Проверяем токен еще раз перед загрузкой
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.warn('No token available for dashboard data loading')
        setLoading(false)
        return
      }
      
      // Загружаем все данные параллельно
      const [orders, products, customers, deliveries] = await Promise.all([
        getAdminOrders(),
        getAdminProducts(),
        getAdminCustomers(),
        getAdminDeliveries()
      ])

      // Обновляем статистику
      setStats({
        orders: orders.length,
        products: products.length,
        customers: customers.length,
        deliveries: deliveries.length
      })

      // Берем последние 5 заказов
      setRecentOrders(orders.slice(0, 5))

      // Генерируем данные для графика (последние 6 месяцев)
      generateMonthlyData(orders)

      // Генерируем данные по статусам
      generateStatusData(orders)

    } catch (error: any) {
      console.error('Ошибка загрузки данных дашборда:', error)
      
      // Если ошибка связана с авторизацией, перенаправляем на логин
      if (error.message.includes('No authentication token') || error.message.includes('401')) {
        console.log('Authentication error, redirecting to login')
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const generateMonthlyData = (orders: Order[]) => {
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн']
    const monthlyStats = months.map(month => {
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate)
        const monthIndex = orderDate.getMonth()
        return monthIndex === months.indexOf(month)
      })
      
      return {
        month,
        orders: monthOrders.length,
        revenue: monthOrders.reduce((sum, order) => sum + order.totalAmount, 0)
      }
    })
    
    setMonthlyData(monthlyStats)
  }

  const generateStatusData = (orders: Order[]) => {
    const statusMap = new Map<string, number>()
    
    orders.forEach(order => {
      const status = order.status?.name || 'Неизвестно'
      statusMap.set(status, (statusMap.get(status) || 0) + 1)
    })

    const colors = ['#3B82F6', '#F59E0B', '#10B981', '#059669', '#EF4444']
    const statusArray = Array.from(statusMap.entries()).map(([status, count], index) => ({
      status,
      count,
      color: colors[index % colors.length]
    }))

    setStatusData(statusArray)
  }

  const exportToCSV = () => {
    try {
      const csvContent = [
        ['ID', 'Номер заказа', 'Клиент', 'Сумма', 'Статус', 'Дата заказа'],
        ...recentOrders.map(order => [
          order.id,
          `GZ-${order.id.slice(-3)}`,
          `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'Неизвестно',
          order.totalAmount.toString(),
          order.status?.name || 'Неизвестно',
          new Date(order.orderDate).toLocaleDateString('ru-RU')
        ])
      ].map(row => row.join(',')).join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Ошибка экспорта CSV:', error)
    }
  }

  const statsCards = [
    {
      title: 'Всего заказов',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Активные товары',
      value: stats.products,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Клиенты',
      value: stats.customers,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Доставки',
      value: stats.deliveries,
      icon: Truck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Панель управления</h1>
          <p className="text-gray-600">Обзор деятельности GreenZone</p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Экспорт заказов
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Заказы по месяцам</CardTitle>
            <CardDescription>Динамика заказов и выручки за последние 6 месяцев</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="orders" fill="#3B82F6" name="Заказы" />
                <Bar yAxisId="right" dataKey="revenue" fill="#10B981" name="Выручка (₽)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Распределение заказов по статусам</CardTitle>
            <CardDescription>Текущее состояние заказов</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusData.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{item.count}</span>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round((item.count / statusData.reduce((sum, s) => sum + s.count, 0)) * 100)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Последние заказы</CardTitle>
          <CardDescription>Недавно созданные заказы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <ShoppingCart className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Заказ #GZ-{order.id.slice(-3)}</p>
                      <p className="text-sm text-gray-600">
                        {order.customer?.firstName && order.customer?.lastName 
                          ? `${order.customer.firstName} ${order.customer.lastName}`
                          : 'Неизвестный клиент'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.totalAmount.toLocaleString()} ₽</p>
                    <Badge variant="outline">{order.status?.name || 'Неизвестно'}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Нет заказов для отображения</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
