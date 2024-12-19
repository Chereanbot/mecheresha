"use client";

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import { ThemeProvider } from 'next-themes';
import CoordinatorSidebar from '@/components/coordinator/Sidebar';
import CoordinatorHeader from '@/components/coordinator/Header';
import { Toaster } from 'react-hot-toast';
import { verifyAuth } from '@/lib/auth';

interface CoordinatorLayoutProps {
  children: React.ReactNode;
}

export default async function CoordinatorLayout({ children }: CoordinatorLayoutProps) {
  try {
    // Check both NextAuth session and JWT token
    const [session, cookieStore] = await Promise.all([
      getServerSession(),
      cookies()
    ]);

    const token = cookieStore.get('auth-token')?.value;

    // Verify the token
    if (token) {
      const authResult = await verifyAuth({ headers: { authorization: `Bearer ${token}` } } as Request);
      if (!authResult.isAuthenticated || authResult.user?.role !== 'COORDINATOR') {
        redirect('/login');
      }
    } else if (!session || session.user?.role !== 'COORDINATOR') {
      redirect('/login');
    }

    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <CoordinatorSidebar />
          <CoordinatorHeader />
          
          <div className="ml-64 min-h-screen">
            <main className="p-6 pt-20">
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
      </ThemeProvider>
    );
  } catch (error) {
    console.error('Coordinator layout error:', error);
    redirect('/login');
  }
} 