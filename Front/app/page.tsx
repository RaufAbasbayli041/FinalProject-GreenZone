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
import { storage, generateId } from "@/lib/storage"
import { initializeData, initialProducts } from "@/lib/data"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context"
import { CartIcon } from "@/components/cart/cart-icon"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { EmailService } from "@/lib/email-service"

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
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
    initializeData()
    const loadedProducts = storage.getProducts()
    setProducts(loadedProducts.length > 0 ? loadedProducts : initialProducts)
  }, [])

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    const order = {
      id: generateId(),
      userId: user?.id || "guest",
      items: [
        {
          productId: selectedProduct.id,
          quantity: 1,
          area: Number.parseFloat(orderForm.area),
          installationRequired: orderForm.installation,
        },
      ],
      totalAmount:
        selectedProduct.price * Number.parseFloat(orderForm.area) +
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

    EmailService.sendOrderConfirmation(orderForm.email, order.id, order.totalAmount)
    EmailService.sendAdminNotification(order.id, orderForm.name, order.totalAmount)

    alert(t("order.success"))

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
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1, false)
    alert(`${product.name} ${t("products.addToCart")}!`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-black text-primary">Green Zone</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#catalog" className="text-foreground hover:text-primary transition-colors">
                {t("nav.catalog")}
              </a>
              <a href="#services" className="text-foreground hover:text-primary transition-colors">
                {t("nav.services")}
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">
                {t("nav.about")}
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                {t("nav.contact")}
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <NotificationCenter />
              <CartIcon />
              {isAuthenticated && user ? (
                <>
                  <Button variant="outline" onClick={() => router.push("/profile")}>
                    {user.name}
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90">{t("nav.call")}</Button>
                </>
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
      <section className="relative bg-gradient-to-br from-muted to-card py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-secondary text-secondary-foreground">🚚 {t("benefits.delivery")}</Badge>
              <h1 className="text-4xl lg:text-6xl font-black text-foreground mb-6">
                {t("hero.title")}
                <span className="text-primary"> {t("hero.subtitle")}</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{t("hero.description")}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                  {t("hero.cta")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 bg-transparent"
                  onClick={() => router.push("/catalog")}
                >
                  {t("hero.learn")}
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/modern-house-artificial-turf.png"
                alt="Красивый искусственный газон перед современным домом"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-4">{t("benefits.title")}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Мы предлагаем комплексные решения для создания идеального газона
            </p>
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
      <section id="catalog" className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-4">{t("products.title")}</h2>
            <p className="text-xl text-muted-foreground">Выберите идеальный газон для ваших потребностей</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => router.push(`/catalog/${product.id}`)}
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-muted-foreground mb-4">{product.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-primary">от {product.price}₽/м²</span>
                    {product.popular && <Badge variant="secondary">Популярный</Badge>}
                    {product.premium && <Badge className="bg-secondary text-secondary-foreground">Премиум</Badge>}
                  </div>
                  <ul className="text-sm text-muted-foreground mb-6 space-y-1">
                    <li>• Высота ворса: {product.specifications.height}</li>
                    <li>• Плотность: {product.specifications.density}</li>
                    <li>• Гарантия: {product.specifications.warranty}</li>
                  </ul>

                  <div className="flex gap-2 mb-4">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => router.push(`/catalog/${product.id}`)}
                    >
                      {t("products.details")}
                    </Button>
                    <Button variant="secondary" className="flex-1" onClick={() => handleAddToCart(product)}>
                      {t("products.addToCart")}
                    </Button>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full"
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
                          {t("order.title")}: {selectedProduct?.name}
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
                          <Label htmlFor="notes">Дополнительные пожелания</Label>
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
                              Газон: {(selectedProduct.price * Number.parseFloat(orderForm.area)).toLocaleString()}₽
                            </p>
                            {orderForm.installation && (
                              <p>Установка: {(500 * Number.parseFloat(orderForm.area)).toLocaleString()}₽</p>
                            )}
                            <p className="text-lg font-bold text-primary">
                              Общая сумма:{" "}
                              {(
                                selectedProduct.price * Number.parseFloat(orderForm.area) +
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
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" onClick={() => router.push("/catalog")}>
              {t("products.viewAll")}
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-4">{t("services.title")}</h2>
            <p className="text-xl text-muted-foreground">
              Полный цикл работ от консультации до гарантийного обслуживания
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{t("services.consultation")}</h3>
                    <p className="text-muted-foreground">{t("services.consultation.desc")}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{t("services.preparation")}</h3>
                    <p className="text-muted-foreground">{t("services.preparation.desc")}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{t("services.installation")}</h3>
                    <p className="text-muted-foreground">{t("services.installation.desc")}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{t("services.warranty")}</h3>
                    <p className="text-muted-foreground">{t("services.warranty.desc")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <img
                src="/placeholder-ftiwu.png"
                alt="Профессиональная команда устанавливает искусственный газон"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-black mb-6">{t("cta.title")}</h2>
          <p className="text-xl mb-8 opacity-90">{t("cta.description")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              {t("cta.call")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              {t("cta.calculate")}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-black text-primary mb-4">Green Zone</h3>
              <p className="text-muted-foreground mb-4">{t("footer.description")}</p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">Telegram</span>📱
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">WhatsApp</span>💬
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">VK</span>🔗
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">{t("footer.catalog")}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    {t("footer.catalog.landscape")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    {t("footer.catalog.sports")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    {t("footer.catalog.decorative")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    {t("footer.catalog.accessories")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">{t("footer.services")}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    {t("footer.services.consultation")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    {t("footer.services.installation")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    {t("footer.services.delivery")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    {t("footer.services.warranty")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">{t("footer.contact")}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>📞 {t("footer.contact.phone")}</li>
                <li>📧 {t("footer.contact.email")}</li>
                <li>📍 {t("footer.contact.address")}</li>
                <li>🕒 {t("footer.contact.hours")}</li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Green Zone. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
