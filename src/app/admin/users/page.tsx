"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineUserAdd,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineDotsVertical,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineLockClosed,
  HiOutlineCheck,
  HiOutlineX
} from 'react-icons/hi';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-03-10 14:30',
    createdAt: '2024-01-15'
  },
  // Add more mock users
];

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and monitor user accounts
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 
          text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <HiOutlineUserAdd className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 
              dark:border-gray-700 dark:bg-gray-800"
          />
          <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 
            text-gray-400 w-5 h-5" />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
            dark:bg-gray-800"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
            dark:bg-gray-800"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 
                dark:text-gray-400 uppercase tracking-wider"
              >
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 
                dark:text-gray-400 uppercase tracking-wider"
              >
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 
                dark:text-gray-400 uppercase tracking-wider"
              >
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 
                dark:text-gray-400 uppercase tracking-wider"
              >
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 
                dark:text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockUsers.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold 
                    rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/20 
                    dark:text-primary-300"
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold 
                    rounded-full ${getStatusColor(user.status)}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 
                  dark:text-gray-400"
                >
                  {user.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button className="text-primary-600 hover:text-primary-900 
                      dark:hover:text-primary-400"
                    >
                      <HiOutlinePencil className="w-5 h-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 
                      dark:hover:text-red-400"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 
                      dark:hover:text-gray-400"
                    >
                      <HiOutlineLockClosed className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage; 