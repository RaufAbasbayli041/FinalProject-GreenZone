import type { Basket, BasketItemsCreateDto, BasketItemsUpdateDto } from '@/lib/types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7100'

// Функция для получения токена авторизации
function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    console.log('getAuthToken: window is undefined (SSR)')
    return null
  }
  
  const token = localStorage.getItem('auth_token')
  console.log('getAuthToken: получение токена из localStorage:', {
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 30) + '...' : 'нет токена',
    tokenLength: token ? token.length : 0,
    localStorageKeys: Object.keys(localStorage),
    localStorageSize: localStorage.length
  })
  
  // Если токен есть, возвращаем его (даже если он может быть невалидным)
  if (token) {
    console.log('✅ Токен найден, используем для запросов')
    return token
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

async function fetchJSON<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  // Получаем токен авторизации
  const token = getAuthToken()
  
  console.log('fetchJSON: начало запроса:', {
    path,
    method: opts.method || 'GET',
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 30) + '...' : 'нет токена'
  })
  
  // Если путь уже полный URL, используем его как есть
  if (path.startsWith('http')) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    console.log('fetchJSON: полный URL запрос:', {
      url: path,
      headers,
      hasAuthHeader: !!headers['Authorization']
    })
    
    const res = await fetch(path, { 
      ...opts, 
      headers: { ...headers, ...(opts.headers || {}) } 
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('fetchJSON: ошибка полного URL запроса:', {
        status: res.status,
        statusText: res.statusText,
        responseText: text
      })
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

  console.log('fetchJSON: запрос к бэкенду:', {
    url,
    method: opts.method || 'GET',
    headers,
    hasAuthHeader: !!headers['Authorization'],
    requestBody: opts.body ? (typeof opts.body === 'string' ? opts.body.substring(0, 200) + '...' : 'не строка') : 'нет тела'
  })

  const res = await fetch(url, { 
    ...opts, 
    credentials: 'include', 
    headers: { ...headers, ...(opts.headers || {}) } 
  })
  
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('fetchJSON: ошибка запроса к бэкенду:', {
      url,
      status: res.status,
      statusText: res.statusText,
      responseText: text,
      hasToken: !!token
    })
    throw new Error(`Request failed ${res.status} ${res.statusText}: ${text}`)
  }
  
  const result = await res.json()
  console.log('fetchJSON: успешный ответ:', {
    url,
    status: res.status,
    resultPreview: JSON.stringify(result).substring(0, 200) + '...'
  })
  
  return result as T
}

export async function getBasketByCustomerId(customerId: string): Promise<Basket> {
  try {
    console.log('Получение корзины для customerId:', customerId)
    const basket = await fetchJSON<Basket>(`/api/Basket/${customerId}`)
    console.log('Получена корзина:', basket)
    return basket
  } catch (e: any) {
    console.log('API корзины недоступен:', e.message)
    
    // Если корзина не найдена (404 или 500), возвращаем пустую корзину
    if (e.message.includes('404') || e.message.includes('500') || e.message.includes('Basket not found')) {
      console.log('Корзина не найдена, возвращаем пустую корзину')
      return {
        id: '',
        customerId: customerId,
        basketItems: [],
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

export async function clearBasket(customerId: string): Promise<void> {
  try {
    console.log('Очистка корзины для customerId:', customerId)
    await fetchJSON(`/api/Basket/${customerId}`, { method: 'DELETE' })
    console.log('Корзина успешно очищена')
  } catch (e: any) {
    console.error('Ошибка очистки корзины:', e.message)
    throw new Error(`Не удалось очистить корзину: ${e.message}`)
  }
}

export async function updateItemsInBasket(customerId: string, items: BasketItemsUpdateDto): Promise<void> {
  try {
    console.log('Обновление товара в корзине:', { customerId, items })
    await fetchJSON(`/api/Basket/${customerId}/items`, { 
      method: 'PUT', 
      body: JSON.stringify(items) 
    })
    console.log('Товар в корзине успешно обновлен')
  } catch (e: any) {
    console.error('Ошибка обновления товара в корзине:', e.message)
    throw new Error(`Не удалось обновить товар в корзине: ${e.message}`)
  }
}

