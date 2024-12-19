import { api } from '@/lib/api';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface User {
  id: string;
  email: string;
  phone: string | null;
  fullName: string;
  username: string | null;
  role: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  lawyerProfile?: {
    specializations: string[];
    experience: number;
    rating: number | null;
  };
  coordinatorProfile?: {
    type: string;
  };
  totalCases: number;
}

interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string | null;
  module: string;
}

interface Activity {
  id: string;
  userId: string;
  user: User;
  action: string;
  details: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface Document {
  id: string;
  userId: string;
  user: User;
  title: string;
  type: string;
  path: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

interface UserStats {
  overview: {
    total: number;
    active: number;
    pending: number;
    blocked: number;
    newToday: number;
    recentActivities: number;
  };
  distribution: {
    roles: {
      SUPER_ADMIN: number;
      ADMIN: number;
      LAWYER: number;
      CLIENT: number;
    };
    verification: {
      verified: number;
      pending: number;
    };
  };
  trends: {
    dailyGrowth: string;
    verificationRate: string;
  };
}

interface GetLawyersOptions {
  available?: boolean;
  specialization?: string;
  officeId?: string;
}

// Service class
class UserService {
  private getAuthHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // Try to get token from localStorage first
    let token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
    
    // If no token in localStorage, try to get from cookie
    if (!token && typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(c => c.trim().startsWith('auth-token='));
      if (authCookie) {
        token = authCookie.split('=')[1].trim();
      }
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // All Users
  async getAllUsers(params = {}) {
    try {
      const headers = this.getAuthHeaders();
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/users${queryString ? `?${queryString}` : ''}`, {
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Only redirect if we're in the browser
          if (typeof window !== 'undefined') {
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
            return null;
          }
          throw new Error('Unauthorized access');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  }

  // Roles & Permissions
  async getAllRoles(): Promise<Role[]> {
    const response = await api.get('/api/roles');
    return response.data;
  }

  async getRoleById(id: string): Promise<Role> {
    const response = await api.get(`/api/roles/${id}`);
    return response.data;
  }

  async getAllPermissions(): Promise<Permission[]> {
    const response = await api.get('/api/permissions');
    return response.data;
  }

  // Access Control
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const response = await api.get(`/api/users/${userId}/permissions`);
    return response.data;
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    await api.post(`/api/users/${userId}/roles`, { roleId });
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    await api.delete(`/api/users/${userId}/roles/${roleId}`);
  }

  // User Registration
  async registerUser(data: {
    email: string;
    password: string;
    fullName: string;
    role: string;
    phone?: string;
    specializations?: string[];
    experience?: number;
    company?: string;
    address?: string;
  }): Promise<User> {
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to register user');
      }

      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to register user');
    }
  }

  // Verification
  async getPendingVerifications(params?: {
    type?: 'EMAIL' | 'PHONE';
    page?: number;
    limit?: number;
  }): Promise<{ verifications: any[]; total: number }> {
    const response = await api.get('/api/verifications/pending', { params });
    return response.data;
  }

  async verifyUser(userId: string, type: 'EMAIL' | 'PHONE'): Promise<void> {
    await api.post(`/api/users/${userId}/verify`, { type });
  }

  // Activity Logs
  async getUserActivities(params?: {
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ activities: Activity[]; total: number }> {
    const response = await api.get('/api/activities', { params });
    return response.data;
  }

  // User Documents
  async getUserDocuments(params?: {
    userId?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{ documents: Document[]; total: number }> {
    const response = await api.get('/api/documents', { params });
    return response.data;
  }

  async uploadUserDocument(userId: string, file: File, metadata: {
    title: string;
    type: string;
  }): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    const response = await api.post(`/users/${userId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  // Security Settings
  async updateUserSecurity(userId: string, data: {
    password?: string;
    twoFactorEnabled?: boolean;
    securityQuestions?: any[];
  }): Promise<void> {
    await api.patch(`/api/users/${userId}/security`, data);
  }

  async getUserSecuritySettings(userId: string): Promise<{
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    securityQuestions: boolean;
  }> {
    const response = await api.get(`/api/users/${userId}/security`);
    return response.data;
  }

  async getUserStats() {
    try {
      const headers = this.getAuthHeaders();
      const response = await fetch('/api/users/stats', {
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          if (typeof window !== 'undefined') {
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
            return null;
          }
          throw new Error('Unauthorized access');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }

  async updateUserStatus(userId: string, status: UserStatus): Promise<void> {
    const response = await fetch(`/api/users/${userId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
  }

  async updateUserRole(userId: string, role: Role): Promise<void> {
    const response = await fetch(`/api/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
  }

  async deleteUser(userId: string): Promise<void> {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
  }

  async getLawyers(options: GetLawyersOptions = {}): Promise<User[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (options.available !== undefined) {
        queryParams.append('available', String(options.available));
      }
      if (options.specialization) {
        queryParams.append('specialization', options.specialization);
      }
      if (options.officeId) {
        queryParams.append('officeId', options.officeId);
      }

      const url = `/api/users/lawyers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetchWrapper.get<User[]>(url);
      return response;
    } catch (error) {
      console.error('Error fetching lawyers:', error);
      return [];
    }
  }

  // Add login method with proper token handling
  async login(credentials: { email: string; password: string }) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.token) {
        // Store token in localStorage
        localStorage.setItem('auth-token', data.token);
        
        // Set cookie with secure attributes
        document.cookie = `auth-token=${data.token}; path=/; max-age=604800; secure; samesite=strict`;

        // If there's a redirect URL in the query params, use it
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const redirect = params.get('redirect');
          if (redirect) {
            window.location.href = redirect;
            return data;
          }
        }
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Add logout method
  async logout() {
    try {
      // Clear token from localStorage
      localStorage.removeItem('auth-token');
      
      // Clear cookie with all security attributes
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; secure; samesite=strict';
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}

export const userService = new UserService(); 