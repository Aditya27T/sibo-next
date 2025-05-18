// app/admin/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { AdminNavigation } from '@/components/Navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [beasiswas, setBeasiswas] = useState([]);
  const [pendaftarans, setPendaftarans] = useState([]);
  const [dokumens, setDokumens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalMahasiswa: 0,
    totalBeasiswa: 0,
    pendaftaranMenunggu: 0,
    pendaftaranDiterima: 0,
    pendaftaranDitolak: 0,
    dokumenMenunggu: 0
  });

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

    // Fetch beasiswa
    const fetchBeasiswas = async () => {
      try {
        const response = await fetch('/api/beasiswa');
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

    // Fetch pendaftaran
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

    // Fetch dokumen
    const fetchDokumens = async () => {
      try {
        const response = await fetch('/api/dokumen');
        if (!response.ok) {
          throw new Error('Gagal mendapatkan data dokumen');
        }
        
        const data = await response.json();
        setDokumens(data.data || []);
      } catch (error) {
        console.error('Error fetching dokumens:', error);
        setError('Gagal memuat data dokumen');
      }
    };

    // Fetch mahasiswa stats
    const fetchMahasiswaStats = async () => {
      try {
        const response = await fetch('/api/users/stats');
        if (!response.ok) {
          throw new Error('Gagal mendapatkan statistik mahasiswa');
        }
        
        const data = await response.json();
        setStats(prev => ({
          ...prev,
          totalMahasiswa: data.totalMahasiswa || 0
        }));
      } catch (error) {
        console.error('Error fetching mahasiswa stats:', error);
      } finally {
        setLoading(false);
      }
    };

    Promise.all([
      fetchUserData(),
      fetchBeasiswas(),
      fetchPendaftarans(),
      fetchDokumens(),
      fetchMahasiswaStats()
    ]);
  }, []);

  useEffect(() => {
    // Calculate stats from fetched data
    if (beasiswas.length > 0) {
      setStats(prev => ({
        ...prev,
        totalBeasiswa: beasiswas.length
      }));
    }

    if (pendaftarans.length > 0) {
      const menunggu = pendaftarans.filter(p => p.status === 'menunggu').length;
      const diterima = pendaftarans.filter(p => p.status === 'diterima').length;
      const ditolak = pendaftarans.filter(p => p.status === 'ditolak').length;
      
      setStats(prev => ({
        ...prev,
        pendaftaranMenunggu: menunggu,
        pendaftaranDiterima: diterima,
        pendaftaranDitolak: ditolak
      }));
    }

    if (dokumens.length > 0) {
      const dokumenMenunggu = dokumens.filter(d => d.status === 'menunggu').length;
      
      setStats(prev => ({
        ...prev,
        dokumenMenunggu
      }));
    }
  }, [beasiswas, pendaftarans, dokumens]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminNavigation userName={user?.name} />
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
      <AdminNavigation userName={user?.name} />
      
      <div className="container mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            <p>{error}</p>
          </div>
        )}
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Admin
          </h1>
          <p className="text-gray-600">
            Selamat datang di Panel Admin SIBO
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-blue-500 rounded-full mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-700">Mahasiswa</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalMahasiswa}</p>
            <p className="text-sm text-gray-600 mt-1">Total mahasiswa terdaftar</p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-green-500 rounded-full mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-700">Beasiswa</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalBeasiswa}</p>
            <p className="text-sm text-gray-600 mt-1">Program beasiswa</p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-yellow-500 rounded-full mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-700">Menunggu Verifikasi</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.pendaftaranMenunggu}</p>
            <p className="text-sm text-gray-600 mt-1">Pendaftaran belum diverifikasi</p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-purple-500 rounded-full mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-700">Dokumen</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.dokumenMenunggu}</p>
            <p className="text-sm text-gray-600 mt-1">Dokumen menunggu verifikasi</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Link 
            href="/admin/verifikasi" 
            className="bg-white shadow rounded-lg p-6 flex items-center hover:bg-blue-50 transition"
          >
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Verifikasi Pendaftaran</h3>
              <p className="text-gray-600">Tinjau dan verifikasi pendaftaran beasiswa mahasiswa</p>
            </div>
          </Link>
          
          <Link 
            href="/admin/beasiswa" 
            className="bg-white shadow rounded-lg p-6 flex items-center hover:bg-green-50 transition"
          >
            <div className="p-3 bg-green-100 rounded-full mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Tambah Beasiswa</h3>
              <p className="text-gray-600">Buat dan kelola program beasiswa baru</p>
            </div>
          </Link>
        </div>

        {/* Pendaftaran Terbaru */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Pendaftaran Terbaru
            </h2>
            <Link 
              href="/admin/verifikasi" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Lihat semua
            </Link>
          </div>
          
          {pendaftarans.length === 0 ? (
            <p className="text-gray-600">Belum ada pendaftaran beasiswa</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Mahasiswa
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Beasiswa
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendaftarans.slice(0, 5).map((pendaftaran) => (
                    <tr key={pendaftaran.id}>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {pendaftaran.mahasiswaNama}
                        </div>
                        <div className="text-sm text-gray-500">
                          {pendaftaran.mahasiswaNim}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {pendaftaran.beasiswaNama}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(pendaftaran.createdAt)}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          pendaftaran.status === 'menunggu'
                            ? 'bg-yellow-100 text-yellow-800'
                            : pendaftaran.status === 'diterima'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {pendaftaran.status === 'menunggu'
                            ? 'Menunggu'
                            : pendaftaran.status === 'diterima'
                            ? 'Diterima'
                            : 'Ditolak'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Beasiswa */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Program Beasiswa
            </h2>
            <Link 
              href="/admin/beasiswa" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Kelola Beasiswa
            </Link>
          </div>
          
          {beasiswas.length === 0 ? (
            <p className="text-gray-600">Belum ada program beasiswa</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {beasiswas.slice(0, 4).map((beasiswa) => (
                <div key={beasiswa.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">{beasiswa.nama}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      beasiswa.status === 'aktif'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {beasiswa.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {beasiswa.deskripsi}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Min IPK:</span>
                      <span className="ml-1 font-medium">{beasiswa.minIpk}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Kuota:</span>
                      <span className="ml-1 font-medium">{beasiswa.kuota}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Dibuka:</span>
                      <span className="ml-1">{formatDate(beasiswa.tanggalBuka)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Ditutup:</span>
                      <span className="ml-1">{formatDate(beasiswa.tanggalTutup)}</span>
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