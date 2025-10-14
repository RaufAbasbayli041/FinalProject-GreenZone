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
import { adminApi, ProductDto } from '../../api/endpoints';
import { useEntityList } from '../../hooks/useEntityManagement';
import { Plus, Eye, Edit, Trash2, Image, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ProductsList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteProduct, setDeleteProduct] = useState<ProductDto | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { page, pageSize, debouncedKeyword, setKeyword, goToPage, changePageSize } = useEntityList({}, 1, 10);

  // Загрузка товаров
  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ['admin-products', page, pageSize, debouncedKeyword],
    queryFn: () => adminApi.products.getAll({
      page,
      pageSize,
      keyword: debouncedKeyword || undefined,
    }),
  });

  // Удаление товара
  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.products.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Товар успешно удален');
      setShowDeleteDialog(false);
      setDeleteProduct(null);
    },
    onError: () => {
      toast.error('Ошибка при удалении товара');
    },
  });

  const handleDelete = (product: ProductDto) => {
    setDeleteProduct(product);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteProduct) {
      deleteMutation.mutate(deleteProduct.id);
    }
  };

  const columns: Column<ProductDto>[] = [
    {
      key: 'imageUrl',
      title: 'Изображение',
      render: (value, product) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          {value ? (
            <img
              src={value}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image className="h-6 w-6 text-gray-400" />
          )}
        </div>
      ),
      width: '80px',
    },
    {
      key: 'name',
      title: 'Название',
      render: (value, product) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-sm text-gray-500">{product.categoryName}</p>
        </div>
      ),
    },
    {
      key: 'price',
      title: 'Цена',
      render: (value) => (
        <span className="font-medium">{value.toLocaleString()} ₽</span>
      ),
    },
    {
      key: 'stockQuantity',
      title: 'Остаток',
      render: (value) => (
        <span className={value && value < 10 ? 'text-red-600 font-medium' : ''}>
          {value || 0} шт.
        </span>
      ),
    },
    {
      key: 'isActive',
      title: 'Статус',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Активен' : 'Неактивен'}
        </Badge>
      ),
    },
  ];

  const products = productsResponse?.data.data || [];
  const totalCount = productsResponse?.data.totalCount || 0;
  const totalPages = productsResponse?.data.totalPages || 0;

  const getProductActions = (product: ProductDto) => [
    {
      label: 'Загрузить изображение',
      onClick: () => navigate(`/admin/products/${product.id}/upload-image`),
      icon: <Image className="h-4 w-4" />,
    },
    {
      label: 'Загрузить документы',
      onClick: () => navigate(`/admin/products/${product.id}/upload-documents`),
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  if (isLoading) {
    return <Loader text="Загрузка товаров..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Товары</h1>
          <p className="text-gray-600">Управление каталогом товаров</p>
        </div>
        <Button onClick={() => navigate('/admin/products/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить товар
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
              placeholder="Поиск по названию товара..."
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список товаров</CardTitle>
          <CardDescription>
            Всего товаров: {totalCount}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={products}
            columns={columns}
            isLoading={isLoading}
            onView={(product) => navigate(`/admin/products/${product.id}`)}
            onEdit={(product) => navigate(`/admin/products/${product.id}/edit`)}
            onDelete={handleDelete}
            actions={getProductActions(products[0])} // Это нужно будет исправить для каждого товара отдельно
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
          setDeleteProduct(null);
        }}
        onConfirm={confirmDelete}
        title="Удалить товар"
        description={`Вы уверены, что хотите удалить товар "${deleteProduct?.name}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
