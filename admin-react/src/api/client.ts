/**
 * Central API client for Node.js backend.
 * Base URL: VITE_API_URL (default http://localhost:2155)
 * Auth: Authorization: Bearer <token> from userData in localStorage
 */

const STORAGE_KEY = 'userData'

function getBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL
  if (url) return url.replace(/\/$/, '')
  return 'http://localhost:2155'
}

function getToken(): string | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.token ?? parsed?._token ?? null
  } catch {
    return null
  }
}

export interface ApiError {
  status: number
  message: string
  body?: unknown
}

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type')
  const isJson = contentType?.includes('application/json')
  const body = isJson ? await res.json().catch(() => ({})) : await res.text()

  if (!res.ok) {
    const err: ApiError = {
      status: res.status,
      message: (body && typeof body === 'object' && 'error' in body && typeof (body as { error: unknown }).error === 'string')
        ? (body as { error: string }).error
        : (body && typeof body === 'object' && 'message' in body && typeof (body as { message: string }).message === 'string')
          ? (body as { message: string }).message
          : res.statusText || 'Request failed',
      body,
    }
    throw err
  }

  return body as T
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const base = getBaseUrl()
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`
  const token = getToken()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers as Record<string, string>),
      ...headers,
    },
  })

  return handleResponse<T>(res)
}

export async function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: 'GET' })
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method: 'POST',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

export function apiPath(segment: string): string {
  const base = getBaseUrl()
  const prefix = '/nodejs'
  const seg = segment.startsWith('/') ? segment : `/${segment}`
  return `${base}${prefix}${seg}`
}
