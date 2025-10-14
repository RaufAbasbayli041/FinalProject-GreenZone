import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { adminApi, CreateProductDto } from '../../api/endpoints';
import { Loader } from '../../components/admin/Loader';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  isActive: boolean;
  stockQuantity: number;
}

export const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    defaultValues: {
      isActive: true,
      stockQuantity: 0,
    },
  });

  const isActive = watch('isActive');

  // Загрузка категорий для выбора
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin-categories-select'],
    queryFn: () => adminApi.categories.getAll(),
  });

  // Создание товара
  const createMutation = useMutation({
    mutationFn: (data: CreateProductDto) => adminApi.products.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Товар успешно создан');
      navigate(`/admin/products/${response.data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка при создании товара');
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({
        name: data.name,
        description: data.description || undefined,
        price: data.price,
        categoryId: data.categoryId,
        isActive: data.isActive,
        stockQuantity: data.stockQuantity,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (categoriesLoading) {
    return <Loader text="Загрузка категорий..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/products')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Создать товар</h1>
          <p className="text-gray-600">Добавление нового товара в каталог</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Информация о товаре</CardTitle>
          <CardDescription>
            Заполните необходимые поля для создания товара
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Название товара *</Label>
              <Input
                id="name"
                placeholder="Введите название товара..."
                {...register('name', { required: 'Название товара обязательно' })}
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
                placeholder="Введите описание товара..."
                {...register('description')}
                className="min-h-[120px]"
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Цена (₽) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register('price', { 
                    required: 'Цена обязательна',
                    min: { value: 0, message: 'Цена не может быть отрицательной' }
                  })}
                />
                {errors.price && (
                  <p className="text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="categoryId">Категория *</Label>
                <Select
                  onValueChange={(value) => setValue('categoryId', Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-red-600">Выберите категорию</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Stock Quantity */}
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Количество на складе</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register('stockQuantity', { 
                    min: { value: 0, message: 'Количество не может быть отрицательным' }
                  })}
                />
                {errors.stockQuantity && (
                  <p className="text-sm text-red-600">{errors.stockQuantity.message}</p>
                )}
              </div>

              {/* Active Status */}
              <div className="space-y-2">
                <Label htmlFor="isActive">Статус товара</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={(checked) => setValue('isActive', checked)}
                  />
                  <Label htmlFor="isActive" className="text-sm">
                    {isActive ? 'Активен' : 'Неактивен'}
                  </Label>
                </div>
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
                {isSubmitting ? 'Создание...' : 'Создать товар'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/products')}
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
