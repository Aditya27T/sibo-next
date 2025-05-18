// app/mahasiswa/daftar/page.js
'use client';

import { useState, useEffect } from 'react';
import { MahasiswaNavigation } from '@/components/Navigation';
import { useRouter } from 'next/navigation';

export default function DaftarBeasiswa() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [beasiswas, setBeasiswas] = useState([]);
  const [pendaftarans, setPendaftarans] = useState([]);
  const [selectedBeasiswa, setSelectedBeasiswa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    beasiswaId: '',
    ipk: '',
    alasan: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
    setFormData(prev => ({
      ...prev,
      beasiswaId: beasiswa.id
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      // Validate IPK
      const ipkValue = parseFloat(formData.ipk);
      if (isNaN(ipkValue) || ipkValue < 0 || ipkValue > 4) {
        throw new Error('IPK harus berupa angka antara 0 dan 4');
      }

      if (ipkValue < selectedBeasiswa.minIpk) {
        throw new Error(`IPK minimum untuk beasiswa ini adalah ${selectedBeasiswa.minIpk}`);
      }

      // Submit pendaftaran
      const response = await fetch('/api/pendaftaran', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat mendaftar beasiswa');
      }

      // Show success message
      setSuccessMessage('Pendaftaran beasiswa berhasil! Silahkan unggah dokumen pendukung.');
      
      // Reset form
      setFormData({
        beasiswaId: '',
        ipk: '',
        alasan: '',
      });
      setSelectedBeasiswa(null);
      
      // Refresh pendaftaran data
      const pendaftaranResponse = await fetch('/api/pendaftaran');
      const pendaftaranData = await pendaftaranResponse.json();
      setPendaftarans(pendaftaranData.data || []);
      
      // Redirect to upload document page after 2 seconds
      setTimeout(() => {
        router.push('/mahasiswa/unggah');
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Format tanggal
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Check if already registered
  const isRegistered = (beasiswaId) => {
    return pendaftarans.some(p => p.beasiswaId === beasiswaId);
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
            Daftar Beasiswa
          </h1>
          <p className="text-gray-600">
            Pilih dan daftar program beasiswa yang tersedia
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

        <div className="grid md:grid-cols-3 gap-6">
          {/* Daftar Beasiswa */}
          <div className="md:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 bg-blue-50 border-b border-blue-100">
                <h2 className="text-lg font-semibold text-blue-800">
                  Program Beasiswa Tersedia
                </h2>
              </div>
              
              {beasiswas.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-600">Tidak ada beasiswa aktif saat ini</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {beasiswas.map((beasiswa) => {
                    const registered = isRegistered(beasiswa.id);
                    
                    return (
                      <div 
                        key={beasiswa.id} 
                        className={`p-4 transition ${
                          registered ? 'bg-gray-50' : 'hover:bg-blue-50 cursor-pointer'
                        } ${selectedBeasiswa?.id === beasiswa.id ? 'bg-blue-50' : ''}`}
                        onClick={() => !registered && handleSelectBeasiswa(beasiswa)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{beasiswa.nama}</h3>
                            <p className="mt-1 text-sm text-gray-600">
                              {beasiswa.deskripsi}
                            </p>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-500">Min IPK:</span>
                                <span className="ml-1 font-medium">{beasiswa.minIpk}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Kuota:</span>
                                <span className="ml-1 font-medium">{beasiswa.kuota}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-500">Deadline:</span>
                                <span className="ml-1">{formatDate(beasiswa.tanggalTutup)}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            {registered ? (
                              <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                Sudah Terdaftar
                              </span>
                            ) : (
                              <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Dapat Didaftarkan
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Form Pendaftaran */}
          <div className="md:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden sticky top-6">
              <div className="p-4 bg-blue-50 border-b border-blue-100">
                <h2 className="text-lg font-semibold text-blue-800">
                  Form Pendaftaran
                </h2>
              </div>
              
              {!selectedBeasiswa ? (
                <div className="p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    Pilih salah satu beasiswa di samping untuk mendaftar
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Beasiswa Dipilih
                    </label>
                    <p className="text-blue-600 font-medium">{selectedBeasiswa.nama}</p>
                  </div>
                  
                  <div>
                    <label htmlFor="ipk" className="block text-sm font-medium text-gray-700 mb-1">
                      IPK Terakhir <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="ipk"
                      name="ipk"
                      value={formData.ipk}
                      onChange={handleChange}
                      placeholder="Contoh: 3.5"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      IPK minimum untuk beasiswa ini: {selectedBeasiswa.minIpk}
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="alasan" className="block text-sm font-medium text-gray-700 mb-1">
                      Alasan Mendaftar <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="alasan"
                      name="alasan"
                      value={formData.alasan}
                      onChange={handleChange}
                      rows="4"
                      required
                      placeholder="Jelaskan mengapa Anda layak mendapatkan beasiswa ini"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Mendaftar...' : 'Daftar Beasiswa'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setSelectedBeasiswa(null)}
                      className="mt-2 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}