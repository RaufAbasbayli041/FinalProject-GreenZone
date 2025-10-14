import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { adminApi } from '../../api/endpoints';
import { Loader } from '../components/admin/Loader';
import {
  ShoppingCart,
  Package,
  Users,
  Truck,
  TrendingUp,
  Download,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

// Mock data for charts (в реальном проекте данные должны приходить с API)
const monthlyOrdersData = [
  { month: 'Янв', orders: 45, revenue: 125000 },
  { month: 'Фев', orders: 52, revenue: 142000 },
  { month: 'Мар', orders: 48, revenue: 138000 },
  { month: 'Апр', orders: 61, revenue: 168000 },
  { month: 'Май', orders: 55, revenue: 152000 },
  { month: 'Июн', orders: 67, revenue: 185000 },
];

const statusDistributionData = [
  { status: 'Новый', count: 12, color: '#3B82F6' },
  { status: 'В обработке', count: 8, color: '#F59E0B' },
  { status: 'Доставляется', count: 15, color: '#10B981' },
  { status: 'Доставлен', count: 23, color: '#059669' },
  { status: 'Отменен', count: 3, color: '#EF4444' },
];

export const AdminDashboard: React.FC = () => {
  // Загружаем статистику
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders-stats'],
    queryFn: () => adminApi.orders.getAll({ pageSize: 1 }),
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products-stats'],
    queryFn: () => adminApi.products.getAll({ pageSize: 1 }),
  });

  const { data: customersData, isLoading: customersLoading } = useQuery({
    queryKey: ['admin-customers-stats'],
    queryFn: () => adminApi.customers.getAll({ pageSize: 1 }),
  });

  const { data: deliveriesData, isLoading: deliveriesLoading } = useQuery({
    queryKey: ['admin-deliveries-stats'],
    queryFn: () => adminApi.deliveries.getAll({ pageSize: 1 }),
  });

  const isLoading = ordersLoading || productsLoading || customersLoading || deliveriesLoading;

  const stats = [
    {
      title: 'Всего заказов',
      value: ordersData?.data.totalCount || 0,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Активные товары',
      value: productsData?.data.totalCount || 0,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Клиенты',
      value: customersData?.data.totalCount || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: 'Доставки',
      value: deliveriesData?.data.totalCount || 0,
      icon: Truck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+5%',
      changeType: 'positive' as const,
    },
  ];

  const exportToCSV = () => {
    // В реальном проекте здесь должен быть вызов API для экспорта
    console.log('Exporting orders to CSV...');
  };

  if (isLoading) {
    return <Loader text="Загрузка статистики..." />;
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
        {stats.map((stat) => (
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
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
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
        {/* Monthly Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Заказы по месяцам</CardTitle>
            <CardDescription>Динамика заказов и выручки за последние 6 месяцев</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyOrdersData}>
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
              {statusDistributionData.map((item) => (
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
                      {Math.round((item.count / statusDistributionData.reduce((sum, s) => sum + s.count, 0)) * 100)}%
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
            {ordersData?.data.data.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Заказ #{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.totalAmount.toLocaleString()} ₽</p>
                  <Badge variant="outline">{order.orderStatusName}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
