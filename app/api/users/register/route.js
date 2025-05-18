// app/api/users/register/route.js
import { NextResponse } from 'next/server';
import { findOne, insertData } from '@/utils/filedb';

export async function POST(request) {
  try {
    const userData = await request.json();
    
    // Validasi input dasar
    const requiredFields = ['name', 'email', 'password', 'nim', 'fakultas', 'jurusan'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json(
          { success: false, message: `Field ${field} diperlukan` },
          { status: 400 }
        );
      }
    }
    
    // Cek apakah email sudah terdaftar
    const existingUser = findOne('users', user => user.email === userData.email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }
    
    // Cek apakah NIM sudah terdaftar
    const existingNim = findOne('users', user => user.nim === userData.nim);
    if (existingNim) {
      return NextResponse.json(
        { success: false, message: 'NIM sudah terdaftar' },
        { status: 400 }
      );
    }
    
    // Tambahkan role dan createdAt
    const newUser = {
      ...userData,
      role: 'mahasiswa', // Default role untuk registrasi
      createdAt: new Date().toISOString()
    };
    
    // Simpan user baru
    const createdUser = insertData('users', newUser);
    
    // Hilangkan password dari response
    const { password, ...userWithoutPassword } = createdUser;
    
    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Register error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    );
  }
}