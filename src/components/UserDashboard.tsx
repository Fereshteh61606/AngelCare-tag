import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, QrCode, Eye, Download, Printer, User, Lock } from 'lucide-react';
import { PersonInfo } from '../types';
import { getPersonsData } from '../utils/storage';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import { LanguageSelector } from './LanguageSelector';
import { generateQRCode } from '../utils/qrcode';

export const UserDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { login } = useAdmin();
  const [userPersons, setUserPersons] = useState<PersonInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      // For now, we'll show all data to users. In a real app, you'd filter by user ID
      const data = await getPersonsData();
      setUserPersons(data);
      setLoading(false);
    };

    loadUserData();
  }, []);

  const handlePrintQR = async (person: PersonInfo) => {
    try {
      const qrData = `${window.location.origin}/view/${person.id}`;
      console.log('User printing QR for:', qrData);
      const qrCodeDataURL = await generateQRCode(qrData);
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>QR Code - ${person.name} ${person.lastName}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  text-align: center; 
                  padding: 20px;
                  margin: 0;
                }
                .qr-container {
                  border: 2px solid #333;
                  padding: 20px;
                  margin: 20px auto;
                  max-width: 400px;
                  border-radius: 10px;
                }
                .qr-code {
                  width: 200px;
                  height: 200px;
                  margin: 20px auto;
                }
                .person-info {
                  margin: 20px 0;
                  font-size: 18px;
                  font-weight: bold;
                }
                .instructions {
                  font-size: 14px;
                  color: #666;
                  margin-top: 20px;
                }
                @media print {
                  body { margin: 0; }
                  .qr-container { border: 2px solid #000; }
                }
              </style>
            </head>
            <body>
              <div class="qr-container">
                <div class="person-info">${person.name} ${person.lastName}</div>
                <img src="${qrCodeDataURL}" alt="QR Code" class="qr-code" />
                <div class="instructions">
                  Scan this QR code to view personal information
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    } catch (error) {
      console.error('Error generating QR code for printing:', error);
      alert('Error generating QR code for printing');
    }
  };

  const handleDownloadQR = async (person: PersonInfo) => {
    try {
      const qrData = `${window.location.origin}/view/${person.id}`;
      console.log('User downloading QR for:', qrData);
      const qrCodeDataURL = await generateQRCode(qrData);
      
      const link = document.createElement('a');
      link.download = `qr-${person.name}-${person.lastName}-${Date.now()}.png`;
      link.href = qrCodeDataURL;
      link.click();
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Error downloading QR code');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(adminPassword);
    if (!success) {
      setAdminError('Invalid password');
      setAdminPassword('');
    } else {
      setShowAdminLogin(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <QrCode className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">Personal QR Information</h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <button
              onClick={() => setShowAdminLogin(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-gray-700 text-white font-medium rounded-xl hover:from-slate-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Lock className="w-4 h-4" />
              Admin Access
            </button>
          </div>
        </header>

        {/* Admin Login Modal */}
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Admin Access</h2>
                <p className="text-slate-600 mt-2">Enter admin password to view all patient data</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setAdminError('');
                  }}
                  placeholder="Admin Password"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200 text-slate-700"
                  required
                />

                {adminError && (
                  <p className="text-red-500 text-sm text-center">{adminError}</p>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminLogin(false);
                      setAdminPassword('');
                      setAdminError('');
                    }}
                    className="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-800 text-center">
                  <strong>Admin Password Required</strong>
                </p>
                <p className="text-xs text-blue-600 text-center mt-1">
                  Contact administrator for access
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Welcome to Your Personal QR System</h2>
          <p className="text-lg text-slate-600 mb-8">Add your information and get your personal QR code</p>
          
          <Link
            to="/add"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            {t.addPerson}
          </Link>
        </div>

        {/* User's Information */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Your Information</h3>
          
          {userPersons.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-12 h-12 text-slate-400" />
              </div>
              <h4 className="text-xl font-semibold text-slate-600 mb-4">No information added yet</h4>
              <p className="text-slate-500 mb-6">Add your personal information to get started</p>
              <Link
                to="/add"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                {t.addPerson}
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {userPersons.map((person) => (
                <div
                  key={person.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 border border-white/50"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-2xl font-bold text-slate-800">
                          {person.name} {person.lastName}
                        </h4>
                        {person.emergencyNote && (
                          <div className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium">
                            Emergency
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                        <p><span className="font-medium">{t.form.personalCode}:</span> {person.personalCode}</p>
                        <p><span className="font-medium">{t.form.phoneNumber}:</span> {person.phoneNumber}</p>
                        {person.status && <p><span className="font-medium">{t.form.status}:</span> {person.status}</p>}
                        <p><span className="font-medium">Created:</span> {new Date(person.createdAt).toLocaleDateString()}</p>
                      </div>
                      
                      {person.diseaseOrProblem && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700">
                            <span className="font-medium">{t.form.diseaseOrProblem}:</span> {person.diseaseOrProblem}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to={`/view/${person.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                      
                      <button
                        onClick={() => handlePrintQR(person)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        title="Print My QR Code"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDownloadQR(person)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        title="Download My QR Code"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-800 mb-3">How to use your QR code:</h4>
            <ul className="text-blue-700 space-y-2 text-sm list-disc list-inside">
              <li>• Print or download your QR code</li>
              <li>• Keep it with you for emergency situations</li>
              <li>• Anyone can scan it to see your information</li>
              <li>• Medical information is highlighted for emergencies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};