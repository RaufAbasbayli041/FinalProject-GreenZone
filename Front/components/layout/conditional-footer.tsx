"use client"

import { usePathname } from 'next/navigation'
import { Footer } from './footer'

export function ConditionalFooter() {
  const pathname = usePathname()
  
  // Определяем, нужно ли показывать footer
  const shouldShowFooter = !pathname.startsWith('/admin') && 
                          pathname !== '/login' && 
                          pathname !== '/register'
  
  // Всегда возвращаем JSX, но условно рендерим содержимое
  return shouldShowFooter ? <Footer /> : null
}


