import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ClientLayout from './ClientLayout';
import { verifyAuth } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Coordinator Dashboard | DulaCMS',
  description: 'Legal aid coordinator dashboard for case management',
};

export default async function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token?.value) {
      redirect('/login');
    }

    const request = new Request('http://localhost', {
      headers: {
        'Cookie': `auth-token=${token.value}`,
        'Authorization': `Bearer ${token.value}`
      }
    });

    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated || !authResult.user) {
      redirect('/login');
    }

    if (authResult.user.userRole !== 'COORDINATOR') {
      redirect(`/${authResult.user.userRole.toLowerCase()}/dashboard`);
    }

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ClientLayout>{children}</ClientLayout>
      </div>
    );
  } catch (error) {
    console.error('Layout auth error:', error);
    redirect('/login');
  }
} 