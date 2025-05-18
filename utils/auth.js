// utils/auth.js
import { findOne } from './filedb';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Memeriksa kredensial login
 * @param {string} email - Email user
 * @param {string} password - Password user
 * @returns {Object|null} - User yang ditemukan atau null
 */
export function verifyCredentials(email, password) {
  const user = findOne('users', user => user.email === email);
  
  if (!user) {
    return null;
  }
  
  // Catatan: Dalam aplikasi produksi, password harus di-hash
  if (user.password !== password) {
    return null;
  }
  
  // Jangan sertakan password saat mengembalikan data user
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Membuat session login
 * @param {Object} user - Data user
 * @param {boolean} rememberMe - Apakah user ingin disimpan sesi (opsional)
 */
export function createSession(user, rememberMe = false) {
  // Dalam aplikasi produksi, kita harus menggunakan token JWT yang aman
  // atau sistem session yang lebih baik, bukan hanya menyimpan ID di cookie
  const { id, role } = user;
  
  // Set expiry time berdasarkan pilihan "Remember Me"
  // 7 hari jika rememberMe, 24 jam jika tidak
  const maxAge = rememberMe 
    ? 60 * 60 * 24 * 7  // 7 hari
    : 60 * 60 * 24;     // 1 hari
  
  // Set secure options berdasarkan environment
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Set cookie untuk user ID
  cookies().set({
    name: 'userId',
    value: id,
    httpOnly: true,
    path: '/',
    secure: isProduction,
    sameSite: 'lax',
    maxAge: maxAge,
  });
  
  // Set cookie untuk user role
  cookies().set({
    name: 'userRole',
    value: role,
    httpOnly: true,
    path: '/',
    secure: isProduction,
    sameSite: 'lax',
    maxAge: maxAge,
  });
  
  // Set cookie untuk session expiry date untuk UI
  cookies().set({
    name: 'sessionExpiry',
    value: new Date(Date.now() + maxAge * 1000).toISOString(),
    httpOnly: false,  // Agar bisa diakses oleh JavaScript untuk UI
    path: '/',
    secure: isProduction,
    sameSite: 'lax',
    maxAge: maxAge,
  });
}

/**
 * Mendapatkan user dari session
 * @returns {Object|null} - User yang sedang login atau null
 */
export function getCurrentUser() {
  const userId = cookies().get('userId')?.value;
  
  if (!userId) {
    return null;
  }
  
  const user = findOne('users', user => user.id === userId);
  
  if (!user) {
    // Hapus cookie jika user tidak ditemukan
    logout();
    return null;
  }
  
  // Jangan sertakan password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Memeriksa apakah user sudah login
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!cookies().get('userId')?.value;
}

/**
 * Memeriksa apakah user memiliki role tertentu
 * @param {string} requiredRole - Role yang dibutuhkan
 * @returns {boolean}
 */
export function hasRole(requiredRole) {
  const userRole = cookies().get('userRole')?.value;
  return userRole === requiredRole;
}

/**
 * Memperpanjang session
 */
export function extendSession() {
  const userId = cookies().get('userId')?.value;
  const userRole = cookies().get('userRole')?.value;
  
  if (!userId || !userRole) {
    return;
  }
  
  // Perpanjang session untuk 24 jam
  cookies().set({
    name: 'userId',
    value: userId,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 jam
  });
  
  cookies().set({
    name: 'userRole',
    value: userRole,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 jam
  });
  
  cookies().set({
    name: 'sessionExpiry',
    value: new Date(Date.now() + 60 * 60 * 24 * 1000).toISOString(),
    httpOnly: false,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 jam
  });
}

/**
 * Logout user
 */
export function logout() {
  cookies().delete('userId');
  cookies().delete('userRole');
  cookies().delete('sessionExpiry');
}

/**
 * Middleware untuk route yang memerlukan login
 * @param {string} redirectTo - URL redirect jika tidak login
 */
export function requireAuth(redirectTo = '/login') {
  if (!isAuthenticated()) {
    redirect(redirectTo);
  }
}

/**
 * Middleware untuk route yang memerlukan role tertentu
 * @param {string} requiredRole - Role yang dibutuhkan
 * @param {string} redirectTo - URL redirect jika tidak memiliki role
 */
export function requireRole(requiredRole, redirectTo = '/login') {
  if (!isAuthenticated() || !hasRole(requiredRole)) {
    redirect(redirectTo);
  }
}

export default {
  verifyCredentials,
  createSession,
  getCurrentUser,
  isAuthenticated,
  hasRole,
  extendSession,
  logout,
  requireAuth,
  requireRole
};