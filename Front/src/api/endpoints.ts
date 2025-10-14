import apiClient from './axiosInstance';

// Types для API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Order types
export interface OrderDto {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName?: string;
  orderDate: string;
  orderStatusId: number;
  orderStatusName?: string;
  totalAmount: number;
  deliveryAddress?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderDto {
  customerId: number;
  deliveryAddress?: string;
  notes?: string;
}

export interface UpdateOrderDto {
  customerId?: number;
  deliveryAddress?: string;
  notes?: string;
}

// Product types
export interface ProductDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  categoryName?: string;
  imageUrl?: string;
  isActive: boolean;
  stockQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  isActive?: boolean;
  stockQuantity?: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  isActive?: boolean;
  stockQuantity?: number;
}

// Customer types
export interface CustomerDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Category types
export interface CategoryDto {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}

// Delivery types
export interface DeliveryDto {
  id: number;
  orderId: number;
  orderNumber?: string;
  deliveryAddress: string;
  deliveryDate?: string;
  status: number;
  statusName?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDeliveryDto {
  orderId: number;
  deliveryAddress: string;
  deliveryDate?: string;
  notes?: string;
}

export interface UpdateDeliveryDto {
  deliveryAddress?: string;
  deliveryDate?: string;
  notes?: string;
}

// Order Status types
export interface OrderStatusDto {
  id: number;
  name: string;
  description?: string;
}

// API endpoints
export const adminApi = {
  // Orders
  orders: {
    getAll: (params?: { keyword?: string; page?: number; pageSize?: number }) =>
      apiClient.get<PaginatedResponse<OrderDto>>('/api/admin/order', { params }),
    
    getById: (id: number) =>
      apiClient.get<OrderDto>(`/api/admin/order/${id}`),
    
    create: (data: CreateOrderDto) =>
      apiClient.post<OrderDto>('/api/admin/order', data),
    
    update: (id: number, data: UpdateOrderDto) =>
      apiClient.put<OrderDto>(`/api/admin/order/${id}`, data),
    
    delete: (id: number) =>
      apiClient.delete(`/api/admin/order/${id}`),
    
    getByStatus: (statusId: number, params?: { keyword?: string; page?: number; pageSize?: number }) =>
      apiClient.get<PaginatedResponse<OrderDto>>(`/api/admin/order/by-status/${statusId}`, { params }),
    
    deliver: (id: number) =>
      apiClient.post(`/api/admin/order/${id}/deliver`),
    
    processing: (id: number) =>
      apiClient.post(`/api/admin/order/${id}/processing`),
    
    returned: (id: number) =>
      apiClient.post(`/api/admin/order/${id}/returned`),
    
    cancel: (id: number) =>
      apiClient.post(`/api/admin/order/${id}/cancel`),
  },

  // Products
  products: {
    getAll: (params?: { keyword?: string; page?: number; pageSize?: number }) =>
      apiClient.get<PaginatedResponse<ProductDto>>('/api/admin/product', { params }),
    
    getById: (id: number) =>
      apiClient.get<ProductDto>(`/api/admin/product/${id}`),
    
    create: (data: CreateProductDto) =>
      apiClient.post<ProductDto>('/api/admin/product', data),
    
    update: (id: number, data: UpdateProductDto) =>
      apiClient.put<ProductDto>(`/api/admin/product/${id}`, data),
    
    delete: (id: number) =>
      apiClient.delete(`/api/admin/product/${id}`),
    
    uploadImage: (id: number, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiClient.post(`/api/admin/product/upload-image/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    
    uploadDocuments: (id: number, files: File[]) => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      return apiClient.post(`/api/admin/product/upload-documents/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
  },

  // Customers
  customers: {
    getAll: (params?: { keyword?: string; page?: number; pageSize?: number }) =>
      apiClient.get<PaginatedResponse<CustomerDto>>('/api/admin/customer', { params }),
    
    getById: (id: number) =>
      apiClient.get<CustomerDto>(`/api/admin/customer/${id}`),
    
    delete: (id: number) =>
      apiClient.delete(`/api/admin/customer/${id}`),
  },

  // Categories
  categories: {
    getAll: () =>
      apiClient.get<CategoryDto[]>('/api/admin/category'),
    
    getById: (id: number) =>
      apiClient.get<CategoryDto>(`/api/admin/category/${id}`),
    
    create: (data: CreateCategoryDto) =>
      apiClient.post<CategoryDto>('/api/admin/category', data),
    
    update: (id: number, data: UpdateCategoryDto) =>
      apiClient.put<CategoryDto>(`/api/admin/category/${id}`, data),
    
    delete: (id: number) =>
      apiClient.delete(`/api/admin/category/${id}`),
  },

  // Deliveries
  deliveries: {
    getAll: (params?: { keyword?: string; page?: number; pageSize?: number }) =>
      apiClient.get<PaginatedResponse<DeliveryDto>>('/api/admin/delivery', { params }),
    
    getById: (id: number) =>
      apiClient.get<DeliveryDto>(`/api/admin/delivery/${id}`),
    
    create: (data: CreateDeliveryDto) =>
      apiClient.post<DeliveryDto>('/api/admin/delivery', data),
    
    update: (id: number, data: UpdateDeliveryDto) =>
      apiClient.put<DeliveryDto>(`/api/admin/delivery/${id}`, data),
    
    delete: (id: number) =>
      apiClient.delete(`/api/admin/delivery/${id}`),
    
    updateStatus: (id: number, status: number) =>
      apiClient.post(`/api/admin/delivery/${id}/status/${status}`),
  },
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<{ token: string; user: any }>('/api/auth/login', { email, password }),
  
  register: (data: { firstName: string; lastName: string; email: string; password: string }) =>
    apiClient.post<{ token: string; user: any }>('/api/auth/register', data),
  
  logout: () =>
    apiClient.post('/api/auth/logout'),
  
  getProfile: () =>
    apiClient.get('/api/auth/profile'),
};
