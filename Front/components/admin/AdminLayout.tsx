"use client"

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Truck,
  FolderOpen,
  Menu,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/language-context-new'
import { LanguageSwitcher } from '@/components/language-switcher-new'

interface AdminLayoutProps {
  children: React.ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { t } = useLanguage()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const navigation = [
    { name: t('admin.nav.dashboard'), href: '/admin', icon: LayoutDashboard },
    { name: t('admin.nav.orders'), href: '/admin/orders', icon: ShoppingCart },
    { name: t('admin.nav.products'), href: '/admin/products', icon: Package },
    { name: t('admin.nav.customers'), href: '/admin/customers', icon: Users },
    { name: t('admin.nav.deliveries'), href: '/admin/deliveries', icon: Truck },
    { name: t('admin.nav.categories'), href: '/admin/categories', icon: FolderOpen },
  ]

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">GZ</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">GreenZone</h1>
            <p className="text-xs text-gray-500">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.email || 'Admin'}
            </p>
          </div>
        </div>
        <div className="ml-auto lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <button
                  onClick={() => {
                    router.push(item.href)
                    setSidebarOpen(false)
                  }}
                  className={`group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold transition-colors w-full text-left ${
                    isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-700 hover:text-green-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon
                    className={`h-6 w-6 shrink-0 ${
                      isActive ? 'text-green-700' : 'text-gray-400 group-hover:text-green-700'
                    }`}
                  />
                  {item.name}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      
      {/* Bottom section with logout and language switcher */}
      <div className="px-4 pb-4 border-t border-gray-200 pt-4">
        <div className="space-y-2">
          <LanguageSwitcher />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t('admin.nav.logout')}
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="bg-white shadow-md"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
