"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineUserGroup,
  HiOutlineScale,
  HiOutlineCash,
  HiOutlineDocumentReport,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineExclamation,
  HiOutlineCheck,
  HiArrowSmUp,
  HiArrowSmDown,
  HiOutlineDotsVertical
} from 'react-icons/hi';
import { useRouter } from 'next/navigation';

// Import the charts
import { CaseStatistics, RevenueChart } from '@/components/admin/charts/DashboardCharts';

// Stats Card Component
const StatsCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType,
  onClick 
}: {
  title: string;
  value: string;
  icon: JSX.Element;
  change?: string;
  changeType?: 'increase' | 'decrease';
  onClick?: () => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
        {icon}
      </div>
      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
        <HiOutlineDotsVertical className="w-5 h-5" />
      </button>
    </div>
    <h3 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h3>
    <div className="flex items-center justify-between mt-2">
      <p className="text-2xl font-bold">{value}</p>
      {change && (
        <span className={`flex items-center text-sm
          ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}
        >
          {changeType === 'increase' ? (
            <HiArrowSmUp className="w-4 h-4 mr-1" />
          ) : (
            <HiArrowSmDown className="w-4 h-4 mr-1" />
          )}
          {change}
        </span>
      )}
    </div>
  </motion.div>
);

// Update the Chart component
const Chart = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
    <h3 className="font-medium mb-4">{title}</h3>
    {children}
  </div>
);

// Recent Activity Component
const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'case',
      title: 'New Case Assigned',
      description: 'Property dispute case assigned to John Doe',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Received',
      description: 'Client payment received for case #123',
      time: '4 hours ago'
    },
    // Add more activities
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h3 className="font-medium mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex-shrink-0">
              <HiOutlineScale className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <h4 className="font-medium">{activity.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {activity.description}
              </p>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pending Tasks Component
const PendingTasks = () => {
  const tasks = [
    {
      id: 1,
      title: 'Review Case Documents',
      priority: 'high',
      deadline: 'Today'
    },
    {
      id: 2,
      title: 'Assign New Cases',
      priority: 'medium',
      deadline: 'Tomorrow'
    },
    // Add more tasks
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h3 className="font-medium mb-4">Pending Tasks</h3>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input type="checkbox" className="rounded border-gray-300" />
              <div>
                <p className="font-medium">{task.title}</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Due {task.deadline}
                </span>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs
              ${task.priority === 'high' 
                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
              }`}
            >
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <HiOutlineExclamation className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {error}
          </h3>
          <button
            onClick={() => window.location.reload()}
            className="text-primary-500 hover:text-primary-600"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Admin</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your legal practice today.
          </p>
        </div>
        <button className="px-4 py-2 bg-primary-500 text-white rounded-lg
          hover:bg-primary-600 transition-colors">
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Cases"
          value="1,234"
          icon={<HiOutlineScale className="w-6 h-6 text-primary-500" />}
          change="12%"
          changeType="increase"
          onClick={() => router.push('/admin/cases')}
        />
        <StatsCard
          title="Active Lawyers"
          value="48"
          icon={<HiOutlineUserGroup className="w-6 h-6 text-primary-500" />}
          change="3"
          changeType="increase"
          onClick={() => router.push('/admin/lawyers')}
        />
        <StatsCard
          title="Revenue"
          value="$52,000"
          icon={<HiOutlineCash className="w-6 h-6 text-primary-500" />}
          change="8%"
          changeType="decrease"
          onClick={() => router.push('/admin/revenue')}
        />
        <StatsCard
          title="Success Rate"
          value="92%"
          icon={<HiOutlineChartBar className="w-6 h-6 text-primary-500" />}
          change="5%"
          changeType="increase"
          onClick={() => router.push('/admin/success-rate')}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart title="Case Statistics">
          <CaseStatistics />
        </Chart>
        <Chart title="Revenue Overview">
          <RevenueChart />
        </Chart>
      </div>

      {/* Activity and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <PendingTasks />
      </div>
    </div>
  );
} 