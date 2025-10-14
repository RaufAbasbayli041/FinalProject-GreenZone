"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useAuth } from '@/contexts/auth-context'
import { getAdminProducts, getAdminCategories, updateAdminProduct } from '@/services/admin-api'
import { ProductUpdateDto, Product, Category } from '@/lib/types'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const { isAdmin } = useAuth()
  const [loading, setLoading] = useState(false)
  const [productsLoading, setProductsLoading] = useState(true)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  const [formData, setFormData] = useState<ProductUpdateDto>({
    title: '',
    description: '',
    pricePerSquareMeter: 0,
    minThickness: 0,
    maxThickness: 0,
    imageUrl: '',
    categoryId: ''
  })

  const productId = params?.id as string

  useEffect(() => {
    if (!isAdmin) {
      router.push('/')
    }
  }, [isAdmin, router])

  useEffect(() => {
    if (isAdmin && productId) {
      loadData()
    }
  }, [isAdmin, productId])

  const loadData = async () => {
    try {
      setProductsLoading(true)
      setCategoriesLoading(true)
      
      const [products, categoriesData] = await Promise.all([
        getAdminProducts(),
        getAdminCategories()
      ])
      
      const foundProduct = products.find(prod => prod.id === productId)
      
      if (foundProduct) {
        setProduct(foundProduct)
        setFormData({
          title: foundProduct.title || '',
          description: foundProduct.description || '',
          pricePerSquareMeter: foundProduct.pricePerSquareMeter || 0,
          minThickness: foundProduct.minThickness || 0,
          maxThickness: foundProduct.maxThickness || 0,
          imageUrl: foundProduct.imageUrl || '',
          categoryId: foundProduct.categoryId || ''
        })
      } else {
        setError('Товар не найден')
      }
      
      setCategories(categoriesData)
    } catch (err: any) {
      console.error('Ошибка загрузки данных:', err)
      setError('Ошибка загрузки данных')
    } finally {
      setProductsLoading(false)
      setCategoriesLoading(false)
    }
  }

  const handleInputChange = (field: keyof ProductUpdateDto, value: string | number) => {
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
      
      await updateAdminProduct(productId, formData)
      router.push('/admin/products')
    } catch (err: any) {
      console.error('Ошибка обновления товара:', err)
      setError(err.message || 'Ошибка обновления товара')
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return null
  }

  if (productsLoading || categoriesLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </AdminLayout>
    )
  }

  if (error && !product) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Редактировать товар</h1>
              <p className="text-gray-600">Изменить информацию о товаре</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Информация о товаре</CardTitle>
            <CardDescription>
              Измените поля для обновления товара
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
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Сохранить изменения
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
