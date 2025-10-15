import type { Order, OrderCreateDto, OrderUpdateDto } from '@/lib/types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7100'

async function fetchJSON<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  // Если путь уже полный URL, используем его как есть
  if (path.startsWith('http')) {
    const res = await fetch(path, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } })
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

  const res = await fetch(url, { 
    ...opts, 
    credentials: 'include', 
    headers: { 
      'Content-Type': 'application/json', 
      ...(opts.headers || {}) 
    } 
  })
  
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Request failed ${res.status} ${res.statusText}: ${text}`)
  }
  return (await res.json()) as T
}

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
    // Поскольку нет endpoint для получения всех заказов клиента,
    // мы возвращаем пустой массив и показываем информативное сообщение
    console.log('API не предоставляет endpoint для получения заказов клиента')
    return []
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

// Функция для анализа JWT токена
function analyzeJWTToken(token: string): void {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('Неверный формат JWT токена')
      return
    }
    
    const header = JSON.parse(atob(parts[0]))
    const payload = JSON.parse(atob(parts[1]))
    
    console.log('Анализ JWT токена:', {
      header: header,
      payload: payload,
      allClaims: Object.keys(payload),
      // Правильные claims согласно бэкенду
      userId: payload.sub, // JwtRegisteredClaimNames.Sub
      email: payload.email, // JwtRegisteredClaimNames.Email
      nameIdentifier: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'], // ClaimTypes.NameIdentifier
      role: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'], // ClaimTypes.Role
      // Дополнительные проверки
      roleDirect: payload.role,
      rolesArray: payload.roles,
      exp: payload.exp,
      iat: payload.iat,
      iss: payload.iss,
      aud: payload.aud,
      currentTime: Math.floor(Date.now() / 1000),
      isExpired: payload.exp ? payload.exp < Math.floor(Date.now() / 1000) : false
    })
  } catch (error) {
    console.error('Ошибка анализа JWT токена:', error)
  }
}

// Тестовая функция для проверки токена
export async function testToken(): Promise<boolean> {
  try {
    console.log('Тестируем токен с простым GET запросом...')
    const response = await fetchJSON('/api/Product')
    console.log('Токен работает с GET запросом:', !!response)
    return true
  } catch (error: any) {
    console.log('Токен не работает с GET запросом:', error.message)
    return false
  }
}

export async function createOrder(orderData: OrderCreateDto, basketId?: string): Promise<Order> {
  try {
    // Получаем токен и анализируем его
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (token) {
      analyzeJWTToken(token)
    }
    
    // Сначала тестируем токен
    const tokenWorks = await testToken()
    if (!tokenWorks) {
      throw new Error('Токен не работает с простыми запросами')
    }
    
    // Попробуем сначала обычный endpoint
    const url = basketId ? `/api/Order?basketId=${basketId}` : '/api/Order'
    
    // Отладочная информация
    console.log('Создание заказа:', {
      url,
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'нет токена',
      orderData,
      requestBody: JSON.stringify(orderData),
      requestHeaders: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : 'нет токена'
      }
    })
    
    return await fetchJSON<Order>(url, {
      method: 'POST', 
      body: JSON.stringify(orderData) 
    })
  } catch (e: any) {
    console.log('API создания заказа недоступен:', e.message)
    
    // Если обычный endpoint не работает, попробуем админский
    try {
      console.log('Пробуем админский endpoint...')
      const adminUrl = '/api/admin/AdminOrder'
      return await fetchJSON<Order>(adminUrl, {
        method: 'POST', 
        body: JSON.stringify(orderData) 
      })
    } catch (adminError: any) {
      console.log('Админский endpoint тоже не работает:', adminError.message)
      throw new Error(`Не удалось создать заказ: ${e.message}`)
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
    if (orderStatusId) params.append('orderStatusId', orderStatusId)
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

