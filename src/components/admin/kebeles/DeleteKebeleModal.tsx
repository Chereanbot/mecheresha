"use client";

import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { HiExclamation } from 'react-icons/hi';

interface Kebele {
  id: string;
  kebeleNumber: string;
  kebeleName: string;
}

interface DeleteKebeleModalProps {
  isOpen: boolean;
  onClose: () => void;
  kebele: Kebele;
}

export default function DeleteKebeleModal({ isOpen, onClose, kebele }: DeleteKebeleModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
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

      const response = await fetch(`/api/kebeles/${kebele.id}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Kebele deleted successfully"
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete kebele",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting kebele:', error);
      toast({
        title: "Error",
        description: "Failed to delete kebele",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900">
              <HiExclamation className="w-6 h-6 text-red-600 dark:text-red-300" />
            </div>
            <h3 className="mb-5 text-lg font-semibold text-center text-gray-900 dark:text-white">
              Delete Kebele
            </h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Are you sure you want to delete kebele{' '}
              <span className="font-medium text-gray-900 dark:text-white">
                {kebele.kebeleName} (#{kebele.kebeleNumber})
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Kebele'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
} 