import { api } from './axios';
import { User, Location, Package, Booking, Receipt, ApiResponse } from '../types';

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<ApiResponse<{ token: string; user: User }>>('/api/auth/login', {
      email,
      password,
    });
    return data;
  },

  register: async (name: string, email: string, password: string) => {
    const { data } = await api.post<ApiResponse<{ token: string; user: User }>>('/api/auth/register', {
      name,
      email,
      password,
    });
    return data;
  },

  getMe: async () => {
    const { data } = await api.get<ApiResponse<User>>('/api/auth/me');
    return data;
  },
};

// Locations API
export const locationsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    q?: string;
    region?: string;
  }) => {
    const { data } = await api.get<ApiResponse<Location[]>>('/api/locations', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Location>>(`/api/locations/${id}`);
    return data;
  },
};

// Packages API
export const packagesAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    q?: string;
    category?: string;
    region?: string;
    priceMin?: string;
    priceMax?: string;
    durationMin?: string;
    durationMax?: string;
  }) => {
    const { data } = await api.get<ApiResponse<Package[]>>('/api/packages', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Package>>(`/api/packages/${id}`);
    return data;
  },
};

// Bookings API
export const bookingsAPI = {
  create: async (bookingData: {
    packageId: string;
    date: string;
    travelers: number;
    pickupCity: string;
    phone: string;
  }) => {
    const { data } = await api.post<ApiResponse<{ bookingId: string; receiptId: string }>>('/api/bookings', bookingData);
    return data;
  },

  getMy: async () => {
    const { data } = await api.get<ApiResponse<Booking[]>>('/api/bookings/me');
    return data;
  },
};

// Receipts API
export const receiptsAPI = {
  getMy: async () => {
    const { data } = await api.get<ApiResponse<Receipt[]>>('/api/receipts/me');
    return data;
  },

  downloadPdf: async (receiptId: string) => {
    const response = await api.get(`/api/receipts/${receiptId}/pdf`, {
      responseType: 'blob',
    });
    return response;
  },
};