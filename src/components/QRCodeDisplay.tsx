import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { generateQRCode } from '../utils/qrcode';
import { useLanguage } from '../contexts/LanguageContext';

interface QRCodeDisplayProps {
  data: string;
  title?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ data, title }) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const generateCode = async () => {
      try {
        const code = await generateQRCode(data);
        setQrCode(code);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    generateCode();
  }, [data]);

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = qrCode;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
      <div className="bg-white p-6 rounded-2xl shadow-lg inline-block">
        <img src={qrCode} alt="QR Code" className="w-64 h-64" />
      </div>
      <button
        onClick={downloadQRCode}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <Download className="w-4 h-4" />
        {t.view.downloadQR}
      </button>
    </div>
  );
};