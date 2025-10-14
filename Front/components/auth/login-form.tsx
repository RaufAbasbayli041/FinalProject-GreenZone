"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context-new"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"

export function LoginForm() {
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const { login, isAdmin, isAuthenticated } = useAuth()
  const router = useRouter()

  // Отслеживаем изменения авторизации и перенаправляем
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, isAdmin })
    if (isAuthenticated) {
      if (isAdmin) {
        console.log('Redirecting to admin panel')
        router.push("/admin")
      } else {
        console.log('Redirecting to home page')
        router.push("/")
      }
    }
  }, [isAuthenticated, isAdmin, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await login(formData.userName, formData.password)

    if (result.success) {
      // Получаем токен и проверяем роль напрямую
      const token = localStorage.getItem('auth_token')
      if (token) {
        try {
          // Декодируем JWT токен для получения роли
          const payload = JSON.parse(atob(token.split('.')[1]))
          const userRole = payload.role || payload.roles || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          
          console.log('Token payload:', payload)
          console.log('User role from token:', userRole)
          
          // Перенаправляем в зависимости от роли
          if (userRole === 'Admin' || userRole === 'admin' || (Array.isArray(userRole) && userRole.includes('Admin'))) {
            console.log('Admin role detected, redirecting to admin panel')
            router.push("/admin")
          } else {
            console.log('Customer role detected, redirecting to home page')
            router.push("/")
          }
        } catch (error) {
          console.error('Error decoding token:', error)
          // Если не удалось декодировать токен, используем стандартную логику
          router.push("/")
        }
      } else {
        console.log('No token found, redirecting to home page')
        router.push("/")
      }
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg border-0">
      <CardHeader className="text-center">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/")}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="flex-1 text-2xl font-semibold text-gray-900">{t("auth.login")}</CardTitle>
        </div>
        <CardDescription className="text-gray-600">{t("auth.welcomeBack")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="userName" className="text-sm font-medium text-gray-700">{t("auth.userName")}</Label>
            <Input
              id="userName"
              type="text"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              placeholder={t("auth.enterUserName")}
              required
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">{t("auth.password")}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={t("auth.enterPassword")}
                required
                minLength={6}
                className="pr-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
            {loading ? `${t("auth.login")}...` : t("auth.login")}
          </Button>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50" 
            onClick={() => router.push("/register")}
          >
            {t("auth.register")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
