"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, AuthState } from "@/lib/types"
import { UserRole } from "@/lib/types"
import { storage, generateId } from "@/lib/storage"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isCustomer: boolean
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
      return { success: false, message: error.message || "Ошибка входа" }
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
  }

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        isAdmin: authState.user?.isAdmin || authState.user?.role === UserRole.ADMIN || false,
        isCustomer: authState.user?.role === UserRole.CUSTOMER || (!authState.user?.isAdmin && !authState.user?.role),
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
