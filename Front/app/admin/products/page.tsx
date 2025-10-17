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
import { Plus, Eye, Edit, Trash2, MoreHorizontal, Search, X, Image, FileText } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getAdminProducts } from '@/services/admin-api'
import { Loader2 } from 'lucide-react'

export default function ProductsList() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAdmin) {
      loadProducts()
    }
  }, [isAdmin])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.warn('Токен недоступен для загрузки товаров')
        router.push('/admin/login')
        return
      }
      
      const productsData = await getAdminProducts()
      setProducts(productsData)
    } catch (err: any) {
      console.error('Ошибка загрузки товаров:', err)
      
      if (err.message.includes('No authentication token') || err.message.includes('401')) {
        console.log('Ошибка авторизации, перенаправляем на страницу входа админ-панели')
        router.push('/admin/login')
        return
      }
      
      if (err.message.includes('404')) {
        console.log('Админ API эндпоинт товаров еще не реализован')
        setProducts([])
        setError(null)
        return
      }
      
      setError(err.message || 'Ошибка загрузки товаров')
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

  const filteredProducts = (products || []).filter(product =>
    product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product?.category?.name && product.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <Button onClick={loadProducts}>Попробовать снова</Button>
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
          <h1 className="text-2xl font-bold text-gray-900">Товары</h1>
          <p className="text-gray-600">Управление каталогом товаров</p>
        </div>
        <Button onClick={() => router.push('/admin/products/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить товар
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Поиск по названию товара..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список товаров</CardTitle>
          <CardDescription>
            Всего товаров: {filteredProducts.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Изображение</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Цена за м²</TableHead>
                  <TableHead>Толщина</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-[100px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product?.id || 'unknown'}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {product?.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product?.name || 'Товар'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product?.title || 'Без названия'}</p>
                        <p className="text-sm text-gray-500">{product?.category?.name || 'Без категории'}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{(product?.pricePerSquareMeter || 0).toLocaleString()} ₽/м²</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>Толщина: {product?.minThickness || 0}-{product?.maxThickness || 0} мм</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">
                        Активен
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/products/${product.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Просмотр
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/admin/products/${product.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/admin/products/${product.id}/upload-image`)}>
                            <Image className="mr-2 h-4 w-4" />
                            Загрузить изображение
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/admin/products/${product.id}/upload-documents`)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Загрузить документы
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
