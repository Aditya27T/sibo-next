// app/mahasiswa/unggah/page.js
'use client';

import { useState, useEffect } from 'react';
import { MahasiswaNavigation } from '@/components/Navigation';

export default function UnggahDokumen() {
  const [user, setUser] = useState(null);
  const [pendaftarans, setPendaftarans] = useState([]);
  const [dokumens, setDokumens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    pendaftaranId: '',
    jenisDokumen: '',
    file: null,
  });
  const [selectedPendaftaran, setSelectedPendaftaran] = useState(null);
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
      } finally {
        setLoading(false);
      }
    };

    Promise.all([
      fetchUserData(),
      fetchPendaftarans(),
      fetchDokumens(),
    ]);
  }, []);

  // Handle select pendaftaran
  const handleSelectPendaftaran = (pendaftaran) => {
    setSelectedPendaftaran(pendaftaran);
    setFormData(prev => ({
      ...prev,
      pendaftaranId: pendaftaran.id,
      jenisDokumen: '',
      file: null,
    }));
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      file
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      // Validate file (must be PDF)
      if (!formData.file) {
        throw new Error('Pilih file untuk diunggah');
      }

      if (!formData.file.name.endsWith('.pdf')) {
        throw new Error('Hanya file PDF yang diperbolehkan');
      }

      // Validate jenis dokumen
      if (!formData.jenisDokumen) {
        throw new Error('Pilih jenis dokumen');
      }

      // Check if document already uploaded
      const existingDokumen = dokumens.find(
        d => d.pendaftaranId === formData.pendaftaranId && d.jenisDokumen === formData.jenisDokumen
      );

      if (existingDokumen) {
        throw new Error(`Dokumen ${formData.jenisDokumen} sudah diunggah sebelumnya`);
      }

      // Create form data for file upload
      const uploadData = new FormData();
      uploadData.append('pendaftaranId', formData.pendaftaranId);
      uploadData.append('jenisDokumen', formData.jenisDokumen);
      uploadData.append('file', formData.file);

      // Submit dokumen
      const response = await fetch('/api/dokumen', {
        method: 'POST',
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat mengunggah dokumen');
      }

      // Show success message
      setSuccessMessage('Dokumen berhasil diunggah!');
      
      // Reset form
      setFormData({
        pendaftaranId: selectedPendaftaran.id,
        jenisDokumen: '',
        file: null,
      });
      
      // Reset file input
      const fileInput = document.getElementById('file');
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Refresh dokumen data
      const dokumenResponse = await fetch('/api/dokumen');
      const dokumenData = await dokumenResponse.json();
      setDokumens(dokumenData.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Jenis-jenis dokumen
  const jenisDokumen = [
    'Kartu Tanda Mahasiswa',
    'Transkrip Nilai',
    'Surat Keterangan IPK',
    'Surat Pernyataan Tidak Menerima Beasiswa Lain',
    'Kartu Keluarga',
    'Surat Keterangan Tidak Mampu',
    'Dokumen Pendukung Lainnya',
  ];

  // Format tanggal
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Get uploaded dokumens for a pendaftaran
  const getUploadedDokumens = (pendaftaranId) => {
    return dokumens.filter(d => d.pendaftaranId === pendaftaranId);
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
            Unggah Dokumen
          </h1>
          <p className="text-gray-600">
            Unggah dokumen pendukung untuk pendaftaran beasiswa Anda
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

        {pendaftarans.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada pendaftaran beasiswa</h3>
            <p className="mt-1 text-sm text-gray-500">
              Anda perlu mendaftar beasiswa terlebih dahulu sebelum mengunggah dokumen.
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
          <div className="grid md:grid-cols-3 gap-6">
            {/* Daftar Pendaftaran */}
            <div className="md:col-span-1">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 bg-blue-50 border-b border-blue-100">
                  <h2 className="text-lg font-semibold text-blue-800">
                    Pendaftaran Beasiswa
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {pendaftarans.map((pendaftaran) => {
                    const uploadedDokumens = getUploadedDokumens(pendaftaran.id);
                    
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
                        <div className="mt-2 flex items-center justify-between">
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
                          <span className="text-xs text-gray-500">
                            {uploadedDokumens.length} dokumen
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Form Unggah & Daftar Dokumen */}
            <div className="md:col-span-2">
              {!selectedPendaftaran ? (
                <div className="bg-white shadow rounded-lg p-6 text-center">
                  <p className="text-gray-600">
                    Pilih pendaftaran beasiswa di samping untuk mengunggah dokumen
                  </p>
                </div>
              ) : (
                <>
                  {/* Form Unggah */}
                  <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                    <div className="p-4 bg-blue-50 border-b border-blue-100">
                      <h2 className="text-lg font-semibold text-blue-800">
                        Unggah Dokumen Baru
                      </h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-6">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Beasiswa
                        </label>
                        <p className="text-blue-600 font-medium">{selectedPendaftaran.beasiswaNama}</p>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="jenisDokumen" className="block text-sm font-medium text-gray-700 mb-1">
                          Jenis Dokumen <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="jenisDokumen"
                          name="jenisDokumen"
                          value={formData.jenisDokumen}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Pilih Jenis Dokumen</option>
                          {jenisDokumen.map((jenis) => {
                            // Check if already uploaded
                            const isUploaded = dokumens.some(
                              d => d.pendaftaranId === selectedPendaftaran.id && d.jenisDokumen === jenis
                            );
                            
                            return (
                              <option 
                                key={jenis} 
                                value={jenis}
                                disabled={isUploaded}
                              >
                                {jenis} {isUploaded ? '(Sudah Diunggah)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                          File (PDF) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          id="file"
                          name="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Hanya file PDF yang diperbolehkan (maks. 5 MB)
                        </p>
                      </div>
                      
                      <div>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? 'Mengunggah...' : 'Unggah Dokumen'}
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  {/* Daftar Dokumen */}
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-4 bg-blue-50 border-b border-blue-100">
                      <h2 className="text-lg font-semibold text-blue-800">
                        Dokumen Terunggah
                      </h2>
                    </div>
                    
                    {dokumens.filter(d => d.pendaftaranId === selectedPendaftaran.id).length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-gray-600">
                          Belum ada dokumen yang diunggah untuk pendaftaran ini
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
                            {dokumens
                              .filter(d => d.pendaftaranId === selectedPendaftaran.id)
                              .map((dokumen) => (
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
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      dokumen.status === 'menunggu'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : dokumen.status === 'diterima'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
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
        )}
      </div>
    </div>
  );
}