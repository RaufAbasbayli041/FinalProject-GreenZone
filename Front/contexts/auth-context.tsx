"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, AuthState } from "@/lib/types"
import { UserRole } from "@/lib/types"
import { storage, generateId } from "@/lib/storage"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userName: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (
    userName: string,
    email: string,
    password: string,
    phoneNumber: string,
    firstName?: string,
    lastName?: string,
    identityCard?: string,
  ) => Promise<{ success: boolean; message: string }>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Загружаем состояние аутентификации при инициализации
    const savedAuthState = storage.getAuthState()
    setAuthState(savedAuthState)
    setLoading(false)
  }, [])

  const login = async (userName: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Импортируем API функцию для входа
      const { login: apiLogin } = await import('@/services/api')
      
      const result = await apiLogin({ userName, password })
      
      if (result.token) {
        // Создаем объект пользователя из результата API
        const user: User = {
          id: result.userId || result.customerId || '',
          name: result.userName || userName,
          email: result.email || '',
          role: result.role || UserRole.CUSTOMER,
          firstName: result.firstName || '',
          lastName: result.lastName || '',
          phoneNumber: result.phoneNumber || '',
          identityCard: result.identityCard || ''
        }

        // Устанавливаем состояние аутентификации
        const newAuthState: AuthState = { user, isAuthenticated: true }
        setAuthState(newAuthState)
        storage.setAuthState(newAuthState)

        return { success: true, message: "Вход выполнен успешно" }
      } else {
        return { success: false, message: "Неверные учетные данные" }
      }
    } catch (error: any) {
      console.error("Ошибка входа:", error)
      
      // Улучшенная обработка ошибок
      let errorMessage = "Ошибка входа"
      
      if (error.message.includes('500')) {
        errorMessage = "Проблема с сервером. Попробуйте позже или используйте демо-режим."
      } else if (error.message.includes('401')) {
        errorMessage = "Неверные учетные данные"
      } else if (error.message.includes('400')) {
        errorMessage = "Некорректные данные для входа"
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = "Проблема с подключением. Проверьте интернет-соединение."
      }
      
      return { success: false, message: errorMessage }
    }
  }

  const register = async (
    userName: string,
    email: string,
    password: string,
    phoneNumber: string,
    firstName?: string,
    lastName?: string,
    identityCard?: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      // Импортируем API функцию для регистрации
      const { register: apiRegister } = await import('@/services/api')
      
      const registerData = {
        userName,
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        phoneNumber,
        password,
        confirmPassword: password, // Для простоты используем тот же пароль
        identityCard: identityCard || ''
      }
      
      const result = await apiRegister(registerData)
      
      if (result.succeeded) {
        return { success: true, message: "Регистрация успешна. Проверьте email для подтверждения аккаунта." }
      } else {
        return { success: false, message: result.message || "Ошибка при регистрации" }
      }
    } catch (error: any) {
      console.error("Ошибка регистрации:", error)
      return { success: false, message: error.message || "Ошибка при регистрации" }
    }
  }

  const logout = () => {
    const newAuthState = { user: null, isAuthenticated: false }
    setAuthState(newAuthState)
    storage.setAuthState(newAuthState)
    
    // Очищаем токен из localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
