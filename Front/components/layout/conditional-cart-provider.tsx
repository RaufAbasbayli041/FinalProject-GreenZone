"use client"

import { usePathname } from 'next/navigation'
import { CartProvider } from '@/contexts/cart-context'

export function ConditionalCartProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Не показываем CartProvider на auth страницах
  if (pathname === '/login' || pathname === '/register') {
    return <>{children}</>
  }
  
  return <CartProvider>{children}</CartProvider>
}


