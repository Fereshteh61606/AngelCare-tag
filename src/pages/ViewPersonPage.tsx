import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Phone,  User, AlertCircle } from 'lucide-react';
import { PersonInfo } from '../types';
import { getPersonById, deletePersonById } from '../utils/storage';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { useLanguage } from '../contexts/LanguageContext';

export const ViewPersonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [person, setPerson] = useState<PersonInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPerson = async () => {
      if (id) {
        console.log('Loading person with ID:', id);
        try {
          const foundPerson = await getPersonById(id);
          console.log('Person data received:', foundPerson ? { id: foundPerson.id, name: foundPerson.name, lastName: foundPerson.lastName } : 'Not found');
          setPerson(foundPerson);
        } catch (error) {
          console.error('Error loading person:', error);
        }
      } else {
        console.error('No ID provided in URL');
      }
      setLoading(false);
    };

    loadPerson();
  }, [id]);

  const handleDelete = async () => {
    if (person && window.confirm('Are you sure you want to delete this person?')) {
      try {
        await deletePersonById(person.id);
        navigate('/list');
      } catch (error) {
        console.error('Error deleting person:', error);
        alert('Error deleting person. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-25 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-600"></div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-25 to-emerald-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Person Not Found</h1>
          <p className="text-slate-600 mb-6">The requested person information could not be found.</p>
          <p className="text-sm text-slate-500 mb-6">ID: {id}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const qrData = `${window.location.origin}/view/${person.id}`;
  console.log('QR Data generated:', qrData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-25 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/list"
              className="p-3 bg-white/70 backdrop-blur-sm rounded-xl hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className={`w-5 h-5 text-gray-600 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">{t.view.title}</h1>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="p-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-200 shadow-lg hover:shadow-xl border border-red-200"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-teal-600" />
                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t.form.name}</label>
                    <p className="text-lg font-semibold text-gray-800">{person.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t.form.lastName}</label>
                    <p className="text-lg font-semibold text-gray-800">{person.lastName}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">{t.form.personalCode}</label>
                  <p className="text-lg text-gray-800">{person.personalCode}</p>
                </div>
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Phone className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">{t.form.phoneNumber}</label>
                  <p className="text-lg text-gray-800">{person.phoneNumber}</p>
                </div>
                
                {person.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t.form.address}</label>
                    <p className="text-gray-800">{person.address}</p>
                  </div>
                )}
                
                {person.status && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t.form.status}</label>
                    <p className="text-gray-800">{person.status}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Medical & Emergency Info Card */}
            {(person.diseaseOrProblem || person.emergencyNote) && (
              <div className="bg-red-50/70 backdrop-blur-sm border-2 border-red-200 rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <h2 className="text-xl font-semibold text-red-800">{t.view.emergency}</h2>
                </div>
                
                <div className="space-y-4">
                  {person.diseaseOrProblem && (
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-1">{t.form.diseaseOrProblem}</label>
                      <p className="text-red-800">{person.diseaseOrProblem}</p>
                    </div>
                  )}
                  
                  {person.emergencyNote && (
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-1">{t.form.emergencyNote}</label>
                      <p className="text-red-800 font-semibold">{person.emergencyNote}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Info Card */}
            {person.additionalInfo && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.form.additionalInfo}</h2>
                <p className="text-gray-700">{person.additionalInfo}</p>
              </div>
            )}
          </div>

          {/* QR Code Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6">
            <QRCodeDisplay 
              data={qrData} 
              title={t.view.qrCode}
            />
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800">
                Share this QR code to allow others to quickly access this person's information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};