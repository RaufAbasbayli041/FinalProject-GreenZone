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
import { adminApi, DeliveryDto } from '../../api/endpoints';
import { useEntityList } from '../../hooks/useEntityManagement';
import { Plus, Eye, Edit, Trash2, Truck, MapPin, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const DeliveriesList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDelivery, setDeleteDelivery] = useState<DeliveryDto | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { page, pageSize, debouncedKeyword, setKeyword, goToPage, changePageSize } = useEntityList({}, 1, 10);

  // Загрузка доставок
  const { data: deliveriesResponse, isLoading } = useQuery({
    queryKey: ['admin-deliveries', page, pageSize, debouncedKeyword],
    queryFn: () => adminApi.deliveries.getAll({
      page,
      pageSize,
      keyword: debouncedKeyword || undefined,
    }),
  });

  // Удаление доставки
  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deliveries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-deliveries'] });
      toast.success('Доставка успешно удалена');
      setShowDeleteDialog(false);
      setDeleteDelivery(null);
    },
    onError: () => {
      toast.error('Ошибка при удалении доставки');
    },
  });

  const handleDelete = (delivery: DeliveryDto) => {
    setDeleteDelivery(delivery);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteDelivery) {
      deleteMutation.mutate(deleteDelivery.id);
    }
  };

  const getStatusBadge = (status: number, statusName?: string) => {
    const statusMap: Record<number, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
      1: { variant: 'default', color: 'bg-blue-100 text-blue-800' },
      2: { variant: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
      3: { variant: 'outline', color: 'bg-green-100 text-green-800' },
      4: { variant: 'destructive', color: 'bg-red-100 text-red-800' },
    };

    const statusConfig = statusMap[status] || { variant: 'outline', color: 'bg-gray-100 text-gray-800' };
    
    return (
      <Badge variant={statusConfig.variant} className={statusConfig.color}>
        {statusName || `Статус ${status}`}
      </Badge>
    );
  };

  const columns: Column<DeliveryDto>[] = [
    {
      key: 'orderNumber',
      title: 'Заказ',
      render: (value, delivery) => (
        <div>
          <p className="font-medium">#{value || delivery.orderId}</p>
          <p className="text-sm text-gray-500">ID: {delivery.orderId}</p>
        </div>
      ),
    },
    {
      key: 'deliveryAddress',
      title: 'Адрес доставки',
      render: (value) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'deliveryDate',
      title: 'Дата доставки',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {value ? new Date(value).toLocaleDateString('ru-RU') : 'Не назначена'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Статус',
      render: (value, delivery) => getStatusBadge(value, delivery.statusName),
    },
  ];

  const deliveries = deliveriesResponse?.data.data || [];
  const totalCount = deliveriesResponse?.data.totalCount || 0;
  const totalPages = deliveriesResponse?.data.totalPages || 0;

  if (isLoading) {
    return <Loader text="Загрузка доставок..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Доставки</h1>
          <p className="text-gray-600">Управление доставками заказов</p>
        </div>
        <Button onClick={() => navigate('/admin/deliveries/create')}>
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
            <SearchBar
              value={debouncedKeyword}
              onChange={setKeyword}
              placeholder="Поиск по номеру заказа или адресу..."
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Deliveries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список доставок</CardTitle>
          <CardDescription>
            Всего доставок: {totalCount}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={deliveries}
            columns={columns}
            isLoading={isLoading}
            onView={(delivery) => navigate(`/admin/deliveries/${delivery.id}`)}
            onEdit={(delivery) => navigate(`/admin/deliveries/${delivery.id}/edit`)}
            onDelete={handleDelete}
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
          setDeleteDelivery(null);
        }}
        onConfirm={confirmDelete}
        title="Удалить доставку"
        description={`Вы уверены, что хотите удалить доставку для заказа #${deleteDelivery?.orderNumber}? Это действие нельзя отменить.`}
        confirmText="Удалить"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
