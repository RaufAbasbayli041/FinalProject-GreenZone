import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { adminApi, CreateCategoryDto } from '../../api/endpoints';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CategoryFormData {
  name: string;
  description: string;
  isActive: boolean;
}

export const CategoryCreate: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    defaultValues: {
      isActive: true,
    },
  });

  const isActive = watch('isActive');

  // Создание категории
  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryDto) => adminApi.categories.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Категория успешно создана');
      navigate('/admin/categories');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка при создании категории');
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({
        name: data.name,
        description: data.description || undefined,
        isActive: data.isActive,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/categories')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Создать категорию</h1>
          <p className="text-gray-600">Добавление новой категории товаров</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Информация о категории</CardTitle>
          <CardDescription>
            Заполните необходимые поля для создания категории
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Category Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Название категории *</Label>
              <Input
                id="name"
                placeholder="Введите название категории..."
                {...register('name', { required: 'Название категории обязательно' })}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Введите описание категории..."
                {...register('description')}
                className="min-h-[120px]"
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="space-y-2">
              <Label htmlFor="isActive">Статус категории</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={(checked) => setValue('isActive', checked)}
                />
                <Label htmlFor="isActive" className="text-sm">
                  {isActive ? 'Активна' : 'Неактивна'}
                </Label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Создание...' : 'Создать категорию'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/categories')}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
