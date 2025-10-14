"use client"

import React from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { User, Shield, LogOut } from 'lucide-react'

export default function ProfilePage() {
  const { user, isAuthenticated, isAdmin, logout, getUserRoleFromToken } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const tokenRole = getUserRoleFromToken()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Не авторизован</CardTitle>
            <CardDescription>Войдите в систему для просмотра профиля</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/login')} className="w-full">
              Войти
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Профиль пользователя
            </CardTitle>
            <CardDescription>Информация о текущем пользователе</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Основная информация */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold mb-4">Основная информация</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Имя пользователя</label>
                    <p className="text-lg">{user?.name || 'Не указано'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg">{user?.email || 'Не указано'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Имя</label>
                    <p className="text-lg">{user?.firstName || 'Не указано'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Фамилия</label>
                    <p className="text-lg">{user?.lastName || 'Не указано'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Телефон</label>
                    <p className="text-lg">{user?.phoneNumber || 'Не указано'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Роли и права</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Роль в контексте</label>
                    <div className="mt-1">
                      <Badge variant={isAdmin ? "default" : "secondary"} className="text-sm">
                        {isAdmin ? 'Администратор' : 'Клиент'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Роль из токена</label>
                    <div className="mt-1">
                      <Badge variant={tokenRole === 'Admin' ? "default" : "secondary"} className="text-sm">
                        {tokenRole === 'Admin' ? 'Администратор' : 'Клиент'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Статус авторизации</label>
                    <div className="mt-1">
                      <Badge variant="outline" className="text-sm">
                        {isAuthenticated ? 'Авторизован' : 'Не авторизован'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Отладочная информация */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Отладочная информация</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify({
                    user: user,
                    isAuthenticated,
                    isAdmin,
                    tokenRole,
                    localStorage: {
                      auth_token: typeof window !== 'undefined' ? localStorage.getItem('auth_token')?.substring(0, 50) + '...' : 'N/A'
                    }
                  }, null, 2)}
                </pre>
              </div>
            </div>

            {/* Действия */}
            <div className="flex gap-4">
              {isAdmin && (
                <Button onClick={() => router.push('/admin')} className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Админ-панель
                </Button>
              )}
              <Button variant="outline" onClick={() => router.push('/')} className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Главная страница
              </Button>
              <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Выйти
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}