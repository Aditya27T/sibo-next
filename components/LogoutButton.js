// components/LogoutButton.js
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton({ className }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      // Hapus state client-side jika ada
      if (typeof window !== 'undefined') {
        // Hapus localStorage jika menggunakan localStorage untuk penyimpanan tambahan
        localStorage.removeItem('user');
      }

      // Redirect ke login page
      router.push('/login');
      
      // Force refresh halaman untuk menghapus state dalam memori
      router.refresh();
      
      // Hard reload untuk memastikan state benar-benar bersih
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Logout error:', error);
      alert('Terjadi kesalahan saat logout. Silakan coba lagi.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className || "px-3 py-1 text-sm bg-white text-blue-700 rounded hover:bg-blue-100 transition"}
    >
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </button>
  );
}