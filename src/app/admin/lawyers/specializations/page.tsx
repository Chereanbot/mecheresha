"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineBadgeCheck,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineScale,
  HiOutlineAcademicCap,
} from 'react-icons/hi';
import SpecializationModal from '@/components/admin/specializations/SpecializationModal';

interface Specialization {
  id: string;
  facultyName: string;
  title: string;  // Academic title
  department: string;
  specialization: string;
  description: string;
  yearsOfExperience: number;
  casesHandled: number;
  successRate: number;
  expertise: string[];
  currentCases: number;
  education: {
    degree: string;
    institution: string;
    year: number;
  }[];
}

export default function SpecializationsPage() {
  const [specializations, setSpecializations] = useState<Specialization[]>([
    {
      id: '1',
      facultyName: 'Dr. Cherinet Hailu',
      title: 'Associate Professor',
      department: 'Criminal Law',
      specialization: 'Criminal Justice',
      description: 'Expert in criminal defense and prosecution with focus on human rights',
      yearsOfExperience: 8,
      casesHandled: 45,
      successRate: 87,
      expertise: ['Criminal Defense', 'Human Rights Law', 'Constitutional Law'],
      currentCases: 3,
      education: [
        {
          degree: 'PhD in Criminal Law',
          institution: 'Addis Ababa University',
          year: 2018
        },
        {
          degree: 'LLM in Human Rights Law',
          institution: 'Dilla University',
          year: 2015
        }
      ]
    },
    {
      id: '2',
      facultyName: 'Dr. Abebe Kebede',
      title: 'Assistant Professor',
      department: 'Civil Law',
      specialization: 'Family Law',
      description: 'Specialized in family law and civil disputes resolution',
      yearsOfExperience: 6,
      casesHandled: 38,
      successRate: 92,
      expertise: ['Family Law', 'Civil Litigation', 'Mediation'],
      currentCases: 2,
      education: [
        {
          degree: 'PhD in Civil Law',
          institution: 'Dilla University',
          year: 2019
        }
      ]
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization | null>(null);

  const handleAddSpecialization = (data: any) => {
    // Add implementation
    setIsModalOpen(false);
  };

  const handleEditSpecialization = (data: any) => {
    // Add implementation
    setSelectedSpecialization(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Faculty Specializations</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Dilla University Law School - Faculty Expertise Directory
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add Faculty Specialization
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search faculty members..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <select className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2">
          <option value="all">All Departments</option>
          <option value="criminal">Criminal Law</option>
          <option value="civil">Civil Law</option>
          <option value="constitutional">Constitutional Law</option>
          <option value="commercial">Commercial Law</option>
        </select>
      </div>

      {/* Faculty Specializations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specializations.map((spec) => (
          <motion.div
            key={spec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {spec.facultyName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {spec.title} - {spec.department}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedSpecialization(spec)}
                    className="p-1 hover:text-primary-600"
                  >
                    <HiOutlinePencil className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium">Specialization</h4>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {spec.specialization}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-lg font-bold text-primary-600">
                    {spec.yearsOfExperience}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Years Exp.
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {spec.successRate}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Success Rate
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {spec.currentCases}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Active Cases
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Areas of Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {spec.expertise.map((area, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Education</h4>
                <div className="space-y-2">
                  {spec.education.map((edu, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{edu.degree}</div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {edu.institution}, {edu.year}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Cases: {spec.casesHandled}
                </div>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View Full Profile
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <SpecializationModal 
        isOpen={isModalOpen || !!selectedSpecialization}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSpecialization(null);
        }}
        onSubmit={selectedSpecialization ? handleEditSpecialization : handleAddSpecialization}
        initialData={selectedSpecialization}
      />
    </div>
  );
} 