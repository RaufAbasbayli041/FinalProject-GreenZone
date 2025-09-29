import type { Category, CategoryCreateDto, CategoryUpdateDto } from '@/lib/types'

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

export async function getAllCategories(): Promise<Category[]> {
  try {
    return await fetchJSON<Category[]>('/api/category')
  } catch (e: any) {
    console.log('API категорий недоступен:', e.message)
    // Заглушка для категорий
    return [
      {
        id: '1',
        name: 'Жилые газоны',
        description: 'Искусственная трава для жилых домов и садов',
        products: []
      },
      {
        id: '2',
        name: 'Спортивные покрытия',
        description: 'Профессиональные спортивные покрытия',
        products: []
      },
      {
        id: '3',
        name: 'Коммерческие решения',
        description: 'Искусственная трава для коммерческих объектов',
        products: []
      }
    ]
  }
}

export async function getCategoryById(id: string): Promise<Category> {
  try {
    return await fetchJSON<Category>(`/api/category/${id}`)
  } catch (e: any) {
    console.log('API категории недоступен:', e.message)
    throw e
  }
}

export async function createCategory(categoryData: CategoryCreateDto): Promise<Category> {
  try {
    return await fetchJSON<Category>('/api/category', { 
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
    return await fetchJSON<Category>(`/api/category/${id}`, { 
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
    await fetchJSON(`/api/category/${id}`, { method: 'DELETE' })
    return true
  } catch (e: any) {
    console.log('API удаления категории недоступен:', e.message)
    throw e
  }
}

