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
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { CartIcon } from "@/components/cart/cart-icon"
import type { Order, Product } from "@/lib/types"
import { storage } from "@/lib/storage"
import { initialProducts } from "@/lib/data"

export default function ProfilePage() {
  const { user, isAuthenticated, logout, loading } = useAuth()
  const { getTotalItems } = useCart()
  const router = useRouter()

  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (user) {
      const allOrders = storage.getOrders()
      const userOrders = allOrders.filter((order) => order.userId === user.id)
      setOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))

      const loadedProducts = storage.getProducts()
      setProducts(loadedProducts.length > 0 ? loadedProducts : initialProducts)

      setEditForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address || "",
      })
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()

    const users = storage.getUsers()
    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? { ...u, name: editForm.name, email: editForm.email, phone: editForm.phone, address: editForm.address }
        : u,
    )

    storage.setUsers(updatedUsers)

    // Обновляем состояние аутентификации
    const updatedUser = {
      ...user,
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      address: editForm.address,
    }
    storage.setAuthState({ user: updatedUser, isAuthenticated: true })

    setIsEditDialogOpen(false)
    alert("Профиль успешно обновлен!")

    // Перезагружаем страницу для обновления данных
    window.location.reload()
  }

  const getProductById = (productId: string): Product | undefined => {
    return products.find((p) => p.id === productId)
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

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => router.push("/")} className="text-2xl font-black text-primary">
                Green Zone
              </Button>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Button variant="ghost" onClick={() => router.push("/")}>
                Главная
              </Button>
              <Button variant="ghost" onClick={() => router.push("/catalog")}>
                Каталог
              </Button>
            </nav>
            <div className="flex items-center gap-2">
              <CartIcon />
              <span className="text-sm text-muted-foreground">Добро пожаловать, {user.name}</span>
              <Button variant="outline" onClick={handleLogout}>
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-black mb-2">Личный кабинет</h2>
          <p className="text-muted-foreground">Управляйте своим профилем и заказами</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="orders">Мои заказы ({orders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Информация о профиле</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Имя</label>
                    <p className="text-foreground">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Телефон</label>
                    <p className="text-foreground">{user.phone}</p>
                  </div>
                  {user.address && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Адрес</label>
                      <p className="text-foreground">{user.address}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Дата регистрации</label>
                    <p className="text-foreground">{new Date(user.createdAt).toLocaleDateString("ru-RU")}</p>
                  </div>

                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full bg-transparent">
                        Редактировать профиль
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Редактирование профиля</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Имя</Label>
                          <Input
                            id="name"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Телефон</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">Адрес</Label>
                          <Input
                            id="address"
                            value={editForm.address}
                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" className="flex-1">
                            Сохранить
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => setIsEditDialogOpen(false)}
                          >
                            Отмена
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Статистика</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Всего заказов:</span>
                    <span className="font-semibold">{orders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Товаров в корзине:</span>
                    <span className="font-semibold">{getTotalItems()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Общая сумма заказов:</span>
                    <span className="font-semibold text-primary">
                      {orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}₽
                    </span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Button className="w-full" onClick={() => router.push("/catalog")}>
                      Перейти к каталогу
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/cart")}>
                      Перейти в корзину
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-bold mb-2">У вас пока нет заказов</h3>
                  <p className="text-muted-foreground mb-6">Оформите первый заказ в нашем каталоге</p>
                  <Button onClick={() => router.push("/catalog")}>Перейти к каталогу</Button>
                </CardContent>
              </Card>
            ) : (
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
                        </div>
                        <Badge variant={getStatusVariant(order.status) as any}>{getStatusText(order.status)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Товары в заказе */}
                        <div>
                          <h4 className="font-semibold mb-2">Товары:</h4>
                          <div className="space-y-2">
                            {order.items.map((item, index) => {
                              const product = getProductById(item.productId)
                              if (!product) return null

                              return (
                                <div key={`${item.productId}-${index}`} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={product.image || "/placeholder.svg"}
                                      alt={product.name}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                      <p className="font-medium">{product.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {item.area}м² {item.installationRequired && "• Установка включена"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">
                                      {(
                                        product.price * item.area +
                                        (item.installationRequired ? 500 * item.area : 0)
                                      ).toLocaleString()}
                                      ₽
                                    </p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Информация о доставке */}
                        <div>
                          <h4 className="font-semibold mb-2">Адрес доставки:</h4>
                          <p className="text-muted-foreground">{order.customerInfo.address}</p>
                        </div>

                        {/* Дополнительные пожелания */}
                        {order.notes && (
                          <div>
                            <h4 className="font-semibold mb-2">Дополнительные пожелания:</h4>
                            <p className="text-muted-foreground">{order.notes}</p>
                          </div>
                        )}

                        <Separator />

                        {/* Итого */}
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            <p>Контакт: {order.customerInfo.phone}</p>
                            <p>Email: {order.customerInfo.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Итого:</p>
                            <p className="text-2xl font-bold text-primary">{order.totalAmount.toLocaleString()}₽</p>
                            <p className="text-xs text-muted-foreground">Доставка бесплатная</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
