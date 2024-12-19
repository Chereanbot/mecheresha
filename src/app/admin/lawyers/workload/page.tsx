"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineScale,
  HiOutlineClock,
  HiOutlineExclamation,
  HiOutlineCheck,
} from 'react-icons/hi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  Scatter,
  ReferenceLine
} from 'recharts';

interface FacultyWorkload {
  id: string;
  name: string;
  title: string;
  department: 'Criminal Law' | 'Civil Law' | 'Constitutional Law' | 'Commercial Law';
  academicLoad: {
    courseName: string;
    creditHours: number;
    studentCount: number;
    schedule: string;
  }[];
  legalAidCases: {
    active: number;
    pending: number;
    completed: number;
    complexity: 'Simple' | 'Moderate' | 'Complex';
  };
  availability: 'Available' | 'In Class' | 'Court Session' | 'Office Hours' | 'On Leave';
  expertise: string[];
}

export default function FacultyWorkloadPage() {
  const [facultyMembers, setFacultyMembers] = useState<FacultyWorkload[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    department: 'all',
    availability: 'all',
    caseComplexity: 'all'
  });

  // Stats cards for quick overview
  const WorkloadCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  const WorkloadAnalysisCharts = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Cases Per Faculty</h4>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">4.2</p>
              <p className="ml-2 text-sm text-green-600">+12% from last month</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Teaching Hours vs Legal Aid</h4>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">60:40</p>
              <p className="ml-2 text-sm text-blue-600">Optimal ratio</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Case Resolution Rate</h4>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">85%</p>
              <p className="ml-2 text-sm text-green-600">Above target</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AdvancedWorkloadCharts = () => {
    // Sample data for trends
    const trendData = Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      caseload: Math.floor(15 + Math.random() * 10),
      capacity: 20,
      efficiency: 75 + Math.random() * 15,
      volume: Math.floor(10 + Math.random() * 15)
    }));

    // Weekly workload pattern
    const weeklyPattern = [
      { day: 'Mon', peak: 25, average: 18, low: 12 },
      { day: 'Tue', peak: 28, average: 20, low: 15 },
      { day: 'Wed', peak: 30, average: 22, low: 16 },
      { day: 'Thu', peak: 27, average: 19, low: 14 },
      { day: 'Fri', peak: 24, average: 17, low: 11 }
    ];

    return (
      <div className="space-y-6">
        {/* Workload Trend Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Workload Trend Analysis</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" label={{ value: 'Days', position: 'bottom' }} />
                <YAxis 
                  yAxisId="cases"
                  label={{ value: 'Cases', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="efficiency"
                  orientation="right"
                  label={{ value: 'Efficiency %', angle: 90, position: 'insideRight' }}
                />
                <Tooltip />
                <Legend />
                <ReferenceLine yAxisId="cases" y={20} stroke="#ff0000" strokeDasharray="3 3" label="Max Capacity" />
                <Area 
                  yAxisId="cases"
                  type="monotone" 
                  dataKey="caseload" 
                  name="Case Load"
                  fill="#8884d8" 
                  stroke="#8884d8"
                  fillOpacity={0.3} 
                />
                <Line 
                  yAxisId="cases"
                  type="monotone" 
                  dataKey="capacity" 
                  name="Capacity"
                  stroke="#ff0000" 
                  dot={false} 
                />
                <Line 
                  yAxisId="efficiency"
                  type="monotone" 
                  dataKey="efficiency" 
                  name="Efficiency"
                  stroke="#82ca9d" 
                />
                <Scatter 
                  yAxisId="cases"
                  dataKey="volume" 
                  name="Volume"
                  fill="#ff7300" 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Workload Pattern */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Weekly Workload Pattern</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyPattern}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="peak" 
                  stackId="1" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="average" 
                  stackId="2" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="low" 
                  stackId="3" 
                  stroke="#ffc658" 
                  fill="#ffc658" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workload Distribution Heat Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Faculty Efficiency Metrics</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <ReferenceLine y={80} stroke="#ff0000" strokeDasharray="3 3" label="Target" />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Case Volume Analysis</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill="#8884d8" />
                  <ReferenceLine y={15} stroke="#ff0000" strokeDasharray="3 3" label="Threshold" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Law School Faculty Workload</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Dilla University School of Law - Legal Aid Service Distribution
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WorkloadCard
          title="Legal Aid Cases"
          value="24"
          icon={HiOutlineScale}
          color="bg-blue-100 text-blue-600"
        />
        <WorkloadCard
          title="Available Professors"
          value="8"
          icon={HiOutlineAcademicCap}
          color="bg-green-100 text-green-600"
        />
        <WorkloadCard
          title="Course Load"
          value="156 CH"
          icon={HiOutlineBookOpen}
          color="bg-purple-100 text-purple-600"
        />
        <WorkloadCard
          title="Pending Cases"
          value="12"
          icon={HiOutlineClock}
          color="bg-yellow-100 text-yellow-600"
        />
      </div>

      {/* Workload Analysis Charts */}
      <WorkloadAnalysisCharts />

      {/* Enhanced Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-wrap gap-4">
        <select 
          className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2"
          onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
        >
          <option value="all">All Departments</option>
          <option value="criminal">Criminal Law Department</option>
          <option value="civil">Civil Law Department</option>
          <option value="constitutional">Constitutional Law Department</option>
          <option value="commercial">Commercial Law Department</option>
        </select>

        <select 
          className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2"
          onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
        >
          <option value="all">All Availability</option>
          <option value="available">Available</option>
          <option value="inClass">In Class</option>
          <option value="courtSession">Court Session</option>
          <option value="officeHours">Office Hours</option>
        </select>

        <select 
          className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2"
          onChange={(e) => setFilters(prev => ({ ...prev, caseComplexity: e.target.value }))}
        >
          <option value="all">All Case Types</option>
          <option value="simple">Simple Cases</option>
          <option value="moderate">Moderate Cases</option>
          <option value="complex">Complex Cases</option>
        </select>
      </div>

      {/* Faculty Workload Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Faculty Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Teaching Load
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Legal Aid Cases
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Dr. Abebe Kebede
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Associate Professor, Criminal Law
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 dark:text-white">
                  Criminal Law II (3 CH)
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Legal Research Methods (2 CH)
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm">
                  <span className="font-medium text-blue-600">3 Active</span>
                  <span className="mx-2">•</span>
                  <span className="text-yellow-600">1 Pending</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  2 Complex, 1 Simple
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Available for Complex Cases
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                  View Schedule
                </button>
                <button className="text-indigo-600 hover:text-indigo-900">
                  Assign Case
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <AdvancedWorkloadCharts />
    </div>
  );
} 