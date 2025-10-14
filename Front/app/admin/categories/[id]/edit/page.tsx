"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useAuth } from '@/contexts/auth-context'
import { getAdminCategories, updateAdminCategory } from '@/services/admin-api'
import { CategoryUpdateDto, Category } from '@/lib/types'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const { isAdmin } = useAuth()
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState<Category | null>(null)

  const [formData, setFormData] = useState<CategoryUpdateDto>({
    name: '',
    description: ''
  })

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
      setCategoriesLoading(true)
      const categories = await getAdminCategories()
      const foundCategory = categories.find(cat => cat.id === categoryId)
      
      if (foundCategory) {
        setCategory(foundCategory)
        setFormData({
          name: foundCategory.name || '',
          description: foundCategory.description || ''
        })
      } else {
        setError('Категория не найдена')
      }
    } catch (err: any) {
      console.error('Ошибка загрузки категории:', err)
      setError('Ошибка загрузки категории')
    } finally {
      setCategoriesLoading(false)
    }
  }

  const handleInputChange = (field: keyof CategoryUpdateDto, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name) {
      setError('Пожалуйста, введите название категории')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      await updateAdminCategory(categoryId, formData)
      router.push('/admin/categories')
    } catch (err: any) {
      console.error('Ошибка обновления категории:', err)
      setError(err.message || 'Ошибка обновления категории')
    } finally {
      setLoading(false)
    }
  }

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

  if (error && !category) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Редактировать категорию</h1>
              <p className="text-gray-600">Изменить информацию о категории</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Информация о категории</CardTitle>
            <CardDescription>
              Измените поля для обновления категории
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
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Название категории *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Введите название категории"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Введите описание категории"
                    rows={3}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/categories')}
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
