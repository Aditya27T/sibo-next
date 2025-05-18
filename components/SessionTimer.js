// components/SessionTimer.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from './SessionProvider';

export default function SessionTimer() {
  const { remainingTime, extendSession } = useSession();
  const [showWarning, setShowWarning] = useState(false);
  
  // Tampilkan peringatan jika waktu tersisa kurang dari 5 menit
  useEffect(() => {
    if (remainingTime !== null && remainingTime <= 5) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [remainingTime]);
  
  if (!showWarning) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-300 rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Sesi akan berakhir
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              {remainingTime === 0 
                ? 'Sesi Anda telah berakhir. Silakan login kembali.' 
                : `Sesi Anda akan berakhir dalam ${remainingTime} menit.`
              }
            </p>
          </div>
          <div className="mt-3">
            <button
              onClick={extendSession}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Perpanjang Sesi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}