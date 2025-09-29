"use client"

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useProductSearch } from '@/hooks/use-product-search'
import { useRouter } from 'next/navigation'

export function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const { searchResults, isLoading, error, search, clearResults } = useProductSearch()
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      await search(searchTerm)
    }
  }

  const handleClear = () => {
    setSearchTerm('')
    clearResults()
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Поиск продуктов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button type="submit" disabled={isLoading || !searchTerm.trim()}>
          {isLoading ? 'Поиск...' : 'Найти'}
        </Button>
      </form>

      {error && (
        <div className="text-red-500 text-center py-4">
          {error}
        </div>
      )}

      {searchResults && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Результаты поиска ({searchResults.totalCount})
            </h3>
            <Button variant="outline" onClick={handleClear}>
              Очистить
            </Button>
          </div>

          {searchResults.products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Продукты не найдены
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.products.map((product) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/catalog/${product.id}`)}
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{product.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-primary">
                        {product.price}₽/м²
                      </span>
                      <div className="flex gap-1">
                        {product.popular && (
                          <Badge variant="secondary">Популярный</Badge>
                        )}
                        {product.premium && (
                          <Badge className="bg-secondary text-secondary-foreground">
                            Премиум
                          </Badge>
                        )}
                      </div>
                    </div>
                    {product.specifications && (
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Высота: {product.specifications.height}</div>
                        <div>Плотность: {product.specifications.density}</div>
                        <div>Гарантия: {product.specifications.warranty}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {searchResults.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: searchResults.totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === searchResults.page ? "default" : "outline"}
                  size="sm"
                  onClick={() => search(searchTerm, page)}
                >
                  {page}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

