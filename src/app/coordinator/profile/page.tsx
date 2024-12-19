"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  HiOutlineCamera,
  HiOutlineOfficeBuilding,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineIdentification,
  HiOutlineCalendar,
  HiOutlineAcademicCap
} from 'react-icons/hi';

interface CoordinatorProfile {
  id: string;
  user: {
    fullName: string;
    email: string;
    phone: string;
    avatar: string;
  };
  type: string;
  status: string;
  office: {
    name: string;
    location: string;
  };
  startDate: string;
  endDate?: string;
  specialties: string[];
  qualifications: Array<{
    type: string;
    title: string;
    institution: string;
    dateObtained: string;
  }>;
}

export default function CoordinatorProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CoordinatorProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    specialties: [] as string[],
  });

  useEffect(() => {
    loadProfile();
  }, [session]);

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/coordinator/profile');
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.profile);
        setFormData({
          fullName: data.profile.user.fullName,
          phone: data.profile.user.phone,
          specialties: data.profile.specialties,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/coordinator/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Profile updated successfully');
        setProfile(prev => prev ? {
          ...prev,
          user: {
            ...prev.user,
            fullName: formData.fullName,
            phone: formData.phone
          },
          specialties: formData.specialties
        } : null);
        setIsEditing(false);
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('/api/coordinator/profile/avatar', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Avatar updated successfully');
        setProfile(prev => prev ? {
          ...prev,
          user: {
            ...prev.user,
            avatar: data.avatar
          }
        } : null);
      } else {
        toast.error(data.error || 'Failed to update avatar');
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update avatar');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={profile.user.avatar || '/avatar-placeholder.png'}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover"
            />
            <label className="absolute bottom-0 right-0 p-1 bg-white dark:bg-gray-700 rounded-full 
              shadow-lg cursor-pointer">
              <HiOutlineCamera className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.user.fullName}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {profile.type} Coordinator
            </p>
            <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
              <HiOutlineOfficeBuilding className="w-4 h-4 mr-1" />
              {profile.office.name} - {profile.office.location}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Profile Details</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-500 
              rounded-lg hover:bg-primary-600"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Edit Form Fields */}
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full rounded-lg border p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Specialties</label>
              <input
                type="text"
                value={formData.specialties.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  specialties: e.target.value.split(',').map(s => s.trim())
                })}
                className="w-full rounded-lg border p-2"
                placeholder="Enter specialties separated by commas"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg 
                  hover:bg-primary-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Display Profile Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem
                icon={HiOutlineMail}
                label="Email"
                value={profile.user.email}
              />
              <InfoItem
                icon={HiOutlinePhone}
                label="Phone"
                value={profile.user.phone}
              />
              <InfoItem
                icon={HiOutlineIdentification}
                label="Status"
                value={profile.status}
              />
              <InfoItem
                icon={HiOutlineCalendar}
                label="Start Date"
                value={new Date(profile.startDate).toLocaleDateString()}
              />
            </div>

            {/* Specialties */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 
                      text-primary-700 dark:text-primary-300 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Qualifications */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Qualifications</h3>
              <div className="space-y-4">
                {profile.qualifications.map((qual, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-gray-50 
                      dark:bg-gray-700/50 rounded-lg"
                  >
                    <HiOutlineAcademicCap className="w-5 h-5 text-primary-500 mt-1" />
                    <div>
                      <h4 className="font-medium">{qual.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {qual.institution}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(qual.dateObtained).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-gray-400" />
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
} 