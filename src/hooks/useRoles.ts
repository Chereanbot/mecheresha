import { useState, useEffect } from 'react';
import { roleService, Role, Permission } from '@/services/role.service';
import { toast } from 'react-hot-toast';

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      const [rolesData, permissionsData] = await Promise.all([
        roleService.getAllRoles(),
        roleService.getAllPermissions()
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch roles');
      toast.error('Failed to fetch roles');
    } finally {
      setIsLoading(false);
    }
  };

  const createRole = async (data: any) => {
    try {
      const newRole = await roleService.createRole(data);
      setRoles(prev => [...prev, newRole]);
      toast.success('Role created successfully');
      return newRole;
    } catch (err: any) {
      toast.error(err.message || 'Failed to create role');
      throw err;
    }
  };

  const updateRole = async (id: string, data: any) => {
    try {
      const updatedRole = await roleService.updateRole(id, data);
      setRoles(prev => prev.map(role => 
        role.id === id ? updatedRole : role
      ));
      toast.success('Role updated successfully');
      return updatedRole;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update role');
      throw err;
    }
  };

  const deleteRole = async (id: string) => {
    try {
      await roleService.deleteRole(id);
      setRoles(prev => prev.filter(role => role.id !== id));
      toast.success('Role deleted successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete role');
      throw err;
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    permissions,
    isLoading,
    error,
    createRole,
    updateRole,
    deleteRole,
    refreshRoles: fetchRoles
  };
}; 