"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineChartPie,
  HiOutlineUserGroup,
  HiOutlineScale,
  HiOutlineOfficeBuilding,
  HiOutlineCash,
  HiOutlineDocumentReport,
  HiOutlineUsers,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineChevronDown,
  HiOutlineKey,
  HiOutlineShieldCheck,
  HiOutlineUserAdd,
  HiOutlineBadgeCheck,
  HiOutlineClipboardList,
  HiOutlineDocumentDuplicate,
  HiOutlineLockClosed,
} from 'react-icons/hi';
import { useAdmin } from '@/contexts/AdminContext';

interface MenuItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  submenu?: {
    title: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: HiOutlineChartPie,
    path: '/admin/dashboard'
  },
  {
    title: 'User Management',
    icon: HiOutlineUserGroup,
    submenu: [
      { 
        title: 'All Users', 
        path: '/admin/users',
        icon: HiOutlineUsers
      },
      { 
        title: 'Roles & Permissions', 
        path: '/admin/users/roles',
        icon: HiOutlineKey
      },
      { 
        title: 'Access Control', 
        path: '/admin/users/access',
        icon: HiOutlineShieldCheck
      },
      { 
        title: 'User Registration', 
        path: '/admin/users/register',
        icon: HiOutlineUserAdd
      },
      { 
        title: 'Verification', 
        path: '/admin/users/verification',
        icon: HiOutlineBadgeCheck
      },
      { 
        title: 'Activity Logs', 
        path: '/admin/users/logs',
        icon: HiOutlineClipboardList
      },
      { 
        title: 'User Documents', 
        path: '/admin/users/documents',
        icon: HiOutlineDocumentDuplicate
      },
      { 
        title: 'Security Settings', 
        path: '/admin/users/security',
        icon: HiOutlineLockClosed
      }
    ]
  },
  {
    title: 'Case Management',
    icon: HiOutlineScale,
    submenu: [
      { 
        title: 'Active Cases', 
        path: '/admin/cases/active',
        icon: HiOutlineDocumentDuplicate
      },
      { 
        title: 'Case Assignment', 
        path: '/admin/cases/assign',
        icon: HiOutlineUserGroup
      },
      { 
        title: 'Priority Cases', 
        path: '/admin/cases/priority',
        icon: HiOutlineScale
      },
      { 
        title: 'Appeals', 
        path: '/admin/cases/appeals',
        icon: HiOutlineDocumentReport
      }
    ]
  },
  {
    title: 'Office Management',
    icon: HiOutlineOfficeBuilding,
    submenu: [
      { 
        title: 'Resources', 
        path: '/admin/office/resources',
        icon: HiOutlineCog
      },
      { 
        title: 'Performance', 
        path: '/admin/office/performance',
        icon: HiOutlineChartPie
      },
      { 
        title: 'Planning', 
        path: '/admin/office/planning',
        icon: HiOutlineDocumentReport
      }
    ]
  },
  {
    title: 'Client Services',
    icon: HiOutlineCash,
    submenu: [
      { title: 'Service Requests', path: '/admin/services/requests' },
      { title: 'Packages', path: '/admin/services/packages' },
      { title: 'Fee Structure', path: '/admin/services/fees' }
    ]
  },
  {
    title: 'Coordinator Management',
    icon: HiOutlineUsers,
    submenu: [
      { title: 'Project Based', path: '/admin/coordinators/project' },
      { title: 'Permanent', path: '/admin/coordinators/permanent' },
      { title: 'Assignments', path: '/admin/coordinators/assignments' }
    ]
  },
  {
    title: 'Reports',
    icon: HiOutlineDocumentReport,
    submenu: [
      { title: 'Statistics', path: '/admin/reports/statistics' },
      { title: 'Performance', path: '/admin/reports/performance' },
      { title: 'Financial', path: '/admin/reports/financial' }
    ]
  }
];

const Sidebar = () => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAdmin();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSubmenu = (title: string) => {
    setOpenMenus(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (path: string) => pathname === path;
  const isMenuOpen = (title: string) => openMenus.includes(title);

  const renderIcon = (Icon: React.ComponentType<{ className?: string }>) => {
    return <Icon className="w-6 h-6" />;
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && openMenus.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpenMenus([])}
        />
      )}

      <aside className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700 z-50 transition-all duration-300
        ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <img 
              src="/images/logo.svg" 
              alt="Dula CMS" 
              className="w-8 h-8"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.backgroundColor = '#3B82F6';
                target.style.borderRadius = '8px';
              }}
            />
            {!isCollapsed && (
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                Dula CMS
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="lg:block hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <HiOutlineChevronDown 
              className={`w-5 h-5 transform transition-transform duration-300 
                ${isCollapsed ? 'rotate-90' : '-rotate-90'}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className={`p-4 space-y-1 overflow-y-auto h-[calc(100vh-5rem)]
          ${isCollapsed ? 'overflow-x-hidden' : ''}`}
        >
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg
                      hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                      ${isMenuOpen(item.title) ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      {renderIcon(item.icon)}
                      {!isCollapsed && <span>{item.title}</span>}
                    </div>
                    {!isCollapsed && (
                      <motion.div
                        animate={{ rotate: isMenuOpen(item.title) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <HiOutlineChevronDown className="w-4 h-4" />
                      </motion.div>
                    )}
                  </button>
                  <AnimatePresence>
                    {isMenuOpen(item.title) && !isCollapsed && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-4 mt-2 space-y-1"
                      >
                        {item.submenu.map((subitem) => (
                          <motion.li
                            key={subitem.path}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                          >
                            <Link
                              href={subitem.path}
                              className={`flex items-center space-x-3 p-3 rounded-lg text-sm
                                hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                                ${isActive(subitem.path) 
                                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                                  : ''}`}
                            >
                              {renderIcon(subitem.icon)}
                              <span>{subitem.title}</span>
                            </Link>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={item.path!}
                  className={`flex items-center space-x-3 p-3 rounded-lg
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                    ${isActive(item.path!) 
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                      : ''}`}
                >
                  {renderIcon(item.icon)}
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <Link
              href="/admin/settings"
              className="flex items-center space-x-3 p-3 rounded-lg
                hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {renderIcon(HiOutlineCog)}
              {!isCollapsed && <span>Settings</span>}
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 p-3 rounded-lg
                hover:bg-red-50 text-red-600 dark:hover:bg-red-900/20 transition-colors"
            >
              {renderIcon(HiOutlineLogout)}
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 