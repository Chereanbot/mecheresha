"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  HiOutlinePencilAlt, 
  HiOutlineTrash, 
  HiOutlineEye, 
  HiOutlinePlus,
  HiOfficeBuilding,
  HiUsers,
  HiLocationMarker,
  HiSearch,
  HiOutlinePhone,
  HiOutlineMail
} from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import AddKebeleModal from '@/components/admin/kebeles/AddKebeleModal';
import EditKebeleModal from '@/components/admin/kebeles/EditKebeleModal';
import DeleteKebeleModal from '@/components/admin/kebeles/DeleteKebeleModal';
import { useToast } from "@/components/ui/use-toast";

interface Kebele {
  id: string;
  kebeleNumber: string;
  kebeleName: string;
  type: 'URBAN' | 'RURAL' | 'SEMI_URBAN' | 'SPECIAL';
  status: 'ACTIVE' | 'INACTIVE' | 'RESTRUCTURING' | 'MERGED' | 'DISSOLVED';
  region?: string;
  zone?: string;
  woreda?: string;
  contactPhone?: string;
  contactEmail?: string;
  totalStaff: number;
  _count?: {
    cases: number;
    staffProfiles: number;
  };
}

export default function KebeleListPage() {
  const router = useRouter();
  const [kebeles, setKebeles] = useState<Kebele[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedKebele, setSelectedKebele] = useState<Kebele | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { toast: showToast } = useToast();

  // Stats
  const [stats, setStats] = useState({
    totalKebeles: 0,
    activeKebeles: 0,
    totalStaff: 0,
    totalCases: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast({
        title: "Error",
        description: "Please log in to access this page",
        variant: "destructive"
      });
      router.push('/auth/login');
      return;
    }
  }, [router]);

  const fetchKebeles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast({
          title: "Error",
          description: "Authentication token not found",
          variant: "destructive"
        });
        return;
      }

      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('search', searchQuery);
      if (selectedType) queryParams.append('type', selectedType);
      if (selectedStatus) queryParams.append('status', selectedStatus);

      const response = await fetch(`/api/kebeles?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setKebeles(data.data.kebeles);
        // Calculate stats
        const activeKebeles = data.data.kebeles.filter((k: Kebele) => k.status === 'ACTIVE');
        const totalStaff = data.data.kebeles.reduce((acc: number, k: Kebele) => 
          acc + k.totalStaff, 0);
        const totalCases = data.data.kebeles.reduce((acc: number, k: Kebele) => 
          acc + (k._count?.cases || 0), 0);
        
        setStats({
          totalKebeles: data.data.kebeles.length,
          activeKebeles: activeKebeles.length,
          totalStaff,
          totalCases
        });
      } else {
        showToast({
          title: "Error",
          description: data.error || 'Failed to fetch kebeles',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching kebeles:', error);
      showToast({
        title: "Error",
        description: 'Failed to fetch kebeles',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKebeles();
  }, [searchQuery, selectedType, selectedStatus]);

  const handleDelete = async (kebele: Kebele) => {
    setSelectedKebele(kebele);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (kebele: Kebele) => {
    setSelectedKebele(kebele);
    setIsEditModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'RESTRUCTURING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'MERGED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'DISSOLVED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'URBAN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'RURAL':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'SEMI_URBAN':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'SPECIAL':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
              <HiOfficeBuilding className="h-6 w-6 text-primary-600 dark:text-primary-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Kebeles</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalKebeles}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <HiOfficeBuilding className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Kebeles</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.activeKebeles}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <HiUsers className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Staff</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalStaff}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <HiLocationMarker className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Cases</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalCases}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Kebele Management
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-colors"
        >
          <HiOutlinePlus className="h-5 w-5 mr-2" />
          Add Kebele
        </button>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search kebeles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">All Types</option>
          <option value="URBAN">Urban</option>
          <option value="RURAL">Rural</option>
          <option value="SEMI_URBAN">Semi Urban</option>
          <option value="SPECIAL">Special</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="RESTRUCTURING">Restructuring</option>
          <option value="MERGED">Merged</option>
          <option value="DISSOLVED">Dissolved</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th scope="col" className="px-6 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <HiOfficeBuilding className="h-5 w-5 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Kebele Info
                    </span>
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <HiLocationMarker className="h-5 w-5 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Location
                    </span>
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </span>
                </th>
                <th scope="col" className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </span>
                </th>
                <th scope="col" className="px-6 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <HiUsers className="h-5 w-5 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Staff & Cases
                    </span>
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </span>
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : kebeles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <HiOfficeBuilding className="h-12 w-12 text-gray-400" />
                      <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No kebeles found</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                kebeles.map((kebele) => (
                  <tr 
                    key={kebele.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-full w-full rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <HiOfficeBuilding className="h-5 w-5 text-primary-600 dark:text-primary-300" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {kebele.kebeleName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            #{kebele.kebeleNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <HiLocationMarker className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900 dark:text-white">
                          {[kebele.region, kebele.zone, kebele.woreda].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(kebele.type)}`}>
                        {kebele.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(kebele.status)}`}>
                        <span className="h-2 w-2 rounded-full bg-current mr-2"></span>
                        {kebele.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          <HiUsers className="h-4 w-4 mr-1" />
                          {kebele.totalStaff} Staff
                        </span>
                        {kebele._count && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                            <HiLocationMarker className="h-4 w-4 mr-1" />
                            {kebele._count.cases} Cases
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {kebele.contactPhone && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <HiOutlinePhone className="h-4 w-4 mr-2" />
                            {kebele.contactPhone}
                          </div>
                        )}
                        {kebele.contactEmail && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <HiOutlineMail className="h-4 w-4 mr-2" />
                            {kebele.contactEmail}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center space-x-3">
                        <button
                          onClick={() => handleEdit(kebele)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                          title="Edit Kebele"
                        >
                          <HiOutlinePencilAlt className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(kebele)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                          title="Delete Kebele"
                        >
                          <HiOutlineTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddKebeleModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      {selectedKebele && (
        <>
          <EditKebeleModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedKebele(null);
            }}
            kebele={selectedKebele}
          />
          <DeleteKebeleModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedKebele(null);
            }}
            kebele={selectedKebele}
          />
        </>
      )}
    </div>
  );
} 