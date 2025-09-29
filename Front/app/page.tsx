"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { Product } from "@/lib/types"
import { fetchProducts } from "@/services/api"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context-new"
import { CartIcon } from "@/components/cart/cart-icon"
import { LanguageSwitcher } from "@/components/language-switcher-new"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { EmailService } from "@/lib/email-service"

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
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
  const { addToCart } = useCart()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const data = await fetchProducts()
        setProducts(data)
      } catch (error: any) {
        console.error('Ошибка загрузки продуктов:', error)
        
        // Более детальная обработка ошибок
        if (error.message.includes('401')) {
          setError('Требуется авторизация. Пожалуйста, войдите в систему.')
        } else if (error.message.includes('404')) {
          setError('API не найден. Убедитесь, что бэкенд запущен.')
        } else if (error.message.includes('500')) {
          setError('Ошибка сервера. Попробуйте позже.')
        } else {
          setError(`Ошибка загрузки: ${error.message}`)
        }
        
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [])

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    const area = Number.parseFloat(orderForm.area)
    if (area <= 0) {
      alert("Пожалуйста, введите корректную площадь")
      return
    }

    const turfPrice = selectedProduct.pricePerSquareMeter * area
    const installationPrice = orderForm.installation ? 500 * area : 0
    const totalPrice = turfPrice + installationPrice

    const orderData = {
      product: selectedProduct.title,
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
        setSelectedProduct(null)
      })
      .catch((error) => {
        console.error("Ошибка отправки заказа:", error)
        alert("Произошла ошибка при отправке заказа. Пожалуйста, попробуйте еще раз.")
      })
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1, false)
    alert(`${product.title} ${t("products.addToCart")}!`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" className="text-2xl font-black text-primary">
                {t("common.brandName")}
              </Button>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Button variant="ghost">{t("nav.home")}</Button>
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

      {/* Hero Section */}
      <section className="hero-section py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-black text-foreground mb-6 animate-slide-up">
              {t("home.title")}
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up">
              {t("home.subtitle")}
            </p>
            <div className="flex gap-4 justify-center animate-bounce-in">
              <Button size="lg" className="btn-primary" onClick={() => router.push("/catalog")}>
                {t("products.viewAll")}
              </Button>
              <Button size="lg" variant="outline" className="btn-secondary" onClick={() => router.push("/catalog")}>
                {t("products.order")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-4">
              {t("benefits.title")}
            </h2>
            <p className="text-xl text-muted-foreground">{t("benefits.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold mb-4">{t("benefits.warranty")}</h3>
                <p className="text-muted-foreground">{t("benefits.warranty.desc")}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🔧</span>
                </div>
                <h3 className="text-xl font-bold mb-4">{t("benefits.installation")}</h3>
                <p className="text-muted-foreground">{t("benefits.installation.desc")}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="text-xl font-bold mb-4">{t("benefits.delivery")}</h3>
                <p className="text-muted-foreground">{t("benefits.delivery.desc")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-4">{t("products.title")}</h2>
            <p className="text-xl text-muted-foreground">{t('catalog.selectPerfect')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-xl text-muted-foreground">{t('catalog.loading')}</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold mb-4">Ошибка загрузки</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => window.location.reload()} className="btn-primary">
                    Попробовать снова
                  </Button>
                  {error.includes('авторизация') && (
                    <Button variant="outline" onClick={() => router.push("/login")} className="btn-secondary">
                      Войти в систему
                    </Button>
                  )}
                </div>
              </div>
            ) : products && products.length > 0 ? (
              products.map((product) => (
                <Card key={product.id} className="product-card card-hover animate-fade-in">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.title || 'Product'}
                    className="w-full h-48 object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                    onClick={() => router.push(`/catalog/${product.id}`)}
                  />
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{product.title || 'Unnamed Product'}</h3>
                    <p className="text-muted-foreground mb-4">{product.description || 'No description available'}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-primary">от {product.pricePerSquareMeter || 0}₽/м²</span>
                      <Badge variant="secondary" className="animate-bounce-in">
                        {product.category?.name || `Категория: ${product.categoryId}`}
                      </Badge>
                    </div>
                    <ul className="text-sm text-muted-foreground mb-6 space-y-1">
                      <li>• Толщина: {product.minThickness || 30}-{product.maxThickness || 40} мм</li>
                      <li>• Цена за м²: {product.pricePerSquareMeter || 0}₽</li>
                      <li>• Категория: {product.category?.name || product.categoryId || 'Не указана'}</li>
                    </ul>

                    <div className="flex gap-2 mb-4">
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent nav-link"
                        onClick={() => router.push(`/catalog/${product.id}`)}
                      >
                        {t("products.details")}
                      </Button>
                      <Button variant="secondary" className="flex-1 btn-secondary" onClick={() => handleAddToCart(product)}>
                        {t("products.addToCart")}
                      </Button>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full btn-primary"
                          onClick={() => {
                            setSelectedProduct(product)
                            if (user) {
                              setOrderForm((prev) => ({
                                ...prev,
                                name: user.name,
                                email: user.email,
                                phone: user.phone,
                              }))
                            }
                          }}
                        >
                          {t("products.order")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            {t("order.title")}: {selectedProduct?.title}
                          </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleOrderSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="area">{t("order.area")}</Label>
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
                            <Label htmlFor="installation">
                              {t("order.installation")} {t("order.installation.yes")}
                            </Label>
                          </div>

                          <div>
                            <Label htmlFor="name">{t("auth.name")}</Label>
                            <Input
                              id="name"
                              value={orderForm.name}
                              onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="email">{t("auth.email")}</Label>
                            <Input
                              id="email"
                              type="email"
                              value={orderForm.email}
                              onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="phone">{t("auth.phone")}</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={orderForm.phone}
                              onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="address">{t("order.delivery")}</Label>
                            <Textarea
                              id="address"
                              value={orderForm.address}
                              onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="notes">{t('order.additionalNotes')}</Label>
                            <Textarea
                              id="notes"
                              value={orderForm.notes}
                              onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                            />
                          </div>

                          {selectedProduct && orderForm.area && (
                            <div className="bg-muted p-4 rounded-lg">
                              <p className="font-semibold">{t("order.total")}:</p>
                              <p>
                                Газон: {(selectedProduct.pricePerSquareMeter * Number.parseFloat(orderForm.area)).toLocaleString()}₽
                              </p>
                              {orderForm.installation && (
                                <p>Установка: {(500 * Number.parseFloat(orderForm.area)).toLocaleString()}₽</p>
                              )}
                              <p className="text-lg font-bold text-primary">
                                Общая сумма:{" "}
                                {(
                                  selectedProduct.pricePerSquareMeter * Number.parseFloat(orderForm.area) +
                                  (orderForm.installation ? 500 * Number.parseFloat(orderForm.area) : 0)
                                ).toLocaleString()}
                                ₽
                              </p>
                              <p className="text-sm text-muted-foreground mt-2">🚚 {t("benefits.delivery")}!</p>
                            </div>
                          )}

                          <Button type="submit" className="w-full">
                            {t("order.submit")}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold mb-4">Продукты не найдены</h3>
                <p className="text-muted-foreground text-lg">В данный момент нет доступных продуктов</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" onClick={() => router.push("/catalog")} className="btn-secondary">
              {t("products.viewAll")}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{t("common.brandName")}</h3>
            <p className="text-muted-foreground mb-4">{t("footer.description")}</p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => router.push("/catalog")}>
                {t("nav.catalog")}
              </Button>
              <Button variant="outline" onClick={() => router.push("/login")}>
                {t("nav.login")}
              </Button>
            </div>
          </div>
        </div>
      </footer>

      <NotificationCenter />
    </div>
  )
}