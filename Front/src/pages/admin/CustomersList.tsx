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
import { adminApi, CustomerDto } from '../../api/endpoints';
import { useEntityList } from '../../hooks/useEntityManagement';
import { Eye, Trash2, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const CustomersList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteCustomer, setDeleteCustomer] = useState<CustomerDto | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { page, pageSize, debouncedKeyword, setKeyword, goToPage, changePageSize } = useEntityList({}, 1, 10);

  // Загрузка клиентов
  const { data: customersResponse, isLoading } = useQuery({
    queryKey: ['admin-customers', page, pageSize, debouncedKeyword],
    queryFn: () => adminApi.customers.getAll({
      page,
      pageSize,
      keyword: debouncedKeyword || undefined,
    }),
  });

  // Удаление клиента
  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.customers.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
      toast.success('Клиент успешно удален');
      setShowDeleteDialog(false);
      setDeleteCustomer(null);
    },
    onError: () => {
      toast.error('Ошибка при удалении клиента');
    },
  });

  const handleDelete = (customer: CustomerDto) => {
    setDeleteCustomer(customer);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteCustomer) {
      deleteMutation.mutate(deleteCustomer.id);
    }
  };

  const columns: Column<CustomerDto>[] = [
    {
      key: 'firstName',
      title: 'Клиент',
      render: (value, customer) => (
        <div>
          <p className="font-medium">{customer.firstName} {customer.lastName}</p>
          <p className="text-sm text-gray-500">ID: {customer.id}</p>
        </div>
      ),
    },
    {
      key: 'email',
      title: 'Email',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      title: 'Телефон',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{value || 'Не указан'}</span>
        </div>
      ),
    },
    {
      key: 'address',
      title: 'Адрес',
      render: (value) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{value || 'Не указан'}</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      title: 'Дата регистрации',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {value ? new Date(value).toLocaleDateString('ru-RU') : 'Неизвестно'}
          </span>
        </div>
      ),
    },
  ];

  const customers = customersResponse?.data.data || [];
  const totalCount = customersResponse?.data.totalCount || 0;
  const totalPages = customersResponse?.data.totalPages || 0;

  if (isLoading) {
    return <Loader text="Загрузка клиентов..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Клиенты</h1>
          <p className="text-gray-600">Управление клиентской базой</p>
        </div>
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
              placeholder="Поиск по имени, email или телефону..."
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список клиентов</CardTitle>
          <CardDescription>
            Всего клиентов: {totalCount}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={customers}
            columns={columns}
            isLoading={isLoading}
            onView={(customer) => navigate(`/admin/customers/${customer.id}`)}
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
          setDeleteCustomer(null);
        }}
        onConfirm={confirmDelete}
        title="Удалить клиента"
        description={`Вы уверены, что хотите удалить клиента "${deleteCustomer?.firstName} ${deleteCustomer?.lastName}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
