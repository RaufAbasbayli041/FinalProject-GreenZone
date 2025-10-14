import type { 
  Product, 
  ProductCreateDto, 
  ProductUpdateDto,
  Order,
  OrderCreateDto,
  OrderUpdateDto,
  Customer,
  Category,
  CategoryCreateDto,
  CategoryUpdateDto,
  Delivery,
  DeliveryCreateDto,
  DeliveryUpdateDto
} from '@/lib/types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7100'

// Используем реальные API эндпоинты
const USE_MOCK_DATA = false

// Мок-данные для админ-панели
const mockOrders: Order[] = [
  {
    id: '1',
    customerId: 'customer-1',
    orderDate: new Date('2024-01-15'),
    totalAmount: 1500,
    status: { id: '1', name: 'Новый' },
    customer: {
      id: 'customer-1',
      firstName: 'Иван',
      lastName: 'Петров',
      email: 'ivan@example.com',
      phoneNumber: '+7 900 123-45-67'
    }
  },
  {
    id: '2',
    customerId: 'customer-2',
    orderDate: new Date('2024-01-16'),
    totalAmount: 2300,
    status: { id: '2', name: 'В обработке' },
    customer: {
      id: 'customer-2',
      firstName: 'Мария',
      lastName: 'Сидорова',
      email: 'maria@example.com',
      phoneNumber: '+7 900 234-56-78'
    }
  },
  {
    id: '3',
    customerId: 'customer-3',
    orderDate: new Date('2024-01-17'),
    totalAmount: 1800,
    status: { id: '3', name: 'Доставлен' },
    customer: {
      id: 'customer-3',
      firstName: 'Алексей',
      lastName: 'Козлов',
      email: 'alex@example.com',
      phoneNumber: '+7 900 345-67-89'
    }
  }
]

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Искусственная трава Premium',
    description: 'Высококачественная искусственная трава для дома и сада',
    price: 1500,
    category: { id: '1', name: 'Домашняя трава' },
    isActive: true,
    imageUrl: '/placeholder.jpg'
  },
  {
    id: '2',
    name: 'Спортивная трава',
    description: 'Профессиональная трава для спортивных площадок',
    price: 2000,
    category: { id: '2', name: 'Спортивная трава' },
    isActive: true,
    imageUrl: '/placeholder.jpg'
  }
]

const mockCustomers: Customer[] = [
  {
    id: 'customer-1',
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan@example.com',
    phoneNumber: '+7 900 123-45-67',
    registrationDate: new Date('2024-01-01')
  },
  {
    id: 'customer-2',
    firstName: 'Мария',
    lastName: 'Сидорова',
    email: 'maria@example.com',
    phoneNumber: '+7 900 234-56-78',
    registrationDate: new Date('2024-01-02')
  }
]

const mockDeliveries: Delivery[] = [
  {
    id: '1',
    orderId: '1',
    deliveryDate: new Date('2024-01-20'),
    status: 'В пути',
    address: 'ул. Ленина, 123',
    customerName: 'Иван Петров'
  },
  {
    id: '2',
    orderId: '2',
    deliveryDate: new Date('2024-01-21'),
    status: 'Доставлен',
    address: 'пр. Мира, 456',
    customerName: 'Мария Сидорова'
  }
]

// Функция для получения токена из localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

// Функция для выполнения запросов к админ API
async function fetchAdminJSON<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getAuthToken()
  
  if (!token) {
    console.warn('No authentication token found, redirecting to login...')
    // Перенаправляем на страницу входа
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new Error('No authentication token found')
  }

  // Если используем мок-данные, возвращаем их
  if (USE_MOCK_DATA) {
    console.log(`Using mock data for admin API: ${path}`)
    
    // Имитируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Возвращаем соответствующие мок-данные
    if (path.includes('/order')) {
      return mockOrders as T
    } else if (path.includes('/product')) {
      return mockProducts as T
    } else if (path.includes('/customer')) {
      return mockCustomers as T
    } else if (path.includes('/delivery')) {
      return mockDeliveries as T
    }
    
    return [] as T
  }

  // Строим полный URL к бэкенду
  const baseClean = BASE.replace(/\/+$/, '')
  const pathClean = path.replace(/^\/+/, '')
  const url = `${baseClean}/${pathClean}`

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, { 
    ...opts, 
    credentials: 'include', 
    headers: { ...headers, ...(opts.headers || {}) } 
  })
  
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    if (res.status === 401) {
      console.error('Admin API 401 Unauthorized, redirecting to login.')
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
      }
    } else if (res.status === 404) {
      console.warn(`Admin API endpoint not found: ${path}`)
      // Возвращаем пустой массив для 404 ошибок вместо исключения
      return [] as T
    }
    throw new Error(`Request failed ${res.status} ${res.statusText}: ${text}`)
  }
  return (await res.json()) as T
}

// ===== ADMIN ORDER API =====
export async function getAdminOrders(): Promise<Order[]> {
  try {
    return await fetchAdminJSON<Order[]>('/api/admin/order')
  } catch (e: any) {
    console.error('Admin Orders API error:', e.message)
    throw e
  }
}

export async function getAdminOrderById(id: string): Promise<Order> {
  try {
    return await fetchAdminJSON<Order>(`/api/admin/order/${id}`)
  } catch (e: any) {
    console.error('Admin Order API error:', e.message)
    throw e
  }
}

export async function createAdminOrder(orderData: OrderCreateDto): Promise<Order> {
  try {
    return await fetchAdminJSON<Order>('/api/admin/order', {
      method: 'POST',
      body: JSON.stringify(orderData)
    })
  } catch (e: any) {
    console.error('Admin Create Order API error:', e.message)
    throw e
  }
}

export async function updateAdminOrder(id: string, orderData: OrderUpdateDto): Promise<Order> {
  try {
    return await fetchAdminJSON<Order>(`/api/admin/order/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData)
    })
  } catch (e: any) {
    console.error('Admin Update Order API error:', e.message)
    throw e
  }
}

export async function deleteAdminOrder(id: string): Promise<boolean> {
  try {
    await fetchAdminJSON(`/api/admin/order/${id}`, { method: 'DELETE' })
    return true
  } catch (e: any) {
    console.error('Admin Delete Order API error:', e.message)
    throw e
  }
}

export async function getOrdersByStatus(orderStatusId?: string, keyword?: string, page: number = 1, pageSize: number = 10): Promise<Order[]> {
  try {
    const params = new URLSearchParams()
    if (keyword) params.append('keyword', keyword)
    params.append('page', page.toString())
    params.append('pageSize', pageSize.toString())
    
    return await fetchAdminJSON<Order[]>(`/api/admin/order/by-status/${orderStatusId || 'null'}?${params.toString()}`)
  } catch (e: any) {
    console.error('Admin Orders by Status API error:', e.message)
    throw e
  }
}

export async function deliverOrder(id: string): Promise<Order> {
  try {
    return await fetchAdminJSON<Order>(`/api/admin/order/${id}/deliver`, { method: 'PUT' })
  } catch (e: any) {
    console.error('Admin Deliver Order API error:', e.message)
    throw e
  }
}

export async function processOrder(id: string): Promise<Order> {
  try {
    return await fetchAdminJSON<Order>(`/api/admin/order/${id}/processing`, { method: 'PUT' })
  } catch (e: any) {
    console.error('Admin Process Order API error:', e.message)
    throw e
  }
}

export async function returnOrder(id: string): Promise<Order> {
  try {
    return await fetchAdminJSON<Order>(`/api/admin/order/${id}/returned`, { method: 'PUT' })
  } catch (e: any) {
    console.error('Admin Return Order API error:', e.message)
    throw e
  }
}

export async function cancelOrder(id: string): Promise<Order> {
  try {
    return await fetchAdminJSON<Order>(`/api/admin/order/${id}/cancel`, { method: 'PUT' })
  } catch (e: any) {
    console.error('Admin Cancel Order API error:', e.message)
    throw e
  }
}

// ===== ADMIN PRODUCT API =====
export async function getAdminProducts(): Promise<Product[]> {
  try {
    return await fetchAdminJSON<Product[]>('/api/admin/product')
  } catch (e: any) {
    console.error('Admin Products API error:', e.message)
    throw e
  }
}

export async function getAdminProductById(id: string): Promise<Product> {
  try {
    return await fetchAdminJSON<Product>(`/api/admin/product/${id}`)
  } catch (e: any) {
    console.error('Admin Product API error:', e.message)
    throw e
  }
}

export async function createAdminProduct(productData: ProductCreateDto): Promise<Product> {
  try {
    return await fetchAdminJSON<Product>('/api/admin/product', {
      method: 'POST',
      body: JSON.stringify(productData)
    })
  } catch (e: any) {
    console.error('Admin Create Product API error:', e.message)
    throw e
  }
}

export async function updateAdminProduct(id: string, productData: ProductUpdateDto): Promise<Product> {
  try {
    return await fetchAdminJSON<Product>(`/api/admin/product/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    })
  } catch (e: any) {
    console.error('Admin Update Product API error:', e.message)
    throw e
  }
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  try {
    await fetchAdminJSON(`/api/admin/product/${id}`, { method: 'DELETE' })
    return true
  } catch (e: any) {
    console.error('Admin Delete Product API error:', e.message)
    throw e
  }
}

export async function uploadProductImage(id: string, imageFile: File): Promise<boolean> {
  try {
    const formData = new FormData()
    formData.append('Image', imageFile)

    const token = getAuthToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const baseClean = BASE.replace(/\/+$/, '')
    const url = `${baseClean}/api/admin/product/upload-image/${id}`

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Request failed ${res.status} ${res.statusText}: ${text}`)
    }

    return true
  } catch (e: any) {
    console.error('Admin Upload Product Image API error:', e.message)
    throw e
  }
}

export async function uploadProductDocuments(id: string, documents: File[]): Promise<boolean> {
  try {
    const formData = new FormData()
    documents.forEach((doc, index) => {
      formData.append(`Document${index}`, doc)
    })

    const token = getAuthToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const baseClean = BASE.replace(/\/+$/, '')
    const url = `${baseClean}/api/admin/product/upload-documents/${id}`

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Request failed ${res.status} ${res.statusText}: ${text}`)
    }

    return true
  } catch (e: any) {
    console.error('Admin Upload Product Documents API error:', e.message)
    throw e
  }
}

// ===== ADMIN CUSTOMER API =====
export async function getAdminCustomers(): Promise<Customer[]> {
  try {
    return await fetchAdminJSON<Customer[]>('/api/admin/customer')
  } catch (e: any) {
    console.error('Admin Customers API error:', e.message)
    throw e
  }
}

export async function getAdminCustomerById(id: string): Promise<Customer> {
  try {
    return await fetchAdminJSON<Customer>(`/api/admin/customer/${id}`)
  } catch (e: any) {
    console.error('Admin Customer API error:', e.message)
    throw e
  }
}

export async function deleteAdminCustomer(id: string): Promise<boolean> {
  try {
    await fetchAdminJSON(`/api/admin/customer/${id}`, { method: 'DELETE' })
    return true
  } catch (e: any) {
    console.error('Admin Delete Customer API error:', e.message)
    throw e
  }
}

// ===== ADMIN CATEGORY API =====
export async function getAdminCategories(): Promise<Category[]> {
  try {
    return await fetchAdminJSON<Category[]>('/api/admin/category')
  } catch (e: any) {
    console.error('Admin Categories API error:', e.message)
    throw e
  }
}

export async function getAdminCategoryById(id: string): Promise<Category> {
  try {
    return await fetchAdminJSON<Category>(`/api/admin/category/${id}`)
  } catch (e: any) {
    console.error('Admin Category API error:', e.message)
    throw e
  }
}

export async function createAdminCategory(categoryData: CategoryCreateDto): Promise<Category> {
  try {
    return await fetchAdminJSON<Category>('/api/admin/category', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    })
  } catch (e: any) {
    console.error('Admin Create Category API error:', e.message)
    throw e
  }
}

export async function updateAdminCategory(id: string, categoryData: CategoryUpdateDto): Promise<Category> {
  try {
    return await fetchAdminJSON<Category>(`/api/admin/category/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    })
  } catch (e: any) {
    console.error('Admin Update Category API error:', e.message)
    throw e
  }
}

export async function deleteAdminCategory(id: string): Promise<boolean> {
  try {
    await fetchAdminJSON(`/api/admin/category/${id}`, { method: 'DELETE' })
    return true
  } catch (e: any) {
    console.error('Admin Delete Category API error:', e.message)
    throw e
  }
}

// ===== ADMIN DELIVERY API =====
export async function getAdminDeliveries(): Promise<Delivery[]> {
  try {
    return await fetchAdminJSON<Delivery[]>('/api/admin/delivery')
  } catch (e: any) {
    console.error('Admin Deliveries API error:', e.message)
    throw e
  }
}

export async function getAdminDeliveryById(id: string): Promise<Delivery> {
  try {
    return await fetchAdminJSON<Delivery>(`/api/admin/delivery/${id}`)
  } catch (e: any) {
    console.error('Admin Delivery API error:', e.message)
    throw e
  }
}

export async function createAdminDelivery(deliveryData: DeliveryCreateDto): Promise<Delivery> {
  try {
    return await fetchAdminJSON<Delivery>('/api/admin/delivery', {
      method: 'POST',
      body: JSON.stringify(deliveryData)
    })
  } catch (e: any) {
    console.error('Admin Create Delivery API error:', e.message)
    throw e
  }
}

export async function updateAdminDelivery(id: string, deliveryData: DeliveryUpdateDto): Promise<Delivery> {
  try {
    return await fetchAdminJSON<Delivery>(`/api/admin/delivery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deliveryData)
    })
  } catch (e: any) {
    console.error('Admin Update Delivery API error:', e.message)
    throw e
  }
}

export async function deleteAdminDelivery(id: string): Promise<boolean> {
  try {
    await fetchAdminJSON(`/api/admin/delivery/${id}`, { method: 'DELETE' })
    return true
  } catch (e: any) {
    console.error('Admin Delete Delivery API error:', e.message)
    throw e
  }
}

export async function updateDeliveryStatus(id: string, status: string): Promise<Delivery> {
  try {
    return await fetchAdminJSON<Delivery>(`/api/admin/delivery/${id}/status/${status}`, { method: 'PUT' })
  } catch (e: any) {
    console.error('Admin Update Delivery Status API error:', e.message)
    throw e
  }
}
