import { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/Header';
import { Toaster } from 'react-hot-toast';
import { AdminProvider } from '@/contexts/AdminContext';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Dula CMS',
  description: 'Admin dashboard for managing legal services',
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ThemeProvider attribute="class">
      <AdminProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Sidebar */}
          <AdminSidebar />

          {/* Main Content */}
          <div className="ml-64 min-h-screen flex flex-col">
            <AdminHeader />
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>

          {/* Toast Notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#363636',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                borderRadius: '0.5rem',
                padding: '1rem',
              },
            }}
          />
        </div>
      </AdminProvider>
    </ThemeProvider>
  );
} 