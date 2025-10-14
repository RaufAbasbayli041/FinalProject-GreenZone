"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useAuth } from '@/contexts/auth-context'
import { getAdminProducts } from '@/services/admin-api'
import { Product } from '@/lib/types'
import { ArrowLeft, Edit, Calendar, Loader2, Package, DollarSign, Ruler } from 'lucide-react'

export default function ViewProductPage() {
  const router = useRouter()
  const params = useParams()
  const { isAdmin } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<Product | null>(null)

  const productId = params?.id as string

  useEffect(() => {
    if (!isAdmin) {
      router.push('/')
    }
  }, [isAdmin, router])

  useEffect(() => {
    if (isAdmin && productId) {
      loadProduct()
    }
  }, [isAdmin, productId])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const products = await getAdminProducts()
      const foundProduct = products.find(prod => prod.id === productId)
      
      if (foundProduct) {
        setProduct(foundProduct)
      } else {
        setError('Товар не найден')
      }
    } catch (err: any) {
      console.error('Ошибка загрузки товара:', err)
      setError('Ошибка загрузки товара')
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return null
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </AdminLayout>
    )
  }

  if (error || !product) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error || 'Товар не найден'}</p>
            <Button onClick={() => router.push('/admin/products')}>
              Вернуться к товарам
            </Button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/products')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к товарам
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
              <p className="text-gray-600">Информация о товаре</p>
            </div>
          </div>
          <Button onClick={() => router.push(`/admin/products/${productId}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
              <CardDescription>Детали товара</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Название</label>
                <p className="text-lg font-semibold">{product.title}</p>
              </div>
              
              {product.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Описание</label>
                  <p className="text-gray-700">{product.description}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-500">Категория</label>
                <p className="text-gray-700">{product.category?.name || 'Без категории'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Статус</label>
                <div className="mt-1">
                  <Badge variant="default">Активен</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing and Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Цена и характеристики</CardTitle>
              <CardDescription>Технические параметры товара</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Цена за м²</label>
                <div className="flex items-center gap-2 mt-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <p className="text-lg font-semibold text-green-600">
                    {product.pricePerSquareMeter?.toLocaleString()} ₽
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Толщина</label>
                <div className="flex items-center gap-2 mt-1">
                  <Ruler className="h-4 w-4 text-gray-400" />
                  <span>
                    {product.minThickness || 0} - {product.maxThickness || 0} мм
                  </span>
                </div>
              </div>
              
              {product.imageUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Изображение</label>
                  <div className="mt-2">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Дополнительная информация</CardTitle>
            <CardDescription>Метаданные товара</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">ID товара</label>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">{product.id}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">ID категории</label>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">{product.categoryId}</p>
              </div>
              
              {product.createdAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Дата создания</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{new Date(product.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              )}
              
              {product.updatedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Дата обновления</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{new Date(product.updatedAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
