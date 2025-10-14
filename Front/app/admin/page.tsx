"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { ModernAdminDashboard } from '@/components/admin/ModernAdminDashboard'
import { QuickActions } from '@/components/admin/QuickActions'
import { NotificationCenter } from '@/components/admin/NotificationCenter'
import { AdminLayout } from '@/components/admin/AdminLayout'
import Loader from '@/components/admin/Loader'

export default function AdminPage() {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  // Первый useEffect - проверка аутентификации
  useEffect(() => {
    const checkAuth = () => {
      if (!loading) {
        // Проверяем токен в localStorage
        const token = localStorage.getItem('auth_token')
        
        if (!token) {
          console.log('No token found, redirecting to login')
          router.push('/login')
          return
        }
        
        // Дополнительная проверка роли из токена
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const userRole = payload.role || payload.roles || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          
          console.log('Token payload:', payload)
          console.log('User role from token:', userRole)
          
          // Проверяем, является ли пользователь админом
          const isTokenAdmin = userRole === 'Admin' || userRole === 'admin' || 
                              (Array.isArray(userRole) && userRole.includes('Admin'))
          
          if (!isTokenAdmin) {
            console.log('Not admin role in token, redirecting to home')
            router.push('/')
            return
          }
          
          // Если токен валиден и пользователь админ, но состояние еще не готово
          if (!isAuthenticated || !isAdmin) {
            console.log('Token valid but auth state not ready, waiting...')
            return
          }
          
          setIsChecking(false)
        } catch (error) {
          console.error('Error parsing token:', error)
          router.push('/login')
          return
        }
      }
    }

    checkAuth()
  }, [isAuthenticated, isAdmin, loading, router])

  // Убираем второй useEffect - теперь AutoRedirect компонент обрабатывает редиректы

  if (loading || isChecking) {
    return <Loader />
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <ModernAdminDashboard />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <QuickActions />
          <NotificationCenter />
        </div>
      </div>
    </AdminLayout>
  )
}