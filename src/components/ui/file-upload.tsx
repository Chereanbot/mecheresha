"use client";

import { useRef, useState } from 'react';
import { HiOutlineUpload, HiX } from 'react-icons/hi';

interface FileUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  className?: string;
}

export function FileUpload({ 
  value, 
  onChange, 
  multiple = false, 
  accept = ".pdf,.doc,.docx,.cv", 
  className = "" 
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = multiple ? [...value, ...newFiles] : newFiles;
      onChange(updatedFiles);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = value.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div 
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400"
        onClick={() => inputRef.current?.click()}
      >
        <HiOutlineUpload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click to upload CV or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            PDF, DOC, DOCX files accepted
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        multiple={multiple}
        accept={accept}
      />

      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((file, index) => (
            <li 
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <span className="text-sm truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <HiX className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 