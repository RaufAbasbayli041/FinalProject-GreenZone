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
    return await fetchJSON<Order[]>('/api/order')
  } catch (e: any) {
    console.log('API заказов недоступен:', e.message)
    throw e
  }
}

export async function getOrderById(id: string): Promise<Order> {
  try {
    return await fetchJSON<Order>(`/api/order/${id}`)
  } catch (e: any) {
    console.log('API заказа недоступен:', e.message)
    throw e
  }
}

export async function createOrder(orderData: OrderCreateDto): Promise<Order> {
  try {
    return await fetchJSON<Order>('/api/order', { 
      method: 'POST', 
      body: JSON.stringify(orderData) 
    })
  } catch (e: any) {
    console.log('API создания заказа недоступен:', e.message)
    // Заглушка для заказа
    return {
      id: 'mock-order-' + Date.now(),
      customerId: orderData.customerId,
      items: orderData.items,
      totalAmount: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: {
        id: '1',
        name: 'Pending',
        description: 'Order is pending'
      },
      shippingAddress: orderData.shippingAddress,
      notes: orderData.notes,
      orderDate: new Date(),
      updatedAt: new Date()
    }
  }
}

export async function updateOrder(id: string, orderData: OrderUpdateDto): Promise<Order> {
  try {
    return await fetchJSON<Order>(`/api/order/${id}`, { 
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
    await fetchJSON(`/api/order/${id}`, { method: 'DELETE' })
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
    
    return await fetchJSON<Order[]>(`/api/order/by-status/${orderStatusId || 'null'}?${params.toString()}`)
  } catch (e: any) {
    console.log('API заказов по статусу недоступен:', e.message)
    throw e
  }
}

export async function cancelOrder(id: string): Promise<Order> {
  try {
    return await fetchJSON<Order>(`/api/order/${id}/cancel`, { method: 'PUT' })
  } catch (e: any) {
    console.log('API отмены заказа недоступен:', e.message)
    throw e
  }
}

export async function markAsDelivered(id: string): Promise<Order> {
  try {
    return await fetchJSON<Order>(`/api/order/${id}/deliver`, { method: 'PUT' })
  } catch (e: any) {
    console.log('API доставки заказа недоступен:', e.message)
    throw e
  }
}

export async function markAsProcessing(id: string): Promise<Order> {
  try {
    return await fetchJSON<Order>(`/api/order/${id}/processing`, { method: 'PUT' })
  } catch (e: any) {
    console.log('API обработки заказа недоступен:', e.message)
    throw e
  }
}

export async function markAsReturned(id: string): Promise<Order> {
  try {
    return await fetchJSON<Order>(`/api/order/${id}/returned`, { method: 'PUT' })
  } catch (e: any) {
    console.log('API возврата заказа недоступен:', e.message)
    throw e
  }
}

export async function markAsShipped(id: string): Promise<Order> {
  try {
    return await fetchJSON<Order>(`/api/order/${id}/shipped`, { method: 'PUT' })
  } catch (e: any) {
    console.log('API отправки заказа недоступен:', e.message)
    throw e
  }
}

export async function setOrderStatus(id: string, orderStatusId: string): Promise<Order> {
  try {
    return await fetchJSON<Order>(`/api/order/${id}/set-status/${orderStatusId}`, { method: 'PUT' })
  } catch (e: any) {
    console.log('API установки статуса заказа недоступен:', e.message)
    throw e
  }
}

