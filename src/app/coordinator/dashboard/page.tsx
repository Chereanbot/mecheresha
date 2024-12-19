"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OfficeDashboard from '@/components/coordinator/OfficeDashboard';
import { toast } from 'react-hot-toast';

export default function CoordinatorDashboardPage() {
  const router = useRouter();
  const [officeId, setOfficeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoordinatorOffice = async () => {
      try {
        const response = await fetch('/api/coordinator/office', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch office details');
        }

        const data = await response.json();
        setOfficeId(data.officeId);
      } catch (error) {
        console.error('Error fetching coordinator office:', error);
        toast.error('Failed to load office details');
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinatorOffice();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!officeId) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-500">No office assigned</p>
          <button 
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return <OfficeDashboard officeId={officeId} />;
} 