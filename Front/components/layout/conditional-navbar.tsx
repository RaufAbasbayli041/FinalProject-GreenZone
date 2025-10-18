"use client"

import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'
import { AuthNavbar } from './auth-navbar'

export function ConditionalNavbar() {
  const pathname = usePathname()
  
  // Определяем, какой navbar показывать
  if (pathname.startsWith('/admin')) {
    return null
  }
  
  if (pathname === '/login' || pathname === '/register') {
    return <AuthNavbar />
  }
  
  return <Navbar />
}