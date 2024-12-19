"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineUserGroup,
  HiOutlineScale,
  HiOutlineClipboardList,
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineRefresh
} from 'react-icons/hi';
import { Line, Bar } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';

interface OfficeStats {
  overview: {
    coordinatorCount: number;
    activeCoordinators: number;
    totalCases: number;
    activeCases: number;
    pendingRequests: number;
  };
  metrics: {
    caseResolutionRate: number;
    resourceUtilizationRate: number;
    averageWorkload: number;
  };
  performance: any[];
  resourceUtilization: any[];
  coordinatorWorkload: any[];
}

const StatCard = ({ title, value, icon: Icon, trend = 0 }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
        <Icon className="w-6 h-6 text-primary-500" />
      </div>
    </div>
    {trend !== 0 && (
      <div className="mt-4">
        <span className={trend > 0 ? 'text-green-500' : 'text-red-500'}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
        <span className="text-gray-600 dark:text-gray-400 ml-2">vs last month</span>
      </div>
    )}
  </motion.div>
);

export default function OfficeDashboard({ officeId }: { officeId: string }) {
  const [stats, setStats] = useState<OfficeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(30000); // 30 seconds

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/coordinator/office/stats?officeId=${officeId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stats');
      }

      setStats(data);
    } catch (error) {
      console.error('Error fetching office stats:', error);
      toast.error('Failed to fetch office statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(interval);
  }, [officeId, refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Office Dashboard</h1>
        <button
          onClick={fetchStats}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-50 
            dark:bg-primary-900/20 text-primary-600 rounded-lg hover:bg-primary-100"
        >
          <HiOutlineRefresh className="w-5 h-5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Active Coordinators"
          value={stats.overview.activeCoordinators}
          icon={HiOutlineUserGroup}
          trend={5}
        />
        <StatCard
          title="Active Cases"
          value={stats.overview.activeCases}
          icon={HiOutlineScale}
          trend={-2}
        />
        <StatCard
          title="Pending Requests"
          value={stats.overview.pendingRequests}
          icon={HiOutlineClipboardList}
          trend={3}
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Case Resolution Rate</h2>
          <Line
            data={{
              labels: stats.performance.map(p => new Date(p.date).toLocaleDateString()),
              datasets: [{
                label: 'Resolution Rate',
                data: stats.performance.map(p => p.value),
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.1
              }]
            }}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Coordinator Workload</h2>
          <Bar
            data={{
              labels: stats.coordinatorWorkload.map((_, i) => `Coordinator ${i + 1}`),
              datasets: [{
                label: 'Assignments',
                data: stats.coordinatorWorkload.map(c => c.assignments),
                backgroundColor: 'rgba(59, 130, 246, 0.5)'
              }]
            }}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>

      {/* Resource Utilization */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Resource Utilization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.resourceUtilization.map((resource, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{resource.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {resource.type}
                  </p>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <HiOutlineCube className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span>Utilization</span>
                  <span className="font-medium">
                    {Math.round(stats.metrics.resourceUtilizationRate)}%
                  </span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${Math.round(stats.metrics.resourceUtilizationRate)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 