"use client";

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { HiOutlineX, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

interface SpecializationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const SpecializationModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}: SpecializationModalProps) => {
  const [formData, setFormData] = useState({
    facultyName: initialData?.facultyName || '',
    title: initialData?.title || '',
    department: initialData?.department || '',
    specialization: initialData?.specialization || '',
    description: initialData?.description || '',
    yearsOfExperience: initialData?.yearsOfExperience || 0,
    expertise: initialData?.expertise || [''],
    education: initialData?.education || [
      { degree: '', institution: '', year: new Date().getFullYear() }
    ]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addExpertise = () => {
    setFormData(prev => ({
      ...prev,
      expertise: [...prev.expertise, '']
    }));
  };

  const removeExpertise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: new Date().getFullYear() }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <HiOutlineX className="w-6 h-6" />
                </button>

                <Dialog.Title className="text-xl font-semibold mb-6">
                  {initialData ? 'Edit Faculty Specialization' : 'Add Faculty Specialization'}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Faculty Name</label>
                      <input
                        type="text"
                        value={formData.facultyName}
                        onChange={e => setFormData(prev => ({ ...prev, facultyName: e.target.value }))}
                        className="w-full rounded-lg border p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Academic Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full rounded-lg border p-2"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Department</label>
                      <select
                        value={formData.department}
                        onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full rounded-lg border p-2"
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="Criminal Law">Criminal Law</option>
                        <option value="Civil Law">Civil Law</option>
                        <option value="Constitutional Law">Constitutional Law</option>
                        <option value="Commercial Law">Commercial Law</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Years of Experience</label>
                      <input
                        type="number"
                        value={formData.yearsOfExperience}
                        onChange={e => setFormData(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) }))}
                        className="w-full rounded-lg border p-2"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Specialization and Description */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Specialization</label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={e => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                      className="w-full rounded-lg border p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full rounded-lg border p-2"
                      rows={3}
                      required
                    />
                  </div>

                  {/* Areas of Expertise */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">Areas of Expertise</label>
                      <button
                        type="button"
                        onClick={addExpertise}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <HiOutlinePlus className="w-5 h-5" />
                      </button>
                    </div>
                    {formData.expertise.map((expertise, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={expertise}
                          onChange={e => {
                            const newExpertise = [...formData.expertise];
                            newExpertise[index] = e.target.value;
                            setFormData(prev => ({ ...prev, expertise: newExpertise }));
                          }}
                          className="flex-1 rounded-lg border p-2"
                          placeholder="Enter area of expertise"
                          required
                        />
                        {formData.expertise.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExpertise(index)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <HiOutlineTrash className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Education */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">Education</label>
                      <button
                        type="button"
                        onClick={addEducation}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <HiOutlinePlus className="w-5 h-5" />
                      </button>
                    </div>
                    {formData.education.map((edu, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={e => {
                            const newEducation = [...formData.education];
                            newEducation[index] = { ...edu, degree: e.target.value };
                            setFormData(prev => ({ ...prev, education: newEducation }));
                          }}
                          className="rounded-lg border p-2"
                          placeholder="Degree"
                          required
                        />
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={e => {
                            const newEducation = [...formData.education];
                            newEducation[index] = { ...edu, institution: e.target.value };
                            setFormData(prev => ({ ...prev, education: newEducation }));
                          }}
                          className="rounded-lg border p-2"
                          placeholder="Institution"
                          required
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={edu.year}
                            onChange={e => {
                              const newEducation = [...formData.education];
                              newEducation[index] = { ...edu, year: parseInt(e.target.value) };
                              setFormData(prev => ({ ...prev, education: newEducation }));
                            }}
                            className="flex-1 rounded-lg border p-2"
                            placeholder="Year"
                            min="1900"
                            max={new Date().getFullYear()}
                            required
                          />
                          {formData.education.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEducation(index)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <HiOutlineTrash className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      {initialData ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SpecializationModal; 