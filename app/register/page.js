// app/register/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    nim: '',
    fakultas: '',
    jurusan: '',
    tahunMasuk: new Date().getFullYear().toString(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat registrasi');
      }

      // Redirect ke login page dengan pesan sukses
      router.push('/login?success=Registration successful. Please login.');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fakultasOptions = [
    'Teknik',
    'Ekonomi',
    'Hukum',
    'Kedokteran',
    'MIPA',
    'Ilmu Sosial dan Politik',
    'Sastra',
    'Psikologi',
    'Pertanian',
    'Lainnya',
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Registrasi Akun SIBO
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Daftar akun untuk mahasiswa
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="nim" className="block text-sm font-medium text-gray-700">
                NIM (Nomor Induk Mahasiswa)
              </label>
              <div className="mt-1">
                <input
                  id="nim"
                  name="nim"
                  type="text"
                  required
                  value={formData.nim}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="fakultas" className="block text-sm font-medium text-gray-700">
                Fakultas
              </label>
              <div className="mt-1">
                <select
                  id="fakultas"
                  name="fakultas"
                  required
                  value={formData.fakultas}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Pilih Fakultas</option>
                  {fakultasOptions.map((fakultas) => (
                    <option key={fakultas} value={fakultas}>
                      {fakultas}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="jurusan" className="block text-sm font-medium text-gray-700">
                Jurusan / Program Studi
              </label>
              <div className="mt-1">
                <input
                  id="jurusan"
                  name="jurusan"
                  type="text"
                  required
                  value={formData.jurusan}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="tahunMasuk" className="block text-sm font-medium text-gray-700">
                Tahun Masuk
              </label>
              <div className="mt-1">
                <select
                  id="tahunMasuk"
                  name="tahunMasuk"
                  required
                  value={formData.tahunMasuk}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {Array.from({ length: 6 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                Saya menyetujui syarat dan ketentuan yang berlaku
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Mendaftar...' : 'Daftar'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Login disini
              </Link>
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}