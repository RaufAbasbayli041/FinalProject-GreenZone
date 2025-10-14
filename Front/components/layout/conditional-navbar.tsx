"use client"

import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'
import { AuthNavbar } from './auth-navbar'

export function ConditionalNavbar() {
  const pathname = usePathname()
  
  // Не показываем navbar для админ страниц
  if (pathname.startsWith('/admin')) {
    return null
  }
  
  // Показываем специальный navbar для auth страниц
  if (pathname === '/login' || pathname === '/register') {
    return <AuthNavbar />
  }
  
  return <Navbar />
}
