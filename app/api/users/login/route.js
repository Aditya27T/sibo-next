// app/api/users/login/route.js
import { NextResponse } from 'next/server';
import { verifyCredentials, createSession } from '@/utils/auth';

export async function POST(request) {
  try {
    const { email, password, rememberMe } = await request.json();
    
    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email dan password diperlukan' },
        { status: 400 }
      );
    }
    
    // Verifikasi kredensial
    const user = verifyCredentials(email, password);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email atau password salah' },
        { status: 401 }
      );
    }
    
    // Buat session
    createSession(user, rememberMe);
    
    // Berikan respon berhasil
    return NextResponse.json({
      success: true,
      message: 'Login berhasil',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      redirectTo: user.role === 'admin' ? '/admin/dashboard' : '/mahasiswa/dashboard'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}