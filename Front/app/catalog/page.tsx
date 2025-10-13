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
import { useLanguage } from "@/contexts/language-context-new"
import { Search, Filter, RotateCcw } from "lucide-react"

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
      } catch (error: any) {
        console.error(t('error.loading'), error)
        if (error.message.includes('fetch') || error.message.includes('network')) {
          setError(t('error.serverError'))
        } else {
          setError(t('error.apiNotFound'))
        }
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-serif font-medium text-gray-900 mb-4">
            {t("catalog.title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("catalog.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4 bg-white shadow-lg border-0">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              </div>
              {/* Search */}
              <div className="mb-6">
                <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Price per m² (₽)</Label>
                <div className="mt-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={2000}
                    min={0}
                    step={50}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{priceRange[0]}₽</span>
                    <span>{priceRange[1]}₽</span>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Sort</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="By Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">By Name</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Filters */}
              <Button
                variant="outline"
                className="w-full bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setPriceRange([0, 2000])
                  setSortBy("name")
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Products Count */}
            {!loading && !error && (
              <div className="mb-6">
                <p className="text-gray-600">Products found: {filteredProducts.length}</p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-xl text-gray-600">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <div className="text-2xl font-bold mb-4 text-gray-900">Error loading products</div>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700">
                  Try Again
                </Button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No products found</p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setPriceRange([0, 2000])
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-lg">
                    <div className="relative">
                      <img
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-48 object-cover cursor-pointer"
                        onClick={() => router.push(`/catalog/${product.id}`)}
                      />
                      {/* Popular/Premium Badge */}
                      {product.category?.name === 'Популярный' && (
                        <Badge className="absolute top-4 left-4 bg-green-200 text-green-800 border-0">
                          Popular
                        </Badge>
                      )}
                      {product.category?.name === 'Премиум' && (
                        <Badge className="absolute top-4 left-4 bg-green-600 text-white border-0">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-6">
                      {/* Title */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                        {product.description}
                      </p>

                      {/* Specifications */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Pile Height: {product.minThickness || 20}-{product.maxThickness || 35}мм</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Density: {product.pricePerSquareMeter || 16800} стежков/м²</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Warranty: 10 лет</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <span className="text-xl font-bold text-green-600">
                          from {product.pricePerSquareMeter || 890}₽/м²
                        </span>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                          onClick={() => router.push(`/catalog/${product.id}`)}
                        >
                          More Details
                        </Button>
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
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
