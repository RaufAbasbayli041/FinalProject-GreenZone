export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: "landscape" | "sports" | "decorative"
  specifications: {
    height: string
    density: string
    warranty: string
  }
  popular?: boolean
  premium?: boolean
}

export interface User {
  id: string
  email: string
  name: string
  phone: string
  address?: string
  createdAt: Date
  isAdmin?: boolean
}

export interface CartItem {
  productId: string
  quantity: number
  area: number // площадь в м²
  installationRequired: boolean
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
  }
  installationAddress?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}
