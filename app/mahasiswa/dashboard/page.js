// app/mahasiswa/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { MahasiswaNavigation } from '@/components/Navigation';

export default function MahasiswaDashboard() {
  const [user, setUser] = useState(null);
  const [beasiswas, setBeasiswas] = useState([]);
  const [pendaftarans, setPendaftarans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifikasi, setNotifikasi] = useState([]);

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me');
        if (!response.ok) {
          throw new Error('Gagal mendapatkan data pengguna');
        }
        
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Gagal memuat data pengguna');
      }
    };

    // Fetch beasiswa aktif
    const fetchBeasiswas = async () => {
      try {
        const response = await fetch('/api/beasiswa?status=aktif');
        if (!response.ok) {
          throw new Error('Gagal mendapatkan data beasiswa');
        }
        
        const data = await response.json();
        setBeasiswas(data.data || []);
      } catch (error) {
        console.error('Error fetching beasiswas:', error);
        setError('Gagal memuat data beasiswa');
      }
    };

    // Fetch pendaftaran mahasiswa
    const fetchPendaftarans = async () => {
      try {
        const response = await fetch('/api/pendaftaran');
        if (!response.ok) {
          throw new Error('Gagal mendapatkan data pendaftaran');
        }
        
        const data = await response.json();
        setPendaftarans(data.data || []);
      } catch (error) {
        console.error('Error fetching pendaftarans:', error);
      }
    };

    // Fetch notifikasi
    const fetchNotifikasi = async () => {
      try {
        const response = await fetch('/api/notifikasi');
        if (!response.ok) {
          throw new Error('Gagal mendapatkan data notifikasi');
        }
        
        const data = await response.json();
        setNotifikasi(data.data || []);
      } catch (error) {
        console.error('Error fetching notifikasi:', error);
        // Tidak set error untuk notifikasi karena tidak terlalu kritis
      } finally {
        setLoading(false);
      }
    };

    Promise.all([
      fetchUserData(),
      fetchBeasiswas(),
      fetchPendaftarans(),
      fetchNotifikasi()
    ]);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <MahasiswaNavigation userName={user?.name} />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Format tanggal
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MahasiswaNavigation userName={user?.name} />
      
      <div className="container mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            <p>{error}</p>
          </div>
        )}
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Mahasiswa
          </h1>
          <p className="text-gray-600">
            Selamat datang di Sistem Informasi Beasiswa Online
          </p>
        </div>

        {/* Profil Mahasiswa */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Profil Mahasiswa
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Nama Lengkap</p>
                <p className="font-medium">{user?.name || '-'}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">NIM</p>
                <p className="font-medium">{user?.nim || '-'}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="font-medium">{user?.email || '-'}</p>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Fakultas</p>
                <p className="font-medium">{user?.fakultas || '-'}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Program Studi</p>
                <p className="font-medium">{user?.jurusan || '-'}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Tahun Masuk</p>
                <p className="font-medium">{user?.tahunMasuk || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ringkasan */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-blue-500 rounded-full mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-semibold text-blue-800">Beasiswa Aktif</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{beasiswas.length}</p>
            <p className="text-sm text-gray-600 mt-1">Beasiswa tersedia untuk didaftarkan</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-green-500 rounded-full mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-green-800">Pendaftaran</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{pendaftarans.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total pendaftaran beasiswa Anda</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-yellow-500 rounded-full mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="font-semibold text-yellow-800">Notifikasi</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{notifikasi.filter(n => !n.isRead).length}</p>
            <p className="text-sm text-gray-600 mt-1">Notifikasi belum dibaca</p>
          </div>
        </div>

        {/* Beasiswa Aktif */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Beasiswa Aktif
          </h2>
          
          {beasiswas.length === 0 ? (
            <p className="text-gray-600">Tidak ada beasiswa aktif saat ini</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Beasiswa
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min. IPK
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {beasiswas.map((beasiswa) => {
                    // Cek apakah sudah mendaftar
                    const isRegistered = pendaftarans.some(
                      (p) => p.beasiswaId === beasiswa.id
                    );
                    
                    return (
                      <tr key={beasiswa.id}>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {beasiswa.nama}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {beasiswa.deskripsi}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(beasiswa.tanggalTutup)}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {beasiswa.minIpk}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {isRegistered ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              Sudah Mendaftar
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Belum Mendaftar
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Notifikasi Terbaru */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Notifikasi Terbaru
          </h2>
          
          {notifikasi.length === 0 ? (
            <p className="text-gray-600">Tidak ada notifikasi saat ini</p>
          ) : (
            <div className="space-y-4">
              {notifikasi.slice(0, 5).map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-4 border rounded-lg ${notif.isRead ? 'bg-white' : 'bg-yellow-50'}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {notif.isRead ? (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {notif.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {notif.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(notif.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}