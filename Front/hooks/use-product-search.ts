import { useState, useCallback } from 'react'
import { searchProducts, fetchProductsByCategory } from '@/services/api'
import type { Product, ProductSearchResult } from '@/lib/types'

export function useProductSearch() {
  const [searchResults, setSearchResults] = useState<ProductSearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (keyword: string, page: number = 1, pageSize: number = 10) => {
    if (!keyword.trim()) {
      setSearchResults(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const results = await searchProducts(keyword, page, pageSize)
      setSearchResults(results)
    } catch (err: any) {
      setError(err.message || 'Ошибка поиска')
      setSearchResults(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const searchByCategory = useCallback(async (categoryId: string, page: number = 1, pageSize: number = 10) => {
    setIsLoading(true)
    setError(null)

    try {
      const results = await fetchProductsByCategory(categoryId, page, pageSize)
      setSearchResults(results)
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки категории')
      setSearchResults(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setSearchResults(null)
    setError(null)
  }, [])

  return {
    searchResults,
    isLoading,
    error,
    search,
    searchByCategory,
    clearResults
  }
}

