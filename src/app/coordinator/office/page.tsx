"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  HiOutlineOfficeBuilding,
  HiOutlineUsers,
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineCalendar
} from 'react-icons/hi';

interface OfficeDetails {
  id: string;
  name: string;
  location: string;
  coordinators: Array<{
    id: string;
    user: {
      fullName: string;
      email: string;
      phone: string;
      avatar: string;
    };
    type: string;
    startDate: string;
  }>;
  resources: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
  }>;
  performance: {
    caseLoad: number;
    resolutionRate: number;
    avgResponseTime: string;
  };
}

export default function OfficePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [officeDetails, setOfficeDetails] = useState<OfficeDetails | null>(null);

  useEffect(() => {
    loadOfficeDetails();
  }, [session]);

  const loadOfficeDetails = async () => {
    try {
      const response = await fetch('/api/coordinator/office', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        setOfficeDetails(data.office);
      } else {
        toast.error(data.error || 'Failed to load office details');
      }
    } catch (error) {
      console.error('Error loading office details:', error);
      toast.error('Failed to load office details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!officeDetails) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Office details not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Office Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <HiOutlineOfficeBuilding className="w-8 h-8 text-primary-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{officeDetails.name}</h1>
            <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
              <HiOutlineLocationMarker className="w-5 h-5 mr-2" />
              {officeDetails.location}
            </div>
          </div>
        </div>
      </div>

      {/* Office Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Coordinators"
          value={officeDetails.coordinators.length}
          icon={HiOutlineUsers}
        />
        <StatCard
          title="Case Resolution Rate"
          value={`${officeDetails.performance.resolutionRate}%`}
          icon={HiOutlineCalendar}
        />
        <StatCard
          title="Avg Response Time"
          value={officeDetails.performance.avgResponseTime}
          icon={HiOutlineClock}
        />
      </div>

      {/* Coordinators List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Office Coordinators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {officeDetails.coordinators.map((coordinator) => (
              <div
                key={coordinator.id}
                className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <img
                  src={coordinator.user.avatar || "/avatar-placeholder.png"}
                  alt={coordinator.user.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium">{coordinator.user.fullName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {coordinator.type}
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <HiOutlineMail className="w-4 h-4 mr-2" />
                      {coordinator.user.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <HiOutlinePhone className="w-4 h-4 mr-2" />
                      {coordinator.user.phone}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Office Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {officeDetails.resources.map((resource) => (
              <div
                key={resource.id}
                className="p-4 border dark:border-gray-700 rounded-lg"
              >
                <h3 className="font-medium">{resource.name}</h3>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {resource.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    resource.status === 'AVAILABLE' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {resource.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <Icon className="w-6 h-6 text-primary-500" />
        </div>
      </div>
    </div>
  );
} 