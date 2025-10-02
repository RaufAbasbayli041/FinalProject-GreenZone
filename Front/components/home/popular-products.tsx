'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Star, Ruler, Layers, Loader2 } from 'lucide-react'
import { fetchProducts } from '@/services/api'
import { useCart } from '@/contexts/cart-context'
import { useLanguage } from '@/contexts/language-context-new'
import type { Product } from '@/lib/types'

export const PopularProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()
  const { t } = useLanguage()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Loading products from API...')
        
        const apiProducts = await fetchProducts()
        console.log('Products loaded:', apiProducts)
        
        // Берем только первые 6 продуктов для секции "Популярные товары"
        const popularProducts = apiProducts.slice(0, 6)
        setProducts(popularProducts)
        
      } catch (err: any) {
        console.error('Error loading products:', err)
        setError(t('error.loading'))
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const handleAddToCart = async (product: Product) => {
    try {
      console.log('Adding to cart:', product.title)
      await addToCart(product, 1, false) // area = 1 м², без установки
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-[#FAF8F5]">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1F2937] mb-4">
              {t('products.title')}
            </h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              {t('catalog.selectPerfect')}
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#10B981]" />
            <span className="ml-2 text-[#6B7280]">{t('common.loading')}</span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-[#FAF8F5]">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1F2937] mb-4">
              {t('products.title')}
            </h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              {t('catalog.selectPerfect')}
            </p>
          </div>
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white"
            >
              {t('error.tryAgain')}
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-[#FAF8F5]">
      <div className="container mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1F2937] mb-4">
            {t('products.title')}
          </h2>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
            {t('catalog.selectPerfect')}
          </p>
        </div>
        
        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#6B7280] text-lg mb-4">{t('catalog.noProducts')}</p>
            <Link href="/catalog">
              <Button 
                variant="outline"
                className="border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white"
              >
                {t('catalog.goToCatalog')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {products.map((product) => (
            <div 
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:border-[#10B981] transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img 
                  src={product.imageUrl || '/placeholder.jpg'}
                  alt={product.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Category Badge */}
                <Badge className="absolute top-4 left-4 bg-[#10B981] text-white px-3 py-1 text-sm font-medium">
                  {product.category?.name || t('category.landscape')}
                </Badge>
                
                {/* Quick Add Button */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    size="sm" 
                    onClick={() => handleAddToCart(product)}
                    className="bg-white/90 text-[#10B981] hover:bg-white hover:text-[#059669] backdrop-blur-sm"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Rating - Static for now since API doesn't provide ratings */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-[#1F2937]">4.8</span>
                  </div>
                  <span className="text-sm text-[#6B7280]">(127 {t('product.reviews')})</span>
                </div>
                
                {/* Title & Description */}
                <div>
                  <h3 className="text-xl font-semibold text-[#1F2937] mb-2 group-hover:text-[#10B981] transition-colors duration-300">
                    {product.title}
                  </h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>
                
                {/* Specifications */}
                <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                  <div className="flex items-center gap-1">
                    <Layers className="h-4 w-4" />
                    <span>{product.minThickness}-{product.maxThickness}мм</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Ruler className="h-4 w-4" />
                    <span>{t('admin.premium')}</span>
                  </div>
                </div>
                
                {/* Features - Static features since API doesn't provide them */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
                    <span>UV-стойкость</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
                    <span>Дренажная система</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
                    <span>Антибактериальное покрытие</span>
                  </div>
                </div>
                
                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-[#1F2937]">
                        {product.pricePerSquareMeter.toLocaleString()}₽
                      </span>
                    </div>
                    <span className="text-sm text-[#6B7280]">за м²</span>
                  </div>
                  
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2 transition-all duration-300 hover:transform hover:-translate-y-0.5"
                  >
                    {t('products.addToCart')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
        
        {/* View All Button - only show if we have products */}
        {products.length > 0 && (
          <div className="text-center">
          <Link href="/catalog">
            <Button 
              variant="outline" 
              size="lg"
              className="border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white px-8 py-4 text-lg font-medium transition-all duration-300 hover:transform hover:-translate-y-1"
            >
              {t('products.viewAll')}
            </Button>
          </Link>
          </div>
        )}
      </div>
    </section>
  )
}
