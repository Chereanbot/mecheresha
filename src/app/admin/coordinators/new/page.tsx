"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CoordinatorFormService } from '@/services/coordinator/CoordinatorFormService';
import { CoordinatorType, CoordinatorStatus } from '@/types/coordinator';
import { HiOutlineOfficeBuilding, HiOutlineUser, HiOutlineCalendar, HiOutlineBriefcase, HiOutlineMail, HiOutlinePhone, HiOutlineLockClosed } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

interface FormData {
  // User Info
  fullName: string;
  email: string;
  phone: string;
  password: string;

  // Coordinator Info
  type: CoordinatorType;
  officeId: string;
  startDate: string;
  endDate?: string;
  specialties: string[];
  status: CoordinatorStatus;

  // Additional Fields
  qualifications: Array<{
    type: string;
    title: string;
    institution: string;
    dateObtained: string;
    expiryDate?: string;
    score?: number;
  }>;
}

interface Office {
  id: string;
  name: string;
  location: string;
  isFull: boolean;
}

const formStyles = {
  container: "max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg",
  header: "border-b dark:border-gray-700 pb-4",
  sectionHeader: "flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4",
  formGrid: "grid grid-cols-1 md:grid-cols-2 gap-6",
  inputGroup: "space-y-2",
  label: "block text-sm font-medium text-gray-700 dark:text-gray-300",
  input: `w-full rounded-lg border-gray-300 dark:border-gray-600 
    dark:bg-gray-700 shadow-sm 
    focus:border-primary-500 focus:ring-primary-500
    transition-colors duration-200
    placeholder:text-gray-400 dark:placeholder:text-gray-500`,
  inputWithIcon: `w-full rounded-lg border-gray-300 dark:border-gray-600 
    dark:bg-gray-700 shadow-sm pl-10
    focus:border-primary-500 focus:ring-primary-500
    transition-colors duration-200`,
  inputWrapper: "relative",
  inputIcon: `absolute left-3 top-1/2 transform -translate-y-1/2 
    text-gray-400 dark:text-gray-500`,
  inputError: `border-red-300 dark:border-red-600 
    focus:border-red-500 focus:ring-red-500`,
  inputSuccess: `border-green-300 dark:border-green-600 
    focus:border-green-500 focus:ring-green-500`,
  helperText: "text-xs mt-1",
  errorText: "text-red-500 dark:text-red-400",
  successText: "text-green-500 dark:text-green-400",
  requiredStar: "text-red-500 dark:text-red-400 ml-1",
  select: "w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500",
  button: {
    primary: "px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
    secondary: "px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
    danger: "px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
  }
};

const InputWithIcon = ({ 
  icon: Icon, 
  label, 
  required, 
  error, 
  success, 
  helperText,
  ...props 
}: { 
  icon: any;
  label: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  helperText?: React.ReactNode;
  [key: string]: any;
}) => (
  <div className={formStyles.inputGroup}>
    <label className={formStyles.label}>
      {label}
      {required && <span className={formStyles.requiredStar}>*</span>}
    </label>
    <div className={formStyles.inputWrapper}>
      <Icon className={formStyles.inputIcon} />
      <input
        {...props}
        className={`${formStyles.inputWithIcon} 
          ${error ? formStyles.inputError : ''} 
          ${success ? formStyles.inputSuccess : ''}`}
      />
    </div>
    {typeof helperText === 'string' ? (
      <p className={`${formStyles.helperText} 
        ${error ? formStyles.errorText : 
          success ? formStyles.successText : 'text-gray-500'}`}>
        {helperText}
      </p>
    ) : (
      helperText
    )}
    {error && (
      <p className={`${formStyles.helperText} ${formStyles.errorText}`}>
        {error}
      </p>
    )}
  </div>
);

const AddCoordinatorPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    type: CoordinatorType.PERMANENT,
    officeId: '',
    startDate: '',
    endDate: '',
    specialties: [],
    status: CoordinatorStatus.PENDING,
    qualifications: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offices, setOffices] = useState<Office[]>([]);
  const [officeError, setOfficeError] = useState<string | null>(null);

  const service = new CoordinatorFormService();

  const fetchOffices = async () => {
    try {
      const response = await fetch('/api/offices');
      const data = await response.json();
      setOffices(data);
    } catch (error) {
      console.error('Failed to fetch offices:', error);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  const validateForm = (): boolean => {
    // Required fields validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (!Object.values(passwordStrength).every(v => v)) {
      setError('Password does not meet the requirements');
      return false;
    }

    // Phone validation (if provided)
    if (formData.phone) {
      const phoneRegex = /^\+\d{1,3}\s?\d{9,}$/;
      if (!phoneRegex.test(formData.phone)) {
        setError('Please enter a valid phone number with country code');
        return false;
      }
    }

    // Type and Office validation
    if (!formData.type || !formData.officeId) {
      setError('Please select both Type and Office');
      return false;
    }

    // Start date validation
    if (!formData.startDate) {
      setError('Please select a start date');
      return false;
    }

    // End date validation for project-based coordinators
    if (formData.type === CoordinatorType.PROJECT_BASED && !formData.endDate) {
      setError('Please select an end date for project-based coordinator');
      return false;
    }

    // Specialties validation
    if (formData.specialties.length === 0) {
      setError('Please select at least one specialty');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // First validate the form data
      const validation = await service.validateCoordinator(formData);
      if (!validation.valid) {
        setError(Object.values(validation.errors || {}).join(', '));
        return;
      }

      // Create the coordinator
      const response = await service.createCoordinator({
        ...formData,
        status: CoordinatorStatus.PENDING, // Set initial status
        specialties: formData.specialties.filter(Boolean), // Remove empty values
        qualifications: formData.qualifications.filter(q => q.type && q.title), // Only include complete qualifications
      });

      if (response.success) {
        // Show success message
        toast.success('Coordinator created successfully');
        // Redirect to coordinators list
        router.push('/admin/coordinators');
      } else {
        setError(response.message || 'Failed to create coordinator');
      }
    } catch (error) {
      console.error('Coordinator creation error:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while creating the coordinator'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddQualification = () => {
    setFormData(prev => ({
      ...prev,
      qualifications: [
        ...prev.qualifications,
        {
          type: '',
          title: '',
          institution: '',
          dateObtained: '',
          expiryDate: '',
          score: undefined
        }
      ]
    }));
  };

  const handleRemoveQualification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  const handleQualificationChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    number: false,
    special: false,
    uppercase: false
  });

  const validatePassword = (password: string) => {
    setPasswordStrength({
      length: password.length >= 8,
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      uppercase: /[A-Z]/.test(password)
    });
  };

  const PasswordStrengthIndicator = ({ strength }: { strength: typeof passwordStrength }) => (
    <div className="space-y-2 mt-2">
      <div className="flex gap-2">
        {Object.entries(strength).map(([key, valid]) => (
          <div
            key={key}
            className={`h-1 flex-1 rounded-full ${
              valid ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
      <ul className="space-y-1 text-xs">
        <li className={`${strength.length ? 'text-green-500' : 'text-gray-500'}`}>
          ✓ At least 8 characters
        </li>
        <li className={`${strength.number ? 'text-green-500' : 'text-gray-500'}`}>
          ✓ Contains a number
        </li>
        <li className={`${strength.special ? 'text-green-500' : 'text-gray-500'}`}>
          ✓ Contains a special character
        </li>
        <li className={`${strength.uppercase ? 'text-green-500' : 'text-gray-500'}`}>
          ✓ Contains an uppercase letter
        </li>
      </ul>
    </div>
  );

  const handleOfficeChange = async (officeId: string) => {
    try {
      const availability = await service.checkOfficeAvailability(officeId);
      
      if (!availability.available) {
        setOfficeError(`This office has reached its maximum capacity of ${availability.maxAllowed} coordinators`);
        return;
      }

      setOfficeError(null);
      setFormData(prev => ({
        ...prev,
        officeId
      }));
    } catch (error) {
      setOfficeError('Failed to check office availability');
    }
  };

  return (
    <div className={formStyles.container}>
      <div className={formStyles.header}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Add New Coordinator
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Create a new coordinator account with their details and qualifications.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Personal Information Section */}
        <section>
          <h2 className={formStyles.sectionHeader}>
            <HiOutlineUser className="w-5 h-5 mr-2 text-primary-500" />
            Personal Information
          </h2>
          <div className={formStyles.formGrid}>
            <InputWithIcon
              icon={HiOutlineUser}
              label="Full Name"
              required
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                fullName: e.target.value
              }))}
              placeholder="John Doe"
              helperText="Enter your legal full name"
            />

            <InputWithIcon
              icon={HiOutlineMail}
              label="Email"
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))}
              placeholder="john.doe@example.com"
              helperText="Work email address"
            />

            <InputWithIcon
              icon={HiOutlinePhone}
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                phone: e.target.value
              }))}
              placeholder="+251 (91) 234-5678"
              helperText="Include country code"
            />

            <InputWithIcon
              icon={HiOutlineLockClosed}
              label="Initial Password"
              required
              type="password"
              value={formData.password}
              onChange={(e) => {
                const newPassword = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  password: newPassword
                }));
                validatePassword(newPassword);
              }}
              placeholder="••••••••"
              helperText={
                <PasswordStrengthIndicator strength={passwordStrength} />
              }
              error={
                formData.password && 
                Object.values(passwordStrength).some(v => !v) ? 
                "Password does not meet all requirements" : undefined
              }
              success={formData.password && Object.values(passwordStrength).every(v => v)}
            />
          </div>
        </section>

        {/* Employment Details Section */}
        <section>
          <h2 className={formStyles.sectionHeader}>
            <HiOutlineBriefcase className="w-5 h-5 mr-2 text-primary-500" />
            Employment Details
          </h2>
          <div className={formStyles.formGrid}>
            <div className={formStyles.inputGroup}>
              <label className={formStyles.label}>Type</label>
              <select
                required
                className={formStyles.select}
                value={formData.type}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  type: e.target.value as CoordinatorType
                }))}
              >
                <option value="">Select Type</option>
                {Object.values(CoordinatorType).map(type => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className={formStyles.inputGroup}>
              <label className={formStyles.label}>Office Location</label>
              <select
                required
                className={`${formStyles.select} ${officeError ? 'border-red-500' : ''}`}
                value={formData.officeId}
                onChange={(e) => handleOfficeChange(e.target.value)}
              >
                <option value="">Select Office</option>
                {offices.map(office => (
                  <option 
                    key={office.id} 
                    value={office.id}
                    disabled={office.isFull}
                  >
                    {office.name} {office.isFull ? '(Full)' : ''}
                  </option>
                ))}
              </select>
              {officeError && (
                <p className="text-red-500 text-sm mt-1">{officeError}</p>
              )}
            </div>

            <div className={formStyles.inputGroup}>
              <label className={formStyles.label}>Specialties</label>
              <select
                multiple
                className={`${formStyles.select} h-32`}
                value={formData.specialties}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData(prev => ({
                    ...prev,
                    specialties: values
                  }));
                }}
              >
                <option value="FAMILY_LAW">Family Law</option>
                <option value="CORPORATE_LAW">Corporate Law</option>
                <option value="CRIMINAL_LAW">Criminal Law</option>
                <option value="CIVIL_LAW">Civil Law</option>
                <option value="IMMIGRATION">Immigration</option>
                <option value="REAL_ESTATE">Real Estate</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Hold Ctrl/Cmd to select multiple specialties
              </p>
            </div>

            <div className="space-y-4">
              <div className={formStyles.inputGroup}>
                <label className={formStyles.label}>Start Date</label>
                <input
                  type="date"
                  required
                  className={formStyles.input}
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    startDate: e.target.value
                  }))}
                />
              </div>

              {formData.type === CoordinatorType.PROJECT_BASED && (
                <div className={formStyles.inputGroup}>
                  <label className={formStyles.label}>End Date</label>
                  <input
                    type="date"
                    className={formStyles.input}
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      endDate: e.target.value
                    }))}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Qualifications Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className={formStyles.sectionHeader}>
              <HiOutlineCalendar className="w-5 h-5 mr-2 text-primary-500" />
              Qualifications
            </h2>
            <button
              type="button"
              onClick={handleAddQualification}
              className={formStyles.button.primary}
            >
              Add Qualification
            </button>
          </div>

          {formData.qualifications.map((qualification, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-4">
              <div className={formStyles.formGrid}>
                <div className={formStyles.inputGroup}>
                  <label className={formStyles.label}>Type</label>
                  <select
                    className={formStyles.select}
                    value={qualification.type}
                    onChange={(e) => handleQualificationChange(index, 'type', e.target.value)}
                  >
                    <option value="">Select Type</option>
                    <option value="EDUCATION">Education</option>
                    <option value="CERTIFICATION">Certification</option>
                    <option value="TRAINING">Training</option>
                  </select>
                </div>

                <div className={formStyles.inputGroup}>
                  <label className={formStyles.label}>Title</label>
                  <input
                    type="text"
                    className={formStyles.input}
                    value={qualification.title}
                    onChange={(e) => handleQualificationChange(index, 'title', e.target.value)}
                  />
                </div>

                <div className={formStyles.inputGroup}>
                  <label className={formStyles.label}>Institution</label>
                  <input
                    type="text"
                    className={formStyles.input}
                    value={qualification.institution}
                    onChange={(e) => handleQualificationChange(index, 'institution', e.target.value)}
                  />
                </div>

                <div className={formStyles.inputGroup}>
                  <label className={formStyles.label}>Date Obtained</label>
                  <input
                    type="date"
                    className={formStyles.input}
                    value={qualification.dateObtained}
                    onChange={(e) => handleQualificationChange(index, 'dateObtained', e.target.value)}
                  />
                </div>

                <div className={formStyles.inputGroup}>
                  <label className={formStyles.label}>Score (if applicable)</label>
                  <input
                    type="number"
                    step="0.01"
                    className={formStyles.input}
                    value={qualification.score || ''}
                    onChange={(e) => handleQualificationChange(index, 'score', parseFloat(e.target.value))}
                  />
                </div>

                <div className="flex justify-end col-span-full">
                  <button
                    type="button"
                    onClick={() => handleRemoveQualification(index)}
                    className={formStyles.button.danger}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="flex justify-end space-x-4 pt-6 border-t dark:border-gray-700">
          <button
            type="button"
            className={formStyles.button.secondary}
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${formStyles.button.primary} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              'Create Coordinator'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCoordinatorPage; 