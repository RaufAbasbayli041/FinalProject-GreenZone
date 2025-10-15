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
  getAuthToken: () => string | null
  getUserIdFromToken: () => string | null
  getUserRoleFromToken: () => UserRole | null
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
        // Получаем роль из токена или из результата API
        let userRole = result.user?.role || UserRole.CUSTOMER
        
        // Если роль не пришла в результате, пытаемся извлечь из токена
        if (!result.user?.role && result.token) {
          try {
            const payload = JSON.parse(atob(result.token.split('.')[1]))
            const tokenRole = payload.role || payload.roles || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
            
            if (tokenRole) {
              // Обрабатываем роль как строку или массив
              if (Array.isArray(tokenRole)) {
                userRole = tokenRole.includes('Admin') ? UserRole.ADMIN : UserRole.CUSTOMER
              } else {
                userRole = tokenRole === 'Admin' || tokenRole === 'admin' ? UserRole.ADMIN : UserRole.CUSTOMER
              }
            }
          } catch (error) {
            console.error('Error parsing token for role:', error)
          }
        }
        
        console.log('Login result role:', result.user?.role, 'Final role:', userRole)
        
        const user: User = {
          id: result.user?.id || '',
          name: result.user?.name || '',
          email: result.user?.email || '',
          role: userRole,
          firstName: result.user?.firstName || '',
          lastName: result.user?.lastName || '',
          phone: result.user?.phone || '',
          phoneNumber: result.user?.phoneNumber || '',
          identityCard: result.user?.identityCard || '',
          createdAt: result.user?.createdAt || new Date()
        }

        // Сохраняем токен в localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', result.token)
          console.log('Токен сохранен в localStorage:', {
            hasToken: !!result.token,
            tokenPreview: result.token.substring(0, 20) + '...',
            localStorageKeys: Object.keys(localStorage)
          })
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
        errorMessage = "Проблема с сервером. Попробуйте позже."
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

  // Функция для получения токена из localStorage
  const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  // Функция для получения userId из токена
  const getUserIdFromToken = (): string | null => {
    const token = getAuthToken()
    if (!token) return null
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      // Используем правильный claim согласно бэкенду: JwtRegisteredClaimNames.Sub
      return payload.sub
    } catch (error) {
      console.error('Error parsing token for userId:', error)
    }
    
    return null
  }

  // Функция для получения роли из токена
const getUserRoleFromToken = (): UserRole | null => {
  const token = getAuthToken()
  if (!token) return null
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    
    // Ищем роль в правильных местах согласно бэкенду
    const tokenRole = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'] || 
                     payload.role || 
                     payload.roles
    
    console.log('Проверка роли пользователя:', {
      payload: payload,
      tokenRole: tokenRole,
      allClaims: Object.keys(payload),
      userId: payload.sub, // JwtRegisteredClaimNames.Sub
      email: payload.email, // JwtRegisteredClaimNames.Email
      nameIdentifier: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'], // ClaimTypes.NameIdentifier
      exp: payload.exp,
      iat: payload.iat,
      iss: payload.iss,
      aud: payload.aud,
      // Проверяем все возможные места для роли
      roleClaim: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'],
      roleDirect: payload.role,
      rolesArray: payload.roles
    })
    
    if (tokenRole) {
      if (Array.isArray(tokenRole)) {
        const role = tokenRole.includes('Admin') ? UserRole.ADMIN : UserRole.CUSTOMER
        console.log('Роль из массива:', role)
        return role
      } else {
        const role = tokenRole === 'Admin' || tokenRole === 'admin' ? UserRole.ADMIN : UserRole.CUSTOMER
        console.log('Роль из строки:', role)
        return role
      }
    }
    
    console.log('Роль не найдена в токене, но есть userId - считаем клиентом')
    // Если роль не найдена, но есть userId, считаем клиентом
    if (payload.sub) {
      return UserRole.CUSTOMER
    }
    
    console.log('Роль не найдена в токене')
  } catch (error) {
    console.error('Error parsing token for role:', error)
  }
  
  return null
}

  const isAdmin = authState.user?.role === UserRole.ADMIN

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        loading,
        getAuthToken,
        getUserIdFromToken,
        getUserRoleFromToken,
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
