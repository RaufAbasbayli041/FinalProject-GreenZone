'use client'

import React from 'react'
import { Cart } from '@/components/cart/cart'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Вход в систему</h1>
          <p className="text-muted-foreground mb-6">
            Для просмотра корзины необходимо войти в систему
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push('/login')}>
              Войти
            </Button>
            <Button variant="outline" onClick={() => router.push('/register')}>
              Зарегистрироваться
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Корзина</h1>
        <Cart 
          customerId={user.id} 
          onOrderPlaced={() => {
            // Здесь можно добавить логику после оформления заказа
            router.push('/orders')
          }} 
        />
      </div>
    </div>
  )
}