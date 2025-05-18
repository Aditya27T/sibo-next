// app/admin/verifikasi/page.js
'use client';

import { useState, useEffect } from 'react';
import { AdminNavigation } from '@/components/Navigation';

export default function VerifikasiPendaftaran() {
  const [user, setUser] = useState(null);
  const [pendaftarans, setPendaftarans] = useState([]);
  const [dokumens, setDokumens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedPendaftaran, setSelectedPendaftaran] = useState(null);
  const [filterStatus, setFilterStatus] = useState('semua');
  const [filterBeasiswa, setFilterBeasiswa] = useState('semua');
  const [beasiswas, setBeasiswas] = useState([]);
  const [formData, setFormData] = useState({
    status: '',
    catatan: '',
  });
  const [submitting, setSubmitting] = useState(false);

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

    // Fetch beasiswas for filter
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
      }
    };

    // Fetch all dokumens
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
      } finally {
        setLoading(false);
      }
    };

    Promise.all([
      fetchUserData(),
      fetchPendaftarans(),
      fetchBeasiswas(),
      fetchDokumens(),
    ]);
  }, []);

  // Handle select pendaftaran
  const handleSelectPendaftaran = (pendaftaran) => {
    setSelectedPendaftaran(pendaftaran);
    setFormData({
      status: pendaftaran.status,
      catatan: pendaftaran.catatan || '',
    });
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      // Submit pendaftaran update
      const response = await fetch(`/api/pendaftaran/${selectedPendaftaran.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat memperbarui status');
      }

      // Show success message
      setSuccessMessage('Status pendaftaran berhasil diperbarui!');
      
      // Refresh pendaftaran data
      const pendaftaranResponse = await fetch('/api/pendaftaran');
      const pendaftaranData = await pendaftaranResponse.json();
      setPendaftarans(pendaftaranData.data || []);
      
      // Update selected pendaftaran
      const updatedPendaftaran = pendaftaranData.data.find(p => p.id === selectedPendaftaran.id);
      if (updatedPendaftaran) {
        setSelectedPendaftaran(updatedPendaftaran);
      } else {
        setSelectedPendaftaran(null);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle dokumen verification
  const handleVerifyDokumen = async (dokumen, newStatus) => {
    try {
      const response = await fetch(`/api/dokumen/${dokumen.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat memperbarui dokumen');
      }

      // Show success message
      setSuccessMessage(`Dokumen berhasil ${newStatus === 'diterima' ? 'diterima' : 'ditolak'}!`);
      
      // Refresh dokumen data
      const dokumenResponse = await fetch('/api/dokumen');
      const dokumenData = await dokumenResponse.json();
      setDokumens(dokumenData.data || []);
    } catch (error) {
      setError(error.message);
    }
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

  // Filter pendaftarans
  const getFilteredPendaftarans = () => {
    let filtered = [...pendaftarans];
    
    if (filterStatus !== 'semua') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }
    
    if (filterBeasiswa !== 'semua') {
      filtered = filtered.filter(p => p.beasiswaId === filterBeasiswa);
    }
    
    return filtered;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'menunggu':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200',
        };
      case 'diterima':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
        };
      case 'ditolak':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
        };
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
            Verifikasi Pendaftaran
          </h1>
          <p className="text-gray-600">
            Verifikasi pendaftaran dan dokumen beasiswa
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 text-green-700">
            <p>{successMessage}</p>
          </div>
        )}

        {/* Filter */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <h2 className="text-lg font-semibold text-blue-800">
              Filter Pendaftaran
            </h2>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="filterStatus"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="semua">Semua Status</option>
                  <option value="menunggu">Menunggu</option>
                  <option value="diterima">Diterima</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="filterBeasiswa" className="block text-sm font-medium text-gray-700 mb-1">
                  Program Beasiswa
                </label>
                <select
                  id="filterBeasiswa"
                  value={filterBeasiswa}
                  onChange={(e) => setFilterBeasiswa(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="semua">Semua Beasiswa</option>
                  {beasiswas.map((beasiswa) => (
                    <option key={beasiswa.id} value={beasiswa.id}>
                      {beasiswa.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Daftar Pendaftaran */}
          <div className="md:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden sticky top-6">
              <div className="p-4 bg-blue-50 border-b border-blue-100">
                <h2 className="text-lg font-semibold text-blue-800">
                  Daftar Pendaftaran
                </h2>
              </div>
              
              {getFilteredPendaftarans().length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-600">Tidak ada pendaftaran yang sesuai filter</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 max-h-screen overflow-y-auto">
                  {getFilteredPendaftarans().map((pendaftaran) => {
                    const statusColors = getStatusColor(pendaftaran.status);
                    const dokumenCount = getDokumens(pendaftaran.id).length;
                    
                    return (
                      <div 
                        key={pendaftaran.id} 
                        className={`p-4 transition hover:bg-blue-50 cursor-pointer ${
                          selectedPendaftaran?.id === pendaftaran.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleSelectPendaftaran(pendaftaran)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{pendaftaran.mahasiswaNama}</h3>
                            <p className="text-sm text-gray-600">{pendaftaran.mahasiswaNim}</p>
                            <p className="text-sm text-gray-600 mt-1">{pendaftaran.beasiswaNama}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${statusColors.bg} ${statusColors.text}`}>
                            {pendaftaran.status === 'menunggu'
                              ? 'Menunggu'
                              : pendaftaran.status === 'diterima'
                              ? 'Diterima'
                              : 'Ditolak'}
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between text-xs">
                          <span className="text-gray-500">
                            {formatDate(pendaftaran.createdAt)}
                          </span>
                          <span className={dokumenCount > 0 ? 'text-green-600' : 'text-yellow-600'}>
                            {dokumenCount} Dokumen
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Detail Pendaftaran */}
          <div className="md:col-span-2">
            {!selectedPendaftaran ? (
              <div className="bg-white shadow rounded-lg p-6 text-center">
                <p className="text-gray-600">
                  Pilih pendaftaran di samping untuk melihat detail
                </p>
              </div>
            ) : (
              <>
                {/* Detail Mahasiswa & Beasiswa */}
                <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                  <div className="p-4 bg-blue-50 border-b border-blue-100">
                    <h2 className="text-lg font-semibold text-blue-800">
                      Detail Pendaftaran
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Mahasiswa</h3>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Nama Lengkap</p>
                            <p className="font-medium">{selectedPendaftaran.mahasiswaNama}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">NIM</p>
                            <p className="font-medium">{selectedPendaftaran.mahasiswaNim}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">IPK</p>
                            <p className="font-medium">{selectedPendaftaran.ipk}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Tanggal Daftar</p>
                            <p className="font-medium">{formatDate(selectedPendaftaran.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Beasiswa</h3>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Program Beasiswa</p>
                            <p className="font-medium">{selectedPendaftaran.beasiswaNama}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Status Pendaftaran</p>
                            <p className={`font-medium ${
                              selectedPendaftaran.status === 'menunggu'
                                ? 'text-yellow-600'
                                : selectedPendaftaran.status === 'diterima'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                              {selectedPendaftaran.status === 'menunggu'
                                ? 'Menunggu'
                                : selectedPendaftaran.status === 'diterima'
                                ? 'Diterima'
                                : 'Ditolak'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Jumlah Dokumen</p>
                            <p className="font-medium">{getDokumens(selectedPendaftaran.id).length} dokumen</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Alasan Mendaftar</h3>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-600">{selectedPendaftaran.alasan}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Form Verifikasi */}
                <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                  <div className="p-4 bg-blue-50 border-b border-blue-100">
                    <h2 className="text-lg font-semibold text-blue-800">
                      Verifikasi Pendaftaran
                    </h2>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status Pendaftaran <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="menunggu">Menunggu</option>
                        <option value="diterima">Diterima</option>
                        <option value="ditolak">Ditolak</option>
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 mb-1">
                        Catatan
                      </label>
                      <textarea
                        id="catatan"
                        name="catatan"
                        value={formData.catatan}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Tambahkan catatan untuk mahasiswa (opsional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Menyimpan...' : 'Simpan Status'}
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* Dokumen */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-4 bg-blue-50 border-b border-blue-100">
                    <h2 className="text-lg font-semibold text-blue-800">
                      Dokumen Pendukung
                    </h2>
                  </div>
                  
                  {getDokumens(selectedPendaftaran.id).length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-yellow-600">
                        Mahasiswa belum mengunggah dokumen apapun
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Aksi
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
                                    Lihat PDF
                                  </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex space-x-2">
                                    {dokumen.status === 'menunggu' && (
                                      <>
                                        <button
                                          onClick={() => handleVerifyDokumen(dokumen, 'diterima')}
                                          className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200"
                                        >
                                          Terima
                                        </button>
                                        <button
                                          onClick={() => handleVerifyDokumen(dokumen, 'ditolak')}
                                          className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200"
                                        >
                                          Tolak
                                        </button>
                                      </>
                                    )}
                                    {dokumen.status === 'diterima' && (
                                      <button
                                        onClick={() => handleVerifyDokumen(dokumen, 'ditolak')}
                                        className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200"
                                      >
                                        Tolak
                                      </button>
                                    )}
                                    {dokumen.status === 'ditolak' && (
                                      <button
                                        onClick={() => handleVerifyDokumen(dokumen, 'diterima')}
                                        className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200"
                                      >
                                        Terima
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
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