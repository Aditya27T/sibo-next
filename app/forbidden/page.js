// components/SessionProvider.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Context untuk menyimpan informasi session
const SessionContext = createContext(null);

// Public routes that don't need authentication
const publicRoutes = ['/', '/login', '/register', '/forbidden'];

export function SessionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);

  // Fungsi untuk memeriksa apakah current path adalah public route
  const isPublicRoute = () => {
    return publicRoutes.some(route => pathname === route);
  };

  // Fungsi untuk memeriksa session pada client-side
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/users/me');
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.user) {
            setUser(data.user);
            
            // Get session expiry from cookie
            const expiryCookie = document.cookie
              .split('; ')
              .find(row => row.startsWith('sessionExpiry='));
              
            if (expiryCookie) {
              const expiryValue = decodeURIComponent(expiryCookie.split('=')[1]);
              setSessionExpiry(new Date(expiryValue));
            }
          } else {
            // No user or session expired
            setUser(null);
            
            // If not on a public route, redirect to login
            if (!isPublicRoute()) {
              router.push('/login');
            }
          }
        } else {
          // Error response, likely 401
          setUser(null);
          
          // If not on a public route, redirect to login
          if (!isPublicRoute()) {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
        
        // If not on a public route, redirect to login
        if (!isPublicRoute()) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [pathname, router]);

  // Hitung waktu tersisa dari session
  useEffect(() => {
    if (!sessionExpiry) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeLeft = sessionExpiry - now;
      
      if (timeLeft <= 0) {
        // Session expired
        setRemainingTime(0);
        setUser(null);
        clearInterval(interval);
        
        // If not on a public route, redirect to login
        if (!isPublicRoute()) {
          router.push('/login?expired=true');
        }
      } else {
        // Calculate remaining time in minutes
        setRemainingTime(Math.floor(timeLeft / 60000));
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [sessionExpiry, router, pathname]);

  // Fungsi untuk logout
  const logout = async () => {
    try {
      const response = await fetch('/api/users/logout', {
        method: 'POST',
      });
      
      setUser(null);
      
      if (response.ok) {
        // Redirect to login page
        router.push('/login');
        
        // Force client-side navigation to refresh the page
        window.location.href = '/login';
      } else {
        console.error('Logout failed:', await response.text());
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout. Please try again.');
    }
  };

  // Fungsi untuk memperpanjang session
  const extendSession = async () => {
    try {
      const response = await fetch('/api/users/extend-session', {
        method: 'POST',
      });
      
      if (response.ok) {
        // Refresh page to get new session cookies
        window.location.reload();
      } else {
        console.error('Failed to extend session:', await response.text());
        alert('Failed to extend session. Please login again.');
        logout();
      }
    } catch (error) {
      console.error('Extend session error:', error);
      alert('An error occurred while trying to extend your session. Please login again.');
      logout();
    }
  };

  return (
    <SessionContext.Provider 
      value={{ 
        user, 
        loading, 
        remainingTime, 
        logout, 
        extendSession 
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

// Hook untuk menggunakan context session
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}