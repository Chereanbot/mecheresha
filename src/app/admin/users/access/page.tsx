"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

const LoadingSpinner = dynamic(() => import('@/components/common/LoadingSpinner'), {
  ssr: false
});

interface Permission {
  id: string;
  name: string;
  description: string | null;
  module: string;
  roles: {
    role: {
      id: string;
      name: string;
    };
  }[];
}

interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: {
    permission: Permission;
  }[];
  users: {
    id: string;
    email: string;
    fullName: string;
    userRole: string;
  }[];
}

export default function AccessControlPage() {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissionsByModule, setPermissionsByModule] = useState<Record<string, Permission[]>>({});

  useEffect(() => {
    const debugLoadData = async () => {
      try {
        console.log('Starting to load access data...');
        await loadAccessData();
        console.log('Access data loaded successfully');
      } catch (error) {
        console.error('Error in debugLoadData:', error);
      }
    };
    
    debugLoadData();
  }, []);

  const loadAccessData = async () => {
    try {
      const response = await fetch('/api/admin/access');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (!data.roles || !data.permissions) {
        throw new Error('Invalid data format received from server');
      }
      
      setRoles(data.roles);
      setPermissionsByModule(data.permissions);
    } catch (error) {
      console.error('Error loading access data:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load access control data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPermission = async (roleId: string, permissionId: string) => {
    try {
      const response = await fetch('/api/admin/access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'ASSIGN_PERMISSION',
          roleId,
          permissionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign permission');
      }

      toast.success('Permission assigned successfully');
      loadAccessData();
    } catch (error) {
      console.error('Error assigning permission:', error);
      toast.error('Failed to assign permission');
    }
  };

  const handleRemovePermission = async (roleId: string, permissionId: string) => {
    try {
      const response = await fetch('/api/admin/access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'REMOVE_PERMISSION',
          roleId,
          permissionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove permission');
      }

      toast.success('Permission removed successfully');
      loadAccessData();
    } catch (error) {
      console.error('Error removing permission:', error);
      toast.error('Failed to remove permission');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Access Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Roles Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Roles</h2>
          {roles.map(role => (
            <div key={role.id} className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="text-lg font-medium">{role.name}</h3>
              <p className="text-gray-600 text-sm">{role.description}</p>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  Users: {role.users.length}
                </span>
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-medium">Permissions:</h4>
                <ul className="mt-1 space-y-1">
                  {role.permissions.map(({ permission }) => (
                    <li key={permission.id} className="text-sm flex items-center">
                      <span>{permission.name}</span>
                      <button
                        onClick={() => handleRemovePermission(role.id, permission.id)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Permissions Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Permissions by Module</h2>
          {Object.entries(permissionsByModule).map(([module, permissions]) => (
            <div key={module} className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="text-lg font-medium mb-2">{module}</h3>
              <div className="space-y-2">
                {permissions.map(permission => (
                  <div key={permission.id} className="text-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{permission.name}</p>
                        <p className="text-gray-600">{permission.description}</p>
                      </div>
                      <div className="ml-4">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAssignPermission(e.target.value, permission.id);
                            }
                          }}
                          className="text-sm border rounded p-1"
                        >
                          <option value="">Assign to role...</option>
                          {roles.map(role => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 