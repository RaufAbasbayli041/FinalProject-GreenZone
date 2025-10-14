import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { adminApi, CreateOrderDto } from '../../api/endpoints';
import { Loader } from '../../components/admin/Loader';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface OrderFormData {
  customerId: number;
  deliveryAddress: string;
  notes: string;
}

export const OrderCreate: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OrderFormData>();

  // Загрузка клиентов для выбора
  const { data: customersResponse, isLoading: customersLoading } = useQuery({
    queryKey: ['admin-customers-select'],
    queryFn: () => adminApi.customers.getAll({ pageSize: 100 }),
  });

  const customers = customersResponse?.data.data || [];

  // Создание заказа
  const createMutation = useMutation({
    mutationFn: (data: CreateOrderDto) => adminApi.orders.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Заказ успешно создан');
      navigate(`/admin/orders/${response.data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка при создании заказа');
    },
  });

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({
        customerId: data.customerId,
        deliveryAddress: data.deliveryAddress || undefined,
        notes: data.notes || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (customersLoading) {
    return <Loader text="Загрузка клиентов..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/orders')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Создать заказ</h1>
          <p className="text-gray-600">Создание нового заказа для клиента</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Информация о заказе</CardTitle>
          <CardDescription>
            Заполните необходимые поля для создания заказа
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Selection */}
            <div className="space-y-2">
              <Label htmlFor="customerId">Клиент *</Label>
              <Select
                onValueChange={(value) => setValue('customerId', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите клиента" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.firstName} {customer.lastName} ({customer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customerId && (
                <p className="text-sm text-red-600">Выберите клиента</p>
              )}
            </div>

            {/* Delivery Address */}
            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">Адрес доставки</Label>
              <Textarea
                id="deliveryAddress"
                placeholder="Введите адрес доставки..."
                {...register('deliveryAddress')}
                className="min-h-[100px]"
              />
              {errors.deliveryAddress && (
                <p className="text-sm text-red-600">{errors.deliveryAddress.message}</p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Примечания</Label>
              <Textarea
                id="notes"
                placeholder="Дополнительная информация о заказе..."
                {...register('notes')}
                className="min-h-[100px]"
              />
              {errors.notes && (
                <p className="text-sm text-red-600">{errors.notes.message}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Создание...' : 'Создать заказ'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/orders')}
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
