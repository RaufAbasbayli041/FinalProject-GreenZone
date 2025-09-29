'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { addItemsToBasket } from '@/services/api'
import type { Product } from '@/lib/types'

interface AddToCartProps {
  product: Product
  customerId: string
  onAdded?: () => void
}

export const AddToCart: React.FC<AddToCartProps> = ({ product, customerId, onAdded }) => {
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)

  const handleAddToCart = async () => {
    try {
      setAdding(true)
      await addItemsToBasket(customerId, {
        basketId: '', // Будет заполнено на бэкенде
        productId: product.id,
        quantity: quantity
      })
      
      if (onAdded) {
        onAdded()
      }
      
      // Сброс количества
      setQuantity(1)
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error)
    } finally {
      setAdding(false)
    }
  }

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Добавить в корзину</h3>
          <p className="text-2xl font-bold text-primary">
            {product.pricePerSquareMeter}₽/м²
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Количество (м²)</Label>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="text-center"
              min="1"
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={incrementQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Итого: <span className="font-semibold">
              {(product.pricePerSquareMeter * quantity).toFixed(2)}₽
            </span>
          </p>
        </div>

        <Button 
          className="w-full" 
          onClick={handleAddToCart}
          disabled={adding}
        >
          {adding ? (
            'Добавление...'
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Добавить в корзину
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          <p>• Бесплатная доставка от 10,000₽</p>
          <p>• Гарантия качества</p>
          <p>• Быстрая установка</p>
        </div>
      </CardContent>
    </Card>
  )
}

