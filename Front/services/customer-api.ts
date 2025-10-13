import type { Customer, CustomerUpdateDto } from '@/lib/types'
import { storage } from '@/lib/storage'

// Функция для получения токена из localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7100'

async function fetchJSON<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  // Получаем токен аутентификации
  const token = getAuthToken()
  
  // Если путь уже полный URL, используем его как есть
  if (path.startsWith('http')) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers || {}) }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const res = await fetch(path, { ...opts, headers })
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

  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers || {}) }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, { 
    ...opts, 
    credentials: 'include', 
    headers
  })
  
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Request failed ${res.status} ${res.statusText}: ${text}`)
  }
  return (await res.json()) as T
}

export async function getAllCustomers(): Promise<Customer[]> {
  try {
     return await fetchJSON<Customer[]>('/api/Customer')
  } catch (e: any) {
    console.log('API клиентов недоступен:', e.message)
    // Возвращаем пустой массив вместо выброса ошибки
    return []
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

export async function getCustomerByUserId(userId: string): Promise<Customer | null> {
  try {
    console.log('Поиск клиента по userId:', userId)
    
    // Используем новый endpoint из API документации
    const response = await fetch(`${BASE}/api/Customer/by-user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken() || 'mock-token'}`
      }
    })
    
    if (response.ok) {
      const customer = await response.json()
      console.log('Найден клиент по userId:', customer)
      return customer
    } else if (response.status === 404) {
      console.log('Клиент не найден по userId')
      return null
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  } catch (e: any) {
    console.log('API поиска клиента по userId недоступен:', e.message)
    
    // Если это 401 ошибка, значит пользователь не авторизован
    if (e.message.includes('401')) {
      console.log('Пользователь не авторизован, возвращаем null')
      return null
    }
    
    // Fallback: получаем всех клиентов и ищем по userId
    try {
      const customers = await getAllCustomers()
      console.log('Получены все клиенты для fallback:', customers.length)
      
      const customer = customers.find(c => c.userId === userId)
      if (customer) {
        console.log('Найден клиент по userId (fallback):', customer)
        return customer
      } else {
        console.log('Клиент не найден по userId (fallback), возвращаем null')
        return null
      }
    } catch (error) {
      console.log('Ошибка при fallback поиске клиента:', error)
      return null
    }
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

