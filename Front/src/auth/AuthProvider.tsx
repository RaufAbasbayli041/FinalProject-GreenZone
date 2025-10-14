import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi } from '../api/endpoints';

// Types
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string | string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// JWT helper functions
const parseJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const payload = parseJWT(token);
  if (!payload || !payload.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
};

const getUserRole = (token: string): string | string[] | null => {
  const payload = parseJWT(token);
  if (!payload) return null;
  
  // Проверяем различные варианты claims для роли
  return payload.role || payload.roles || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
};

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user && !isTokenExpired(token);
  const isAdmin = isAuthenticated && checkIsAdmin(user.role);

  // Helper function to check if user is admin
  function checkIsAdmin(role: string | string[]): boolean {
    if (Array.isArray(role)) {
      return role.includes('Admin') || role.includes('admin');
    }
    return role === 'Admin' || role === 'admin';
  }

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authApi.login(email, password);
      const { token: newToken, user: userData } = response.data;
      
      // Сохраняем токен в localStorage
      localStorage.setItem('greenzone_token', newToken);
      
      // Парсим роль из токена
      const role = getUserRole(newToken);
      
      setToken(newToken);
      setUser({
        ...userData,
        role: role || 'User'
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem('greenzone_token');
    setToken(null);
    setUser(null);
  };

  // Check authentication on app start
  const checkAuth = async (): Promise<void> => {
    try {
      const storedToken = localStorage.getItem('greenzone_token');
      
      if (!storedToken || isTokenExpired(storedToken)) {
        logout();
        return;
      }

      // Получаем данные пользователя
      const response = await authApi.getProfile();
      const userData = response.data;
      
      // Парсим роль из токена
      const role = getUserRole(storedToken);
      
      setToken(storedToken);
      setUser({
        ...userData,
        role: role || 'User'
      });
    } catch (error) {
      console.error('Auth check error:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
