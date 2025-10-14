"use client"

import React, { useState } from 'react'
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

// Mock data
const mockProducts = [
  {
    id: 1,
    name: 'Премиум искусственный газон',
    description: 'Высококачественный газон для дома',
    price: 2500,
    categoryId: 1,
    categoryName: 'Домашний газон',
    imageUrl: '/placeholder.jpg',
    isActive: true,
    stockQuantity: 50,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Спортивный газон',
    description: 'Профессиональный газон для стадионов',
    price: 3500,
    categoryId: 2,
    categoryName: 'Спортивный газон',
    imageUrl: null,
    isActive: true,
    stockQuantity: 25,
    createdAt: '2024-01-14'
  },
  {
    id: 3,
    name: 'Коммерческий газон',
    description: 'Газон для коммерческих объектов',
    price: 1800,
    categoryId: 3,
    categoryName: 'Коммерческий газон',
    imageUrl: '/placeholder.jpg',
    isActive: false,
    stockQuantity: 0,
    createdAt: '2024-01-13'
  }
]

export default function ProductsList() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [products] = useState(mockProducts)

  if (!isAdmin) {
    router.push('/')
    return null
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
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
                  <TableHead>Цена</TableHead>
                  <TableHead>Остаток</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-[100px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.categoryName}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.price.toLocaleString()} ₽</TableCell>
                    <TableCell>
                      <span className={product.stockQuantity && product.stockQuantity < 10 ? 'text-red-600 font-medium' : ''}>
                        {product.stockQuantity || 0} шт.
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? 'default' : 'secondary'}>
                        {product.isActive ? 'Активен' : 'Неактивен'}
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
  )
}
