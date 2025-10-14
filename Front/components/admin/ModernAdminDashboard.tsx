"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  ShoppingCart,
  Package,
  Users,
  Truck,
  TrendingUp,
  TrendingDown,
  Download,
  Loader2,
  Eye,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  BarChart3,
} from 'lucide-react'
// Временно отключаем Recharts для избежания ошибок
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
// } from 'recharts'
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
  revenue: number
  growth: number
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

interface RecentActivity {
  id: string
  type: 'order' | 'customer' | 'product'
  title: string
  description: string
  time: string
  status: 'success' | 'warning' | 'error'
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export const ModernAdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    orders: 0,
    products: 0,
    customers: 0,
    deliveries: 0,
    revenue: 0,
    growth: 0
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([])
  const [statusData, setStatusData] = useState<StatusData[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      loadDashboardData()
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.warn('No token available for dashboard data loading')
        setLoading(false)
        return
      }
      
      const [orders, products, customers, deliveries] = await Promise.all([
        getAdminOrders(),
        getAdminProducts(),
        getAdminCustomers(),
        getAdminDeliveries()
      ])

      // Обновляем статистику
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
      const growth = Math.round(Math.random() * 20 - 5) // Заглушка для роста
      
      setStats({
        orders: orders.length,
        products: products.length,
        customers: customers.length,
        deliveries: deliveries.length,
        revenue: totalRevenue,
        growth
      })

      // Берем последние 5 заказов
      setRecentOrders(orders.slice(0, 5))

      // Генерируем данные для графиков
      generateMonthlyData(orders)
      generateStatusData(orders)
      generateRecentActivity(orders, customers, products)

    } catch (error: any) {
      console.error('Ошибка загрузки данных дашборда:', error)
      
      if (error.message.includes('No authentication token') || error.message.includes('401')) {
        console.log('Authentication error, redirecting to login')
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return
      }
      
      // Если API эндпоинты не найдены (404), показываем пустые данные
      if (error.message.includes('404')) {
        console.log('Admin API endpoints not implemented yet, showing empty dashboard')
        setStats({
          orders: 0,
          products: 0,
          customers: 0,
          deliveries: 0,
          revenue: 0,
          growth: 0
        })
        setRecentOrders([])
        setMonthlyData([])
        setStatusData([])
        setRecentActivity([])
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

    const statusArray = Array.from(statusMap.entries()).map(([status, count], index) => ({
      status,
      count,
      color: COLORS[index % COLORS.length]
    }))

    setStatusData(statusArray)
  }

  const generateRecentActivity = (orders: Order[], customers: Customer[], products: Product[]) => {
    const activities: RecentActivity[] = []
    
    // Добавляем последние заказы
    orders.slice(0, 3).forEach(order => {
      activities.push({
        id: order.id,
        type: 'order',
        title: `Новый заказ #GZ-${order.id.slice(-3)}`,
        description: `Сумма: ${order.totalAmount.toLocaleString()} ₽`,
        time: new Date(order.orderDate).toLocaleDateString('ru-RU'),
        status: 'success'
      })
    })
    
    // Добавляем новых клиентов
    customers.slice(0, 2).forEach(customer => {
      activities.push({
        id: customer.id,
        type: 'customer',
        title: `Новый клиент: ${customer.firstName} ${customer.lastName}`,
        description: customer.email,
        time: new Date().toLocaleDateString('ru-RU'),
        status: 'success'
      })
    })
    
    setRecentActivity(activities)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const statsCards = [
    {
      title: 'Всего заказов',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Выручка',
      value: stats.revenue,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: `+${stats.growth}%`,
      changeType: stats.growth >= 0 ? 'positive' : 'negative' as const,
      format: 'currency'
    },
    {
      title: 'Активные товары',
      value: stats.products,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Клиенты',
      value: stats.customers,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+15%',
      changeType: 'positive' as const,
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
          <h1 className="text-3xl font-bold text-gray-900">Панель управления</h1>
          <p className="text-gray-600 mt-1">Добро пожаловать в админ-панель GreenZone</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Экспорт данных
          </Button>
          <Button className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Подробный отчет
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.format === 'currency' 
                  ? `${stat.value.toLocaleString()} ₽`
                  : stat.value.toLocaleString()
                }
              </div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>
                <span className="ml-1">с прошлого месяца</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Динамика выручки</CardTitle>
              <CardDescription>Заказы и выручка за последние 6 месяцев</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">График будет доступен после установки Recharts</p>
                  <p className="text-sm text-gray-400 mt-2">npm install recharts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Статусы заказов</CardTitle>
              <CardDescription>Распределение заказов по статусам</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Круговая диаграмма будет доступна после установки Recharts</p>
                  <p className="text-sm text-gray-400 mt-2">npm install recharts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Recent Activity and Orders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Последняя активность</CardTitle>
            <CardDescription>Недавние события в системе</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
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

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Показатели эффективности</CardTitle>
          <CardDescription>Ключевые метрики работы системы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Конверсия заказов</span>
                <span className="text-sm text-gray-500">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Удовлетворенность клиентов</span>
                <span className="text-sm text-gray-500">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Скорость обработки</span>
                <span className="text-sm text-gray-500">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
