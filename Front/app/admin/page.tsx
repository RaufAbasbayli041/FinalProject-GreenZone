"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context-new"
import type { Order, Product, User } from "@/lib/types"
import { storage, generateId } from "@/lib/storage"
import { initialProducts } from "@/lib/data"

export default function AdminPage() {
  const { user, isAuthenticated, logout, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "landscape" as "landscape" | "sports" | "decorative",
    image: "",
    height: "",
    density: "",
    warranty: "",
    popular: false,
    premium: false,
  })

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user?.isAdmin)) {
      router.push("/")
    }
  }, [isAuthenticated, user, loading, router])

  useEffect(() => {
    if (user?.isAdmin) {
      loadData()
    }
  }, [user])

  const loadData = () => {
    const loadedProducts = storage.getProducts()
    setProducts(loadedProducts.length > 0 ? loadedProducts : initialProducts)

    const loadedOrders = storage.getOrders()
    setOrders(loadedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))

    const loadedUsers = storage.getUsers()
    setUsers(loadedUsers)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">{t('admin.accessDenied')}</div>
          <p className="text-muted-foreground mb-4">{t('admin.noAccess')}</p>
          <Button onClick={() => router.push("/")}>{t('admin.goHome')}</Button>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const productData: Product = {
      id: selectedProduct?.id || generateId(),
      name: productForm.name,
      description: productForm.description,
      price: Number.parseFloat(productForm.price),
      category: productForm.category,
      image: productForm.image || "/placeholder.svg",
      specifications: {
        height: productForm.height,
        density: productForm.density,
        warranty: productForm.warranty,
      },
      popular: productForm.popular,
      premium: productForm.premium,
    }

    let updatedProducts
    if (selectedProduct) {
      // Редактирование
      updatedProducts = products.map((p) => (p.id === selectedProduct.id ? productData : p))
    } else {
      // Добавление
      updatedProducts = [...products, productData]
    }

    setProducts(updatedProducts)
    storage.setProducts(updatedProducts)

    // Сброс формы
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "landscape",
      image: "",
      height: "",
      density: "",
      warranty: "",
      popular: false,
      premium: false,
    })
    setSelectedProduct(null)
    setIsProductDialogOpen(false)

    alert(selectedProduct ? "Товар обновлен!" : "Товар добавлен!")
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Вы уверены, что хотите удалить этот товар?")) {
      const updatedProducts = products.filter((p) => p.id !== productId)
      setProducts(updatedProducts)
      storage.setProducts(updatedProducts)
      alert("Товар удален!")
    }
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      height: product.specifications.height,
      density: product.specifications.density,
      warranty: product.specifications.warranty,
      popular: product.popular || false,
      premium: product.premium || false,
    })
    setIsProductDialogOpen(true)
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus as any, updatedAt: new Date() } : order,
    )

    setOrders(updatedOrders)
    storage.setOrders(updatedOrders)
    setIsOrderDialogOpen(false)
    alert("Статус заказа обновлен!")
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Ожидает подтверждения"
      case "confirmed":
        return "Подтвержден"
      case "in-progress":
        return "В работе"
      case "completed":
        return "Выполнен"
      case "cancelled":
        return "Отменен"
      default:
        return status
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "confirmed":
        return "default"
      case "in-progress":
        return "default"
      case "completed":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "landscape":
        return "Ландшафтный"
      case "sports":
        return "Спортивный"
      case "decorative":
        return "Декоративный"
      default:
        return category
    }
  }

  const getProductById = (productId: string): Product | undefined => {
    return products.find((p) => p.id === productId)
  }

  const totalRevenue = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.totalAmount, 0)

  const pendingOrders = orders.filter((order) => order.status === "pending").length

  return (
    <div className="min-h-screen bg-background">

      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="text-3xl font-black mb-2">Панель администратора</div>
          <p className="text-muted-foreground">Управление товарами, заказами и пользователями</p>
        </div>

        {/* Статистика */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Всего товаров</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Всего заказов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ожидают обработки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Общая выручка</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalRevenue.toLocaleString()}₽</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Товары ({products.length})</TabsTrigger>
            <TabsTrigger value="orders">Заказы ({orders.length})</TabsTrigger>
            <TabsTrigger value="users">Пользователи ({users.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold">Управление товарами</div>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setSelectedProduct(null)
                      setProductForm({
                        name: "",
                        description: "",
                        price: "",
                        category: "landscape",
                        image: "",
                        height: "",
                        density: "",
                        warranty: "",
                        popular: false,
                        premium: false,
                      })
                    }}
                  >
                    Добавить товар
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{selectedProduct ? "Редактировать товар" : "Добавить товар"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Название</Label>
                        <Input
                          id="name"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Цена (₽/м²)</Label>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Описание</Label>
                      <Textarea
                        id="description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Категория</Label>
                        <Select
                          value={productForm.category}
                          onValueChange={(value: any) => setProductForm({ ...productForm, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="landscape">Ландшафтный</SelectItem>
                            <SelectItem value="sports">Спортивный</SelectItem>
                            <SelectItem value="decorative">Декоративный</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="image">URL изображения</Label>
                        <Input
                          id="image"
                          value={productForm.image}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                          placeholder="/placeholder.svg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="height">Высота ворса</Label>
                        <Input
                          id="height"
                          value={productForm.height}
                          onChange={(e) => setProductForm({ ...productForm, height: e.target.value })}
                          placeholder="20-35мм"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="density">Плотность</Label>
                        <Input
                          id="density"
                          value={productForm.density}
                          onChange={(e) => setProductForm({ ...productForm, density: e.target.value })}
                          placeholder="16800 стежков/м²"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="warranty">Гарантия</Label>
                        <Input
                          id="warranty"
                          value={productForm.warranty}
                          onChange={(e) => setProductForm({ ...productForm, warranty: e.target.value })}
                          placeholder="10 лет"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="popular"
                          checked={productForm.popular}
                          onChange={(e) => setProductForm({ ...productForm, popular: e.target.checked })}
                        />
                        <Label htmlFor="popular">Популярный</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="premium"
                          checked={productForm.premium}
                          onChange={(e) => setProductForm({ ...productForm, premium: e.target.checked })}
                        />
                        <Label htmlFor="premium">Премиум</Label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        {selectedProduct ? "Обновить" : "Добавить"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setIsProductDialogOpen(false)}
                      >
                        Отмена
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id}>
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-32 object-cover"
                  />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold">{product.name}</h4>
                      <div className="flex gap-1">
                        {product.popular && <Badge variant="secondary">Популярный</Badge>}
                        {product.premium && <Badge className="bg-secondary text-secondary-foreground">Премиум</Badge>}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{getCategoryName(product.category)}</p>
                    <p className="text-lg font-bold text-primary mb-4">{product.price}₽/м²</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleEditProduct(product)}
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="text-xl font-bold">Управление заказами</div>

            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Заказ #{order.id}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Клиент: {order.customerInfo.name} ({order.customerInfo.phone})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(order.status) as any}>{getStatusText(order.status)}</Badge>
                        <Dialog
                          open={isOrderDialogOpen && selectedOrder?.id === order.id}
                          onOpenChange={setIsOrderDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent"
                              onClick={() => setSelectedOrder(order)}
                            >
                              Изменить статус
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Изменить статус заказа #{order.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-2">
                                <Button
                                  variant={order.status === "confirmed" ? "default" : "outline"}
                                  className={order.status !== "confirmed" ? "bg-transparent" : ""}
                                  onClick={() => handleUpdateOrderStatus(order.id, "confirmed")}
                                >
                                  Подтвердить
                                </Button>
                                <Button
                                  variant={order.status === "in-progress" ? "default" : "outline"}
                                  className={order.status !== "in-progress" ? "bg-transparent" : ""}
                                  onClick={() => handleUpdateOrderStatus(order.id, "in-progress")}
                                >
                                  В работе
                                </Button>
                                <Button
                                  variant={order.status === "completed" ? "default" : "outline"}
                                  className={order.status !== "completed" ? "bg-transparent" : ""}
                                  onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                                >
                                  Выполнен
                                </Button>
                                <Button
                                  variant={order.status === "cancelled" ? "destructive" : "outline"}
                                  className={order.status !== "cancelled" ? "bg-transparent" : ""}
                                  onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                                >
                                  Отменить
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Товары:</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => {
                            const product = getProductById(item.productId)
                            if (!product) return null

                            return (
                              <div key={`${item.productId}-${index}`} className="flex justify-between items-center p-2 bg-muted rounded">
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {item.area}м² {item.installationRequired && "• Установка"}
                                  </p>
                                </div>
                                <p className="font-semibold">
                                  {(
                                    product.price * item.area +
                                    (item.installationRequired ? 500 * item.area : 0)
                                  ).toLocaleString()}
                                  ₽
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-1">Адрес доставки:</h4>
                        <p className="text-sm text-muted-foreground">{order.customerInfo.address}</p>
                      </div>

                      {order.notes && (
                        <div>
                          <h4 className="font-semibold mb-1">Пожелания:</h4>
                          <p className="text-sm text-muted-foreground">{order.notes}</p>
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          <p>Email: {order.customerInfo.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">{order.totalAmount.toLocaleString()}₽</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="text-xl font-bold">Управление пользователями</div>

            <div className="space-y-4">
              {users.map((userData) => (
                <Card key={userData.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg">{userData.name}</h4>
                        <p className="text-muted-foreground">{userData.email}</p>
                        <p className="text-muted-foreground">{userData.phone}</p>
                        <p className="text-sm text-muted-foreground">
                          Регистрация: {new Date(userData.createdAt).toLocaleDateString("ru-RU")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {userData.isAdmin && (
                          <Badge className="bg-destructive text-destructive-foreground">Админ</Badge>
                        )}
                        <Badge variant="outline">
                          Заказов: {orders.filter((order) => order.userId === userData.id).length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
