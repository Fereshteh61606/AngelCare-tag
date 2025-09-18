import QRCode from 'qrcode';

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    console.log('Generating QR code for:', data);
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1e40af',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    });
    console.log('QR code generated successfully');
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};