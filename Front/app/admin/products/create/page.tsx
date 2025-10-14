"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useAuth } from '@/contexts/auth-context'
import { createAdminProduct, getAdminCategories } from '@/services/admin-api'
import { ProductCreateDto, Category } from '@/lib/types'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

export default function CreateProductPage() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<ProductCreateDto>({
    title: '',
    description: '',
    pricePerSquareMeter: 0,
    minThickness: 0,
    maxThickness: 0,
    imageUrl: '',
    categoryId: ''
  })

  useEffect(() => {
    if (isAdmin) {
      loadCategories()
    }
  }, [isAdmin])

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true)
      const categoriesData = await getAdminCategories()
      setCategories(categoriesData)
    } catch (err: any) {
      console.error('Ошибка загрузки категорий:', err)
      setError('Ошибка загрузки категорий')
    } finally {
      setCategoriesLoading(false)
    }
  }

  const handleInputChange = (field: keyof ProductCreateDto, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.categoryId) {
      setError('Пожалуйста, заполните все обязательные поля')
      return
    }

    if (formData.pricePerSquareMeter <= 0) {
      setError('Цена за квадратный метр должна быть больше 0')
      return
    }

    if (formData.minThickness >= formData.maxThickness) {
      setError('Минимальная толщина должна быть меньше максимальной')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      await createAdminProduct(formData)
      router.push('/admin/products')
    } catch (err: any) {
      console.error('Ошибка создания товара:', err)
      setError(err.message || 'Ошибка создания товара')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAdmin) {
      router.push('/')
    }
  }, [isAdmin, router])

  if (!isAdmin) {
    return null
  }

  if (categoriesLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
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
              <h1 className="text-2xl font-bold text-gray-900">Создать товар</h1>
              <p className="text-gray-600">Добавить новый товар в каталог</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Информация о товаре</CardTitle>
            <CardDescription>
              Заполните все поля для создания нового товара
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Название товара *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Введите название товара"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Категория *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => handleInputChange('categoryId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Цена за м² (₽) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.pricePerSquareMeter}
                    onChange={(e) => handleInputChange('pricePerSquareMeter', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Min Thickness */}
                <div className="space-y-2">
                  <Label htmlFor="minThickness">Минимальная толщина (мм) *</Label>
                  <Input
                    id="minThickness"
                    type="number"
                    min="0"
                    value={formData.minThickness}
                    onChange={(e) => handleInputChange('minThickness', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    required
                  />
                </div>

                {/* Max Thickness */}
                <div className="space-y-2">
                  <Label htmlFor="maxThickness">Максимальная толщина (мм) *</Label>
                  <Input
                    id="maxThickness"
                    type="number"
                    min="0"
                    value={formData.maxThickness}
                    onChange={(e) => handleInputChange('maxThickness', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    required
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL изображения</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Описание *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Введите описание товара"
                  rows={4}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/products')}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Создание...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Создать товар
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}