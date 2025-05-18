// scripts/init.js
/**
 * Script inisialisasi proyek SIBO
 * Membuat struktur folder dan file yang diperlukan
 */

const fs = require('fs');
const path = require('path');

// Path ke direktori root proyek
const ROOT_DIR = process.cwd();

// Struktur folder yang diperlukan
const DIRECTORIES = [
  'app',
  'app/login',
  'app/register',
  'app/mahasiswa',
  'app/mahasiswa/dashboard',
  'app/mahasiswa/daftar',
  'app/mahasiswa/unggah',
  'app/mahasiswa/status',
  'app/admin',
  'app/admin/dashboard',
  'app/admin/beasiswa',
  'app/admin/verifikasi',
  'app/admin/laporan',
  'app/api',
  'app/api/users',
  'app/api/users/logout',
  'app/api/users/me',
  'app/api/users/stats',
  'app/api/beasiswa',
  'app/api/pendaftaran',
  'app/api/dokumen',
  'app/api/notifikasi',
  'app/api/laporan',
  'app/api/laporan/pdf',
  'components',
  'data',
  'public',
  'public/uploads',
  'utils',
  'scripts'
];

// Data JSON awal
const INITIAL_DATA = {
  users: [
    {
      "id": "1",
      "name": "Admin Sistem",
      "email": "admin@sibo.ac.id",
      "password": "admin123",
      "role": "admin",
      "createdAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": "2",
      "name": "Budi Santoso",
      "email": "budi@student.ac.id",
      "password": "mahasiswa123",
      "nim": "M123456",
      "role": "mahasiswa",
      "fakultas": "Teknik",
      "jurusan": "Informatika",
      "tahunMasuk": "2023",
      "createdAt": "2025-01-02T00:00:00.000Z"
    },
    {
      "id": "3",
      "name": "Siti Aminah",
      "email": "siti@student.ac.id",
      "password": "mahasiswa123",
      "nim": "M789012",
      "role": "mahasiswa",
      "fakultas": "Ekonomi",
      "jurusan": "Manajemen",
      "tahunMasuk": "2024",
      "createdAt": "2025-01-03T00:00:00.000Z"
    }
  ],
  beasiswas: [
    {
      "id": "1",
      "nama": "Beasiswa Prestasi Akademik",
      "deskripsi": "Beasiswa untuk mahasiswa dengan prestasi akademik tinggi",
      "kuota": 10,
      "minIpk": 3.5,
      "tanggalBuka": "2025-01-01T00:00:00.000Z",
      "tanggalTutup": "2025-06-30T23:59:59.000Z",
      "status": "aktif",
      "createdAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": "2",
      "nama": "Beasiswa Peningkatan Prestasi Akademik",
      "deskripsi": "Beasiswa untuk mahasiswa yang menunjukkan peningkatan prestasi akademik",
      "kuota": 5,
      "minIpk": 3.0,
      "tanggalBuka": "2025-02-01T00:00:00.000Z",
      "tanggalTutup": "2025-03-31T23:59:59.000Z",
      "status": "aktif",
      "createdAt": "2025-01-15T00:00:00.000Z"
    },
    {
      "id": "3",
      "nama": "Beasiswa Mahasiswa Berprestasi",
      "deskripsi": "Beasiswa untuk mahasiswa dengan prestasi di bidang akademik dan non-akademik",
      "kuota": 7,
      "minIpk": 3.25,
      "tanggalBuka": "2025-03-01T00:00:00.000Z",
      "tanggalTutup": "2025-04-30T23:59:59.000Z",
      "status": "aktif",
      "createdAt": "2025-02-01T00:00:00.000Z"
    }
  ],
  pendaftarans: [],
  dokumens: [],
  notifikasis: []
};

/**
 * Buat direktori secara rekursif jika belum ada
 * @param {string} dir - Path direktori
 */
function createDirectory(dir) {
  const fullPath = path.join(ROOT_DIR, dir);
  if (!fs.existsSync(fullPath)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(fullPath, { recursive: true });
  }
}

/**
 * Tulis file JSON
 * @param {string} filename - Nama file
 * @param {object} data - Data yang akan ditulis
 */
function writeJsonFile(filename, data) {
  const fullPath = path.join(ROOT_DIR, 'data', `${filename}.json`);
  console.log(`Writing file: ${fullPath}`);
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
}

/**
 * Inisialisasi proyek
 */
function initialize() {
  console.log('🚀 Initializing SIBO project...');
  
  // Buat direktori
  DIRECTORIES.forEach(dir => createDirectory(dir));
  
  // Tulis file data JSON
  Object.keys(INITIAL_DATA).forEach(key => {
    writeJsonFile(key, INITIAL_DATA[key]);
  });
  
  console.log('✅ Project initialized successfully!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Run "npm install" to install dependencies');
  console.log('2. Run "npm run dev" to start the development server');
  console.log('3. Open http://localhost:3000 in your browser');
  console.log('');
  console.log('Available accounts:');
  console.log('- Admin: admin@sibo.ac.id / admin123');
  console.log('- Mahasiswa: budi@student.ac.id / mahasiswa123');
}

// Run initialization
initialize();