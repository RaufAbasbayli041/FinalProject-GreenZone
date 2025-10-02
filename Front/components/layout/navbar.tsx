'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useCart } from '@/contexts/cart-context'
import { useLanguage } from '@/contexts/language-context-new'
import { LanguageSwitcher } from '@/components/language-switcher-new'
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  LogOut, 
  Home, 
  Package,
  Phone,
  Mail
} from 'lucide-react'

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { items } = useCart()
  const { t } = useLanguage()
  const router = useRouter()

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleLogout = () => {
    logout()
    router.push('/')
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold text-[#1F2937]">GreenZone</span>
          </Link>

          {/* Десктопное меню */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-[#6B7280] hover:text-[#1F2937] transition-colors"
            >
              {t('nav.home')}
            </Link>
            <Link 
              href="/catalog" 
              className="text-[#6B7280] hover:text-[#1F2937] transition-colors"
            >
              {t('nav.catalog')}
            </Link>
            <Link 
              href="/about" 
              className="text-[#6B7280] hover:text-[#1F2937] transition-colors"
            >
              {t('nav.about')}
            </Link>
            <Link 
              href="/contact" 
              className="text-[#6B7280] hover:text-[#1F2937] transition-colors"
            >
              {t('nav.contact')}
            </Link>
          </div>

          {/* Правые элементы */}
          <div className="flex items-center space-x-4">
            {/* Переключатель языка */}
            <LanguageSwitcher />
            
            {/* Корзина */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#10B981] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Пользователь */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-sm text-gray-700 font-medium">
                  {user?.name || user?.firstName || 'Пользователь'}
                </span>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="p-2">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="p-2">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">{t('nav.login')}</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-[#10B981] hover:bg-[#059669] text-white">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            )}

            {/* Мобильное меню */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#E5E7EB] py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-[#6B7280] hover:text-[#1F2937] transition-colors flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4 mr-2" />
                {t('nav.home')}
              </Link>
              <Link 
                href="/catalog" 
                className="text-[#6B7280] hover:text-[#1F2937] transition-colors flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Package className="h-4 w-4 mr-2" />
                {t('nav.catalog')}
              </Link>
              <Link 
                href="/about" 
                className="text-[#6B7280] hover:text-[#1F2937] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link 
                href="/contact" 
                className="text-[#6B7280] hover:text-[#1F2937] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              
              {/* Мобильная авторизация */}
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-[#E5E7EB]">
                  <div className="px-2 py-1">
                    <span className="text-sm text-gray-700 font-medium">
                      {user?.name || user?.firstName || 'Пользователь'}
                    </span>
                  </div>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      {t('nav.profile')}
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('nav.logout')}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t border-[#E5E7EB]">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      {t('nav.login')}
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-[#10B981] hover:bg-[#059669] text-white">
                      {t('nav.register')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
