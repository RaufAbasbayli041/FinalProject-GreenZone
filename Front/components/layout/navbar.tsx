'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useCart } from '@/contexts/cart-context'
import { useLanguage } from '@/contexts/language-context-new'
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
              Главная
            </Link>
            <Link 
              href="/catalog" 
              className="text-[#6B7280] hover:text-[#1F2937] transition-colors"
            >
              Каталог
            </Link>
            <Link 
              href="/about" 
              className="text-[#6B7280] hover:text-[#1F2937] transition-colors"
            >
              О нас
            </Link>
            <Link 
              href="/contact" 
              className="text-[#6B7280] hover:text-[#1F2937] transition-colors"
            >
              Контакты
            </Link>
          </div>

          {/* Правые элементы */}
          <div className="flex items-center space-x-4">
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
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user?.firstName || 'Профиль'}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Войти</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-[#10B981] hover:bg-[#059669] text-white">
                    Регистрация
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
                Главная
              </Link>
              <Link 
                href="/catalog" 
                className="text-[#6B7280] hover:text-[#1F2937] transition-colors flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Package className="h-4 w-4 mr-2" />
                Каталог
              </Link>
              <Link 
                href="/about" 
                className="text-[#6B7280] hover:text-[#1F2937] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                О нас
              </Link>
              <Link 
                href="/contact" 
                className="text-[#6B7280] hover:text-[#1F2937] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Контакты
              </Link>
              
              {/* Мобильная авторизация */}
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-[#E5E7EB]">
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      {user?.firstName || 'Профиль'}
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t border-[#E5E7EB]">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      Войти
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-[#10B981] hover:bg-[#059669] text-white">
                      Регистрация
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
