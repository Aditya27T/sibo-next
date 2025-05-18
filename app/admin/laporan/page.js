// app/admin/laporan/page.js
'use client';

import { useState, useEffect } from 'react';
import { AdminNavigation } from '@/components/Navigation';
import { useRouter } from 'next/navigation';

export default function LaporanBeasiswa() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [beasiswas, setBeasiswas] = useState([]);
  const [pendaftarans, setPendaftarans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBeasiswa, setSelectedBeasiswa] = useState(null);
  const [filterStatus, setFilterStatus] = useState('semua');
  const [exportLoading, setExportLoading] = useState(false);

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

    // Fetch beasiswas
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

    // Fetch all pendaftarans
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
      } finally {
        setLoading(false);
      }
    };

    Promise.all([
      fetchUserData(),
      fetchBeasiswas(),
      fetchPendaftarans(),
    ]);
  }, []);

  // Handle select beasiswa
  const handleSelectBeasiswa = (beasiswa) => {
    setSelectedBeasiswa(beasiswa);
  };

  // Format tanggal
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Get pendaftarans for a beasiswa
  const getBeasiswaPendaftarans = () => {
    if (!selectedBeasiswa) return [];
    
    let filtered = pendaftarans.filter(p => p.beasiswaId === selectedBeasiswa.id);
    
    if (filterStatus !== 'semua') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }
    
    return filtered;
  };

  // Get count by status
  const getStatusCount = (status) => {
    if (!selectedBeasiswa) return 0;
    return pendaftarans.filter(p => p.beasiswaId === selectedBeasiswa.id && p.status === status).length;
  };

  // Handle PDF export
  const handleExportPDF = async () => {
    if (!selectedBeasiswa) return;
    
    setExportLoading(true);
    
    try {
      const response = await fetch(`/api/laporan/pdf?beasiswaId=${selectedBeasiswa.id}&status=${filterStatus}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Terjadi kesalahan saat mengunduh laporan');
      }
      
      // Get the blob from response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element
      const a = document.createElement('a');
      a.href = url;
      a.download = `Laporan_${selectedBeasiswa.nama.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Append link to body, click it, and then remove it
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Release the object URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(error.message);
    } finally {
      setExportLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavigation userName={user?.name} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Laporan Beasiswa
          </h1>
          <p className="text-gray-600">
            Lihat dan cetak laporan pendaftaran beasiswa
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            <p>{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Daftar Beasiswa */}
          <div className="md:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden sticky top-6">
              <div className="p-4 bg-blue-50 border-b border-blue-100">
                <h2 className="text-lg font-semibold text-blue-800">
                  Program Beasiswa
                </h2>
              </div>
              
              {beasiswas.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-600">Belum ada program beasiswa</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 max-h-screen overflow-y-auto">
                  {beasiswas.map((beasiswa) => {
                    const pendaftaranCount = pendaftarans.filter(p => p.beasiswaId === beasiswa.id).length;
                    
                    return (
                      <div 
                        key={beasiswa.id} 
                        className={`p-4 transition hover:bg-blue-50 cursor-pointer ${
                          selectedBeasiswa?.id === beasiswa.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleSelectBeasiswa(beasiswa)}
                      >
                        <h3 className="font-semibold text-gray-900">{beasiswa.nama}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Periode: {formatDate(beasiswa.tanggalBuka)} s/d {formatDate(beasiswa.tanggalTutup)}
                        </p>
                        <div className="mt-2 flex justify-between text-xs">
                          <span className={`px-2 py-1 rounded-full ${
                            beasiswa.status === 'aktif'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {beasiswa.status === 'aktif' ? 'Aktif' : 'Non-Aktif'}
                          </span>
                          <span className="text-blue-600">
                            {pendaftaranCount} Pendaftar
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Laporan Beasiswa */}
          <div className="md:col-span-2">
            {!selectedBeasiswa ? (
              <div className="bg-white shadow rounded-lg p-6 text-center">
                <p className="text-gray-600">
                  Pilih program beasiswa di samping untuk melihat laporan
                </p>
              </div>
            ) : (
              <>
                {/* Ringkasan */}
                <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                  <div className="p-4 bg-blue-50 border-b border-blue-100">
                    <h2 className="text-lg font-semibold text-blue-800">
                      Ringkasan Beasiswa
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">{selectedBeasiswa.nama}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedBeasiswa.deskripsi}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500">Kuota</p>
                        <p className="text-xl font-semibold text-gray-900">{selectedBeasiswa.kuota}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500">Total Pendaftar</p>
                        <p className="text-xl font-semibold text-blue-600">
                          {pendaftarans.filter(p => p.beasiswaId === selectedBeasiswa.id).length}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500">Diterima</p>
                        <p className="text-xl font-semibold text-green-600">{getStatusCount('diterima')}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500">Ditolak</p>
                        <p className="text-xl font-semibold text-red-600">{getStatusCount('ditolak')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Filter & Export */}
                <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                  <div className="p-4 bg-blue-50 border-b border-blue-100">
                    <h2 className="text-lg font-semibold text-blue-800">
                      Laporan Pendaftaran
                    </h2>
                  </div>
                  
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center">
                        <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mr-2">
                          Filter Status:
                        </label>
                        <select
                          id="filterStatus"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="semua">Semua Status</option>
                          <option value="menunggu">Menunggu</option>
                          <option value="diterima">Diterima</option>
                          <option value="ditolak">Ditolak</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={handleExportPDF}
                        disabled={exportLoading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {exportLoading ? 'Exporting...' : 'Export PDF'}
                      </button>
                    </div>
                  </div>
                  
                  {getBeasiswaPendaftarans().length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-gray-600">Tidak ada data pendaftaran yang sesuai filter</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              No
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nama Mahasiswa
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              NIM
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              IPK
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tanggal Daftar
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getBeasiswaPendaftarans().map((pendaftaran, index) => (
                            <tr key={pendaftaran.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{pendaftaran.mahasiswaNama}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{pendaftaran.mahasiswaNim}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{pendaftaran.ipk}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{formatDate(pendaftaran.createdAt)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}