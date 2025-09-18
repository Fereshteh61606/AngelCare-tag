import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, QrCode, Eye, Trash2, Download, Printer, Shield } from 'lucide-react';
import { PersonInfo } from '../types';
import { getPersonsData, deletePersonById } from '../utils/storage';
import { useLanguage } from '../contexts/LanguageContext';
import { generateQRCode } from '../utils/qrcode';
import { useAdmin } from '../contexts/AdminContext';

export const PersonListPage: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { isAdmin } = useAdmin();
  const [persons, setPersons] = useState<PersonInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-25 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need admin privileges to view this page</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all duration-200"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const loadData = async () => {
      const data = await getPersonsData();
      setPersons(data);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deletePersonById(id).then(() => {
        setPersons(prev => prev.filter(person => person.id !== id));
      }).catch(error => {
        console.error('Error deleting person:', error);
        alert('Error deleting person. Please try again.');
      });
    }
  };

  const handlePrintQR = async (person: PersonInfo) => {
    try {
      const qrData = `${window.location.origin}/view/${person.id}`;
      console.log('Printing QR for:', qrData);
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
      console.log('Downloading QR for:', qrData);
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
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-25 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-25 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-3 bg-white/70 backdrop-blur-sm rounded-xl hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className={`w-5 h-5 text-gray-600 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">{t.list.title}</h1>
          </div>
          
          <div className="text-sm text-gray-600 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2">
            <strong>Admin View:</strong> All Users Data
          </div>
        </header>

        {/* List */}
        {persons.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <QrCode className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">{t.list.noData}</h2>
            <Link
              to="/add"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-teal-400 text-white font-semibold rounded-xl hover:from-green-500 hover:to-teal-500 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              {t.addPerson}
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {persons.map((person) => (
              <div
                key={person.id}
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {person.name} {person.lastName}
                      </h3>
                      {person.emergencyNote && (
                        <div className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium">
                          Emergency
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <p><span className="font-medium">{t.form.personalCode}:</span> {person.personalCode}</p>
                      <p><span className="font-medium">{t.form.phoneNumber}:</span> {person.phoneNumber}</p>
                      {person.status && <p><span className="font-medium">{t.form.status}:</span> {person.status}</p>}
                      <p><span className="font-medium">{t.list.createdAt}:</span> {new Date(person.createdAt).toLocaleDateString()}</p>
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
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Eye className="w-4 h-4" />
                      {t.view.title}
                    </Link>
                    
                    <button
                      onClick={() => handlePrintQR(person)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      title="Print QR Code"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDownloadQR(person)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-medium rounded-xl hover:from-sky-600 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      title="Download QR Code"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(person.id, `${person.name} ${person.lastName}`)}
                      className="p-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-200 shadow-lg hover:shadow-xl border border-red-200"
                      title="Delete Person"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};