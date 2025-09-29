const BASE = process.env.NEXT_PUBLIC_API_URL || ''

export async function fetchJSON<T = any>(path: string, opts: RequestInit = {}) {
  const url = path.startsWith('http') ? path : `${BASE}${path.startsWith('/') ? '' : '/'}${path}`
  const res = await fetch(url, { ...opts })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(txt || `Fetch error ${res.status}`)
  }
  return (await res.json()) as T
}