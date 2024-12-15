"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getAvatarUrl } from '@/utils/avatar';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface AdminContextType {
  adminUser: AdminUser | null;
  notifications: Notification[];
  isLoading: boolean;
  markNotificationAsRead: (id: string) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Simulate loading admin data
        const mockAdminUser = {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'SUPER_ADMIN',
          avatar: getAvatarUrl('Admin User')
        };

        // Simulate loading notifications
        const mockNotifications = [
          {
            id: '1',
            title: 'New Case Assignment',
            message: 'A new case has been assigned to your office',
            time: '5 minutes ago',
            read: false
          },
          {
            id: '2',
            title: 'Performance Report',
            message: 'Monthly performance report is ready for review',
            time: '1 hour ago',
            read: false
          }
        ];

        setAdminUser(mockAdminUser);
        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Error loading admin data:', error);
        toast.error('Failed to load admin data');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, [router]);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const logout = () => {
    // Clear admin data
    setAdminUser(null);
    setNotifications([]);
    
    // Clear auth tokens
    localStorage.removeItem('token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Redirect to login
    router.push('/login');
    toast.success('Logged out successfully');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ 
      adminUser, 
      notifications, 
      isLoading,
      markNotificationAsRead,
      logout 
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}; 