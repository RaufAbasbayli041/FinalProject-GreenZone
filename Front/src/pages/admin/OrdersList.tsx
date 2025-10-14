import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { DataTable, Column } from '../../components/admin/DataTable';
import { SearchBar } from '../../components/admin/SearchBar';
import { Pagination } from '../../components/admin/Pagination';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Loader } from '../../components/admin/Loader';
import { adminApi, OrderDto } from '../../api/endpoints';
import { useEntityList } from '../../hooks/useEntityManagement';
import { Plus, Eye, Edit, Trash2, Package, Truck, RotateCcw, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const OrdersList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteOrder, setDeleteOrder] = useState<OrderDto | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { page, pageSize, debouncedKeyword, setKeyword, goToPage, changePageSize } = useEntityList({}, 1, 10);

  // Загрузка заказов
  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['admin-orders', page, pageSize, debouncedKeyword],
    queryFn: () => adminApi.orders.getAll({
      page,
      pageSize,
      keyword: debouncedKeyword || undefined,
    }),
  });

  // Удаление заказа
  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.orders.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Заказ успешно удален');
      setShowDeleteDialog(false);
      setDeleteOrder(null);
    },
    onError: () => {
      toast.error('Ошибка при удалении заказа');
    },
  });

  // Изменение статуса заказа
  const statusMutation = useMutation({
    mutationFn: ({ id, action }: { id: number; action: string }) => {
      switch (action) {
        case 'processing':
          return adminApi.orders.processing(id);
        case 'deliver':
          return adminApi.orders.deliver(id);
        case 'returned':
          return adminApi.orders.returned(id);
        case 'cancel':
          return adminApi.orders.cancel(id);
        default:
          throw new Error('Unknown action');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Статус заказа обновлен');
    },
    onError: () => {
      toast.error('Ошибка при обновлении статуса');
    },
  });

  const handleDelete = (order: OrderDto) => {
    setDeleteOrder(order);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteOrder) {
      deleteMutation.mutate(deleteOrder.id);
    }
  };

  const getStatusBadge = (statusId: number, statusName?: string) => {
    const statusMap: Record<number, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
      1: { variant: 'default', color: 'bg-blue-100 text-blue-800' },
      2: { variant: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
      3: { variant: 'outline', color: 'bg-green-100 text-green-800' },
      4: { variant: 'outline', color: 'bg-green-100 text-green-800' },
      5: { variant: 'destructive', color: 'bg-red-100 text-red-800' },
    };

    const status = statusMap[statusId] || { variant: 'outline', color: 'bg-gray-100 text-gray-800' };
    
    return (
      <Badge variant={status.variant} className={status.color}>
        {statusName || `Статус ${statusId}`}
      </Badge>
    );
  };

  const columns: Column<OrderDto>[] = [
    {
      key: 'orderNumber',
      title: 'Номер заказа',
      render: (value) => <span className="font-medium">#{value}</span>,
    },
    {
      key: 'customerName',
      title: 'Клиент',
      render: (value, order) => (
        <div>
          <p className="font-medium">{value || `Клиент #${order.customerId}`}</p>
          <p className="text-sm text-gray-500">ID: {order.customerId}</p>
        </div>
      ),
    },
    {
      key: 'orderDate',
      title: 'Дата заказа',
      render: (value) => new Date(value).toLocaleDateString('ru-RU'),
    },
    {
      key: 'totalAmount',
      title: 'Сумма',
      render: (value) => (
        <span className="font-medium">{value.toLocaleString()} ₽</span>
      ),
    },
    {
      key: 'orderStatusId',
      title: 'Статус',
      render: (value, order) => getStatusBadge(value, order.orderStatusName),
    },
  ];

  const orders = ordersResponse?.data.data || [];
  const totalCount = ordersResponse?.data.totalCount || 0;
  const totalPages = ordersResponse?.data.totalPages || 0;

  const getStatusActions = (order: OrderDto) => {
    const actions = [];
    
    if (order.orderStatusId === 1) { // Новый
      actions.push({
        label: 'В обработку',
        onClick: () => statusMutation.mutate({ id: order.id, action: 'processing' }),
        icon: <Package className="h-4 w-4" />,
      });
    }
    
    if (order.orderStatusId === 2) { // В обработке
      actions.push({
        label: 'Доставить',
        onClick: () => statusMutation.mutate({ id: order.id, action: 'deliver' }),
        icon: <Truck className="h-4 w-4" />,
      });
    }
    
    if (order.orderStatusId === 3) { // Доставляется
      actions.push({
        label: 'Возврат',
        onClick: () => statusMutation.mutate({ id: order.id, action: 'returned' }),
        icon: <RotateCcw className="h-4 w-4" />,
      });
    }
    
    if (order.orderStatusId !== 5) { // Не отменен
      actions.push({
        label: 'Отменить',
        onClick: () => statusMutation.mutate({ id: order.id, action: 'cancel' }),
        icon: <X className="h-4 w-4" />,
        variant: 'destructive' as const,
      });
    }

    return actions;
  };

  if (isLoading) {
    return <Loader text="Загрузка заказов..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Заказы</h1>
          <p className="text-gray-600">Управление заказами клиентов</p>
        </div>
        <Button onClick={() => navigate('/admin/orders/create')}>
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
            <SearchBar
              value={debouncedKeyword}
              onChange={setKeyword}
              placeholder="Поиск по номеру заказа или клиенту..."
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список заказов</CardTitle>
          <CardDescription>
            Всего заказов: {totalCount}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={orders}
            columns={columns}
            isLoading={isLoading}
            onView={(order) => navigate(`/admin/orders/${order.id}`)}
            onEdit={(order) => navigate(`/admin/orders/${order.id}/edit`)}
            onDelete={handleDelete}
            actions={getStatusActions(orders[0])} // Это нужно будет исправить для каждого заказа отдельно
          />
          
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalCount}
                onPageChange={goToPage}
                onPageSizeChange={changePageSize}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeleteOrder(null);
        }}
        onConfirm={confirmDelete}
        title="Удалить заказ"
        description={`Вы уверены, что хотите удалить заказ #${deleteOrder?.orderNumber}? Это действие нельзя отменить.`}
        confirmText="Удалить"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
