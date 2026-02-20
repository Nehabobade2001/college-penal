const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';

export const authAPI = {
  requestOTP: async (role: 'admin' | 'franchise' | 'student', email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/${role}/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  verifyOTP: async (role: 'admin' | 'franchise' | 'student', email: string, password: string, otp: number) => {
    const res = await fetch(`${API_URL}/auth/${role}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, otp })
    });
    return res.json();
  },

  getProfile: async (token: string) => {
    const res = await fetch(`${API_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  }
};

export const centerAPI = {
  list: async (token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/centers`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  create: async (payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/centers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  update: async (id: number, payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/centers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  deactivate: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/centers/${id}/deactivate`, {
      method: 'PATCH',
      headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
    })
    return res.json()
  },
  activate: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/centers/${id}/activate`, {
      method: 'PATCH',
      headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
    })
    return res.json()
  },
}

export const studentAPI = {
  list: async (token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/students`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  create: async (payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  update: async (id: number, payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  deactivate: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/students/${id}/deactivate`, {
      method: 'PATCH',
      headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
    })
    return res.json()
  },

  activate: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/students/${id}/activate`, {
      method: 'PATCH',
      headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
    })
    return res.json()
  },
}
