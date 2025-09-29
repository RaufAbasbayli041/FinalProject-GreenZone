"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import type { Product } from "@/lib/types"
import { fetchProductById } from "@/services/api"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context-new"
import { CartIcon } from "@/components/cart/cart-icon"
import { LanguageSwitcher } from "@/components/language-switcher-new"
import { EmailService } from "@/lib/email-service"

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orderForm, setOrderForm] = useState({
    area: "",
    installation: false,
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })

  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { t } = useLanguage()

  const productId = params.id as string

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return
      
      setLoading(true)
      setError(null)
      
      try {
        const data = await fetchProductById(productId)
        setProduct(data)
        setError(null) // Очищаем ошибку при успешной загрузке
      } catch (error: any) {
        console.error('Ошибка загрузки продукта:', error)
        
        // Более детальная обработка ошибок
        if (error.message.includes('401')) {
          setError('Требуется авторизация. Пожалуйста, войдите в систему.')
        } else if (error.message.includes('404')) {
          setError('Продукт не найден.')
        } else if (error.message.includes('500')) {
          setError('Ошибка сервера. Попробуйте позже.')
        } else {
          setError(`Ошибка загрузки: ${error.message}`)
        }
        
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    
    loadProduct()
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

    const area = Number.parseFloat(orderForm.area)
    if (area <= 0) {
      alert("Пожалуйста, введите корректную площадь")
      return
    }

    const turfPrice = product.pricePerSquareMeter * area
    const installationPrice = orderForm.installation ? 500 * area : 0
    const totalPrice = turfPrice + installationPrice

    const orderData = {
      product: product.title,
      area: area,
      turfPrice: turfPrice,
      installationPrice: installationPrice,
      totalPrice: totalPrice,
      customer: {
        name: orderForm.name,
        email: orderForm.email,
        phone: orderForm.phone,
        address: orderForm.address,
      },
      notes: orderForm.notes,
    }

    EmailService.sendOrderEmail(orderData)
      .then(() => {
        alert("Заказ отправлен! Мы свяжемся с вами в ближайшее время.")
        setOrderForm({
          area: "",
          installation: false,
          name: "",
          email: "",
          phone: "",
          address: "",
          notes: "",
        })
      })
      .catch((error) => {
        console.error("Ошибка отправки заказа:", error)
        alert("Произошла ошибка при отправке заказа. Пожалуйста, попробуйте еще раз.")
      })
  }

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product, 1, false)
    alert(`${product.title} добавлен в корзину!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Button variant="ghost" className="text-2xl font-black text-primary">
                  {t("common.brandName")}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <CartIcon />
              </div>
            </div>
          </div>
        </header>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-xl text-muted-foreground">{t('catalog.loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Button variant="ghost" className="text-2xl font-black text-primary">
                  {t("common.brandName")}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <CartIcon />
              </div>
            </div>
          </div>
        </header>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-bold mb-4">Продукт не найден</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push("/catalog")}>
                Вернуться к каталогу
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                На главную
              </Button>
              {error.includes('авторизация') && (
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Войти в систему
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => router.push("/")} className="text-2xl font-black text-primary">
                {t("common.brandName")}
              </Button>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Button variant="ghost" onClick={() => router.push("/")}>
                {t("nav.home")}
              </Button>
              <Button variant="ghost" onClick={() => router.push("/catalog")}>
                {t("nav.catalog")}
              </Button>
            </nav>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <CartIcon />
              {isAuthenticated && user ? (
                <Button variant="outline" onClick={() => router.push("/profile")}>
                  {user.name}
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => router.push("/login")}>
                    {t("nav.login")}
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push("/register")}>
                    {t("nav.register")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Button variant="ghost" onClick={() => router.push("/")} className="text-sm">
                  {t("nav.home")}
                </Button>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <Button variant="ghost" onClick={() => router.push("/catalog")} className="text-sm">
                    {t("nav.catalog")}
                  </Button>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <span className="text-sm text-muted-foreground">{product.title}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              <p className="mt-2 text-lg text-muted-foreground">{product.description}</p>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary">
                {product.category?.name || `Категория: ${product.categoryId}`}
              </Badge>
            </div>

            <Separator />

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Характеристики</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Цена за м²</dt>
                  <dd className="text-2xl font-bold text-primary">{product.pricePerSquareMeter}₽</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Толщина</dt>
                  <dd className="text-lg">{product.minThickness}-{product.maxThickness} мм</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Категория</dt>
                  <dd className="text-lg">{product.category?.name || product.categoryId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Документы</dt>
                  <dd className="text-lg">{product.documentIds?.length || 0} шт.</dd>
                </div>
              </div>
            </div>

            <Separator />

            {/* Order Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Заказать</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="area">Площадь (м²)</Label>
                  <Input
                    id="area"
                    type="number"
                    min="1"
                    step="0.1"
                    value={orderForm.area}
                    onChange={(e) => setOrderForm({ ...orderForm, area: e.target.value })}
                    placeholder="Введите площадь"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="installation"
                    checked={orderForm.installation}
                    onCheckedChange={(checked) => setOrderForm({ ...orderForm, installation: !!checked })}
                  />
                  <Label htmlFor="installation">Установка (+500₽/м²)</Label>
                </div>
              </div>

              {orderForm.area && (
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Расчет стоимости:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Газон ({orderForm.area} м²):</span>
                      <span>{(product.pricePerSquareMeter * Number.parseFloat(orderForm.area)).toLocaleString()}₽</span>
                    </div>
                    {orderForm.installation && (
                      <div className="flex justify-between">
                        <span>Установка ({orderForm.area} м²):</span>
                        <span>{(500 * Number.parseFloat(orderForm.area)).toLocaleString()}₽</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Итого:</span>
                      <span className="text-primary">
                        {(
                          product.pricePerSquareMeter * Number.parseFloat(orderForm.area) +
                          (orderForm.installation ? 500 * Number.parseFloat(orderForm.area) : 0)
                        ).toLocaleString()}₽
                      </span>
                    </div>
                  </div>
                </Card>
              )}

              <div className="flex gap-2">
                <Button onClick={handleAddToCart} className="flex-1">
                  Добавить в корзину
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      Заказать
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Оформление заказа: {product.title}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleOrderSubmit} className="space-y-4">
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
                        <Label htmlFor="address">Адрес доставки</Label>
                        <Textarea
                          id="address"
                          value={orderForm.address}
                          onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Дополнительные заметки</Label>
                        <Textarea
                          id="notes"
                          value={orderForm.notes}
                          onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Отправить заказ
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}