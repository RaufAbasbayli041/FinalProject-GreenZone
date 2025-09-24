"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, AuthState } from "@/lib/types"
import { storage, generateId } from "@/lib/storage"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (
    name: string,
    email: string,
    password: string,
    phone: string,
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

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const users = storage.getUsers()
      const user = users.find((u) => u.email === email)

      if (!user) {
        return { success: false, message: "Пользователь не найден" }
      }

      // В реальном приложении здесь была бы проверка хешированного пароля
      // Для демонстрации используем простую проверку
      if (password.length < 6) {
        return { success: false, message: "Неверный пароль" }
      }

      const newAuthState = { user, isAuthenticated: true }
      setAuthState(newAuthState)
      storage.setAuthState(newAuthState)

      return { success: true, message: "Успешный вход" }
    } catch (error) {
      return { success: false, message: "Ошибка при входе" }
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    phone: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const users = storage.getUsers()

      // Проверяем, существует ли пользователь с таким email
      if (users.find((u) => u.email === email)) {
        return { success: false, message: "Пользователь с таким email уже существует" }
      }

      // Создаем нового пользователя
      const newUser: User = {
        id: generateId(),
        name,
        email,
        phone,
        createdAt: new Date(),
        isAdmin: false,
      }

      // Сохраняем пользователя
      const updatedUsers = [...users, newUser]
      storage.setUsers(updatedUsers)

      // Автоматически входим в систему
      const newAuthState = { user: newUser, isAuthenticated: true }
      setAuthState(newAuthState)
      storage.setAuthState(newAuthState)

      return { success: true, message: "Регистрация успешна" }
    } catch (error) {
      return { success: false, message: "Ошибка при регистрации" }
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
