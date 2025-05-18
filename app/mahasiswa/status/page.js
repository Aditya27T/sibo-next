// app/mahasiswa/status/page.js
'use client';

import { useState, useEffect } from 'react';
import { MahasiswaNavigation } from '@/components/Navigation';

export default function StatusPendaftaran() {
  const [user, setUser] = useState(null);
  const [pendaftarans, setPendaftarans] = useState([]);
  const [dokumens, setDokumens] = useState([]);
  const [notifikasis, setNotifikasis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPendaftaran, setSelectedPendaftaran] = useState(null);

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

    // Fetch pendaftaran mahasiswa
    const fetchPendaftarans = async () => {
      try {
        const response = await fetch('/api/pendaftaran');
        if (!response.ok) {
          throw new Error('Gagal mendapatkan data pendaftaran');
        }
        
        const data = await response.json();
        setPendaftarans(data.data || []);
        
        // Set selected pendaftaran to the first one if any
        if (data.data && data.data.length > 0) {
          setSelectedPendaftaran(data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching pendaftarans:', error);
        setError('');
      }
    };

    // Fetch dokumen mahasiswa
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

    // Fetch notifikasi
    const fetchNotifikasis = async () => {
      try {
        const response = await fetch('/api/notifikasi');
        if (!response.ok) {
          throw new Error('Gagal mendapatkan data notifikasi');
        }
        
        const data = await response.json();
        setNotifikasis(data.data || []);
      } catch (error) {
        console.error('Error fetching notifikasis:', error);
        // Tidak set error untuk notifikasi karena tidak terlalu kritis
      } finally {
        setLoading(false);
      }
    };

    Promise.all([
      fetchUserData(),
      fetchPendaftarans(),
      fetchDokumens(),
      fetchNotifikasis(),
    ]);
  }, []);

  // Handle select pendaftaran
  const handleSelectPendaftaran = (pendaftaran) => {
    setSelectedPendaftaran(pendaftaran);
  };

  // Format tanggal
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Get dokumens for a pendaftaran
  const getDokumens = (pendaftaranId) => {
    return dokumens.filter(d => d.pendaftaranId === pendaftaranId) || [];
  };

  // Get notifikasis for a pendaftaran (approximate match based on beasiswa name)
  const getNotifikasis = (pendaftaran) => {
    if (!pendaftaran) return [];
    
    return notifikasis.filter(n => 
      n.message.toLowerCase().includes(pendaftaran.beasiswaNama.toLowerCase())
    ) || [];
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'menunggu':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: 'text-yellow-500',
        };
      case 'diterima':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: 'text-green-500',
        };
      case 'ditolak':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: 'text-red-500',
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: 'text-gray-500',
        };
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-100">
      <MahasiswaNavigation userName={user?.name} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Status Pendaftaran
          </h1>
          <p className="text-gray-600">
            Pantau status pendaftaran beasiswa Anda
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {pendaftarans.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada pendaftaran beasiswa</h3>
            <p className="mt-1 text-sm text-gray-500">
              Anda belum mendaftar beasiswa apapun.
            </p>
            <div className="mt-6">
              <a
                href="/mahasiswa/daftar"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Daftar Beasiswa
              </a>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {/* Daftar Pendaftaran */}
            <div className="md:col-span-1">
              <div className="bg-white shadow rounded-lg overflow-hidden sticky top-6">
                <div className="p-4 bg-blue-50 border-b border-blue-100">
                  <h2 className="text-lg font-semibold text-blue-800">
                    Pendaftaran Beasiswa
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {pendaftarans.map((pendaftaran) => {
                    const statusColors = getStatusColor(pendaftaran.status);
                    
                    return (
                      <div 
                        key={pendaftaran.id} 
                        className={`p-4 transition hover:bg-blue-50 cursor-pointer ${
                          selectedPendaftaran?.id === pendaftaran.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleSelectPendaftaran(pendaftaran)}
                      >
                        <h3 className="font-semibold text-gray-900">{pendaftaran.beasiswaNama}</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Tanggal Daftar: {formatDate(pendaftaran.createdAt)}
                        </p>
                        <div className="mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${statusColors.bg} ${statusColors.text}`}>
                            {pendaftaran.status === 'menunggu'
                              ? 'Menunggu'
                              : pendaftaran.status === 'diterima'
                              ? 'Diterima'
                              : 'Ditolak'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Detail Pendaftaran */}
            <div className="md:col-span-3">
              {!selectedPendaftaran ? (
                <div className="bg-white shadow rounded-lg p-6 text-center">
                  <p className="text-gray-600">
                    Pilih pendaftaran beasiswa di samping untuk melihat detail
                  </p>
                </div>
              ) : (
                <>
                  {/* Status Timeline */}
                  <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                    <div className="p-4 bg-blue-50 border-b border-blue-100">
                      <h2 className="text-lg font-semibold text-blue-800">
                        Status Pendaftaran
                      </h2>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{selectedPendaftaran.beasiswaNama}</h3>
                        {selectedPendaftaran.updatedAt && (
                          <p className="text-sm text-gray-600">
                            Terakhir diupdate: {formatDate(selectedPendaftaran.updatedAt)}
                          </p>
                        )}
                      </div>
                      
                      <div className="relative pb-12">
                        {/* Timeline dots and lines */}
                        <div className="absolute top-0 left-4 -ml-px h-full w-0.5 bg-gray-200"></div>
                        
                        {/* Pendaftaran */}
                        <div className="relative flex items-start group">
                          <div className="flex items-center h-9">
                            <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4 min-w-0 flex-1 py-0.5 mb-6">
                            <div className="text-sm font-medium text-gray-900">Pendaftaran Diterima</div>
                            <div className="text-sm text-gray-500">
                              Tanggal: {formatDate(selectedPendaftaran.createdAt)}
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                              Anda telah berhasil mendaftar beasiswa. Pendaftaran Anda sedang diproses.
                            </div>
                          </div>
                        </div>
                        
                        {/* Dokumen */}
                        <div className="relative flex items-start group">
                          <div className="flex items-center h-9">
                            <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4 min-w-0 flex-1 py-0.5 mb-6">
                            <div className="text-sm font-medium text-gray-900">Dokumen</div>
                            {getDokumens(selectedPendaftaran.id).length === 0 ? (
                              <div className="text-sm text-yellow-600">
                                Belum ada dokumen yang diunggah
                              </div>
                            ) : (
                              <div className="text-sm text-green-600">
                                {getDokumens(selectedPendaftaran.id).length} dokumen telah diunggah
                              </div>
                            )}
                            <div className="mt-1 text-sm text-gray-600">
                              Status dokumen:
                              <ul className="mt-1 list-disc list-inside">
                                {getDokumens(selectedPendaftaran.id).map((dokumen) => {
                                  const statusColors = getStatusColor(dokumen.status);
                                  return (
                                    <li key={dokumen.id} className="text-sm">
                                      {dokumen.jenisDokumen}: <span className={statusColors.text}>{dokumen.status}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        {/* Verifikasi */}
                        <div className="relative flex items-start group">
                          <div className="flex items-center h-9">
                            <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                              selectedPendaftaran.status === 'menunggu'
                                ? 'bg-gray-100 text-gray-400'
                                : selectedPendaftaran.status === 'diterima'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-red-100 text-red-600'
                            }`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                {selectedPendaftaran.status === 'menunggu' ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                ) : selectedPendaftaran.status === 'diterima' ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                )}
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4 min-w-0 flex-1 py-0.5">
                            <div className="text-sm font-medium text-gray-900">Verifikasi</div>
                            
                            {selectedPendaftaran.status === 'menunggu' ? (
                              <div className="text-sm text-yellow-600">
                                Pendaftaran Anda sedang dalam proses verifikasi
                              </div>
                            ) : selectedPendaftaran.status === 'diterima' ? (
                              <div className="text-sm text-green-600">
                                Selamat! Pendaftaran beasiswa Anda telah diterima
                              </div>
                            ) : (
                              <div className="text-sm text-red-600">
                                Maaf, pendaftaran beasiswa Anda ditolak
                              </div>
                            )}
                            
                            {selectedPendaftaran.catatan && (
                              <div className="mt-1 text-sm text-gray-600">
                                Catatan: {selectedPendaftaran.catatan}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dokumen */}
                  <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                    <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-blue-800">
                        Dokumen Pendukung
                      </h2>
                      <a
                        href="/mahasiswa/unggah"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Unggah Dokumen
                      </a>
                    </div>
                    
                    {getDokumens(selectedPendaftaran.id).length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-yellow-600">
                          Belum ada dokumen yang diunggah untuk pendaftaran ini
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                          Unggah dokumen pendukung untuk mempercepat proses verifikasi
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Jenis Dokumen
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tanggal Unggah
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                File
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {getDokumens(selectedPendaftaran.id).map((dokumen) => {
                              const statusColors = getStatusColor(dokumen.status);
                              
                              return (
                                <tr key={dokumen.id}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                      {dokumen.jenisDokumen}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                      {formatDate(dokumen.createdAt)}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors.bg} ${statusColors.text}`}>
                                      {dokumen.status === 'menunggu'
                                        ? 'Menunggu'
                                        : dokumen.status === 'diterima'
                                        ? 'Diterima'
                                        : 'Ditolak'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <a
                                      href={dokumen.filePath}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      Lihat
                                    </a>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  
                  {/* Notifikasi */}
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-4 bg-blue-50 border-b border-blue-100">
                      <h2 className="text-lg font-semibold text-blue-800">
                        Riwayat Notifikasi
                      </h2>
                    </div>
                    
                    {getNotifikasis(selectedPendaftaran).length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-gray-600">
                          Belum ada notifikasi untuk pendaftaran ini
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 space-y-4">
                        {getNotifikasis(selectedPendaftaran).map((notifikasi) => (
                          <div 
                            key={notifikasi.id}
                            className="p-4 border rounded-lg bg-white"
                          >
                            <div className="flex items-start">
                              <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <h3 className="font-medium text-gray-900">{notifikasi.title}</h3>
                                <p className="mt-1 text-sm text-gray-600">{notifikasi.message}</p>
                                <p className="mt-2 text-xs text-gray-500">
                                  {formatDate(notifikasi.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}