/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

// ============ USER TYPES ============
export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  username: string;
  role: 'citizen' | 'government';
  department?: 'road' | 'water' | 'utilities' | 'health' | 'admin';
  profileImage?: string;
  phoneNumber?: string;
  address?: Address;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  fullName: string;
  username: string;
  role?: 'citizen' | 'government';
  department?: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  data?: {
    user: Omit<UserProfile, 'lastLogin' | 'createdAt' | 'updatedAt'>;
    token: string;
  };
  message?: string;
}

export interface UserResponse {
  status: 'success' | 'error';
  data?: {
    user: UserProfile;
  };
  message?: string;
}

// ============ COMPLAINT TYPES ============
export type ComplaintCategory = 'road' | 'water' | 'utilities' | 'health' | 'other';
export type ComplaintStatus = 'pending' | 'in-progress' | 'resolved';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
}

export interface ImageData {
  url: string;
  publicId?: string;
  uploadedAt?: string;
}

export interface Remark {
  id?: string;
  text: string;
  addedBy?: {
    id: string;
    fullName: string;
    department?: string;
  };
  addedAt?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  location: Location;
  images: ImageData[];
  citizen: {
    id: string;
    fullName: string;
    email: string;
    username: string;
  };
  assignedTo?: {
    id: string;
    fullName: string;
    department: string;
  };
  remarks: Remark[];
  viewCount: number;
  upvotes?: string[]; // Array of user IDs who upvoted
  upvoteCount?: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface CreateComplaintRequest {
  title: string;
  description: string;
  category: ComplaintCategory;
  latitude: number;
  longitude: number;
  locationAddress: string;
  priority?: ComplaintPriority;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  image?: File;
}

export interface UpdateComplaintRequest {
  title?: string;
  description?: string;
  category?: ComplaintCategory;
  priority?: ComplaintPriority;
  location?: Partial<Location>;
}

export interface UpdateComplaintStatusRequest {
  status: ComplaintStatus;
  remarks?: string;
}

export interface AddRemarkRequest {
  text: string;
}

export interface ComplaintsResponse {
  status: 'success' | 'error';
  data?: {
    complaints: Complaint[];
    totalPages: number;
    currentPage: number;
    total: number;
  };
  message?: string;
}

export interface ComplaintResponse {
  status: 'success' | 'error';
  data?: {
    complaint: Complaint;
  };
  message?: string;
}

export interface ComplaintStatistics {
  statusStats: Array<{
    _id: ComplaintStatus;
    count: number;
  }>;
  categoryStats: Array<{
    _id: ComplaintCategory;
    count: number;
  }>;
}

export interface StatisticsResponse {
  status: 'success' | 'error';
  data?: {
    statistics: ComplaintStatistics;
  };
  message?: string;
}

// ============ API RESPONSE TYPES ============
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface ComplaintQueryParams extends PaginationParams {
  status?: ComplaintStatus;
  category?: ComplaintCategory;
}

export interface HealthResponse {
  status: 'success';
  message: string;
  timestamp: string;
}
