import type { Product, User, Order, CartItem, AuthState } from "./types"

// Ключи для localStorage
const STORAGE_KEYS = {
  PRODUCTS: "gazonpro_products",
  USERS: "gazonpro_users",
  ORDERS: "gazonpro_orders",
  CART: "gazonpro_cart",
  AUTH: "gazonpro_auth",
  CURRENT_USER: "gazonpro_current_user",
} as const

// Утилиты для работы с localStorage
export const storage = {
  // Общие методы
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  },

  remove(key: string): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(key)
  },

  // Методы для продуктов
  getProducts(): Product[] {
    return this.get<Product[]>(STORAGE_KEYS.PRODUCTS) || []
  },

  setProducts(products: Product[]): void {
    this.set(STORAGE_KEYS.PRODUCTS, products)
  },

  // Методы для пользователей
  getUsers(): User[] {
    return this.get<User[]>(STORAGE_KEYS.USERS) || []
  },

  setUsers(users: User[]): void {
    this.set(STORAGE_KEYS.USERS, users)
  },

  // Методы для заказов
  getOrders(): Order[] {
    return this.get<Order[]>(STORAGE_KEYS.ORDERS) || []
  },

  setOrders(orders: Order[]): void {
    this.set(STORAGE_KEYS.ORDERS, orders)
  },

  // Методы для корзины
  getCart(): CartItem[] {
    return this.get<CartItem[]>(STORAGE_KEYS.CART) || []
  },

  setCart(cart: CartItem[]): void {
    this.set(STORAGE_KEYS.CART, cart)
  },

  // Методы для аутентификации
  getAuthState(): AuthState {
    return this.get<AuthState>(STORAGE_KEYS.AUTH) || { user: null, isAuthenticated: false }
  },

  setAuthState(authState: AuthState): void {
    this.set(STORAGE_KEYS.AUTH, authState)
  },

  // Очистка всех данных
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach((key) => this.remove(key))
  },
}

// Генератор уникальных ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
