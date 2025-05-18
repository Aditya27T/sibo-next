// app/not-found.js
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-6 py-12">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-6">Halaman Tidak Ditemukan</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
        </p>
        <div className="mt-8 space-x-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/login"
            className="inline-block px-6 py-3 rounded-md bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}