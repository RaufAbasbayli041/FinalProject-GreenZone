"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import type { Product, Category } from "@/lib/types"
import { fetchProducts, getAllCategories } from "@/services/api"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { CartIcon } from "@/components/cart/cart-icon"
import { useLanguage } from "@/contexts/language-context-new"

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [sortBy, setSortBy] = useState("name")

  const { user, isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          getAllCategories()
        ])
        setProducts(productsData)
        setFilteredProducts(productsData)
        setCategories([{ id: "all", name: t("catalog.allCategories"), value: "all", label: t("catalog.allCategories") }, ...categoriesData.map(cat => ({ ...cat, value: cat.id, label: cat.name }))])
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
        setError(t('error.apiNotFound'))
        setProducts([])
        setFilteredProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [t])

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory
      const matchesPrice = product.pricePerSquareMeter >= priceRange[0] && product.pricePerSquareMeter <= priceRange[1]

      return matchesSearch && matchesCategory && matchesPrice
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.pricePerSquareMeter - b.pricePerSquareMeter
        case "price-high":
          return b.pricePerSquareMeter - a.pricePerSquareMeter
        case "name":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory, priceRange, sortBy])

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1, false)
    alert(`${product.title} ${t("products.addToCart")}!`)
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="text-3xl font-black text-foreground mb-2">{t("catalog.title")}</div>
          <p className="text-muted-foreground">{t("catalog.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="font-bold mb-4">{t("catalog.filters")}</h3>

              {/* Search */}
              <div className="mb-6">
                <Label htmlFor="search">{t("catalog.search")}</Label>
                <Input
                  id="search"
                  placeholder={t("catalog.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <Label>{t("catalog.category")}</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label>{t("catalog.priceRange")}</Label>
                <div className="mt-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={2000}
                    min={0}
                    step={50}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{priceRange[0]}₽</span>
                    <span>{priceRange[1]}₽</span>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <Label>{t("catalog.sort")}</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">{t("catalog.sortName")}</SelectItem>
                    <SelectItem value="price-low">{t("catalog.sortPriceLow")}</SelectItem>
                    <SelectItem value="price-high">{t("catalog.sortPriceHigh")}</SelectItem>
                    <SelectItem value="popular">{t("catalog.sortPopular")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Filters */}
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setPriceRange([0, 2000])
                  setSortBy("name")
                }}
              >
                {t("catalog.resetFilters")}
              </Button>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {t("catalog.productsFound")}: {filteredProducts.length}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-xl text-muted-foreground">{t('catalog.loading')}</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <div className="text-2xl font-bold mb-4">{t('error.loading')}</div>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  {t('error.tryAgain')}
                </Button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">{t("catalog.noProducts")}</p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setPriceRange([0, 2000])
                  }}
                >
                  {t("catalog.resetFilters")}
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                    <img
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => router.push(`/catalog/${product.id}`)}
                    />
                    <CardContent className="p-6">
                      <div className="text-xl font-bold mb-2">{product.title}</div>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{product.description}</p>

                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-primary">
                          {t("catalog.from")} {product.pricePerSquareMeter}₽/м²
                        </span>
                        <Badge variant="secondary">
                          {product.category?.name || `Категория: ${product.categoryId}`}
                        </Badge>
                      </div>

                      <ul className="text-sm text-muted-foreground mb-6 space-y-1">
                        <li>
                          • Толщина: {product.minThickness}-{product.maxThickness} мм
                        </li>
                        <li>
                          • Цена за м²: {product.pricePerSquareMeter}₽
                        </li>
                        <li>
                          • Категория: {product.category?.name || product.categoryId}
                        </li>
                      </ul>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => router.push(`/catalog/${product.id}`)}
                        >
                          {t("catalog.moreDetails")}
                        </Button>
                        <Button variant="secondary" className="flex-1" onClick={() => router.push(`/catalog/${product.id}`)}>
                          {t("products.addToCart")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
