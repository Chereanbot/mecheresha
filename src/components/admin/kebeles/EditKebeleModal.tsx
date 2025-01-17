"use client";

import { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

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
}

interface EditKebeleModalProps {
  isOpen: boolean;
  onClose: () => void;
  kebele: Kebele;
}

export default function EditKebeleModal({ isOpen, onClose, kebele }: EditKebeleModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Kebele>({
    id: '',
    kebeleNumber: '',
    kebeleName: '',
    type: 'URBAN',
    status: 'ACTIVE',
    region: '',
    zone: '',
    woreda: '',
    contactPhone: '',
    contactEmail: '',
    totalStaff: 0
  });

  useEffect(() => {
    if (kebele) {
      setFormData(kebele);
    }
  }, [kebele]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`/api/kebeles/${kebele.id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Kebele updated successfully"
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update kebele",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating kebele:', error);
      toast({
        title: "Error",
        description: "Failed to update kebele",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Edit Kebele</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kebeleNumber">Kebele Number</Label>
                <Input
                  id="kebeleNumber"
                  name="kebeleNumber"
                  value={formData.kebeleNumber}
                  onChange={handleChange}
                  placeholder="Enter kebele number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kebeleName">Kebele Name</Label>
                <Input
                  id="kebeleName"
                  name="kebeleName"
                  value={formData.kebeleName}
                  onChange={handleChange}
                  placeholder="Enter kebele name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="URBAN">Urban</SelectItem>
                    <SelectItem value="RURAL">Rural</SelectItem>
                    <SelectItem value="SEMI_URBAN">Semi Urban</SelectItem>
                    <SelectItem value="SPECIAL">Special</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="RESTRUCTURING">Restructuring</SelectItem>
                    <SelectItem value="MERGED">Merged</SelectItem>
                    <SelectItem value="DISSOLVED">Dissolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  placeholder="Enter region"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zone">Zone</Label>
                <Input
                  id="zone"
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  placeholder="Enter zone"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="woreda">Woreda</Label>
                <Input
                  id="woreda"
                  name="woreda"
                  value={formData.woreda}
                  onChange={handleChange}
                  placeholder="Enter woreda"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="Enter contact phone"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="Enter contact email"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Kebele'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
} 