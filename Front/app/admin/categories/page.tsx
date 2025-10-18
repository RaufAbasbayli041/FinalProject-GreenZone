"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, Eye, Edit, Trash2, MoreHorizontal, FolderOpen, Calendar, Search, X } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getAdminCategories } from '@/services/admin-api'
import { Loader2 } from 'lucide-react'

export default function CategoriesList() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  
  // Early return for non-admin users before any other hooks
  if (!isAdmin) {
    router.push('/')
    return null
  }

  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.warn('Токен недоступен для загрузки категорий')
        router.push('/admin/login')
        return
      }
      
      const categoriesData = await getAdminCategories()
      setCategories(categoriesData)
    } catch (err: any) {
      console.error('Ошибка загрузки категорий:', err)
      
      if (err.message.includes('No authentication token') || err.message.includes('401')) {
        console.log('Ошибка авторизации, перенаправляем на страницу входа админ-панели')
        router.push('/admin/login')
        return
      }
      
      if (err.message.includes('404')) {
        console.log('Админ API эндпоинт категорий еще не реализован')
        setCategories([])
        setError(null)
        return
      }
      
      setError(err.message || 'Ошибка загрузки категорий')
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = (categories || []).filter(category =>
    category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category?.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadCategories}>Попробовать снова</Button>
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Категории</h1>
          <p className="text-gray-600">Управление категориями товаров</p>
        </div>
        <Button onClick={() => router.push('/admin/categories/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Создать категорию
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
          <CardDescription>Фильтруйте категории по названию или описанию.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск по названию или описанию..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            {searchTerm && (
              <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список категорий</CardTitle>
          <CardDescription>
            Всего категорий: {filteredCategories.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата создания</TableHead>
                  <TableHead className="w-[100px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category?.id || 'unknown'}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <FolderOpen className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{category?.name || 'Без названия'}</p>
                          {category?.description && (
                            <p className="text-sm text-gray-500">{category.description}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">
                        Активна
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {category?.createdAt ? new Date(category.createdAt).toLocaleDateString('ru-RU') : 'Неизвестно'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/categories/${category?.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Просмотр
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/admin/categories/${category?.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  )
}
