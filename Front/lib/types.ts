export interface Product {
  id: string
  title: string
  description: string
  pricePerSquareMeter: number
  minThickness: number
  maxThickness: number
  imageUrl?: string
  categoryId: string
  category?: {
    id: string
    name: string
  }
  documentIds?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface ProductCreateDto {
  title: string
  description: string
  pricePerSquareMeter: number
  minThickness: number
  maxThickness: number
  imageUrl?: string
  categoryId: string
  documentIds?: string[]
}

export interface ProductUpdateDto {
  title?: string
  description?: string
  pricePerSquareMeter?: number
  minThickness?: number
  maxThickness?: number
  imageUrl?: string
  categoryId?: string
  documentIds?: string[]
}

export interface ProductSearchResult {
  products: Product[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

// Auth Types
export interface LoginDto {
  userName: string
  password: string
}

export interface RegisterDto {
  userName: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  password: string
  confirmPassword: string
  identityCard: string
}

export interface AuthResult {
  token: string
  user: User
  expiresAt: Date
}

// Category Types
export interface Category {
  id: string
  name: string
  description?: string
  products?: Product[]
}

export interface CategoryCreateDto {
  name: string
  description?: string
}

export interface CategoryUpdateDto {
  name?: string
  description?: string
}

// Basket Types
export interface BasketItem {
  id: string
  basketId: string
  productId: string
  product?: Product
  quantity: number
  totalPrice?: number
  createdAt?: string
  updatedAt?: string
  isDeleted?: boolean
}

export interface Basket {
  id: string
  customerId: string
  basketItems: BasketItem[] // Исправляем: используем basketItems вместо items
  totalAmount: number
  createdAt?: string
  updatedAt?: string
  isDeleted?: boolean
}

export interface BasketItemsCreateDto {
  basketId: string
  productId: string
  quantity: number
}

export interface BasketItemsUpdateDto {
  productId: string
  quantity: number
}

// Customer Types
export interface Customer {
  id: string
  userId: string
  firstName: string
  lastName: string
  identityCard: string
  email: string
  phoneNumber: string
  orders?: Order[]
}

export interface CustomerUpdateDto {
  firstName?: string
  lastName?: string
  identityCard?: string
  email?: string
  phoneNumber?: string
}

// Order Types
export interface OrderStatus {
  id: string
  name: string
  description?: string
}

export interface OrderItem {
  id: string
  productId: string
  product?: Product
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface OrderCreateDto {
  totalAmount: number
  shippingAddress: string
  orderDate: Date
  customerId: string
  orderStatusId: string
  items: OrderItemCreateDto[]
}

export interface OrderItemCreateDto {
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface OrderUpdateDto {
  totalAmount?: number
  shippingAddress?: string
  orderDate?: Date
  customerId?: string
  orderStatusId?: string
  items?: OrderItemCreateDto[]
}

// User Roles
export enum UserRole {
  CUSTOMER = 'Customer',
  ADMIN = 'Admin'
}

// Language Types
export enum Language {
  RU = 'ru',
  EN = 'en',
  AZ = 'az'
}

export interface LanguageState {
  currentLanguage: Language
  translations: Record<string, string>
}

export interface User {
  id: string
  email: string
  name: string
  phone: string
  address?: string
  createdAt: Date
  role?: UserRole
  firstName?: string
  lastName?: string
  phoneNumber?: string
  identityCard?: string
}

export interface CartItem {
  productId: string
  quantity: number
  area: number // площадь в м²
  installationRequired: boolean
}

export interface Order {
  id: string
  customerId: string
  customer?: Customer
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  shippingAddress: string
  orderDate: Date
  orderStatusId: string
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Additional types from apidoc.json
export interface ApplicationUser {
  id?: string
  userName?: string
  normalizedUserName?: string
  email?: string
  normalizedEmail?: string
  emailConfirmed: boolean
  passwordHash?: string
  securityStamp?: string
  concurrencyStamp?: string
  phoneNumber?: string
  phoneNumberConfirmed: boolean
  twoFactorEnabled: boolean
  lockoutEnd?: Date
  lockoutEnabled: boolean
  accessFailedCount: number
  firstName?: string
  lastName?: string
}

export interface BasketItems {
  id: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  basketId: string
  basket?: Basket
  productId: string
  product?: Product
  quantity: number
  totalPrice: number
}

export interface Delivery {
  id: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  orderId: string
  deliveryStatusId: string
  deliveredAt?: Date
  order?: Order
  deliveryStatus?: DeliveryStatus
}

export interface DeliveryCreateDto {
  orderId: string
  deliveryStatusId: string
}

export interface DeliveryReadDto {
  id: string
  orderId: string
  statusName?: string
  createdAt: Date
  deliveredAt?: Date
}

export interface DeliveryStatus {
  id: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  name?: string
  statusType: DeliveryStatusType
  deliveries?: Delivery[]
}

export interface DeliveryStatusCreateDto {
  name?: string
}

export interface DeliveryStatusReadDto {
  id: string
  name?: string
}

export enum DeliveryStatusType {
  PENDING = 1,
  IN_TRANSIT = 2,
  DELIVERED = 3,
  FAILED = 4
}

export interface DeliveryStatusUpdateDto {
  name?: string
}

export interface DeliveryUpdateDto {
  deliveryStatusId: string
}

export enum OrderStatusName {
  PENDING = 1,
  CONFIRMED = 2,
  PROCESSING = 3,
  SHIPPED = 4,
  DELIVERED = 5,
  CANCELLED = 6
}

export interface Payment {
  id: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  amount: number
  paymentDate: Date
  refundDate?: Date
  status: PaymentStatus
  paymentMethodId: string
  paymentMethod?: PaymentMethod
  customerId: string
  customer?: Customer
}

export interface PaymentMethod {
  id: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  name?: string
  payments?: Payment[]
}

export enum PaymentStatus {
  PENDING = 0,
  COMPLETED = 1,
  FAILED = 2,
  REFUNDED = 3,
  CANCELLED = 4
}

export interface ProductDocuments {
  id: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  documentUrl?: string
  productId: string
  product?: Product
}
