const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';

// Permissions are now fetched fresh from /auth/profile on every page load.
// No localStorage permission cache to clear.

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
  ,
  logout: async (token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
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

  get: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/categories/${id}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
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
    if (res.status === 204) return { success: true }
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

export const courseAPI = {
  list: async (token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/courses`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  create: async (payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  update: async (id: number, payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  remove: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
    })
    if (res.status === 204) return { success: true }
    return res.json()
  },

  assignSubjects: async (id: number, subjectIds: number[], token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/courses/${id}/subjects`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify({ subjects: subjectIds }),
    })
    return res.json()
  },

  setFees: async (id: number, fees: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/courses/${id}/fees`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify({ fees }),
    })
    return res.json()
  },
}

export const feesAPI = {
  createStructure: async (payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/fees/structure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  assignToStudent: async (payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/fees/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  submitPayment: async (payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/fees/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  approveSubmission: async (payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/fees/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  rejectSubmission: async (submissionId: number, rejectedBy: number, reason: string, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/fees/reject/${submissionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify({ rejectedBy, reason }),
    })
    return res.json()
  },

  pendingSubmissions: async (centerId?: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const qs = centerId ? `?centerId=${centerId}` : ''
    const res = await fetch(`${API_URL}/fees/submissions/pending${qs}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  recordPayment: async (payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/fees/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  createInstallments: async (payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/fees/installments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  studentFees: async (studentId: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/fees/student/${studentId}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  pendingReport: async (params?: Record<string, any>, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const qs = params ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => [k, String(v)])).toString() : ''
    const res = await fetch(`${API_URL}/fees/pending${qs}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  allPayments: async (params?: Record<string, any>, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const qs = params ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => [k, String(v)])).toString() : ''
    const res = await fetch(`${API_URL}/fees/payments${qs}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  exportPaymentsExcel: async (params?: Record<string, any>, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const qs = params ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => [k, String(v)])).toString() : ''
    const res = await fetch(`${API_URL}/fees/export/payments/excel${qs}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    const blob = await res.blob()
    return blob
  },

  exportPaymentsPDF: async (params?: Record<string, any>, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const qs = params ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => [k, String(v)])).toString() : ''
    const res = await fetch(`${API_URL}/fees/export/payments/pdf${qs}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    const blob = await res.blob()
    return blob
  },

  centerCollection: async (centerId: number, fromDate?: string, toDate?: string, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const qs = (fromDate && toDate) ? `?fromDate=${encodeURIComponent(fromDate)}&toDate=${encodeURIComponent(toDate)}` : ''
    const res = await fetch(`${API_URL}/fees/center/${centerId}/collection${qs}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  exportCenterExcel: async (centerId: number, fromDate?: string, toDate?: string, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const qs = (fromDate && toDate) ? `?fromDate=${encodeURIComponent(fromDate)}&toDate=${encodeURIComponent(toDate)}` : ''
    const res = await fetch(`${API_URL}/fees/export/center/${centerId}/excel${qs}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    const blob = await res.blob()
    return blob
  },

  getReceipt: async (receiptNumber: string, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/fees/receipt/${receiptNumber}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },
}

export const resultAPI = {
  list: async (params?: Record<string, any>, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const qs = params ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => [k, String(v)])).toString() : ''
    const res = await fetch(`${API_URL}/results${qs}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  get: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/results/${id}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  create: async (payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  update: async (id: number, payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/results/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  publish: async (id: number, isPublished: boolean, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/results/${id}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify({ isPublished }),
    })
    return res.json()
  },

  uploadExcel: async (file: File, payload: { courseId?: number; examName?: string; semester?: string; academicYear?: string }, token?: string) => {
    const form = new FormData()
    form.append('file', file)
    Object.entries(payload || {}).forEach(([k, v]) => { if (v !== undefined) form.append(k, String(v)) })
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/results/upload`, {
      method: 'POST',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
      body: form as any,
    })
    return res.json()
  },

  downloadPDF: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/results/${id}/download/pdf`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    const blob = await res.blob()
    return blob
  },

  remove: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/results/${id}`, {
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

const getToken = () =>
  typeof document !== 'undefined'
    ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, '$1')
    : ''

export const roleAPI = {
  list: async (opts?: { all?: boolean }) => {
    const url = `${API_URL}/roles${opts && opts.all ? '?all=1' : ''}`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    return res.json()
  },
  getById: async (id: number) => {
    const res = await fetch(`${API_URL}/roles/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    return res.json()
  },
  create: async (payload: any) => {
    const res = await fetch(`${API_URL}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(payload),
    })
    return res.json()
  },
  update: async (id: number, payload: any) => {
    const res = await fetch(`${API_URL}/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(payload),
    })
    // Permissions re-fetched from API on next page load — no cache to invalidate.
    return res.json()
  },
  remove: async (id: number) => {
    const res = await fetch(`${API_URL}/roles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    if (res.status === 204) return { success: true }
    return res.json()
  },
}

export const permissionAPI = {
  list: async () => {
    const res = await fetch(`${API_URL}/permissions`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    return res.json()
  },
  getById: async (id: number) => {
    const res = await fetch(`${API_URL}/permissions/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    return res.json()
  },
  create: async (payload: any) => {
    const res = await fetch(`${API_URL}/permissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(payload),
    })
    return res.json()
  },
  update: async (id: number, payload: any) => {
    const res = await fetch(`${API_URL}/permissions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(payload),
    })
    return res.json()
  },
  remove: async (id: number) => {
    const res = await fetch(`${API_URL}/permissions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    if (res.status === 204) return { success: true }
    return res.json()
  },
}


export const complaintAPI = {
  list: async (filter?: Record<string, any>, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const qs = filter ? '?' + new URLSearchParams(filter as any).toString() : ''
    const res = await fetch(`${API_URL}/complaints${qs}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  paginated: async (params: Record<string, any>, filter?: Record<string, any>, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const merged = { ...(params || {}), ...(filter || {}) }
    const qs = '?' + new URLSearchParams(merged as any).toString()
    const res = await fetch(`${API_URL}/complaints/paginated${qs}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  create: async (payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  get: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/complaints/${id}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    return res.json()
  },

  update: async (id: number, payload: any, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/complaints/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  assignToCenter: async (id: number, centerId: number, assignedTo?: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/complaints/${id}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify({ centerId, assignedTo }),
    })
    return res.json()
  },

  resolve: async (id: number, resolution: string, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/complaints/${id}/resolve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body: JSON.stringify({ resolution }),
    })
    return res.json()
  },

  close: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/complaints/${id}/close`, {
      method: 'PATCH',
      headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
    })
    return res.json()
  },

  remove: async (id: number, token?: string) => {
    const authToken = token || (typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1") : '')
    const res = await fetch(`${API_URL}/complaints/${id}`, {
      method: 'DELETE',
      headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
    })
    if (res.status === 204) return { success: true }
    return res.json()
  },
}
