"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CartIcon } from "@/components/cart/cart-icon"
import { LanguageSwitcher } from "@/components/language-switcher-new"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context-new"
import { LogOut, User } from "lucide-react"

export function Navbar() {
  const router = useRouter()
  const { user, isAuthenticated, logout, isAdmin } = useAuth()
  const { t } = useLanguage()

  // Если пользователь админ, не показываем обычную навигацию
  if (isAuthenticated && isAdmin) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/register")
  }

  return (
    <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="text-2xl font-black text-primary"
              onClick={() => router.push("/")}
            >
              {t("common.brandName")}
            </Button>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Button variant="ghost" onClick={() => router.push("/")}>
              {t("nav.home")}
            </Button>
            <Button variant="ghost" onClick={() => router.push("/catalog")}>
              {t("nav.catalog")}
            </Button>
            <Button variant="ghost" onClick={() => {
              router.push('/');
              setTimeout(() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}>
              {t("nav.contact")}
            </Button>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <CartIcon />
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => router.push("/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  {user.name}
                </Button>
                <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("nav.logout")}
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => router.push("/login")}>
                {t("nav.login")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}