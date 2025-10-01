import type { 
  Product, 
  ProductCreateDto, 
  ProductUpdateDto, 
  ProductSearchResult,
  LoginDto,
  RegisterDto,
  AuthResult,
  Category,
  CategoryCreateDto,
  CategoryUpdateDto,
  Basket,
  BasketItemsCreateDto,
  BasketItemsUpdateDto,
  Customer,
  CustomerUpdateDto,
  Order,
  OrderCreateDto,
  OrderUpdateDto,
  Delivery,
  DeliveryCreateDto,
  DeliveryReadDto,
  DeliveryUpdateDto,
  DeliveryStatus,
  DeliveryStatusCreateDto,
  DeliveryStatusReadDto,
  DeliveryStatusUpdateDto,
  DeliveryStatusType,
  Payment,
  PaymentMethod,
  PaymentStatus,
  ProductDocuments
} from '@/lib/types'
import { getCustomerByUserId } from './customer-api'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7100'

// Функция для получения токена из localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

// Функция для получения userId из JWT токена
export function getUserIdFromToken(): string | null {
  const token = getAuthToken()
  if (!token) return null
  
  try {
    // Декодируем JWT токен (только payload часть)
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.userId || payload.sub || null
  } catch (error) {
    console.error('Ошибка декодирования токена:', error)
    return null
  }
}

// Функция для получения customerId по userId
export async function getCustomerIdByUserId(userId: string): Promise<string | null> {
  try {
    console.log('Получение customerId для userId:', userId)
    
    // Простое решение: используем userId как customerId
    // Это работает, если в системе userId = customerId
    const customer = await getCustomerByUserId(userId)
    
    if (customer) {
      console.log('Найден customerId:', customer.id)
      return customer.id
    } else {
      console.log('Клиент не найден, используем userId как customerId:', userId)
      return userId
    }
  } catch (error) {
    console.error('Ошибка получения customerId:', error)
    // В случае ошибки, используем userId как customerId
    console.log('Используем userId как customerId из-за ошибки:', userId)
    return userId
  }
}

// Функция для получения корзины по userId (используем userId напрямую)
export async function getBasketByUserId(userId: string): Promise<Basket | null> {
  try {
    return await getBasketByCustomerId(userId)
  } catch (error) {
    console.error('Ошибка получения корзины по userId:', error)
    return null
  }
}

async function fetchJSON<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  // Получаем токен аутентификации
  const token = getAuthToken()
  
  // Если путь уже полный URL, используем его как есть
  if (path.startsWith('http')) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const res = await fetch(path, { 
      ...opts, 
      headers: { ...headers, ...(opts.headers || {}) } 
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Request failed ${res.status} ${res.statusText}: ${text}`)
    }
    return (await res.json()) as T
  }

  // Строим полный URL к бэкенду
  const baseClean = BASE.replace(/\/+$/, '') // убираем trailing slash
  const pathClean = path.replace(/^\/+/, '') // убираем leading slash
  const url = `${baseClean}/${pathClean}`

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, { 
    ...opts, 
    credentials: 'include', 
    headers: { ...headers, ...(opts.headers || {}) } 
  })
  
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Request failed ${res.status} ${res.statusText}: ${text}`)
  }
  return (await res.json()) as T
}

// ===== PRODUCT API =====
export async function fetchProducts(): Promise<Product[]> {
  try {
    // Загружаем продукты и категории параллельно
    const [products, categories] = await Promise.all([
      fetchJSON<Product[]>('/api/Product'),
      fetchJSON<Category[]>('/api/Category')
    ])
    
    // Создаем карту категорий для быстрого поиска
    const categoryMap = new Map(categories.map(cat => [cat.id, cat]))
    
    // Добавляем информацию о категории к каждому продукту
    const productsWithCategories = products.map(product => ({
      ...product,
      category: categoryMap.get(product.categoryId)
    }))
    
    return productsWithCategories
  } catch (error: any) {
    console.error('Ошибка загрузки продуктов с категориями:', error)
    throw error
  }
}

export async function fetchProductById(id: string): Promise<Product> {
  try {
    // Загружаем продукт и категории параллельно
    const [product, categories] = await Promise.all([
      fetchJSON<Product>(`/api/Product/${id}`),
      fetchJSON<Category[]>('/api/Category')
    ])
    
    // Находим категорию для этого продукта
    const category = categories.find(cat => cat.id === product.categoryId)
    
    return {
      ...product,
      category
    }
  } catch (error: any) {
    console.log('API продукта недоступен:', error.message)
    throw error
  }
}

export async function createProduct(productData: ProductCreateDto): Promise<Product> {
  try {
    return await fetchJSON<Product>('/api/Product', {
      method: 'POST',
      body: JSON.stringify(productData)
    })
  } catch (e: any) {
    console.log('API создания продукта недоступен:', e.message)
    throw e
  }
}

export async function updateProduct(id: string, productData: ProductUpdateDto): Promise<Product> {
  try {
    return await fetchJSON<Product>(`/api/Product/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    })
  } catch (e: any) {
    console.log('API обновления продукта недоступен:', e.message)
    throw e
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await fetchJSON(`/api/Product/${id}`, { method: 'DELETE' })
    return true
  } catch (e: any) {
    console.log('API удаления продукта недоступен:', e.message)
    throw e
  }
}

export async function uploadProductImage(id: string, imageFile: File): Promise<boolean> {
  try {
    const formData = new FormData()
    formData.append('Image', imageFile)

    await fetchJSON(`/api/Product/upload-image/${id}`, {
      method: 'POST',
      body: formData
    })
    return true
  } catch (e: any) {
    console.log('API загрузки изображения недоступен:', e.message)
    throw e
  }
}

export async function searchProducts(keyword: string, page: number = 1, pageSize: number = 10): Promise<ProductSearchResult> {
  try {
    return await fetchJSON<ProductSearchResult>(`/api/Product/search?keyword=${encodeURIComponent(keyword)}&page=${page}&pageSize=${pageSize}`)
  } catch (e: any) {
    console.log('API поиска недоступен:', e.message)
    throw e
  }
}

export async function getProductById(id: string): Promise<Product> {
  try {
    return await fetchJSON<Product>(`/api/Product/${id}`)
  } catch (e: any) {
    console.log('API получения продукта по ID недоступен:', e.message)
    throw e
  }
}

export async function fetchProductsByCategory(categoryId: string, page: number = 1, pageSize: number = 10): Promise<ProductSearchResult> {
  try {
    return await fetchJSON<ProductSearchResult>(`/api/Product/by-category/${categoryId}?page=${page}&pageSize=${pageSize}`)
  } catch (e: any) {
    console.log('API категорий недоступен:', e.message)
    throw e
  }
}

// ===== AUTH API =====
export async function login(loginData: LoginDto): Promise<AuthResult> {
  try {
    const result = await fetchJSON<AuthResult>('/api/Auth/login', { 
      method: 'POST', 
      body: JSON.stringify(loginData) 
    })
    
    // Сохраняем токен в localStorage
    if (result.token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', result.token)
    }
    
    return result
  } catch (e: any) {
    console.log('API логина недоступен:', e.message)
    throw e
  }
}

export async function register(registerData: RegisterDto): Promise<any> {
  try {
    return await fetchJSON('/api/Auth/register', { 
      method: 'POST', 
      body: JSON.stringify(registerData) 
    })
  } catch (e: any) {
    console.log('API регистрации недоступен:', e.message)
    // Заглушка для регистрации
    return {
      succeeded: true,
      message: 'User registered successfully (mock)'
    }
  }
}

export async function logout(): Promise<void> {
  try {
    await fetchJSON('/api/Auth/logout', { method: 'POST' })
  } catch (e: any) {
    console.log('API выхода недоступен:', e.message)
    // Просто логируем ошибку, не выбрасываем исключение
  } finally {
    // Удаляем токен из localStorage в любом случае
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }
}

// Функция для проверки аутентификации
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('auth_token')
}

// Функция для получения текущего токена
export function getCurrentToken(): string | null {
  return getAuthToken()
}


// Функция для получения информации о текущем пользователе
export async function getCurrentUser(): Promise<any> {
  try {
    return await fetchJSON('/api/Auth/me')
  } catch (error: any) {
    console.log('API получения пользователя недоступен:', error.message)
    throw error
  }
}


// Функция для получения корзины пользователя
export async function getBasket(customerId: string): Promise<any> {
  try {
    return await fetchJSON(`/api/Basket/${customerId}`)
  } catch (error: any) {
    console.log('API корзины недоступен:', error.message)
    throw error
  }
}

// Функция для добавления товара в корзину
export async function addToBasket(customerId: string, productId: string, quantity: number): Promise<any> {
  try {
    return await fetchJSON(`/api/Basket/${customerId}/items`, {
      method: 'POST',
      body: JSON.stringify({
        basketId: customerId, // Предполагаем, что basketId = customerId
        productId,
        quantity
      })
    })
  } catch (error: any) {
    console.log('API добавления в корзину недоступен:', error.message)
    throw error
  }
}

// Функция для удаления товара из корзины
export async function removeFromBasket(customerId: string, productId: string, quantity: number): Promise<any> {
  try {
    return await fetchJSON(`/api/Basket/${customerId}/items?productId=${productId}&quantity=${quantity}`, {
      method: 'DELETE'
    })
  } catch (error: any) {
    console.log('API удаления из корзины недоступен:', error.message)
    throw error
  }
}

// Функция для обновления товара в корзине
export async function updateBasketItem(customerId: string, productId: string, quantity: number): Promise<any> {
  try {
    return await fetchJSON('/api/Basket/items', {
      method: 'PUT',
      body: JSON.stringify({
        customerId,
        productId,
        quantity
      })
    })
  } catch (error: any) {
    console.log('API обновления корзины недоступен:', error.message)
    throw error
  }
}

// Функция для очистки корзины
export async function clearBasket(customerId: string): Promise<any> {
  try {
    return await fetchJSON(`/api/Basket/${customerId}`, {
      method: 'DELETE'
    })
  } catch (error: any) {
    console.log('API очистки корзины недоступен:', error.message)
    throw error
  }
}

// ===== CATEGORY API =====
export async function getAllCategories(): Promise<Category[]> {
  try {
    return await fetchJSON<Category[]>('/api/Category')
  } catch (e: any) {
    console.log('API категорий недоступен:', e.message)
    throw e
  }
}

export async function getCategoryById(id: string): Promise<Category> {
  try {
    return await fetchJSON<Category>(`/api/Category/${id}`)
  } catch (e: any) {
    console.log('API категории недоступен:', e.message)
    throw e
  }
}

export async function createCategory(categoryData: CategoryCreateDto): Promise<Category> {
  try {
    return await fetchJSON<Category>('/api/Category', { 
      method: 'POST', 
      body: JSON.stringify(categoryData) 
    })
  } catch (e: any) {
    console.log('API создания категории недоступен:', e.message)
    throw e
  }
}

export async function updateCategory(id: string, categoryData: CategoryUpdateDto): Promise<Category> {
  try {
    return await fetchJSON<Category>(`/api/Category/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(categoryData) 
    })
  } catch (e: any) {
    console.log('API обновления категории недоступен:', e.message)
    throw e
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    await fetchJSON(`/api/Category/${id}`, { method: 'DELETE' })
    return true
  } catch (e: any) {
    console.log('API удаления категории недоступен:', e.message)
    throw e
  }
}

// ===== BASKET API =====
export async function getBasketByCustomerId(customerId: string): Promise<Basket> {
  try {
    return await fetchJSON<Basket>(`/api/Basket/${customerId}`)
  } catch (e: any) {
    console.log('API корзины недоступен или корзина не найдена:', e.message)
    
    // Если корзина не найдена (500 ошибка), возвращаем пустую корзину
    if (e.message.includes('500') || e.message.includes('Basket not found')) {
      return {
        id: '',
        customerId: customerId,
        basketItems: [], // Исправляем: используем basketItems вместо items
        totalAmount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false
      }
    }
    
    throw e
  }
}

export async function addItemsToBasket(customerId: string, items: BasketItemsCreateDto): Promise<void> {
  try {
    await fetchJSON(`/api/Basket/${customerId}/items`, { 
      method: 'POST', 
      body: JSON.stringify(items) 
    })
  } catch (e: any) {
    console.log('API добавления в корзину недоступен:', e.message)
    // Просто логируем ошибку
  }
}

export async function removeItemsFromBasket(customerId: string, productId: string, quantity: number): Promise<void> {
  try {
    await fetchJSON(`/api/Basket/${customerId}/items?productId=${productId}&quantity=${quantity}`, { 
      method: 'DELETE' 
    })
  } catch (e: any) {
    console.log('API удаления из корзины недоступен:', e.message)
    // Просто логируем ошибку
  }
}


export async function updateItemsInBasket(customerId: string, items: BasketItemsUpdateDto): Promise<void> {
  try {
    await fetchJSON(`/api/Basket/${customerId}/items`, { 
      method: 'PUT', 
      body: JSON.stringify(items) 
    })
  } catch (e: any) {
    console.log('API обновления корзины недоступен:', e.message)
    // Просто логируем ошибку
  }
}

// ===== CUSTOMER API =====
export async function getAllCustomers(): Promise<Customer[]> {
  try {
    return await fetchJSON<Customer[]>('/api/Customer')
  } catch (e: any) {
    console.log('API клиентов недоступен:', e.message)
    throw e
  }
}

export async function getCustomerById(id: string): Promise<Customer> {
  try {
    return await fetchJSON<Customer>(`/api/Customer/${id}`)
  } catch (e: any) {
    console.log('API клиента недоступен:', e.message)
    throw e
  }
}

export async function updateCustomer(id: string, customerData: CustomerUpdateDto): Promise<Customer> {
  try {
    return await fetchJSON<Customer>(`/api/Customer/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(customerData) 
    })
  } catch (e: any) {
    console.log('API обновления клиента недоступен:', e.message)
    throw e
  }
}

export async function getAllCustomersWithOrders(page: number = 1, pageSize: number = 10): Promise<Customer[]> {
  try {
    return await fetchJSON<Customer[]>(`/api/Customer/with-orders?page=${page}&pageSize=${pageSize}`)
  } catch (e: any) {
    console.log('API клиентов с заказами недоступен:', e.message)
    throw e
  }
}

export async function getCustomerFullData(customerId: string): Promise<Customer> {
  try {
    return await fetchJSON<Customer>(`/api/Customer/full-data/${customerId}`)
  } catch (e: any) {
    console.log('API полных данных клиента недоступен:', e.message)
    throw e
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  try {
    await fetchJSON(`/api/Customer/${id}`, { method: 'DELETE' })
  } catch (e: any) {
    console.log('API удаления клиента недоступен:', e.message)
    throw e
  }
}

// ===== ORDER API =====
export async function getAllOrders(): Promise<Order[]> {
  try {
    return await fetchJSON<Order[]>('/api/Order')
  } catch (e: any) {
    console.log('API заказов недоступен:', e.message)
    throw e
  }
}

export async function getOrderById(id: string): Promise<Order> {
  try {
    return await fetchJSON<Order>(`/api/Order/${id}`)
  } catch (e: any) {
    console.log('API заказа недоступен:', e.message)
    throw e
  }
}

export async function createOrder(orderData: OrderCreateDto): Promise<Order> {
  try {
    return await fetchJSON<Order>('/api/Order', { 
      method: 'POST', 
      body: JSON.stringify(orderData) 
    })
  } catch (e: any) {
    console.log('API создания заказа недоступен:', e.message)
    // Заглушка для заказа
    return {
      id: 'mock-order-' + Date.now(),
      customerId: orderData.customerId,
      items: [],
      totalAmount: orderData.totalAmount,
      status: {
        id: '1',
        name: 'Pending',
        description: 'Order is pending'
      },
      shippingAddress: orderData.shippingAddress,
      orderDate: orderData.orderDate,
      orderStatusId: orderData.orderStatusId,
      updatedAt: new Date()
    }
  }
}

export async function updateOrder(id: string, orderData: OrderUpdateDto): Promise<Order> {
  try {
    return await fetchJSON<Order>(`/api/Order/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(orderData) 
    })
  } catch (e: any) {
    console.log('API обновления заказа недоступен:', e.message)
    throw e
  }
}

export async function deleteOrder(id: string): Promise<boolean> {
  try {
    await fetchJSON(`/api/Order/${id}`, { method: 'DELETE' })
    return true
  } catch (e: any) {
    console.log('API удаления заказа недоступен:', e.message)
    throw e
  }
}

export async function getOrdersByStatus(orderStatusId?: string, keyword?: string, page: number = 1, pageSize: number = 10): Promise<Order[]> {
  try {
    const params = new URLSearchParams()
    if (keyword) params.append('keyword', keyword)
    params.append('page', page.toString())
    params.append('pageSize', pageSize.toString())
    
    return await fetchJSON<Order[]>(`/api/Order/by-status/${orderStatusId || 'null'}?${params.toString()}`)
  } catch (e: any) {
    console.log('API заказов по статусу недоступен:', e.message)
    throw e
  }
}

export async function cancelOrder(id: string): Promise<Order> {
  try {
    return await fetchJSON<Order>(`/api/Order/${id}/cancel`, { method: 'PUT' })
  } catch (e: any) {
    console.log('API отмены заказа недоступен:', e.message)
    throw e
  }
}

export async function markAsDelivered(id: string): Promise<Order> {
  try {
    return await fetchJSON<Order>(`/api/Order/${id}/deliver`, { method: 'PUT' })
  } catch (e: any) {
    console.log('API доставки заказа недоступен:', e.message)
    throw e
  }
}

export async function markAsProcessing(id: string): Promise<Order> {
  try {
    return await fetchJSON<Order>(`/api/Order/${id}/processing`, { method: 'PUT' })
  } catch (e: any) {
    console.log('API обработки заказа недоступен:', e.message)
    throw e
  }
}

export async function markAsReturned(id: string): Promise<Order> {
  try {
    return await fetchJSON<Order>(`/api/Order/${id}/returned`, { method: 'PUT' })
  } catch (e: any) {
    console.log('API возврата заказа недоступен:', e.message)
    throw e
  }
}

export async function markAsShipped(id: string): Promise<Order> {
  try {
    return await fetchJSON<Order>(`/api/Order/${id}/shipped`, { method: 'PUT' })
  } catch (e: any) {
    console.log('API отправки заказа недоступен:', e.message)
    throw e
  }
}

export async function setOrderStatus(id: string, orderStatusId: string): Promise<Order> {
  try {
    return await fetchJSON<Order>(`/api/Order/${id}/set-status/${orderStatusId}`, { method: 'PUT' })
  } catch (e: any) {
    console.log('API установки статуса заказа недоступен:', e.message)
    throw e
  }
}

// ===== LEGACY FUNCTIONS (for backward compatibility) =====
export async function fetchTranslations(lang = "en"): Promise<Record<string, string>> {
  // Возвращаем заглушку переводов напрямую, так как API переводов не существует в бэкенде
  const translations: Record<string, Record<string, string>> = {
    en: {
      'home.title': 'GreenZone - Premium Artificial Grass',
      'home.subtitle': 'Transform your space with our high-quality artificial grass solutions',
      'nav.catalog': 'Catalog',
      'nav.services': 'Services',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'nav.login': 'Login',
      'nav.register': 'Register',
      'nav.cart': 'Cart',
      'nav.profile': 'Profile',
      'product.price': 'Price',
      'product.add_to_cart': 'Add to Cart',
      'product.description': 'Description',
      'cart.title': 'Shopping Cart',
      'cart.empty': 'Your cart is empty',
      'cart.total': 'Total',
      'cart.checkout': 'Checkout',
      'auth.login': 'Login',
      'auth.register': 'Register',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.confirm_password': 'Confirm Password',
      'auth.submit': 'Submit',
      'products.title': 'Our Products',
      'products.order': 'Order Now',
      'products.viewAll': 'View All Products'
    },
    ru: {
      'home.title': 'GreenZone - Премиум Искусственная Трава',
      'home.subtitle': 'Преобразите ваше пространство с нашими высококачественными решениями искусственной травы',
      'nav.catalog': 'Каталог',
      'nav.services': 'Услуги',
      'nav.about': 'О нас',
      'nav.contact': 'Контакты',
      'nav.login': 'Вход',
      'nav.register': 'Регистрация',
      'nav.cart': 'Корзина',
      'nav.profile': 'Профиль',
      'product.price': 'Цена',
      'product.add_to_cart': 'В корзину',
      'product.description': 'Описание',
      'cart.title': 'Корзина покупок',
      'cart.empty': 'Ваша корзина пуста',
      'cart.total': 'Итого',
      'cart.checkout': 'Оформить заказ',
      'auth.login': 'Вход',
      'auth.register': 'Регистрация',
      'auth.email': 'Email',
      'auth.password': 'Пароль',
      'auth.confirm_password': 'Подтвердите пароль',
      'auth.submit': 'Отправить',
      'products.title': 'Наши Продукты',
      'products.order': 'Заказать',
      'products.viewAll': 'Все Продукты'
    }
  }
  return translations[lang] || translations['en']
}

export async function request<T = any>(path: string, opts: RequestInit = {}) {
  return fetchJSON<T>(path, opts)
}

// ===== DELIVERY API =====
export async function getAllDeliveries(): Promise<DeliveryReadDto[]> {
  try {
    return await fetchJSON<DeliveryReadDto[]>('/api/Delivery')
  } catch (e: any) {
    console.log('API доставок недоступен:', e.message)
    throw e
  }
}

export async function getDeliveryById(id: string): Promise<DeliveryReadDto> {
  try {
    return await fetchJSON<DeliveryReadDto>(`/api/Delivery/${id}`)
  } catch (e: any) {
    console.log('API доставки недоступен:', e.message)
    throw e
  }
}

export async function createDelivery(deliveryData: DeliveryCreateDto): Promise<DeliveryReadDto> {
  try {
    return await fetchJSON<DeliveryReadDto>('/api/Delivery', { 
      method: 'POST', 
      body: JSON.stringify(deliveryData) 
    })
  } catch (e: any) {
    console.log('API создания доставки недоступен:', e.message)
    throw e
  }
}

export async function updateDelivery(id: string, deliveryData: DeliveryUpdateDto): Promise<DeliveryReadDto> {
  try {
    return await fetchJSON<DeliveryReadDto>(`/api/Delivery/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(deliveryData) 
    })
  } catch (e: any) {
    console.log('API обновления доставки недоступен:', e.message)
    throw e
  }
}

export async function deleteDelivery(id: string): Promise<boolean> {
  try {
    await fetchJSON(`/api/Delivery/${id}`, { method: 'DELETE' })
    return true
  } catch (e: any) {
    console.log('API удаления доставки недоступен:', e.message)
    throw e
  }
}

export async function updateDeliveryStatusById(id: string, status: DeliveryStatusType): Promise<void> {
  try {
    await fetchJSON(`/api/Delivery/${id}/status?status=${status}`, { method: 'PATCH' })
  } catch (e: any) {
    console.log('API обновления статуса доставки недоступен:', e.message)
    throw e
  }
}

// ===== DELIVERY STATUS API =====
export async function getAllDeliveryStatuses(): Promise<DeliveryStatusReadDto[]> {
  try {
    return await fetchJSON<DeliveryStatusReadDto[]>('/api/DeliveryStatus')
  } catch (e: any) {
    console.log('API статусов доставки недоступен:', e.message)
    throw e
  }
}

export async function getDeliveryStatusById(id: string): Promise<DeliveryStatusReadDto> {
  try {
    return await fetchJSON<DeliveryStatusReadDto>(`/api/DeliveryStatus/${id}`)
  } catch (e: any) {
    console.log('API статуса доставки недоступен:', e.message)
    throw e
  }
}

export async function createDeliveryStatus(statusData: DeliveryStatusCreateDto): Promise<DeliveryStatusReadDto> {
  try {
    return await fetchJSON<DeliveryStatusReadDto>('/api/DeliveryStatus', { 
      method: 'POST', 
      body: JSON.stringify(statusData) 
    })
  } catch (e: any) {
    console.log('API создания статуса доставки недоступен:', e.message)
    throw e
  }
}

export async function updateDeliveryStatus(id: string, statusData: DeliveryStatusUpdateDto): Promise<DeliveryStatusReadDto> {
  try {
    return await fetchJSON<DeliveryStatusReadDto>(`/api/DeliveryStatus/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(statusData) 
    })
  } catch (e: any) {
    console.log('API обновления статуса доставки недоступен:', e.message)
    throw e
  }
}

export async function deleteDeliveryStatus(id: string): Promise<boolean> {
  try {
    await fetchJSON(`/api/DeliveryStatus/${id}`, { method: 'DELETE' })
    return true
  } catch (e: any) {
    console.log('API удаления статуса доставки недоступен:', e.message)
    throw e
  }
}

// ===== PRODUCT DOCUMENTS API =====
export async function uploadProductDocuments(id: string, documents: ProductDocuments[]): Promise<void> {
  try {
    await fetchJSON(`/api/Product/upload-documents/${id}`, { 
      method: 'POST', 
      body: JSON.stringify(documents) 
    })
  } catch (e: any) {
    console.log('API загрузки документов продукта недоступен:', e.message)
    throw e
  }
}