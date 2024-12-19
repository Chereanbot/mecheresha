import { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/Header';
import { Toaster } from 'react-hot-toast';
import { AdminProvider } from '@/contexts/AdminContext';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Dula CMS',
  description: 'Admin dashboard for managing legal services',
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  try {
    const [session, cookieStore] = await Promise.all([
      getServerSession(),
      cookies()
    ]);

    const token = await cookieStore.get('auth-token')?.value;

    if (!session && !token) {
      redirect('/login');
    }

    return (
      <ThemeProvider attribute="class">
        <AdminProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <AdminSidebar />
            <div className="ml-64 min-h-screen flex flex-col">
              <AdminHeader />
              <main className="flex-1 p-6">
                {children}
              </main>
            </div>
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
  } catch (error) {
    console.error('Admin layout error:', error);
    redirect('/login');
  }
} 