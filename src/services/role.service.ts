import { api } from '@/lib/api';

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  usersCount: number;
  createdAt: string;
}

export interface CreateRoleDto {
  name: string;
  description: string;
  permissions: string[];
}

export interface UpdateRoleDto extends CreateRoleDto {
  id: string;
}

class RoleService {
  async getAllRoles(): Promise<Role[]> {
    return await api.get('/roles');
  }

  async getRoleById(id: string): Promise<Role> {
    return await api.get(`/roles/${id}`);
  }

  async createRole(data: CreateRoleDto): Promise<Role> {
    return await api.post('/roles', data);
  }

  async updateRole(id: string, data: UpdateRoleDto): Promise<Role> {
    return await api.put(`/roles/${id}`, data);
  }

  async deleteRole(id: string): Promise<void> {
    await api.delete(`/roles/${id}`);
  }

  async getAllPermissions(): Promise<Permission[]> {
    return await api.get('/permissions');
  }

  async assignRoleToUsers(roleId: string, userIds: string[]): Promise<void> {
    await api.post(`/roles/${roleId}/assign`, { userIds });
  }

  async removeRoleFromUsers(roleId: string, userIds: string[]): Promise<void> {
    await api.post(`/roles/${roleId}/remove`, { userIds });
  }
}

export const roleService = new RoleService(); 