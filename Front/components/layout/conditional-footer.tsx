"use client"

import { usePathname } from 'next/navigation'
import { Footer } from './footer'

export function ConditionalFooter() {
  const pathname = usePathname()
  
  // Не показываем footer на страницах login и register
  if (pathname === '/login' || pathname === '/register') {
    return null
  }
  
  return <Footer />
}

