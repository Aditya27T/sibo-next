// utils/filedb.js
import fs from 'fs';
import path from 'path';

// Path ke direktori data
const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Membaca data dari file JSON
 * @param {string} filename - Nama file tanpa ekstensi .json
 * @returns {Array|Object} - Data dari file JSON
 */
export function readData(filename) {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  
  // Cek apakah file ada
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  // Baca dan parse file JSON
  const rawData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(rawData);
}

/**
 * Menulis data ke file JSON
 * @param {string} filename - Nama file tanpa ekstensi .json
 * @param {Array|Object} data - Data yang akan ditulis
 * @returns {boolean} - Status keberhasilan
 */
export function writeData(filename, data) {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  
  // Pastikan direktori data ada
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  // Tulis data ke file JSON
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing to ${filename}.json:`, error);
    return false;
  }
}

/**
 * Mencari data berdasarkan kriteria
 * @param {string} filename - Nama file tanpa ekstensi .json
 * @param {Function} predicate - Fungsi filter untuk mencari data
 * @returns {Array|Object|null} - Data yang ditemukan
 */
export function findData(filename, predicate) {
  const data = readData(filename);
  
  if (!data || !Array.isArray(data)) {
    return null;
  }
  
  return data.filter(predicate);
}

/**
 * Mencari data tunggal berdasarkan kriteria
 * @param {string} filename - Nama file tanpa ekstensi .json
 * @param {Function} predicate - Fungsi filter untuk mencari data
 * @returns {Object|null} - Data yang ditemukan
 */
export function findOne(filename, predicate) {
  const data = readData(filename);
  
  if (!data || !Array.isArray(data)) {
    return null;
  }
  
  return data.find(predicate) || null;
}

/**
 * Menambahkan data baru ke file JSON
 * @param {string} filename - Nama file tanpa ekstensi .json
 * @param {Object} newData - Data baru yang akan ditambahkan
 * @returns {Object} - Data yang ditambahkan dengan ID
 */
export function insertData(filename, newData) {
  const data = readData(filename) || [];
  
  // Generate ID sederhana
  const id = Date.now().toString();
  const dataWithId = { id, ...newData, createdAt: new Date().toISOString() };
  
  // Tambahkan data baru
  const updatedData = [...data, dataWithId];
  writeData(filename, updatedData);
  
  return dataWithId;
}

/**
 * Memperbarui data berdasarkan ID
 * @param {string} filename - Nama file tanpa ekstensi .json
 * @param {string} id - ID data yang akan diperbarui
 * @param {Object} updateData - Data baru untuk memperbarui
 * @returns {Object|null} - Data yang diperbarui atau null jika tidak ditemukan
 */
export function updateData(filename, id, updateData) {
  const data = readData(filename);
  
  if (!data || !Array.isArray(data)) {
    return null;
  }
  
  const index = data.findIndex(item => item.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Update data
  const updatedItem = { 
    ...data[index], 
    ...updateData, 
    updatedAt: new Date().toISOString() 
  };
  
  data[index] = updatedItem;
  writeData(filename, data);
  
  return updatedItem;
}

/**
 * Menghapus data berdasarkan ID
 * @param {string} filename - Nama file tanpa ekstensi .json
 * @param {string} id - ID data yang akan dihapus
 * @returns {boolean} - Status keberhasilan
 */
export function deleteData(filename, id) {
  const data = readData(filename);
  
  if (!data || !Array.isArray(data)) {
    return false;
  }
  
  const filteredData = data.filter(item => item.id !== id);
  
  if (filteredData.length === data.length) {
    return false; // Tidak ada yang dihapus
  }
  
  writeData(filename, filteredData);
  return true;
}

// Initialisasi file-file JSON jika belum ada
export function initializeDataFiles() {
  // Pastikan direktori data ada
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  const files = ['users', 'beasiswas', 'pendaftarans', 'dokumens', 'notifikasis'];
  
  files.forEach(file => {
    const filePath = path.join(DATA_DIR, `${file}.json`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
    }
  });
}

// Export fungsi-fungsi untuk digunakan di modul lain
export default {
  readData,
  writeData,
  findData,
  findOne,
  insertData,
  updateData,
  deleteData,
  initializeDataFiles
};