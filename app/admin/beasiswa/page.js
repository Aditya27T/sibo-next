// app/admin/beasiswa/page.js
'use client';

import { useState, useEffect } from 'react';
import { AdminNavigation } from '@/components/Navigation';

export default function KelolaBeasiswa() {
  const [user, setUser] = useState(null);
  const [beasiswas, setBeasiswas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAddingBeasiswa, setIsAddingBeasiswa] = useState(false);
  const [isEditingBeasiswa, setIsEditingBeasiswa] = useState(false);
  const [selectedBeasiswa, setSelectedBeasiswa] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    kuota: '',
    minIpk: '',
    tanggalBuka: '',
    tanggalTutup: '',
    status: 'aktif',
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
      } finally {
        setLoading(false);
      }
    };

    Promise.all([
      fetchUserData(),
      fetchBeasiswas(),
    ]);
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      // Validation
      if (!formData.nama || !formData.deskripsi || !formData.kuota || !formData.minIpk || !formData.tanggalBuka || !formData.tanggalTutup) {
        throw new Error('Semua field harus diisi');
      }

      let response;
      
      if (isEditingBeasiswa) {
        // Edit existing beasiswa
        response = await fetch(`/api/beasiswa/${selectedBeasiswa.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Add new beasiswa
        response = await fetch('/api/beasiswa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan');
      }

      // Show success message
      setSuccessMessage(isEditingBeasiswa 
        ? 'Beasiswa berhasil diperbarui!'
        : 'Beasiswa baru berhasil ditambahkan!'
      );
      
      // Reset form and states
      setFormData({
        nama: '',
        deskripsi: '',
        kuota: '',
        minIpk: '',
        tanggalBuka: '',
        tanggalTutup: '',
        status: 'aktif',
      });
      setIsAddingBeasiswa(false);
      setIsEditingBeasiswa(false);
      setSelectedBeasiswa(null);
      
      // Refresh beasiswas data
      const beasiswaResponse = await fetch('/api/beasiswa');
      const beasiswaData = await beasiswaResponse.json();
      setBeasiswas(beasiswaData.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit beasiswa
  const handleEditBeasiswa = (beasiswa) => {
    setSelectedBeasiswa(beasiswa);
    setFormData({
      nama: beasiswa.nama,
      deskripsi: beasiswa.deskripsi,
      kuota: beasiswa.kuota,
      minIpk: beasiswa.minIpk,
      tanggalBuka: new Date(beasiswa.tanggalBuka).toISOString().split('T')[0],
      tanggalTutup: new Date(beasiswa.tanggalTutup).toISOString().split('T')[0],
      status: beasiswa.status,
    });
    setIsEditingBeasiswa(true);
    setIsAddingBeasiswa(false);
  };

  // Handle delete beasiswa
  const handleDeleteBeasiswa = async (beasiswa) => {
    if (!confirm(`Yakin ingin menghapus beasiswa "${beasiswa.nama}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/beasiswa/${beasiswa.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat menghapus beasiswa');
      }

      // Show success message
      setSuccessMessage('Beasiswa berhasil dihapus!');
      
      // Refresh beasiswas data
      const beasiswaResponse = await fetch('/api/beasiswa');
      const beasiswaData = await beasiswaResponse.json();
      setBeasiswas(beasiswaData.data || []);
    } catch (error) {
      setError(error.message);
    }
  };

  // Format tanggal
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Toggle add form
  const toggleAddForm = () => {
    setIsAddingBeasiswa(!isAddingBeasiswa);
    setIsEditingBeasiswa(false);
    setSelectedBeasiswa(null);
    setFormData({
      nama: '',
      deskripsi: '',
      kuota: '',
      minIpk: '',
      tanggalBuka: '',
      tanggalTutup: '',
      status: 'aktif',
    });
  };

  // Cancel form
  const handleCancelForm = () => {
    setIsAddingBeasiswa(false);
    setIsEditingBeasiswa(false);
    setSelectedBeasiswa(null);
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Kelola Beasiswa
            </h1>
            <p className="text-gray-600">
              Tambah, edit, dan hapus program beasiswa
            </p>
          </div>
          
          <button
            onClick={toggleAddForm}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {isAddingBeasiswa ? 'Batal' : 'Tambah Beasiswa'}
          </button>
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

        {/* Form Tambah/Edit Beasiswa */}
        {(isAddingBeasiswa || isEditingBeasiswa) && (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <h2 className="text-lg font-semibold text-blue-800">
                {isEditingBeasiswa ? 'Edit Beasiswa' : 'Tambah Beasiswa Baru'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Beasiswa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Non-Aktif</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    rows="3"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="kuota" className="block text-sm font-medium text-gray-700 mb-1">
                    Kuota <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="kuota"
                    name="kuota"
                    value={formData.kuota}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="minIpk" className="block text-sm font-medium text-gray-700 mb-1">
                    IPK Minimum <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="minIpk"
                    name="minIpk"
                    value={formData.minIpk}
                    onChange={handleChange}
                    required
                    min="0"
                    max="4"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="tanggalBuka" className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Buka <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="tanggalBuka"
                    name="tanggalBuka"
                    value={formData.tanggalBuka}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="tanggalTutup" className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Tutup <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="tanggalTutup"
                    name="tanggalTutup"
                    value={formData.tanggalTutup}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting 
                    ? 'Menyimpan...' 
                    : isEditingBeasiswa ? 'Perbarui Beasiswa' : 'Tambah Beasiswa'
                  }
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Daftar Beasiswa */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <h2 className="text-lg font-semibold text-blue-800">
              Daftar Program Beasiswa
            </h2>
          </div>
          
          {beasiswas.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">Belum ada program beasiswa</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Beasiswa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kuota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min IPK
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Periode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {beasiswas.map((beasiswa) => (
                    <tr key={beasiswa.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{beasiswa.nama}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{beasiswa.deskripsi}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{beasiswa.kuota}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{beasiswa.minIpk}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(beasiswa.tanggalBuka)} s/d {formatDate(beasiswa.tanggalTutup)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          beasiswa.status === 'aktif'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {beasiswa.status === 'aktif' ? 'Aktif' : 'Non-Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditBeasiswa(beasiswa)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBeasiswa(beasiswa)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}