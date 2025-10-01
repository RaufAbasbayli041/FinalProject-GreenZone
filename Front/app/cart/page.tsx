'use client'

import React, { useState, useEffect } from 'react'
import { CartNew } from '@/components/cart/cart-new'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { getUserIdFromToken, getCustomerIdByUserId } from '@/services/api'
import { ShoppingCart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/contexts/language-context-new'

export default function CartPage() {
  const { user, isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCustomerId = async () => {
      if (isAuthenticated && user) {
        try {
          // Получаем userId из JWT токена
          const userId = getUserIdFromToken()
          console.log('Получен userId из токена:', userId)
          
          if (userId) {
            // Получаем customerId по userId
            const customerId = await getCustomerIdByUserId(userId)
            console.log('Получен customerId:', customerId)
            
            if (customerId) {
              setCustomerId(customerId)
            } else {
              console.warn('Не удалось получить customerId для userId:', userId)
            }
          } else {
            console.warn('Не удалось получить userId из токена')
          }
        } catch (error) {
          console.error('Ошибка получения customerId:', error)
        }
      }
      setLoading(false)
    }
    
    loadCustomerId()
  }, [isAuthenticated, user])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-muted-foreground">{t('cart.loading')}</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('cart.loginRequired')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('cart.loginRequiredDesc')}
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push('/login')}>
              {t('cart.login')}
            </Button>
            <Button variant="outline" onClick={() => router.push('/register')}>
              {t('cart.register')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!customerId) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('cart.error')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('cart.userInfoError')}
          </p>
          <Button onClick={() => router.push('/login')}>
            {t('cart.loginAgain')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <CartNew 
      customerId={customerId} 
      onOrderPlaced={() => {
        // Здесь можно добавить логику после оформления заказа
        router.push('/')
      }} 
    />
  )
}