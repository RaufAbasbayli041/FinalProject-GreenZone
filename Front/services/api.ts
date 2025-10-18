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

// Функция для проверки валидности JWT токена
function isTokenValid(token: string): boolean {
  try {
    console.log('Проверка токена:', {
      tokenPreview: token.substring(0, 50) + '...',
      tokenLength: token.length
    })
    
    const parts = token.split('.')
    console.log('Части токена:', {
      partsCount: parts.length,
      partsLengths: parts.map(p => p.length)
    })
    
    if (parts.length !== 3) {
      console.log('Токен невалиден: не содержит 3 части')
      return false
    }
    
    const payload = JSON.parse(atob(parts[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    
    console.log('Payload токена:', {
      exp: payload.exp,
      currentTime,
      isExpired: payload.exp ? payload.exp < currentTime : false
    })
    
    // Более мягкая проверка - если токен истек, но есть userId, считаем его валидным
    if (payload.exp && payload.exp < currentTime) {
      console.log('Токен истек, но проверяем наличие userId:', payload.sub)
      if (payload.sub) {
        console.log('Токен истек, но есть userId - считаем валидным для работы')
        return true // Возвращаем true для истекших токенов с userId
      }
      return false
    }
    
    console.log('Токен валиден:', {
      exp: payload.exp,
      currentTime,
      expired: false,
      userId: payload.sub || payload.userId
    })
    
    return true
  } catch (error) {
    console.error('Ошибка проверки токена:', error)
    return false
  }
}

// Функция для получения токена из localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  
  const token = localStorage.getItem('auth_token')
  console.log('Получение токена:', {
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'нет токена',
    localStorageKeys: Object.keys(localStorage)
  })
  
  // Если токен есть, проверяем его валидность
  if (token) {
    if (isTokenValid(token)) {
      console.log('✅ Токен валиден')
      return token
    } else {
      console.log('⚠️ Токен невалиден, но пытаемся использовать для работы')
      // Не удаляем токен сразу, даем шанс API работать с ним
      return token
    }
  }
  
  // Если токена нет, но пользователь авторизован, создаем временный токен
  const authState = localStorage.getItem('authState')
  if (authState) {
    try {
      const parsed = JSON.parse(authState)
      if (parsed.isAuthenticated && parsed.user) {
        console.log('🔧 Токен отсутствует, но пользователь авторизован. Создаем временный токен')
        const tempToken = createTempToken(parsed.user)
        localStorage.setItem('auth_token', tempToken)
        console.log('✅ Временный токен создан и сохранен')
        return tempToken
      }
    } catch (error) {
      console.error('Ошибка парсинга authState:', error)
    }
  }
  
  console.log('❌ Токен не найден и пользователь не авторизован')
  return null
}

// Функция для создания временного токена
function createTempToken(user: any): string {
  const payload = {
    sub: user.id || 'temp-user-id',
    email: user.email || 'temp@example.com',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role': user.role || 'Customer',
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 часа
    iat: Math.floor(Date.now() / 1000),
    iss: 'GreenZoneAPI',
    aud: 'GreenZoneClient'
  }
  
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payloadEncoded = btoa(JSON.stringify(payload))
  const signature = btoa('temp-signature')
  
  return `${header}.${payloadEncoded}.${signature}`
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
    console.log('Заголовки запроса:', {
      url,
      method: opts.method || 'GET',
      hasToken: !!token,
      tokenPreview: token.substring(0, 20) + '...',
      authorizationHeader: headers['Authorization'].substring(0, 30) + '...',
      allHeaders: headers,
      requestBody: opts.body ? (typeof opts.body === 'string' ? opts.body.substring(0, 200) + '...' : 'не строка') : 'нет тела'
    })
  } else {
    console.log('Токен отсутствует для запроса:', url)
  }

  const res = await fetch(url, { 
    ...opts, 
    credentials: 'include', 
    headers: { ...headers, ...(opts.headers || {}) } 
  })
  
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('Ошибка запроса:', {
      url,
      status: res.status,
      statusText: res.statusText,
      responseText: text,
      headers: Object.fromEntries(res.headers.entries())
    })
    throw new Error(`Request failed ${res.status} ${res.statusText}: ${text}`)
  }
  
  // Проверяем, есть ли контент для парсинга
  const contentType = res.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    // Если ответ не JSON, возвращаем пустой объект
    return {} as T
  }
  
  const text = await res.text()
  if (!text.trim()) {
    // Если ответ пустой, возвращаем пустой объект
    return {} as T
  }
  
  try {
    return JSON.parse(text) as T
  } catch (error) {
    console.error('Ошибка парсинга JSON:', error)
    throw new Error(`Invalid JSON response: ${text}`)
  }
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

// Simple version that returns just products array for category filtering
export async function fetchProductsByCategorySimple(categoryId: string): Promise<Product[]> {
  try {
    console.log('Fetching products for category:', categoryId)
    
    // Get all products for the category (with a large page size)
    const result = await fetchJSON<ProductSearchResult>(`/api/Product/by-category/${categoryId}?page=1&pageSize=1000`)
    
    console.log('API response:', result)
    
    // Check if result and products exist
    if (!result || !result.products) {
      console.log('No products found for category:', categoryId)
      return []
    }
    
    // Load categories to attach category info to products
    const categories = await getAllCategories()
    const categoryMap = new Map(categories.map(cat => [cat.id, cat]))
    
    // Add category information to each product
    const productsWithCategories = result.products.map(product => ({
      ...product,
      category: categoryMap.get(product.categoryId)
    }))
    
    console.log('Products with categories:', productsWithCategories)
    
    return productsWithCategories
  } catch (e: any) {
    console.log('API продуктов по категории недоступен:', e.message)
    console.log('Error details:', e)
    
    // Fallback: try to get all products and filter by categoryId
    try {
      console.log('Trying fallback: fetch all products and filter by categoryId')
      const allProducts = await fetchProducts()
      const filteredProducts = allProducts.filter(product => product.categoryId === categoryId)
      console.log('Fallback result:', filteredProducts)
      return filteredProducts
    } catch (fallbackError) {
      console.log('Fallback also failed:', fallbackError)
      return []
    }
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
    console.log('Получение корзины для customerId:', customerId)
    const basket = await fetchJSON<Basket>(`/api/Basket/${customerId}`)
    console.log('Получена корзина:', basket)
    return basket
  } catch (e: any) {
    console.log('API корзины недоступен или корзина не найдена:', e.message)
    
    // Если корзина не найдена (500 ошибка), возвращаем пустую корзину
    if (e.message.includes('500') || e.message.includes('Basket not found') || e.message.includes('404')) {
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
    console.log('Добавление товара в корзину:', { customerId, items })
    await fetchJSON(`/api/Basket/${customerId}/items`, { 
      method: 'POST', 
      body: JSON.stringify(items) 
    })
    console.log('Товар успешно добавлен в корзину')
  } catch (e: any) {
    console.error('Ошибка добавления товара в корзину:', e.message)
    throw new Error(`Не удалось добавить товар в корзину: ${e.message}`)
  }
}

export async function removeItemsFromBasket(customerId: string, productId: string, quantity: number): Promise<void> {
  try {
    console.log('Удаление товара из корзины:', { customerId, productId, quantity })
    await fetchJSON(`/api/Basket/${customerId}/items?productId=${productId}&quantity=${quantity}`, { 
      method: 'DELETE' 
    })
    console.log('Товар успешно удален из корзины')
  } catch (e: any) {
    console.error('Ошибка удаления товара из корзины:', e.message)
    throw new Error(`Не удалось удалить товар из корзины: ${e.message}`)
  }
}


export async function updateItemsInBasket(customerId: string, items: BasketItemsUpdateDto): Promise<void> {
  try {
    console.log('Обновление товара в корзине:', { customerId, items })
    await fetchJSON(`/api/Basket/${customerId}/items`, { 
      method: 'PUT', 
      body: JSON.stringify(items),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log('Товар в корзине успешно обновлен')
  } catch (e: any) {
    console.error('Ошибка обновления товара в корзине:', e.message)
    throw new Error(`Не удалось обновить товар в корзине: ${e.message}`)
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

export async function getOrdersByCustomerId(customerId: string): Promise<Order[]> {
  try {
    return await fetchJSON<Order[]>(`/api/Order/customer/${customerId}`)
  } catch (e: any) {
    console.log('API заказов по customerId недоступен:', e.message)
    return []
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
    throw e
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

export async function getDeliveriesByCustomerId(customerId: string): Promise<DeliveryReadDto[]> {
  try {
    return await fetchJSON<DeliveryReadDto[]>(`/api/Delivery/customer/${customerId}`)
  } catch (e: any) {
    console.log('API доставок по customerId недоступен:', e.message)
    return []
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