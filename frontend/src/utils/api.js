export const API_BASE = 'http://localhost:8000';
export const SESSION_EXPIRED_MESSAGE = 'Tu sesión expiró. Inicia sesión nuevamente.';

export function saveSession({ access_token, refresh_token }) {
  localStorage.setItem('access_token', access_token);
  if (refresh_token) localStorage.setItem('refresh_token', refresh_token);
}

export function clearSession() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

// Varias páginas pueden disparar peticiones en paralelo (Promise.all) que expiran a la vez;
// esta promesa compartida evita pedir varios refresh simultáneos con el mismo refresh_token
// (Supabase rota el refresh_token en cada uso, así que el segundo invalidaría al primero).
let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return false;

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) return false;
        const data = await res.json();
        saveSession(data);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

// Fetch autenticado: adjunta el access_token y, si responde 401 (expirado), intenta
// renovarlo una vez con el refresh_token antes de rendirse. El llamador solo debe
// tratar la sesión como muerta si la respuesta sigue en 401 después de esto.
export async function authFetch(path, options = {}) {
  const doFetch = () => {
    const token = localStorage.getItem('access_token');
    return fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
  };

  let res = await doFetch();

  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) res = await doFetch();
  }

  return res;
}
