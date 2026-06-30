import { getAccessToken, setAccessToken, clearAccessToken } from './token-store';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

let refreshPromise: Promise<boolean> | null = null;

async function attemptTokenRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function redirectToLogin(): void {
  clearAccessToken();
  const { pathname, search } = window.location;
  if (!pathname.startsWith('/login')) {
    window.location.href = `/login?redirect=${encodeURIComponent(pathname + search)}`;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    const refreshed = await attemptTokenRefresh();
    if (refreshed) {
      const retryHeaders: Record<string, string> = {};
      const newToken = getAccessToken();
      if (newToken) retryHeaders['Authorization'] = `Bearer ${newToken}`;
      if (body !== undefined) retryHeaders['Content-Type'] = 'application/json';

      res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: retryHeaders,
        credentials: 'include',
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } else {
      redirectToLogin();
      throw new Error('Session expired');
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `Request failed: ${res.status}`);
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }

  return res.json();
}

export function get<T>(path: string): Promise<T> {
  return request<T>('GET', path);
}

export function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>('POST', path, body);
}

export function patch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>('PATCH', path, body);
}

export function del<T>(path: string): Promise<T> {
  return request<T>('DELETE', path);
}
