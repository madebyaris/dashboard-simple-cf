export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
  message?: string;
}

export interface Finance {
  id: number;
  user_id: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description?: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface FinanceSummary {
  income: { total: number; count: number };
  expense: { total: number; count: number };
  balance: number;
}

export interface FinanceResponse {
  success: boolean;
  data?: {
    records: Finance[];
    summary: FinanceSummary;
    pagination: {
      limit: number;
      offset: number;
      total: number;
    };
  };
  error?: string;
  message?: string;
}

export interface CreateFinanceRequest {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description?: string;
  date?: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 