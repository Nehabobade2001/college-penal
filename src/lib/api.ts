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
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },
  remove: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
    })
    // DELETE returns 204 on success in backend; handle accordingly
    if (res.status === 204) return { success: true }
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

export const categoryAPI = {
  list: async (token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/categories`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  create: async (payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },
}

export const departmentAPI = {
  list: async (token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/departments`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  create: async (payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  update: async (id: number, payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/departments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  remove: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/departments/${id}`, {
      method: 'DELETE',
      headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
    })
    if (res.status === 204) return { success: true }
    return res.json()
  },
}

export const programAPI = {
  list: async (token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/programs`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  create: async (payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/programs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  update: async (id: number, payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/programs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  remove: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/programs/${id}`, {
      method: 'DELETE',
      headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
    })
    if (res.status === 204) return { success: true }
    return res.json()
  },
}

export const streamAPI = {
  list: async (token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/streams`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  create: async (payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/streams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  update: async (id: number, payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/streams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  remove: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/streams/${id}`, {
      method: 'DELETE',
      headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
    })
    if (res.status === 204) return { success: true }
    return res.json()
  },
}

export const subjectAPI = {
  list: async (token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/subjects`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  create: async (payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  update: async (id: number, payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/subjects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  remove: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/subjects/${id}`, {
      method: 'DELETE',
      headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
    })
    if (res.status === 204) return { success: true }
    return res.json()
  },
}

export const specializationAPI = {
  list: async (token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/specializations`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  create: async (payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/specializations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  update: async (id: number, payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/specializations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  remove: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/specializations/${id}`, {
      method: 'DELETE',
      headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
    })
    if (res.status === 204) return { success: true }
    return res.json()
  },
}

export const addressAPI = {
  list: async (token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/addresses`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  create: async (payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  update: async (id: number, payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/addresses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  remove: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/addresses/${id}`, {
      method: 'DELETE',
      headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
    })
    if (res.status === 204) return { success: true }
    return res.json()
  },
}
