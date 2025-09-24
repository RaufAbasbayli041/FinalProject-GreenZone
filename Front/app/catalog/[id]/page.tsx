"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/lib/types"
import { storage, generateId } from "@/lib/storage"
import { initialProducts } from "@/lib/data"
import { useAuth } from "@/contexts/auth-context"

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [orderForm, setOrderForm] = useState({
    area: "",
    installation: false,
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })

  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  useEffect(() => {
    const loadedProducts = storage.getProducts()
    const allProducts = loadedProducts.length > 0 ? loadedProducts : initialProducts

    const foundProduct = allProducts.find((p) => p.id === productId)
    setProduct(foundProduct || null)

    // Найти похожие товары той же категории
    if (foundProduct) {
      const related = allProducts.filter((p) => p.id !== productId && p.category === foundProduct.category).slice(0, 3)
      setRelatedProducts(related)
    }
  }, [productId])

  useEffect(() => {
    if (user) {
      setOrderForm((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }))
    }
  }, [user])

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    const order = {
      id: generateId(),
      userId: user?.id || "guest",
      items: [
        {
          productId: product.id,
          quantity: 1,
          area: Number.parseFloat(orderForm.area),
          installationRequired: orderForm.installation,
        },
      ],
      totalAmount:
        product.price * Number.parseFloat(orderForm.area) +
        (orderForm.installation ? 500 * Number.parseFloat(orderForm.area) : 0),
      status: "pending" as const,
      customerInfo: {
        name: orderForm.name,
        email: orderForm.email,
        phone: orderForm.phone,
        address: orderForm.address,
      },
      notes: orderForm.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const existingOrders = storage.getOrders()
    storage.setOrders([...existingOrders, order])

    alert(`Заказ оформлен! Номер заказа: ${order.id}. Мы свяжемся с вами в ближайшее время.`)

    setOrderForm({
      area: "",
      installation: false,
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: "",
      notes: "",
    })
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
          <Button onClick={() => router.push("/catalog")}>Вернуться к каталогу</Button>
        </div>
      </div>
    )
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              {isAuthenticated && user ? (
                <Button variant="outline" onClick={() => router.push("/profile")}>
                  {user.name}
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => router.push("/login")}>
                    Войти
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push("/register")}>
                    Регистрация
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/")}>
              Главная
            </Button>
            <span>/</span>
            <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/catalog")}>
              Каталог
            </Button>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </nav>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <div>
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full rounded-lg shadow-lg" />
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Badge variant="outline" className="mb-2">
                {getCategoryName(product.category)}
              </Badge>
              <h1 className="text-3xl font-black text-foreground mb-2">{product.name}</h1>
              <p className="text-xl text-muted-foreground">{product.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold text-primary">от {product.price}₽/м²</span>
                <div className="flex gap-2">
                  {product.popular && <Badge variant="secondary">Популярный</Badge>}
                  {product.premium && <Badge className="bg-secondary text-secondary-foreground">Премиум</Badge>}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">🚚 Бесплатная доставка по всей стране</p>
            </div>

            {/* Quick Specs */}
            <div className="mb-8">
              <h3 className="font-bold mb-4">Основные характеристики</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Высота ворса</p>
                  <p className="font-semibold">{product.specifications.height}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Плотность</p>
                  <p className="font-semibold">{product.specifications.density}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Гарантия</p>
                  <p className="font-semibold">{product.specifications.warranty}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Категория</p>
                  <p className="font-semibold">{getCategoryName(product.category)}</p>
                </div>
              </div>
            </div>

            {/* Order Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full mb-4">
                  Заказать сейчас
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Заказ: {product.name}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="area">Площадь (м²)</Label>
                    <Input
                      id="area"
                      type="number"
                      min="1"
                      step="0.1"
                      value={orderForm.area}
                      onChange={(e) => setOrderForm({ ...orderForm, area: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="installation"
                      checked={orderForm.installation}
                      onCheckedChange={(checked) => setOrderForm({ ...orderForm, installation: !!checked })}
                    />
                    <Label htmlFor="installation">Требуется установка (+500₽/м²)</Label>
                  </div>

                  <div>
                    <Label htmlFor="name">Имя</Label>
                    <Input
                      id="name"
                      value={orderForm.name}
                      onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={orderForm.email}
                      onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Адрес установки</Label>
                    <Textarea
                      id="address"
                      value={orderForm.address}
                      onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Дополнительные пожелания</Label>
                    <Textarea
                      id="notes"
                      value={orderForm.notes}
                      onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                    />
                  </div>

                  {orderForm.area && (
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="font-semibold">Итого:</p>
                      <p>Газон: {(product.price * Number.parseFloat(orderForm.area)).toLocaleString()}₽</p>
                      {orderForm.installation && (
                        <p>Установка: {(500 * Number.parseFloat(orderForm.area)).toLocaleString()}₽</p>
                      )}
                      <p className="text-lg font-bold text-primary">
                        Общая сумма:{" "}
                        {(
                          product.price * Number.parseFloat(orderForm.area) +
                          (orderForm.installation ? 500 * Number.parseFloat(orderForm.area) : 0)
                        ).toLocaleString()}
                        ₽
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">🚚 Доставка бесплатная!</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full">
                    Оформить заказ
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="lg" className="w-full bg-transparent">
              Получить консультацию
            </Button>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Описание</TabsTrigger>
            <TabsTrigger value="specifications">Характеристики</TabsTrigger>
            <TabsTrigger value="installation">Установка</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Подробное описание</h3>
                <div className="prose max-w-none">
                  <p className="mb-4">{product.description}</p>
                  <p className="mb-4">
                    Наш {product.name.toLowerCase()} изготовлен из высококачественных материалов с использованием
                    современных технологий производства. Идеально подходит для создания красивого и долговечного
                    покрытия, которое будет радовать вас долгие годы.
                  </p>
                  <p>
                    Преимущества нашего газона: устойчивость к UV-излучению, отличная дренажная система, мягкость и
                    комфорт при ходьбе, простота в уходе и обслуживании.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Технические характеристики</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Основные параметры</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong>Высота ворса:</strong> {product.specifications.height}
                      </li>
                      <li>
                        <strong>Плотность:</strong> {product.specifications.density}
                      </li>
                      <li>
                        <strong>Гарантия:</strong> {product.specifications.warranty}
                      </li>
                      <li>
                        <strong>Материал:</strong> Полиэтилен + Полипропилен
                      </li>
                      <li>
                        <strong>Основа:</strong> Латексная с дренажными отверстиями
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Дополнительные характеристики</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong>UV-стабилизация:</strong> Да
                      </li>
                      <li>
                        <strong>Дренаж:</strong> 60 л/м²/мин
                      </li>
                      <li>
                        <strong>Огнестойкость:</strong> Класс E
                      </li>
                      <li>
                        <strong>Температурный диапазон:</strong> -40°C до +80°C
                      </li>
                      <li>
                        <strong>Ширина рулона:</strong> 2м, 4м
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="installation" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Процесс установки</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Подготовка основания</h4>
                      <p className="text-sm text-muted-foreground">
                        Выравнивание поверхности, создание дренажного слоя из щебня и песка
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Укладка газона</h4>
                      <p className="text-sm text-muted-foreground">
                        Раскатка рулонов, подгонка по размеру, соединение швов
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Финишная обработка</h4>
                      <p className="text-sm text-muted-foreground">
                        Засыпка кварцевым песком, расчесывание ворса, финальная проверка
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Время установки:</strong> 1-3 дня в зависимости от площади
                    <br />
                    <strong>Гарантия на работы:</strong> 2 года
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-black mb-6">Похожие товары</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={relatedProduct.image || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    className="w-full h-32 object-cover cursor-pointer"
                    onClick={() => router.push(`/catalog/${relatedProduct.id}`)}
                  />
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2">{relatedProduct.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{relatedProduct.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary">от {relatedProduct.price}₽/м²</span>
                      <Button size="sm" onClick={() => router.push(`/catalog/${relatedProduct.id}`)}>
                        Подробнее
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
