// components/Navigation.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from './SessionProvider';
import SessionTimer from './SessionTimer';
import LogoutButton from './LogoutButton';

export function MahasiswaNavigation() {
  const pathname = usePathname();
  const { user } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link href="/mahasiswa/dashboard" className="font-bold text-xl">
              SIBO
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink href="/mahasiswa/dashboard" current={pathname === '/mahasiswa/dashboard'}>
              Dashboard
            </NavLink>
            <NavLink href="/mahasiswa/daftar" current={pathname === '/mahasiswa/daftar'}>
              Daftar Beasiswa
            </NavLink>
            <NavLink href="/mahasiswa/unggah" current={pathname === '/mahasiswa/unggah'}>
              Unggah Dokumen
            </NavLink>
            <NavLink href="/mahasiswa/status" current={pathname === '/mahasiswa/status'}>
              Status Pendaftaran
            </NavLink>
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            <div className="text-sm font-medium">
              Hi, {user?.name || 'Mahasiswa'}
            </div>
            <LogoutButton className="px-3 py-1 text-sm bg-white text-blue-700 rounded hover:bg-blue-100 transition" />
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden py-3 space-y-2 pb-4">
            <MobileNavLink
              href="/mahasiswa/dashboard"
              current={pathname === '/mahasiswa/dashboard'}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </MobileNavLink>
            <MobileNavLink
              href="/mahasiswa/daftar"
              current={pathname === '/mahasiswa/daftar'}
              onClick={() => setIsOpen(false)}
            >
              Daftar Beasiswa
            </MobileNavLink>
            <MobileNavLink
              href="/mahasiswa/unggah"
              current={pathname === '/mahasiswa/unggah'}
              onClick={() => setIsOpen(false)}
            >
              Unggah Dokumen
            </MobileNavLink>
            <MobileNavLink
              href="/mahasiswa/status"
              current={pathname === '/mahasiswa/status'}
              onClick={() => setIsOpen(false)}
            >
              Status Pendaftaran
            </MobileNavLink>
            <div className="flex items-center justify-between pt-2 border-t border-blue-500">
              <div className="text-sm font-medium pl-3">
                Hi, {user?.name || 'Mahasiswa'}
              </div>
              <LogoutButton className="px-3 py-1 text-sm bg-white text-blue-700 rounded hover:bg-blue-100 transition mr-2" />
            </div>
          </div>
        )}
      </div>
      
      {/* Session Timer */}
      <SessionTimer />
    </nav>
  );
}

export function AdminNavigation() {
  const pathname = usePathname();
  const { user } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="font-bold text-xl">
              SIBO Admin
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink href="/admin/dashboard" current={pathname === '/admin/dashboard'}>
              Dashboard
            </NavLink>
            <NavLink href="/admin/beasiswa" current={pathname === '/admin/beasiswa'}>
              Kelola Beasiswa
            </NavLink>
            <NavLink href="/admin/verifikasi" current={pathname === '/admin/verifikasi'}>
              Verifikasi
            </NavLink>
            <NavLink href="/admin/laporan" current={pathname === '/admin/laporan'}>
              Laporan
            </NavLink>
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            <div className="text-sm font-medium">
              Hi, {user?.name || 'Admin'}
            </div>
            <LogoutButton className="px-3 py-1 text-sm bg-white text-gray-800 rounded hover:bg-gray-100 transition" />
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden py-3 space-y-2 pb-4">
            <MobileNavLink
              href="/admin/dashboard"
              current={pathname === '/admin/dashboard'}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </MobileNavLink>
            <MobileNavLink
              href="/admin/beasiswa"
              current={pathname === '/admin/beasiswa'}
              onClick={() => setIsOpen(false)}
            >
              Kelola Beasiswa
            </MobileNavLink>
            <MobileNavLink
              href="/admin/verifikasi"
              current={pathname === '/admin/verifikasi'}
              onClick={() => setIsOpen(false)}
            >
              Verifikasi
            </MobileNavLink>
            <MobileNavLink
              href="/admin/laporan"
              current={pathname === '/admin/laporan'}
              onClick={() => setIsOpen(false)}
            >
              Laporan
            </MobileNavLink>
            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
              <div className="text-sm font-medium pl-3">
                Hi, {user?.name || 'Admin'}
              </div>
              <LogoutButton className="px-3 py-1 text-sm bg-white text-gray-800 rounded hover:bg-gray-100 transition mr-2" />
            </div>
          </div>
        )}
      </div>
      
      {/* Session Timer */}
      <SessionTimer />
    </nav>
  );
}

// Helper Components
function NavLink({ href, current, children }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        current
          ? 'bg-blue-700 text-white'
          : 'text-white hover:bg-blue-500 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, current, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-3 py-2 rounded-md text-base font-medium ${
        current ? 'bg-blue-700 text-white' : 'hover:bg-blue-500 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}