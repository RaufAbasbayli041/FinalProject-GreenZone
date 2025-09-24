"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Product } from "@/lib/types"
import { storage, generateId } from "@/lib/storage"
import { initialProducts } from "@/lib/data"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"

export default function CartPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })

  const { items, removeFromCart, updateArea, clearCart, getTotalPrice, getItemPrice } = useCart()
  const { user, isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    const loadedProducts = storage.getProducts()
    setProducts(loadedProducts.length > 0 ? loadedProducts : initialProducts)
  }, [])

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

  const handleAreaChange = (productId: string, newArea: string) => {
    const area = Number.parseFloat(newArea)
    if (area > 0) {
      updateArea(productId, area)
    }
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      alert(t("cart.emptyCart") || "Корзина пуста")
      return
    }

    const order = {
      id: generateId(),
      userId: user?.id || "guest",
      items: items,
      totalAmount: getTotalPrice(),
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

    clearCart()

    alert(`${t("cart.orderPlaced") || "Заказ оформлен"} ${order.id}. ${t("cart.contactSoon") || "Мы свяжемся с вами"}`)
    router.push("/profile")
  }

  const getProductById = (productId: string): Product | undefined => {
    return products.find((p) => p.id === productId)
  }

  if (items.length === 0) {
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
                {isAuthenticated && user ? (
                  <Button variant="outline" onClick={() => router.push("/profile")}>
                    {user.name}
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => router.push("/login")}>
                      {t("auth.login")}
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push("/register")}>
                      {t("auth.register")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-black mb-4">{t("cart.emptyTitle")}</h1>
            <p className="text-muted-foreground mb-8">{t("cart.emptyDescription")}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push("/catalog")}>{t("cart.goToCatalog")}</Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                {t("cart.goHome")}
              </Button>
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
              {isAuthenticated && user ? (
                <Button variant="outline" onClick={() => router.push("/profile")}>
                  {user.name}
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => router.push("/login")}>
                    {t("auth.login")}
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push("/register")}>
                    {t("auth.register")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-foreground mb-2">{t("cart.title")}</h1>
          <p className="text-muted-foreground">{t("cart.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = getProductById(item.productId)
              if (!product) return null

              return (
                <Card key={`${item.productId}-${item.installationRequired}`}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.productId)}
                            className="text-destructive hover:text-destructive"
                          >
                            ✕
                          </Button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`area-${item.productId}`} className="text-sm">
                              {t("cart.area")}:
                            </Label>
                            <Input
                              id={`area-${item.productId}`}
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={item.area}
                              onChange={(e) => handleAreaChange(item.productId, e.target.value)}
                              className="w-20"
                            />
                            <span className="text-sm text-muted-foreground">м²</span>
                          </div>

                          {item.installationRequired && (
                            <Badge variant="secondary">{t("cart.installationIncluded")}</Badge>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            <p>
                              {t("cart.turf")}: {product.price}₽/м² × {item.area}м² ={" "}
                              {(product.price * item.area).toLocaleString()}₽
                            </p>
                            {item.installationRequired && (
                              <p>
                                {t("cart.installation")}: 500₽/м² × {item.area}м² = {(500 * item.area).toLocaleString()}
                                ₽
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              {getItemPrice(item, product).toLocaleString()}₽
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={clearCart}>
                {t("cart.clearCart")}
              </Button>
              <Button variant="outline" onClick={() => router.push("/catalog")}>
                {t("cart.continueShopping")}
              </Button>
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>{t("cart.checkout")}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t("cart.name")}</Label>
                    <Input
                      id="name"
                      value={orderForm.name}
                      onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">{t("cart.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={orderForm.email}
                      onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">{t("cart.phone")}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">{t("cart.address")}</Label>
                    <Textarea
                      id="address"
                      value={orderForm.address}
                      onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">{t("cart.notes")}</Label>
                    <Textarea
                      id="notes"
                      value={orderForm.notes}
                      onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t("cart.products")}:</span>
                      <span>{getTotalPrice().toLocaleString()}₽</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t("cart.delivery")}:</span>
                      <span>{t("cart.free")}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>{t("cart.total")}:</span>
                      <span className="text-primary">{getTotalPrice().toLocaleString()}₽</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    {t("cart.placeOrder")}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">{t("cart.agreement")}</p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
