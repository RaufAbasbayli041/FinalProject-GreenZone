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

// Функция для получения токена из localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

// Функция для выполнения запросов к админ API
async function fetchAdminJSON<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getAuthToken()
  
  if (!token) {
    console.warn('Токен авторизации не найден, перенаправляем на страницу входа админ-панели...')
    // Перенаправляем на страницу входа админ-панели
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login'
    }
    throw new Error('Токен авторизации не найден')
  }

  // Строим полный URL к бэкенду
  const baseClean = BASE.replace(/\/+$/, '')
  const pathClean = path.replace(/^\/+/, '')
  const url = `${baseClean}/${pathClean}`

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  headers['Authorization'] = `Bearer ${token}`

  console.log(`Выполняем запрос к админ API: ${url}`)

  const res = await fetch(url, { 
    ...opts, 
    credentials: 'include', 
    headers: { ...headers, ...(opts.headers || {}) } 
  })
  
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error(`Запрос к админ API завершился ошибкой: ${res.status} ${res.statusText}`, text)
    
    if (res.status === 401) {
      console.error('Админ API: ошибка авторизации 401, перенаправляем на страницу входа админ-панели.')
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        window.location.href = '/admin/login'
      }
    } else if (res.status === 404) {
      console.warn(`Админ API: эндпоинт не найден: ${path}`)
      // Возвращаем пустой массив для 404 ошибок вместо исключения
      return [] as T
    }
    throw new Error(`Request failed ${res.status} ${res.statusText}: ${text}`)
  }
  
  const result = await res.json()
  console.log(`Ответ админ API для ${path}:`, result)
  return result as T
}

// ===== ADMIN ORDER API =====
export async function getAdminOrders(): Promise<Order[]> {
  try {
    return await fetchAdminJSON<Order[]>('/api/admin/AdminOrder')
  } catch (e: any) {
    console.error('Ошибка админ API заказов:', e.message)
    throw e
  }
}

export async function getAdminOrderById(id: string): Promise<Order> {
  try {
    return await fetchAdminJSON<Order>(`/api/admin/AdminOrder/${id}`)
  } catch (e: any) {
    console.error('Ошибка админ API заказа:', e.message)
    throw e
  }
}

export async function createAdminOrder(orderData: OrderCreateDto): Promise<Order> {
  try {
    return await fetchAdminJSON<Order>('/api/admin/AdminOrder', {
      method: 'POST',
      body: JSON.stringify(orderData)
    })
  } catch (e: any) {
    console.error('Ошибка админ API создания заказа:', e.message)
    throw e
  }
}

export async function updateAdminOrder(id: string, orderData: OrderUpdateDto): Promise<Order> {
  try {
    return await fetchAdminJSON<Order>(`/api/admin/AdminOrder/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData)
    })
  } catch (e: any) {
    console.error('Ошибка админ API обновления заказа:', e.message)
    throw e
  }
}

export async function deleteAdminOrder(id: string): Promise<boolean> {
  try {
    await fetchAdminJSON(`/api/admin/AdminOrder/${id}`, { method: 'DELETE' })
    return true
  } catch (e: any) {
    console.error('Ошибка админ API удаления заказа:', e.message)
    throw e
  }
}

export async function getOrdersByStatus(orderStatusId?: string, keyword?: string, page: number = 1, pageSize: number = 10): Promise<Order[]> {
  try {
    const params = new URLSearchParams()
    if (keyword) params.append('keyword', keyword)
    params.append('page', page.toString())
    params.append('pageSize', pageSize.toString())
    
    return await fetchAdminJSON<Order[]>(`/api/admin/AdminOrder/by-status/${orderStatusId || 'null'}?${params.toString()}`)
  } catch (e: any) {
    console.error('Ошибка админ API заказов по статусу:', e.message)
    throw e
  }
}

export async function deliverOrder(id: string): Promise<Order> {
  try {
    return await fetchAdminJSON<Order>(`/api/admin/AdminOrder/${id}/deliver`, { method: 'PUT' })
  } catch (e: any) {
    console.error('Ошибка админ API доставки заказа:', e.message)
    throw e
  }
}

export async function processOrder(id: string): Promise<Order> {
  try {
    return await fetchAdminJSON<Order>(`/api/admin/AdminOrder/${id}/processing`, { method: 'PUT' })
  } catch (e: any) {
    console.error('Ошибка админ API обработки заказа:', e.message)
    throw e
  }
}

export async function returnOrder(id: string): Promise<Order> {
  try {
    return await fetchAdminJSON<Order>(`/api/admin/AdminOrder/${id}/returned`, { method: 'PUT' })
  } catch (e: any) {
    console.error('Ошибка админ API возврата заказа:', e.message)
    throw e
  }
}

export async function cancelOrder(id: string): Promise<Order> {
  try {
    return await fetchAdminJSON<Order>(`/api/admin/AdminOrder/${id}/cancel`, { method: 'PUT' })
  } catch (e: any) {
    console.error('Ошибка админ API отмены заказа:', e.message)
    throw e
  }
}

// ===== ADMIN PRODUCT API =====
export async function getAdminProducts(): Promise<Product[]> {
  try {
    return await fetchAdminJSON<Product[]>('/api/admin/AdminProduct')
  } catch (e: any) {
    console.error('Ошибка админ API товаров:', e.message)
    throw e
  }
}

export async function getAdminProductById(id: string): Promise<Product> {
  try {
    return await fetchAdminJSON<Product>(`/api/admin/AdminProduct/${id}`)
  } catch (e: any) {
    console.error('Ошибка админ API товара:', e.message)
    throw e
  }
}

export async function createAdminProduct(productData: ProductCreateDto): Promise<Product> {
  try {
    return await fetchAdminJSON<Product>('/api/admin/AdminProduct', {
      method: 'POST',
      body: JSON.stringify(productData)
    })
  } catch (e: any) {
    console.error('Ошибка админ API создания товара:', e.message)
    throw e
  }
}

export async function updateAdminProduct(id: string, productData: ProductUpdateDto): Promise<Product> {
  try {
    return await fetchAdminJSON<Product>(`/api/admin/AdminProduct/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    })
  } catch (e: any) {
    console.error('Ошибка админ API обновления товара:', e.message)
    throw e
  }
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  try {
    await fetchAdminJSON(`/api/admin/AdminProduct/${id}`, { method: 'DELETE' })
    return true
  } catch (e: any) {
    console.error('Ошибка админ API удаления товара:', e.message)
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
    const url = `${baseClean}/api/admin/AdminProduct/upload-image/${id}`

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
    console.error('Ошибка админ API загрузки изображения товара:', e.message)
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
    const url = `${baseClean}/api/admin/AdminProduct/upload-documents/${id}`

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
    console.error('Ошибка админ API загрузки документов товара:', e.message)
    throw e
  }
}

// ===== ADMIN CUSTOMER API =====
export async function getAdminCustomers(): Promise<Customer[]> {
  try {
    return await fetchAdminJSON<Customer[]>('/api/admin/AdminCustomer')
  } catch (e: any) {
    console.error('Ошибка админ API клиентов:', e.message)
    throw e
  }
}

export async function getAdminCustomerById(id: string): Promise<Customer> {
  try {
    return await fetchAdminJSON<Customer>(`/api/admin/AdminCustomer/${id}`)
  } catch (e: any) {
    console.error('Ошибка админ API клиента:', e.message)
    throw e
  }
}

export async function deleteAdminCustomer(id: string): Promise<boolean> {
  try {
    await fetchAdminJSON(`/api/admin/AdminCustomer/${id}`, { method: 'DELETE' })
    return true
  } catch (e: any) {
    console.error('Ошибка админ API удаления клиента:', e.message)
    throw e
  }
}

// ===== ADMIN CATEGORY API =====
export async function getAdminCategories(): Promise<Category[]> {
  try {
    return await fetchAdminJSON<Category[]>('/api/admin/AdminCategory')
  } catch (e: any) {
    console.error('Ошибка админ API категорий:', e.message)
    throw e
  }
}

export async function getAdminCategoryById(id: string): Promise<Category> {
  try {
    return await fetchAdminJSON<Category>(`/api/admin/AdminCategory/${id}`)
  } catch (e: any) {
    console.error('Ошибка админ API категории:', e.message)
    throw e
  }
}

export async function createAdminCategory(categoryData: CategoryCreateDto): Promise<Category> {
  try {
    return await fetchAdminJSON<Category>('/api/admin/AdminCategory', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    })
  } catch (e: any) {
    console.error('Ошибка админ API создания категории:', e.message)
    throw e
  }
}

export async function updateAdminCategory(id: string, categoryData: CategoryUpdateDto): Promise<Category> {
  try {
    return await fetchAdminJSON<Category>(`/api/admin/AdminCategory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    })
  } catch (e: any) {
    console.error('Ошибка админ API обновления категории:', e.message)
    throw e
  }
}

export async function deleteAdminCategory(id: string): Promise<boolean> {
  try {
    await fetchAdminJSON(`/api/admin/AdminCategory/${id}`, { method: 'DELETE' })
    return true
  } catch (e: any) {
    console.error('Ошибка админ API удаления категории:', e.message)
    throw e
  }
}

// ===== ADMIN DELIVERY API =====
export async function getAdminDeliveries(): Promise<Delivery[]> {
  try {
    return await fetchAdminJSON<Delivery[]>('/api/admin/AdminDelivery')
  } catch (e: any) {
    console.error('Ошибка админ API доставок:', e.message)
    throw e
  }
}

export async function getAdminDeliveryById(id: string): Promise<Delivery> {
  try {
    return await fetchAdminJSON<Delivery>(`/api/admin/AdminDelivery/${id}`)
  } catch (e: any) {
    console.error('Ошибка админ API доставки:', e.message)
    throw e
  }
}

export async function createAdminDelivery(deliveryData: DeliveryCreateDto): Promise<Delivery> {
  try {
    return await fetchAdminJSON<Delivery>('/api/admin/AdminDelivery', {
      method: 'POST',
      body: JSON.stringify(deliveryData)
    })
  } catch (e: any) {
    console.error('Ошибка админ API создания доставки:', e.message)
    throw e
  }
}

export async function updateAdminDelivery(id: string, deliveryData: DeliveryUpdateDto): Promise<Delivery> {
  try {
    return await fetchAdminJSON<Delivery>(`/api/admin/AdminDelivery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deliveryData)
    })
  } catch (e: any) {
    console.error('Ошибка админ API обновления доставки:', e.message)
    throw e
  }
}

export async function deleteAdminDelivery(id: string): Promise<boolean> {
  try {
    await fetchAdminJSON(`/api/admin/AdminDelivery/${id}`, { method: 'DELETE' })
    return true
  } catch (e: any) {
    console.error('Ошибка админ API удаления доставки:', e.message)
    throw e
  }
}

export async function updateDeliveryStatus(id: string, status: string): Promise<Delivery> {
  try {
    return await fetchAdminJSON<Delivery>(`/api/admin/AdminDelivery/${id}/status`, { 
      method: 'PATCH',
      body: JSON.stringify(status)
    })
  } catch (e: any) {
    console.error('Ошибка админ API обновления статуса доставки:', e.message)
    throw e
  }
}

// ===== ДОПОЛНИТЕЛЬНЫЕ АДМИН ФУНКЦИИ =====

// Поиск продуктов в админке
export async function searchAdminProducts(keyword?: string, page: number = 1, pageSize: number = 10): Promise<Product[]> {
  try {
    const params = new URLSearchParams()
    if (keyword) params.append('keyword', keyword)
    params.append('page', page.toString())
    params.append('pageSize', pageSize.toString())
    
    return await fetchAdminJSON<Product[]>(`/api/admin/AdminProduct/search?${params.toString()}`)
  } catch (e: any) {
    console.error('Ошибка админ API поиска товаров:', e.message)
    throw e
  }
}

// Получение продуктов по категории в админке
export async function getAdminProductsByCategory(categoryId: string, page: number = 1, pageSize: number = 10): Promise<Product[]> {
  try {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('pageSize', pageSize.toString())
    
    return await fetchAdminJSON<Product[]>(`/api/admin/AdminProduct/by-category/${categoryId}?${params.toString()}`)
  } catch (e: any) {
    console.error('Ошибка админ API товаров по категории:', e.message)
    throw e
  }
}

// Получение клиентов с заказами
export async function getAdminCustomersWithOrders(page: number = 1, pageSize: number = 10): Promise<Customer[]> {
  try {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('pageSize', pageSize.toString())
    
    return await fetchAdminJSON<Customer[]>(`/api/admin/AdminCustomer/with-orders?${params.toString()}`)
  } catch (e: any) {
    console.error('Ошибка админ API клиентов с заказами:', e.message)
    throw e
  }
}

// Получение полных данных клиента
export async function getAdminCustomerFullData(customerId: string): Promise<Customer> {
  try {
    return await fetchAdminJSON<Customer>(`/api/admin/AdminCustomer/full-data/${customerId}`)
  } catch (e: any) {
    console.error('Ошибка админ API полных данных клиента:', e.message)
    throw e
  }
}

// Получение заказов по клиенту
export async function getAdminOrdersByCustomer(customerId: string): Promise<Order[]> {
  try {
    return await fetchAdminJSON<Order[]>(`/api/admin/AdminOrder/by-customer/${customerId}`)
  } catch (e: any) {
    console.error('Ошибка админ API заказов клиента:', e.message)
    throw e
  }
}

// Получение доставок по клиенту
export async function getAdminDeliveriesByCustomer(customerId: string): Promise<Delivery[]> {
  try {
    return await fetchAdminJSON<Delivery[]>(`/api/admin/AdminDelivery/customer/${customerId}`)
  } catch (e: any) {
    console.error('Ошибка админ API доставок клиента:', e.message)
    throw e
  }
}

// Получение доставок по статусу
export async function getAdminDeliveriesByStatus(status: number): Promise<Delivery[]> {
  try {
    return await fetchAdminJSON<Delivery[]>(`/api/admin/AdminDelivery/status/${status}`)
  } catch (e: any) {
    console.error('Ошибка админ API доставок по статусу:', e.message)
    throw e
  }
}

// Получение первой доставки по статусу
export async function getAdminFirstDeliveryByStatus(status: number): Promise<Delivery> {
  try {
    return await fetchAdminJSON<Delivery>(`/api/admin/AdminDelivery/status/first/${status}`)
  } catch (e: any) {
    console.error('Ошибка админ API первой доставки по статусу:', e.message)
    throw e
  }
}

// Получение статусов доставки
export async function getAdminDeliveryStatuses(): Promise<any[]> {
  try {
    return await fetchAdminJSON<any[]>('/api/admin/AdminDeliveryStatus')
  } catch (e: any) {
    console.error('Ошибка админ API статусов доставки:', e.message)
    throw e
  }
}

// Получение статуса доставки по типу
export async function getAdminDeliveryStatusByType(statusType: number): Promise<any> {
  try {
    return await fetchAdminJSON<any>(`/api/admin/AdminDeliveryStatus/${statusType}`)
  } catch (e: any) {
    console.error('Ошибка админ API статуса доставки по типу:', e.message)
    throw e
  }
}

// Получение статусов заказов
export async function getAdminOrderStatuses(): Promise<any[]> {
  try {
    return await fetchAdminJSON<any[]>('/api/admin/AdminOrderStatus')
  } catch (e: any) {
    console.error('Ошибка админ API статусов заказа:', e.message)
    throw e
  }
}

// Получение статуса заказа по имени
export async function getAdminOrderStatusByName(name: number): Promise<any> {
  try {
    return await fetchAdminJSON<any>(`/api/admin/AdminOrderStatus/${name}`)
  } catch (e: any) {
    console.error('Ошибка админ API статуса заказа по имени:', e.message)
    throw e
  }
}

// Установка статуса заказа
export async function setAdminOrderStatus(id: string, orderStatusId: string, orderStatusName?: number): Promise<Order> {
  try {
    const params = new URLSearchParams()
    if (orderStatusName !== undefined) params.append('orderStatusName', orderStatusName.toString())
    
    return await fetchAdminJSON<Order>(`/api/admin/AdminOrder/${id}/set-status/${orderStatusId}?${params.toString()}`, { 
      method: 'PUT' 
    })
  } catch (e: any) {
    console.error('Ошибка админ API установки статуса заказа:', e.message)
    throw e
  }
}

// Получение корзины клиента
export async function getAdminBasket(customerId: string): Promise<any> {
  try {
    return await fetchAdminJSON<any>(`/api/admin/AdminBasket/${customerId}`)
  } catch (e: any) {
    console.error('Ошибка админ API корзины:', e.message)
    throw e
  }
}

// ===== UPDATE FUNCTIONS =====
export async function updateProduct(id: string, data: any): Promise<Product> {
  try {
    return await fetchAdminJSON<Product>(`/api/admin/AdminProduct/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  } catch (e: any) {
    console.error('Ошибка админ API обновления товара:', e.message)
    throw e
  }
}

export async function updateOrder(id: string, data: any): Promise<Order> {
  try {
    return await fetchAdminJSON<Order>(`/api/admin/AdminOrder/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  } catch (e: any) {
    console.error('Ошибка админ API обновления заказа:', e.message)
    throw e
  }
}

export async function updateDelivery(id: string, data: any): Promise<Delivery> {
  try {
    return await fetchAdminJSON<Delivery>(`/api/admin/AdminDelivery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  } catch (e: any) {
    console.error('Ошибка админ API обновления доставки:', e.message)
    throw e
  }
}

export async function updateCategory(id: string, data: any): Promise<Category> {
  try {
    return await fetchAdminJSON<Category>(`/api/admin/AdminCategory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  } catch (e: any) {
    console.error('Ошибка админ API обновления категории:', e.message)
    throw e
  }
}
