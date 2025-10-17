"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useAuth } from '@/contexts/auth-context'
import { 
  getAdminProducts, 
  getAdminOrders, 
  getAdminDeliveries, 
  getAdminCategories,
  updateProduct,
  updateOrder,
  updateDelivery,
  updateCategory,
  getAdminOrderStatuses,
  getAdminDeliveryStatuses
} from '@/services/admin-api'
import { Loader2, Package, ShoppingCart, Truck, FolderOpen, Save, RefreshCw } from 'lucide-react'
import type { Product, Order, Delivery, Category } from '@/lib/types'

export default function UpdatePage() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Данные
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orderStatuses, setOrderStatuses] = useState<any[]>([])
  const [deliveryStatuses, setDeliveryStatuses] = useState<any[]>([])

  // Выбранные элементы для редактирования
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Формы редактирования
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    pricePerSquareMeter: 0,
    categoryId: '',
    minThickness: 0,
    maxThickness: 0
  })

  const [orderForm, setOrderForm] = useState({
    statusId: '',
    totalAmount: 0,
    notes: ''
  })

  const [deliveryForm, setDeliveryForm] = useState({
    statusId: '',
    deliveryDate: '',
    address: '',
    notes: ''
  })

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    if (isAdmin) {
      loadData()
    }
  }, [isAdmin])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.warn('Токен недоступен для загрузки данных обновления')
        router.push('/admin/login')
        return
      }

      const [productsData, ordersData, deliveriesData, categoriesData, orderStatusesData, deliveryStatusesData] = await Promise.all([
        getAdminProducts(),
        getAdminOrders(),
        getAdminDeliveries(),
        getAdminCategories(),
        getAdminOrderStatuses(),
        getAdminDeliveryStatuses()
      ])

      setProducts(productsData)
      setOrders(ordersData)
      setDeliveries(deliveriesData)
      setCategories(categoriesData)
      setOrderStatuses(orderStatusesData)
      setDeliveryStatuses(deliveryStatusesData)

    } catch (err: any) {
      console.error('Ошибка загрузки данных обновления:', err)
      
      if (err.message.includes('No authentication token') || err.message.includes('401')) {
        console.log('Ошибка авторизации, перенаправляем на страницу входа админ-панели')
        router.push('/admin/login')
        return
      }
      
      setError('Ошибка загрузки данных. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      setSelectedProduct(product)
      setProductForm({
        title: product.title || '',
        description: product.description || '',
        pricePerSquareMeter: product.pricePerSquareMeter || 0,
        categoryId: product.categoryId || '',
        minThickness: product.minThickness || 0,
        maxThickness: product.maxThickness || 0
      })
    }
  }

  const handleOrderSelect = (orderId: string) => {
    const order = orders.find(o => o.id === orderId)
    if (order) {
      setSelectedOrder(order)
      setOrderForm({
        statusId: order.status?.id || '',
        totalAmount: order.totalAmount || 0,
        notes: order.notes || ''
      })
    }
  }

  const handleDeliverySelect = (deliveryId: string) => {
    const delivery = deliveries.find(d => d.id === deliveryId)
    if (delivery) {
      setSelectedDelivery(delivery)
      setDeliveryForm({
        statusId: delivery.status?.id || '',
        deliveryDate: delivery.deliveryDate ? new Date(delivery.deliveryDate).toISOString().split('T')[0] : '',
        address: delivery.address || '',
        notes: delivery.notes || ''
      })
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    if (category) {
      setSelectedCategory(category)
      setCategoryForm({
        name: category.name || '',
        description: category.description || ''
      })
    }
  }

  const handleSaveProduct = async () => {
    if (!selectedProduct) return
    
    try {
      setSaving(true)
      setError(null)
      
      await updateProduct(selectedProduct.id, productForm)
      setSuccess('Товар успешно обновлен!')
      
      // Обновляем данные
      await loadData()
      
    } catch (err: any) {
      console.error('Ошибка обновления товара:', err)
      setError('Ошибка обновления товара. Попробуйте позже.')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveOrder = async () => {
    if (!selectedOrder) return
    
    try {
      setSaving(true)
      setError(null)
      
      await updateOrder(selectedOrder.id, orderForm)
      setSuccess('Заказ успешно обновлен!')
      
      // Обновляем данные
      await loadData()
      
    } catch (err: any) {
      console.error('Ошибка обновления заказа:', err)
      setError('Ошибка обновления заказа. Попробуйте позже.')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveDelivery = async () => {
    if (!selectedDelivery) return
    
    try {
      setSaving(true)
      setError(null)
      
      await updateDelivery(selectedDelivery.id, deliveryForm)
      setSuccess('Доставка успешно обновлена!')
      
      // Обновляем данные
      await loadData()
      
    } catch (err: any) {
      console.error('Ошибка обновления доставки:', err)
      setError('Ошибка обновления доставки. Попробуйте позже.')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveCategory = async () => {
    if (!selectedCategory) return
    
    try {
      setSaving(true)
      setError(null)
      
      await updateCategory(selectedCategory.id, categoryForm)
      setSuccess('Категория успешно обновлена!')
      
      // Обновляем данные
      await loadData()
      
    } catch (err: any) {
      console.error('Ошибка обновления категории:', err)
      setError('Ошибка обновления категории. Попробуйте позже.')
    } finally {
      setSaving(false)
    }
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Обновление данных</h1>
            <p className="text-gray-600 mt-1">Изменение статусов и информации о товарах, заказах, доставках и категориях</p>
          </div>
          <Button onClick={loadData} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Обновить данные
          </Button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Товары
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="deliveries" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Доставки
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Категории
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Выберите товар</CardTitle>
                  <CardDescription>Выберите товар для редактирования</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          selectedProduct?.id === product.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => handleProductSelect(product.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{product.title}</h3>
                            <p className="text-sm text-gray-600">{product.category?.name}</p>
                            <p className="text-sm font-semibold text-green-600">
                              ₽{product.pricePerSquareMeter}/м²
                            </p>
                          </div>
                          <Badge variant="outline">{product.id.slice(-4)}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Редактировать товар</CardTitle>
                  <CardDescription>
                    {selectedProduct ? `Редактирование: ${selectedProduct.title}` : 'Выберите товар для редактирования'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedProduct ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="product-title">Название</Label>
                        <Input
                          id="product-title"
                          value={productForm.title}
                          onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="product-description">Описание</Label>
                        <Textarea
                          id="product-description"
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="product-price">Цена за м² (₽)</Label>
                        <Input
                          id="product-price"
                          type="number"
                          value={productForm.pricePerSquareMeter}
                          onChange={(e) => setProductForm({ ...productForm, pricePerSquareMeter: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="product-category">Категория</Label>
                        <Select value={productForm.categoryId} onValueChange={(value) => setProductForm({ ...productForm, categoryId: value })}>
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
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="product-min-thickness">Мин. толщина (мм)</Label>
                          <Input
                            id="product-min-thickness"
                            type="number"
                            value={productForm.minThickness}
                            onChange={(e) => setProductForm({ ...productForm, minThickness: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="product-max-thickness">Макс. толщина (мм)</Label>
                          <Input
                            id="product-max-thickness"
                            type="number"
                            value={productForm.maxThickness}
                            onChange={(e) => setProductForm({ ...productForm, maxThickness: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <Button onClick={handleSaveProduct} disabled={saving} className="w-full">
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      Выберите товар для редактирования
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Выберите заказ</CardTitle>
                  <CardDescription>Выберите заказ для изменения статуса</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          selectedOrder?.id === order.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => handleOrderSelect(order.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">Заказ #{order.id.slice(-6)}</h3>
                            <p className="text-sm text-gray-600">
                              {order.customer?.firstName} {order.customer?.lastName}
                            </p>
                            <p className="text-sm font-semibold text-green-600">
                              ₽{order.totalAmount?.toLocaleString()}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {order.status?.name || 'Без статуса'}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Изменить статус заказа</CardTitle>
                  <CardDescription>
                    {selectedOrder ? `Заказ #${selectedOrder.id.slice(-6)}` : 'Выберите заказ для редактирования'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedOrder ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="order-status">Статус заказа</Label>
                        <Select value={orderForm.statusId} onValueChange={(value) => setOrderForm({ ...orderForm, statusId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите статус" />
                          </SelectTrigger>
                          <SelectContent>
                            {orderStatuses.map((status) => (
                              <SelectItem key={status.id} value={status.id}>
                                {status.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="order-amount">Сумма заказа (₽)</Label>
                        <Input
                          id="order-amount"
                          type="number"
                          value={orderForm.totalAmount}
                          onChange={(e) => setOrderForm({ ...orderForm, totalAmount: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="order-notes">Примечания</Label>
                        <Textarea
                          id="order-notes"
                          value={orderForm.notes}
                          onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleSaveOrder} disabled={saving} className="w-full">
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      Выберите заказ для редактирования
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Deliveries Tab */}
          <TabsContent value="deliveries">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Выберите доставку</CardTitle>
                  <CardDescription>Выберите доставку для изменения статуса</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {deliveries.map((delivery) => (
                      <div
                        key={delivery.id}
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          selectedDelivery?.id === delivery.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => handleDeliverySelect(delivery.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">Доставка #{delivery.id.slice(-6)}</h3>
                            <p className="text-sm text-gray-600">{delivery.address}</p>
                            <p className="text-sm text-gray-500">
                              {delivery.deliveryDate ? new Date(delivery.deliveryDate).toLocaleDateString() : 'Дата не указана'}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {delivery.status?.name || 'Без статуса'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Изменить статус доставки</CardTitle>
                  <CardDescription>
                    {selectedDelivery ? `Доставка #${selectedDelivery.id.slice(-6)}` : 'Выберите доставку для редактирования'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDelivery ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="delivery-status">Статус доставки</Label>
                        <Select value={deliveryForm.statusId} onValueChange={(value) => setDeliveryForm({ ...deliveryForm, statusId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите статус" />
                          </SelectTrigger>
                          <SelectContent>
                            {deliveryStatuses.map((status) => (
                              <SelectItem key={status.id} value={status.id}>
                                {status.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="delivery-date">Дата доставки</Label>
                        <Input
                          id="delivery-date"
                          type="date"
                          value={deliveryForm.deliveryDate}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="delivery-address">Адрес доставки</Label>
                        <Input
                          id="delivery-address"
                          value={deliveryForm.address}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="delivery-notes">Примечания</Label>
                        <Textarea
                          id="delivery-notes"
                          value={deliveryForm.notes}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, notes: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleSaveDelivery} disabled={saving} className="w-full">
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      Выберите доставку для редактирования
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Выберите категорию</CardTitle>
                  <CardDescription>Выберите категорию для редактирования</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          selectedCategory?.id === category.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{category.name}</h3>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </div>
                          <Badge variant="outline">{category.id.slice(-4)}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Редактировать категорию</CardTitle>
                  <CardDescription>
                    {selectedCategory ? `Редактирование: ${selectedCategory.name}` : 'Выберите категорию для редактирования'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedCategory ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="category-name">Название категории</Label>
                        <Input
                          id="category-name"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category-description">Описание</Label>
                        <Textarea
                          id="category-description"
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleSaveCategory} disabled={saving} className="w-full">
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      Выберите категорию для редактирования
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
