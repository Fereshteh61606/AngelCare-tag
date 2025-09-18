import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-5 h-5 text-teal-500" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'fa')}
        className="bg-white/70 backdrop-blur-sm border border-teal-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all duration-200"
      >
        <option value="en">English</option>
        <option value="fa">فارسی</option>
      </select>
    </div>
  );
};