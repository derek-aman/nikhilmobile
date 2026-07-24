const TOKEN_KEY = 'admin_token';

export function setAdminToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAdminToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function adminFetch(endpoint, options = {}) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = getAdminToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers
    },
    ...options
  });

  if (res.status === 401) {
    clearAdminToken();
    window.location.href = '/admin/login';
    return;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Something went wrong' }));
    throw new Error(error.message);
  }

  return res.json();
}