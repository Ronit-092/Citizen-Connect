import {
  AuthRequest,
  RegisterRequest,
  AuthResponse,
  UserResponse,
  CreateComplaintRequest,
  ComplaintsResponse,
  ComplaintResponse,
  UpdateComplaintStatusRequest,
  AddRemarkRequest,
  StatisticsResponse,
  ComplaintQueryParams,
} from '@shared/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Store token in localStorage
let authToken: string | null = localStorage.getItem('auth_token');

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('auth_token', token);
};

export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('auth_token');
};

export const getAuthToken = (): string | null => {
  return authToken || localStorage.getItem('auth_token');
};

// ============ HELPER FUNCTIONS ============
const getHeaders = (isFormData = false) => {
  const headers: Record<string, string> = {};
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      status: 'error',
      message: `HTTP ${response.status}`,
    }));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

// ============ AUTH ENDPOINTS ============
export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  login: async (data: AuthRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await handleResponse<AuthResponse>(response);
    if (result.data?.token) {
      setAuthToken(result.data.token);
    }
    return result;
  },

  getMe: async (): Promise<UserResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<UserResponse>(response);
  },

  updatePassword: async (oldPassword: string, newPassword: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/update-password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    return handleResponse(response);
  },

  logout: () => {
    clearAuthToken();
  },
};

// ============ COMPLAINT ENDPOINTS ============
export const complaintApi = {
  create: async (data: CreateComplaintRequest) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('latitude', data.latitude.toString());
    formData.append('longitude', data.longitude.toString());
    formData.append('locationAddress', data.locationAddress);
    if (data.priority) {
      formData.append('priority', data.priority);
    }
    if (data.area) {
      formData.append('area', data.area);
    }
    if (data.city) {
      formData.append('city', data.city);
    }
    if (data.state) {
      formData.append('state', data.state);
    }
    if (data.pincode) {
      formData.append('pincode', data.pincode);
    }
    if (data.landmark) {
      formData.append('landmark', data.landmark);
    }
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });
    return handleResponse<ComplaintResponse>(response);
  },

  getAll: async (params?: ComplaintQueryParams): Promise<ComplaintsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.sort) searchParams.append('sort', params.sort);

    const url = `${API_BASE_URL}/complaints${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<ComplaintsResponse>(response);
  },

  // Public endpoint - fetches all complaints without auth filtering
  getAllPublic: async (params?: ComplaintQueryParams): Promise<ComplaintsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.sort) searchParams.append('sort', params.sort);

    const url = `${API_BASE_URL}/complaints/public${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      // No auth headers for public endpoint
    });
    return handleResponse<ComplaintsResponse>(response);
  },

  getById: async (id: string): Promise<ComplaintResponse> => {
    const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<ComplaintResponse>(response);
  },

  getMy: async (params?: ComplaintQueryParams): Promise<ComplaintsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.sort) searchParams.append('sort', params.sort);

    const url = `${API_BASE_URL}/complaints/my-complaints${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<ComplaintsResponse>(response);
  },

  updateStatus: async (
    id: string,
    data: UpdateComplaintStatusRequest
  ): Promise<ComplaintResponse> => {
    const response = await fetch(`${API_BASE_URL}/complaints/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ComplaintResponse>(response);
  },

  addRemark: async (id: string, data: AddRemarkRequest) => {
    const response = await fetch(`${API_BASE_URL}/complaints/${id}/remarks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ComplaintResponse>(response);
  },

  getByStatus: async (
    status: string,
    params?: ComplaintQueryParams
  ): Promise<ComplaintsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sort) searchParams.append('sort', params.sort);

    const url = `${API_BASE_URL}/complaints/status/${status}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<ComplaintsResponse>(response);
  },

  getStatistics: async (): Promise<StatisticsResponse> => {
    const response = await fetch(`${API_BASE_URL}/complaints/statistics`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<StatisticsResponse>(response);
  },

  toggleUpvote: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/complaints/${id}/upvote`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse<{ status: string; data: { upvoteCount: number; hasUpvoted: boolean } }>(response);
  },

  updatePriority: async (id: string, priority: string) => {
    const response = await fetch(`${API_BASE_URL}/complaints/${id}/priority`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ priority }),
    });
    return handleResponse<ComplaintResponse>(response);
  },

  assignComplaint: async (id: string, assignedTo: string | null) => {
    const response = await fetch(`${API_BASE_URL}/complaints/${id}/assign`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ assignedTo }),
    });
    return handleResponse<ComplaintResponse>(response);
  },

  search: async (params: {
    q?: string;
    status?: string;
    category?: string;
    priority?: string;
    dateFrom?: string;
    dateTo?: string;
    department?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });

    const url = `${API_BASE_URL}/complaints/search${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<ComplaintsResponse>(response);
  },

  bulkUpdate: async (complaintIds: string[], updates: Record<string, any>) => {
    const response = await fetch(`${API_BASE_URL}/complaints/bulk`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ complaintIds, updates }),
    });
    return handleResponse<{ status: string; data: { matchedCount: number; modifiedCount: number } }>(response);
  },

  getAnalytics: async (days: number = 30) => {
    const response = await fetch(`${API_BASE_URL}/complaints/analytics?days=${days}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<{
      status: string;
      data: {
        trend: Array<{ _id: string; count: number }>;
        categories: Array<{ _id: string; count: number }>;
        priorities: Array<{ _id: string; count: number }>;
        statuses: Array<{ _id: string; count: number }>;
        avgResolutionTime: number;
      };
    }>(response);
  },
};

// ============ HEALTH CHECK ============
export const healthApi = {
  check: async () => {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });
    return handleResponse(response);
  },
};