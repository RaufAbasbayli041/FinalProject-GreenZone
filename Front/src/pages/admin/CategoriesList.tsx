import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { DataTable, Column } from '../../components/admin/DataTable';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Loader } from '../../components/admin/Loader';
import { adminApi, CategoryDto } from '../../api/endpoints';
import { Plus, Edit, Trash2, FolderOpen, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const CategoriesList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteCategory, setDeleteCategory] = useState<CategoryDto | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Загрузка категорий
  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.categories.getAll(),
  });

  // Удаление категории
  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.categories.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Категория успешно удалена');
      setShowDeleteDialog(false);
      setDeleteCategory(null);
    },
    onError: () => {
      toast.error('Ошибка при удалении категории');
    },
  });

  const handleDelete = (category: CategoryDto) => {
    setDeleteCategory(category);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteCategory) {
      deleteMutation.mutate(deleteCategory.id);
    }
  };

  const columns: Column<CategoryDto>[] = [
    {
      key: 'name',
      title: 'Название',
      render: (value, category) => (
        <div className="flex items-center gap-3">
          <FolderOpen className="h-5 w-5 text-gray-400" />
          <div>
            <p className="font-medium">{value}</p>
            {category.description && (
              <p className="text-sm text-gray-500">{category.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'isActive',
      title: 'Статус',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Активна' : 'Неактивна'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      title: 'Дата создания',
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

  if (isLoading) {
    return <Loader text="Загрузка категорий..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Категории</h1>
          <p className="text-gray-600">Управление категориями товаров</p>
        </div>
        <Button onClick={() => navigate('/admin/categories/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить категорию
        </Button>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список категорий</CardTitle>
          <CardDescription>
            Всего категорий: {categories?.length || 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={categories || []}
            columns={columns}
            isLoading={isLoading}
            onEdit={(category) => navigate(`/admin/categories/${category.id}/edit`)}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeleteCategory(null);
        }}
        onConfirm={confirmDelete}
        title="Удалить категорию"
        description={`Вы уверены, что хотите удалить категорию "${deleteCategory?.name}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
