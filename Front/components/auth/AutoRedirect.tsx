"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

export function AutoRedirect() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    // Не делаем редирект если:
    // 1. Еще загружается состояние аутентификации
    // 2. Уже был редирект
    // 3. Пользователь не аутентифицирован
    if (loading || hasRedirected || !isAuthenticated) {
      return
    }

    // Небольшая задержка для обновления состояния аутентификации
    const timeoutId = setTimeout(() => {
      // Проверяем токен напрямую для более надежной проверки
      const token = localStorage.getItem('auth_token')
      if (!token) {
        return
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const userRole = payload.role || payload.roles || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        
        // Определяем, является ли пользователь админом
        const isTokenAdmin = userRole === 'Admin' || userRole === 'admin' || 
                            (Array.isArray(userRole) && userRole.includes('Admin'))

        console.log('AutoRedirect: Checking user role', { userRole, isTokenAdmin, pathname })

        // Перенаправляем в зависимости от роли
        if (isTokenAdmin) {
          // Админ должен быть в админ панели
          if (!pathname.startsWith('/admin')) {
            console.log('AutoRedirect: Admin user on non-admin page, redirecting to admin panel')
            router.push('/admin')
            setHasRedirected(true)
          }
        } else {
          // Обычный пользователь должен быть в UI
          if (pathname.startsWith('/admin')) {
            console.log('AutoRedirect: Non-admin user on admin page, redirecting to home')
            router.push('/')
            setHasRedirected(true)
          } else if (pathname === '/login' || pathname === '/register') {
            // Если пользователь на странице логина/регистрации, перенаправляем на главную
            console.log('AutoRedirect: Customer user on auth page, redirecting to home')
            router.push('/')
            setHasRedirected(true)
          }
        }
      } catch (error) {
        console.error('AutoRedirect: Error parsing token:', error)
        // Если токен невалиден, перенаправляем на логин
        if (pathname.startsWith('/admin')) {
          router.push('/login')
          setHasRedirected(true)
        }
      }
    }, 100) // 100ms задержка

    return () => clearTimeout(timeoutId)
  }, [isAuthenticated, isAdmin, loading, pathname, router, hasRedirected])

  // Этот компонент не рендерит ничего видимого
  return null
}
