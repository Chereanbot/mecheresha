import { toast } from 'react-hot-toast';

interface CoordinatorFormData {
  email: string;
  password: string;
  fullName: string;
  officeId: string;
  phone?: string;
  address?: string;
  status?: string;
}

export class CoordinatorFormService {
  static async createCoordinator(data: CoordinatorFormData) {
    try {
      const response = await fetch('/api/coordinators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create coordinator');
      }

      toast.success('Coordinator created successfully');

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Create coordinator error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create coordinator');
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create coordinator',
        data: null
      };
    }
  }
} 