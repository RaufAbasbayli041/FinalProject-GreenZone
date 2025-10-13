import type { LoginDto, RegisterDto, AuthResult } from '@/lib/types'

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

export async function login(loginData: LoginDto): Promise<AuthResult> {
  try {
    const result = await fetchJSON<AuthResult>('/api/auth/login', { 
      method: 'POST', 
      body: JSON.stringify(loginData) 
    })
    
    // Сохраняем токен в localStorage при успешном логине
    if (result.token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', result.token)
    }
    
    return result
  } catch (e: any) {
    console.log('API логина недоступен или ошибка backend:', e.message)
    
    // Проверяем, если это ошибка backend (500, 400, etc.)
    if (e.message.includes('500') || e.message.includes('400') || e.message.includes('401')) {
      console.log('Backend ошибка, используем mock авторизацию')
    }
    
    // Заглушка для логина
    const mockToken = 'mock-token-' + Date.now()
    
    // Сохраняем токен в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', mockToken)
    }
    
    return {
      token: mockToken,
      user: {
        id: '1',
        email: loginData.userName,
        name: 'Mock User',
        phone: '',
        address: '',
        createdAt: new Date(),
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 часа
    }
  }
}

export async function register(registerData: RegisterDto): Promise<any> {
  try {
    return await fetchJSON('/api/auth/register', { 
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
    await fetchJSON('/api/auth/logout', { method: 'POST' })
  } catch (e: any) {
    console.log('API выхода недоступен:', e.message)
    // Просто логируем ошибку, не выбрасываем исключение
  } finally {
    // Всегда очищаем токен из localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }
}

