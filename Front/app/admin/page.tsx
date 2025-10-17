"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { ModernAdminDashboard } from '@/components/admin/ModernAdminDashboard'
import { QuickActions } from '@/components/admin/QuickActions'
import { NotificationCenter } from '@/components/admin/NotificationCenter'
import { AdminLayout } from '@/components/admin/AdminLayout'
import Loader from '@/components/admin/Loader'

export default function AdminPage() {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      if (!loading) {
        // Проверяем токен в localStorage
        const token = localStorage.getItem('auth_token')
        
        if (!token) {
          console.log('Токен не найден, перенаправляем на страницу входа админ-панели')
          router.push('/admin/login')
          return
        }
        
        if (!isAuthenticated) {
          console.log('Пользователь не авторизован, перенаправляем на страницу входа админ-панели')
          router.push('/admin/login')
          return
        }
        
        if (!isAdmin) {
          console.log('Пользователь не является админом, перенаправляем на главную страницу')
          router.push('/')
          return
        }
        
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [isAuthenticated, isAdmin, loading, router])

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