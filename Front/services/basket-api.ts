import type { Basket, BasketItemsCreateDto, BasketItemsUpdateDto } from '@/lib/types'

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

export async function getBasketByCustomerId(customerId: string): Promise<Basket> {
  try {
    return await fetchJSON<Basket>(`/api/basket/${customerId}`)
  } catch (e: any) {
    console.log('API корзины недоступен:', e.message)
    // Заглушка для корзины
    return {
      id: 'mock-basket-' + customerId,
      customerId: customerId,
      items: [],
      totalAmount: 0
    }
  }
}

export async function addItemsToBasket(customerId: string, items: BasketItemsCreateDto): Promise<void> {
  try {
    await fetchJSON(`/api/basket/${customerId}/items`, { 
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
    await fetchJSON(`/api/basket/${customerId}/items?productId=${productId}&quantity=${quantity}`, { 
      method: 'DELETE' 
    })
  } catch (e: any) {
    console.log('API удаления из корзины недоступен:', e.message)
    // Просто логируем ошибку
  }
}

export async function clearBasket(customerId: string): Promise<void> {
  try {
    await fetchJSON(`/api/basket/${customerId}`, { method: 'DELETE' })
  } catch (e: any) {
    console.log('API очистки корзины недоступен:', e.message)
    // Просто логируем ошибку
  }
}

export async function updateItemsInBasket(customerId: string, items: BasketItemsUpdateDto): Promise<void> {
  try {
    await fetchJSON('/api/basket/items', { 
      method: 'PUT', 
      body: JSON.stringify({ customerId, ...items }) 
    })
  } catch (e: any) {
    console.log('API обновления корзины недоступен:', e.message)
    // Просто логируем ошибку
  }
}

