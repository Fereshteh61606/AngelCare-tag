import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, QrCode, Shield, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { useAdmin } from '../contexts/AdminContext';
import { UserDashboard } from '../components/UserDashboard';
import { AdminLogin } from '../components/AdminLogin';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { isAdmin, logout } = useAdmin();
  const [showAdminLogin, setShowAdminLogin] = React.useState(false);

  // Show admin login if requested
  if (showAdminLogin && !isAdmin) {
    return <AdminLogin />;
  }

  // Show user dashboard for regular users
  if (!showAdminLogin && !isAdmin) {
    return <UserDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-25 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <QrCode className="w-8 h-8 text-teal-600" />
            <h1 className="text-2xl font-bold text-gray-800">QR Info - Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 border border-red-200"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Healthcare Admin Dashboard
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Securely manage patient information and print QR codes for easy access
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/list"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-2xl hover:from-teal-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[200px]"
            >
              <Users className="w-5 h-5" />
              View All Patients
            </Link>

            <button
              onClick={() => setShowAdminLogin(false)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[200px]"
            >
              <Shield className="w-5 h-5" />
              Patient View
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Patient Management</h3>
            <p className="text-gray-600">Securely view and manage all patient information</p>
          </div>

          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">QR Code Printing</h3>
            <p className="text-gray-600">Print and distribute QR codes for patient access</p>
          </div>

          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Access</h3>
            <p className="text-gray-600">Protected admin panel with healthcare-grade security</p>
          </div>
        </div>

        {/* Admin Instructions */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Healthcare Admin Instructions</h3>
            <div className="grid md:grid-cols-2 gap-6 text-blue-700">
              <div>
                <h4 className="font-semibold mb-2">Patient Data Management:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• View all patient information securely</li>
                  <li>• Print QR codes for patient distribution</li>
                  <li>• Download QR codes as image files</li>
                  <li>• Manage patient records safely</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Patient Experience:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Patients can only see their own data</li>
                  <li>• Patients can add their information privately</li>
                  <li>• Patients can print their own QR codes</li>
                  <li>• QR codes work for emergency access</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Access Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAdminLogin(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-700 text-white font-medium rounded-xl hover:from-slate-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Lock className="w-4 h-4" />
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};