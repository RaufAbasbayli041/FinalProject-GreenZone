"use client"

import { usePathname } from 'next/navigation'
import { CartProvider } from '@/contexts/cart-context'

export function ConditionalCartProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Определяем, нужно ли показывать CartProvider
  const shouldShowCartProvider = pathname !== '/login' && pathname !== '/register'
  
  // Всегда возвращаем JSX, но условно рендерим содержимое
  return shouldShowCartProvider ? <CartProvider>{children}</CartProvider> : <>{children}</>
}


