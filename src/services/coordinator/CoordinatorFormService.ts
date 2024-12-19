import { Coordinator, Qualification } from '@/types/coordinator';

export class CoordinatorFormService {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  async validateCoordinator(data: any) {
    try {
      const response = await fetch(`${this.apiUrl}/coordinators/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Validation error:', error);
      throw error;
    }
  }

  async createCoordinator(data: any) {
    try {
      const response = await fetch(`${this.apiUrl}/coordinators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any authentication headers if required
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create coordinator');
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Create coordinator error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create coordinator',
      };
    }
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    const response = await fetch(`${this.apiUrl}/coordinators/check-email?email=${email}`);
    const data = await response.json();
    return data.available;
  }

  async uploadQualificationDocuments(qualificationId: string, files: File[]): Promise<QualificationDocument[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await fetch(`${this.apiUrl}/qualifications/${qualificationId}/documents`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  }

  async checkOfficeAvailability(officeId: string): Promise<{
    available: boolean;
    currentCount: number;
    maxAllowed: number;
  }> {
    try {
      const response = await fetch(
        `${this.apiUrl}/offices/check-availability?officeId=${officeId}`
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check office availability');
      }

      return response.json();
    } catch (error) {
      console.error('Office availability check error:', error);
      throw error;
    }
  }

  async updateCoordinator(id: string, data: any) {
    try {
      const response = await fetch(`${this.apiUrl}/coordinators/${id}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update coordinator');
      }

      return result;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update coordinator');
    }
  }

  async getCoordinator(id: string) {
    try {
      const response = await fetch(`${this.apiUrl}/coordinators/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch coordinator');
      }

      return response.json();
    } catch (error) {
      throw new Error('Failed to fetch coordinator');
    }
  }
} 