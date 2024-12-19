import { useState } from 'react';
import { Role } from '@prisma/client';
import { motion } from 'framer-motion';

interface AddUserModalProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

interface UserFormData {
  email: string;
  fullName: string;
  password: string;
  role: Role;
  phone?: string;
  specializations?: string[];
  experience?: number;
  company?: string;
  address?: string;
}

export default function AddUserModal({ onClose, onSubmit }: AddUserModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    fullName: '',
    password: '',
    role: 'CLIENT',
    phone: '',
    specializations: [],
    experience: 0,
    company: '',
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.email || !formData.password || !formData.fullName) {
        throw new Error('Please fill in all required fields');
      }

      // Clean up the data before submission
      const submitData = {
        ...formData,
        // Remove undefined or empty values
        phone: formData.phone || undefined,
        specializations: formData.role === 'LAWYER' ? formData.specializations : undefined,
        experience: formData.role === 'LAWYER' ? formData.experience : undefined,
        company: formData.role === 'CLIENT' ? formData.company : undefined,
        address: formData.role === 'CLIENT' ? formData.address : undefined,
      };

      await onSubmit(submitData);
      onClose();
    } catch (error: any) {
      console.error('Error adding user:', error);
      // You might want to show an error message to the user here
    }
  };

  const renderStepOne = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="CLIENT">Client</option>
          <option value="LAWYER">Lawyer</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>
  );

  const renderStepTwo = () => {
    switch (formData.role) {
      case 'LAWYER':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Specializations</label>
              <select
                multiple
                value={formData.specializations}
                onChange={(e) => setFormData({
                  ...formData,
                  specializations: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="CRIMINAL">Criminal Law</option>
                <option value="CIVIL">Civil Law</option>
                <option value="CORPORATE">Corporate Law</option>
                <option value="FAMILY">Family Law</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Years of Experience</label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        );

      case 'CLIENT':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company (Optional)</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Add New User</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 ? renderStepOne() : renderStepTwo()}

          <div className="flex justify-between">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
            )}
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              
              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  disabled={!formData.email || !formData.fullName || !formData.password}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Create User
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 