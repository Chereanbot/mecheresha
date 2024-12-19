"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineLockClosed,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineDotsVertical,
  HiOutlineClock,
  HiOutlineBan
} from 'react-icons/hi';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'LAWYER' | 'CLIENT';
  emailVerified: boolean;
  createdAt: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED';
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onBan: (userId: string) => void;
  onStatusChange: (userId: string, status: UserStatus) => void;
  onRoleChange: (userId: string, role: Role) => void;
}

export default function UserTable({ 
  users, 
  onEdit, 
  onDelete, 
  onBan,
  onStatusChange,
  onRoleChange 
}: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-black dark:bg-purple-900/40 dark:text-purple-200';
      case 'ADMIN':
        return 'bg-blue-100 text-black dark:bg-blue-900/40 dark:text-blue-200';
      case 'LAWYER':
        return 'bg-green-100 text-black dark:bg-green-900/40 dark:text-green-200';
      case 'CLIENT':
        return 'bg-yellow-100 text-black dark:bg-yellow-900/40 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-black dark:bg-gray-900/40 dark:text-gray-200';
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    const statusColors = {
      ACTIVE: 'bg-green-100 text-black dark:bg-green-900/40 dark:text-green-200',
      INACTIVE: 'bg-gray-100 text-black dark:bg-gray-900/40 dark:text-gray-200',
      SUSPENDED: 'bg-yellow-100 text-black dark:bg-yellow-900/40 dark:text-yellow-200',
      BANNED: 'bg-red-100 text-black dark:bg-red-900/40 dark:text-red-200'
    };
    return statusColors[status];
  };

  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setShowActionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          No users found for the selected criteria
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              User
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Joined
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {users.map((user) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`}
                      alt={user.fullName}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.fullName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.emailVerified
                    ? 'bg-green-100 text-black dark:bg-green-900/40 dark:text-green-200'
                    : 'bg-yellow-100 text-black dark:bg-yellow-900/40 dark:text-yellow-200'
                }`}>
                  {user.emailVerified ? (
                    <HiOutlineCheck className="w-4 h-4 mr-1" />
                  ) : (
                    <HiOutlineX className="w-4 h-4 mr-1" />
                  )}
                  {user.emailVerified ? 'Verified' : 'Pending'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-3 relative">
                  <button
                    onClick={() => onEdit(user)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    title="Edit User"
                  >
                    <HiOutlinePencil className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => setShowActionMenu(user.id)}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                    title="More Actions"
                  >
                    <HiOutlineDotsVertical className="w-5 h-5" />
                  </button>

                  {showActionMenu === user.id && (
                    <div 
                      ref={actionMenuRef}
                      className="absolute right-0 mt-8 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => onStatusChange(user.id, 'ACTIVE')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <HiOutlineCheck className="inline w-4 h-4 mr-2" />
                          Activate User
                        </button>
                        
                        <button
                          onClick={() => onStatusChange(user.id, 'SUSPENDED')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <HiOutlineClock className="inline w-4 h-4 mr-2" />
                          Suspend User
                        </button>
                        
                        <button
                          onClick={() => onBan(user.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <HiOutlineBan className="inline w-4 h-4 mr-2" />
                          Ban User
                        </button>

                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                        <button
                          onClick={() => onDelete(user.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <HiOutlineTrash className="inline w-4 h-4 mr-2" />
                          Delete User
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 