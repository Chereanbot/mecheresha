"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineUserGroup,
  HiOutlineScale,
  HiOutlineClipboardList,
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineBell,
  HiOutlineExclamationCircle,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineChat
} from 'react-icons/hi';
import { Line } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';
import { defaultChartOptions, chartColors } from '@/lib/chartConfig';

interface DashboardStats {
  success: boolean;
  data: {
    office: {
      id: string;
      name: string;
      location: string;
    };
    stats: {
      coordinatorCount: number;
      activeCoordinators: number;
      totalCases: number;
      activeCases: number;
      pendingCases: number;
      resolvedCases: number;
      todayAppointments: number;
      documentsToReview: number;
      averageResponseTime: string;
      caseResolutionRate: number;
    };
    recentActivities: Array<{
      id: string;
      type: string;
      description: string;
      timestamp: string;
    }>;
  };
}

// Add new interfaces for additional features
interface Appointment {
  id: string;
  title: string;
  time: string;
  clientName: string;
  type: 'consultation' | 'follow-up' | 'document-review';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
  timestamp: string;
}

export default function CoordinatorDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/coordinator/office/stats', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to load stats');
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !stats?.data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          {error || 'No statistics available'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats: officeStats, recentActivities = [] } = stats.data;

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'warning',
      message: '3 cases require immediate attention',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      type: 'info',
      message: 'New office guidelines available',
      timestamp: new Date().toISOString()
    }
  ];

  const todayAppointments: Appointment[] = [
    {
      id: '1',
      title: 'Initial Consultation',
      time: '10:00 AM',
      clientName: 'John Doe',
      type: 'consultation',
      status: 'scheduled'
    },
    // ... more appointments
  ];

  const performanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Cases Handled',
        data: [12, 19, 15, 17, 14],
        borderColor: chartColors.primary,
        backgroundColor: chartColors.primary,
        tension: 0.4,
        fill: false
      }
    ]
  };

  const chartOptions = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      legend: {
        display: true,
        position: 'top' as const
      },
      tooltip: {
        enabled: true
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      <div className="relative">
        <button
          onClick={() => setShowAlerts(!showAlerts)}
          className="absolute right-0 top-0 p-2 rounded-full bg-white dark:bg-gray-800 
            shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <HiOutlineBell className="w-6 h-6 text-gray-500" />
          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 
              text-white text-xs flex items-center justify-center">
              {alerts.length}
            </span>
          )}
        </button>
        <AnimatePresence>
          {showAlerts && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 
                rounded-lg shadow-lg border dark:border-gray-700 z-10"
            >
              <div className="p-4">
                <h3 className="font-semibold mb-2">Alerts & Notifications</h3>
                <div className="space-y-2">
                  {alerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg ${
                        alert.type === 'warning' 
                          ? 'bg-yellow-50 text-yellow-800' 
                          : 'bg-blue-50 text-blue-800'
                      }`}
                    >
                      <p className="text-sm">{alert.message}</p>
                      <span className="text-xs opacity-75">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Cases"
          value={stats?.data.stats.totalCases || 0}
          icon={HiOutlineClipboardList}
          trend={10}
        />
        <StatCard
          title="Active Cases"
          value={stats?.data.stats.activeCases || 0}
          icon={HiOutlineScale}
          trend={5}
        />
        <StatCard
          title="Today's Appointments"
          value={todayAppointments.length}
          icon={HiOutlineCalendar}
        />
        <StatCard
          title="Resolution Rate"
          value={`${stats?.data.stats.caseResolutionRate || 0}%`}
          icon={HiOutlineCheckCircle}
          trend={2}
        />
      </div>

      {/* Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Performance Overview</h3>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="rounded-md border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-700 text-sm"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="h-64">
            <Line 
              data={performanceData} 
              options={chartOptions}
            />
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
          <div className="space-y-4">
            {todayAppointments.map(appointment => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 bg-gray-50 
                  dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {appointment.type === 'consultation' ? (
                      <HiOutlineChat className="w-5 h-5 text-blue-500" />
                    ) : appointment.type === 'document-review' ? (
                      <HiOutlineDocumentText className="w-5 h-5 text-green-500" />
                    ) : (
                      <HiOutlinePhone className="w-5 h-5 text-purple-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{appointment.title}</p>
                    <p className="text-sm text-gray-500">
                      {appointment.time} - {appointment.clientName}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  appointment.status === 'scheduled' 
                    ? 'bg-blue-100 text-blue-800' 
                    : appointment.status === 'in-progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Case Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Case Distribution</h3>
        <div className="space-y-4">
          <MetricItem
            label="Pending Review"
            value={officeStats.pendingCases}
            total={officeStats.totalCases}
            color="yellow"
          />
          <MetricItem
            label="Active"
            value={officeStats.activeCases}
            total={officeStats.totalCases}
            color="blue"
          />
          <MetricItem
            label="Resolved"
            value={officeStats.resolvedCases}
            total={officeStats.totalCases}
            color="green"
          />
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary-500"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: number;
}

function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend !== undefined && (
            <div className="mt-2">
              <span className={trend > 0 ? 'text-green-500' : 'text-red-500'}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">
                vs last month
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <Icon className="w-6 h-6 text-primary-500" />
        </div>
      </div>
    </motion.div>
  );
}

interface MetricItemProps {
  label: string;
  value: number;
  total: number;
  color: 'yellow' | 'blue' | 'green';
}

function MetricItem({ label, value, total, color }: MetricItemProps) {
  const percentage = Math.round((value / total) * 100) || 0;
  const colors = {
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500'
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors[color]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
