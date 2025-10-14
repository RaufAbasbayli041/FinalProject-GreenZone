"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useAuth } from '@/contexts/auth-context'
import { getAdminCategories } from '@/services/admin-api'
import { Category } from '@/lib/types'
import { ArrowLeft, Edit, Calendar, Loader2 } from 'lucide-react'

export default function ViewCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const { isAdmin } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState<Category | null>(null)

  const categoryId = params?.id as string

  useEffect(() => {
    if (!isAdmin) {
      router.push('/')
    }
  }, [isAdmin, router])

  useEffect(() => {
    if (isAdmin && categoryId) {
      loadCategory()
    }
  }, [isAdmin, categoryId])

  const loadCategory = async () => {
    try {
      setLoading(true)
      const categories = await getAdminCategories()
      const foundCategory = categories.find(cat => cat.id === categoryId)
      
      if (foundCategory) {
        setCategory(foundCategory)
      } else {
        setError('Категория не найдена')
      }
    } catch (err: any) {
      console.error('Ошибка загрузки категории:', err)
      setError('Ошибка загрузки категории')
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

  if (error || !category) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error || 'Категория не найдена'}</p>
            <Button onClick={() => router.push('/admin/categories')}>
              Вернуться к категориям
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
              onClick={() => router.push('/admin/categories')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к категориям
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-gray-600">Информация о категории</p>
            </div>
          </div>
          <Button onClick={() => router.push(`/admin/categories/${categoryId}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
        </div>

        {/* Category Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
              <CardDescription>Детали категории</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Название</label>
                <p className="text-lg font-semibold">{category.name}</p>
              </div>
              
              {category.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Описание</label>
                  <p className="text-gray-700">{category.description}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-500">Статус</label>
                <div className="mt-1">
                  <Badge variant="default">Активна</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Дополнительная информация</CardTitle>
              <CardDescription>Метаданные категории</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">ID категории</label>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">{category.id}</p>
              </div>
              
              {category.createdAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Дата создания</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{new Date(category.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              )}
              
              {category.products && category.products.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Количество товаров</label>
                  <p className="text-lg font-semibold text-green-600">{category.products.length}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Products in Category */}
        {category.products && category.products.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Товары в категории</CardTitle>
              <CardDescription>Список товаров, принадлежащих этой категории</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {category.products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-gray-500">ID: {product.id}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/products/${product.id}`)}
                    >
                      Просмотр
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
