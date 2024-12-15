"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useAdmin } from '@/contexts/AdminContext';
import {
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineMenuAlt2,
  HiX
} from 'react-icons/hi';
import Avatar from '@/components/common/Avatar';

const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { theme, setTheme } = useTheme();
  const { adminUser, notifications, markNotificationAsRead, logout } = useAdmin();
  
  const unreadNotifications = notifications?.filter(n => !n.read) || [];

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? (
            <HiX className="w-6 h-6" />
          ) : (
            <HiOutlineMenuAlt2 className="w-6 h-6" />
          )}
        </button>

        {/* Search */}
        <div className="hidden md:block flex-1 max-w-lg">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 
                dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
            />
            <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 
              text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <HiOutlineSun className="w-6 h-6" />
            ) : (
              <HiOutlineMoon className="w-6 h-6" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
              aria-label="Notifications"
            >
              <HiOutlineBell className="w-6 h-6" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg 
                    shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications && notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markNotificationAsRead(notification.id)}
                          className={`p-4 border-b border-gray-200 dark:border-gray-700 last:border-0
                            cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700
                            ${!notification.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                        >
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-500 mt-2 block">
                            {notification.time}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg 
                hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Avatar 
                name={adminUser?.name || 'Admin'} 
                src={adminUser?.avatar}
                size="sm"
              />
              <span className="font-medium hidden md:block">
                {adminUser?.name || 'Administrator'}
              </span>
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg 
                    shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        // Navigate to profile
                      }}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg
                        hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <HiOutlineUser className="w-5 h-5" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        // Navigate to settings
                      }}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg
                        hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <HiOutlineCog className="w-5 h-5" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg
                        hover:bg-red-50 text-red-600 dark:hover:bg-red-900/20"
                    >
                      <HiOutlineLogout className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 