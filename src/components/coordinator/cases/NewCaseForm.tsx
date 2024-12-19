"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineDocumentText,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineExclamationCircle,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineX
} from 'react-icons/hi';
import { FormField } from './FormField';
import { ReviewItem } from './ReviewItem';
import { format } from 'date-fns';

interface CaseFormData {
  // Client Information
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  
  // Location Details
  region?: string;
  zone?: string;
  wereda: string;
  kebele: string;
  houseNumber?: string;
  
  // Case Information
  caseType: string;
  caseDescription: string;
  caseDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  
  // Request & Response
  clientRequest: string;
  requestDetails: {
    questions: Array<{
      question: string;
      answer: string;
    }>;
    additionalNotes?: string;
  };
  
  documents: File[];
  tags: string[];
  assignedTo?: string;
  expectedResolutionDate?: string;
  documentNotes?: string;
  documentChecklist?: boolean[];
}

const caseTypes = [
  { value: 'CIVIL', label: 'Civil Case' },
  { value: 'CRIMINAL', label: 'Criminal Case' },
  { value: 'FAMILY', label: 'Family Law' },
  { value: 'PROPERTY', label: 'Property Dispute' },
  { value: 'LABOR', label: 'Labor Law' },
  { value: 'DIVORCE', label: 'Divorce' },
  { value: 'INHERITANCE', label: 'Inheritance' },
  { value: 'DOMESTIC_VIOLENCE', label: 'Domestic Violence' },
  { value: 'LAND_DISPUTE', label: 'Land Dispute' },
  { value: 'CONTRACT', label: 'Contract Related' },
  { value: 'OTHER', label: 'Other' }
];

const documentTypes = [
  'ID_CARD',
  'INCOME_PROOF',
  'RESIDENCE_PROOF',
  'COURT_DOCUMENTS',
  'WITNESS_STATEMENTS',
  'PROPERTY_DOCUMENTS',
  'MEDICAL_RECORDS',
  'POLICE_REPORT',
  'PREVIOUS_CASE_DOCUMENTS',
  'OTHER'
];

const documentCategories = [
  { value: 'IDENTIFICATION', label: 'Identification Documents' },
  { value: 'LEGAL', label: 'Legal Documents' },
  { value: 'EVIDENCE', label: 'Evidence Documents' },
  { value: 'WITNESS', label: 'Witness Statements' },
  { value: 'COURT', label: 'Court Documents' },
  { value: 'OTHER', label: 'Other Documents' }
];

export default function NewCaseForm() {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Initialize form data with all required fields
  const [formData, setFormData] = useState<CaseFormData>({
    clientName: '',
    clientPhone: '',
    clientAddress: '',
    caseType: '',
    caseDescription: '',
    caseDate: '',
    priority: 'MEDIUM',
    tags: [],
    documents: [],
    requestDetails: {
      questions: [],
      additionalNotes: ''
    }
  });

  // Set the date after component mounts
  useEffect(() => {
    setMounted(true);
    setFormData(prev => ({
      ...prev,
      caseDate: format(new Date(), 'yyyy-MM-dd')
    }));
  }, []);

  if (!mounted) {
    return null; // or a loading skeleton
  }

  const steps = [
    { number: 1, title: 'Client Information' },
    { number: 2, title: 'Location Details' },
    { number: 3, title: 'Case Details' },
    { number: 4, title: 'Request & Response' },
    { number: 5, title: 'Documents & Tags' },
    { number: 6, title: 'Review & Submit' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps before submitting
    for (let step = 1; step <= steps.length; step++) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        return;
      }
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'documents') {
          value.forEach((file: File) => {
            formDataToSend.append('documents', file);
          });
        } else if (key === 'tags') {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      const response = await fetch('/api/coordinator/cases', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to create case');
      }

      toast.success('Case created successfully');
      // Redirect to case list or case details
    } catch (error) {
      console.error('Error creating case:', error);
      toast.error('Failed to create case');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.clientName || !formData.clientPhone) {
          toast.error('Please fill in all required fields');
          return false;
        }
        return true;

      case 2:
        if (!formData.wereda || !formData.kebele) {
          toast.error('Wereda and Kebele are required');
          return false;
        }
        return true;

      case 3:
        if (!formData.caseType || !formData.caseDescription || !formData.caseDate) {
          toast.error('Please fill in all required fields');
          return false;
        }
        return true;

      case 4:
        if (!formData.clientRequest) {
          toast.error('Client request is required');
          return false;
        }
        if (formData.requestDetails?.questions?.some(qa => !qa.question || !qa.answer)) {
          toast.error('Please complete all questions and answers');
          return false;
        }
        return true;

      case 5:
        // Validate document types if any documents are uploaded
        if (formData.documents.length > 0 && !formData.documentTypes?.length) {
          toast.error('Please specify document types for uploaded files');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Client Name"
                required
                icon={HiOutlineUser}
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Enter client's full name"
              />

              <FormField
                label="Phone Number"
                required
                icon={HiOutlinePhone}
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                placeholder="+251 (91) 234-5678"
              />

              <div className="col-span-2">
                <FormField
                  label="Address"
                  icon={HiOutlineLocationMarker}
                  value={formData.clientAddress}
                  onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                  placeholder="Enter client's address"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Region</label>
                <select
                  value={formData.region || ''}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Region</option>
                  <option value="OROMIA">Oromia</option>
                  <option value="AMHARA">Amhara</option>
                  <option value="SNNPR">SNNPR</option>
                  {/* Add other regions */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Zone</label>
                <input
                  type="text"
                  value={formData.zone || ''}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter zone"
                />
              </div>

              <FormField
                label="Wereda"
                required
                value={formData.wereda || ''}
                onChange={(e) => setFormData({ ...formData, wereda: e.target.value })}
                placeholder="Enter wereda"
              />

              <FormField
                label="Kebele"
                required
                value={formData.kebele || ''}
                onChange={(e) => setFormData({ ...formData, kebele: e.target.value })}
                placeholder="Enter kebele"
              />

              <FormField
                label="House Number"
                value={formData.houseNumber || ''}
                onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                placeholder="Enter house number (optional)"
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Case Type</label>
                <select
                  value={formData.caseType}
                  onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                  className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select Case Type</option>
                  {caseTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Case Description</label>
                <textarea
                  value={formData.caseDescription}
                  onChange={(e) => setFormData({ ...formData, caseDescription: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe the case details..."
                  required
                />
              </div>

              <FormField
                label="Case Date"
                type="date"
                icon={HiOutlineCalendar}
                value={formData.caseDate}
                onChange={(e) => setFormData({ ...formData, caseDate: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as CaseFormData['priority'] })}
                  className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Client's Request</label>
                <textarea
                  value={formData.clientRequest || ''}
                  onChange={(e) => setFormData({ ...formData, clientRequest: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe the client's main request..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Questions & Answers</label>
                <div className="space-y-4">
                  {(formData.requestDetails?.questions || []).map((qa, index) => (
                    <div key={index} className="grid grid-cols-1 gap-3 p-4 border rounded-lg">
                      <div>
                        <label className="block text-xs font-medium mb-1">Question {index + 1}</label>
                        <input
                          type="text"
                          value={qa.question}
                          onChange={(e) => {
                            const newQuestions = [...(formData.requestDetails?.questions || [])];
                            newQuestions[index].question = e.target.value;
                            setFormData({
                              ...formData,
                              requestDetails: {
                                ...formData.requestDetails,
                                questions: newQuestions
                              }
                            });
                          }}
                          className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter question"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Answer</label>
                        <textarea
                          value={qa.answer}
                          onChange={(e) => {
                            const newQuestions = [...(formData.requestDetails?.questions || [])];
                            newQuestions[index].answer = e.target.value;
                            setFormData({
                              ...formData,
                              requestDetails: {
                                ...formData.requestDetails,
                                questions: newQuestions
                              }
                            });
                          }}
                          rows={2}
                          className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter answer"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newQuestions = [...(formData.requestDetails?.questions || [])];
                          newQuestions.splice(index, 1);
                          setFormData({
                            ...formData,
                            requestDetails: {
                              ...formData.requestDetails,
                              questions: newQuestions
                            }
                          });
                        }}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        requestDetails: {
                          ...formData.requestDetails,
                          questions: [
                            ...(formData.requestDetails?.questions || []),
                            { question: '', answer: '' }
                          ]
                        }
                      });
                    }}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Add Question & Answer
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Additional Notes</label>
                <textarea
                  value={formData.requestDetails?.additionalNotes || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    requestDetails: {
                      ...formData.requestDetails,
                      additionalNotes: e.target.value
                    }
                  })}
                  rows={3}
                  className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any additional notes about the request..."
                />
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Document Upload</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload relevant documents for the case. Supported formats: PDF, DOC, DOCX, JPG, PNG
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documentCategories.map((category) => (
                  <div 
                    key={category.value}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 
                      transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">{category.label}</h4>
                      <span className="text-sm text-gray-500">
                        {formData.documents.filter(doc => 
                          doc.category === category.value
                        ).length} files
                      </span>
                    </div>

                    <label className="relative flex flex-col items-center p-4 bg-gray-50 
                      border-2 border-dashed border-gray-300 rounded-lg cursor-pointer 
                      hover:bg-gray-100 transition-colors">
                      <HiOutlineDocumentText className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Drop files here or click to upload</span>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          const newDocuments = files.map(file => ({
                            file,
                            category: category.value,
                            uploadDate: new Date().toISOString(),
                            status: 'PENDING'
                          }));
                          setFormData(prev => ({
                            ...prev,
                            documents: [...prev.documents, ...newDocuments]
                          }));
                        }}
                      />
                    </label>

                    <div className="mt-4 space-y-2">
                      {formData.documents
                        .filter(doc => doc.category === category.value)
                        .map((doc, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-2 bg-white 
                              border border-gray-200 rounded-md"
                          >
                            <div className="flex items-center space-x-3">
                              <HiOutlineDocumentText className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {doc.file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  documents: prev.documents.filter((_, i) => i !== index)
                                }));
                              }}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <HiOutlineX className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Document Notes
                </label>
                <textarea
                  value={formData.documentNotes || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    documentNotes: e.target.value
                  }))}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Add any notes about the uploaded documents..."
                />
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Document Requirements</h4>
                <div className="space-y-3">
                  {[
                    'Valid identification document',
                    'Proof of residence',
                    'Case-related evidence',
                    'Witness statements (if applicable)',
                    'Previous case documents (if any)',
                    'Power of attorney (if applicable)'
                  ].map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.documentChecklist?.[index] || false}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            documentChecklist: {
                              ...prev.documentChecklist,
                              [index]: e.target.checked
                            }
                          }));
                        }}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 
                          border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`flex-1 ${step.number !== steps.length ? 'relative' : ''}`}
            >
              <div
                className={`h-1 ${
                  step.number <= currentStep ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              />
              <div className="absolute top-0 -ml-2">
                <div
                  className={`w-4 h-4 rounded-full ${
                    step.number <= currentStep ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                >
                  {step.number < currentStep && (
                    <HiOutlineCheck className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500">{step.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>

        <div className="flex justify-between pt-6 border-t">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="ml-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="ml-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Case'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}