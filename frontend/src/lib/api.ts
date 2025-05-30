import { AuthResponse, FinanceResponse, CreateFinanceRequest, APIResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new APIError(response.status, data.error || 'Request failed');
  }

  return data;
}

// Auth API
export const authAPI = {
  register: async (email: string, password: string, name: string, invitationCode: string): Promise<AuthResponse> => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, invitationCode }),
    });
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async (): Promise<APIResponse> => {
    return request('/auth/logout', {
      method: 'POST',
    });
  },

  me: async (): Promise<AuthResponse> => {
    return request('/auth/me');
  },
};

// Finance API
export const financeAPI = {
  getRecords: async (params?: { limit?: number; offset?: number; type?: 'income' | 'expense' }): Promise<FinanceResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    if (params?.type) searchParams.append('type', params.type);
    
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request(`/finance${query}`);
  },

  createRecord: async (data: CreateFinanceRequest): Promise<APIResponse> => {
    return request('/finance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateRecord: async (id: number, data: CreateFinanceRequest): Promise<APIResponse> => {
    return request(`/finance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteRecord: async (id: number): Promise<APIResponse> => {
    return request(`/finance/${id}`, {
      method: 'DELETE',
    });
  },
};

export { APIError }; 