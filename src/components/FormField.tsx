import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  type?: 'text' | 'tel' | 'textarea';
  placeholder?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
  error,
  type = 'text',
  placeholder,
}) => {
  const { isRTL } = useLanguage();

  const inputClasses = `
    w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 rounded-xl 
    focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent 
    transition-all duration-200 text-gray-700 placeholder-gray-400
    ${error ? 'border-red-300' : 'border-teal-200'}
    ${isRTL ? 'text-right' : 'text-left'}
  `;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={inputClasses + ' resize-none'}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};