// app/api/users/logout/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Hapus semua cookie autentikasi
    cookies().delete('userId');
    cookies().delete('userRole');
    cookies().delete('sessionExpiry');
    
    // Response untuk redirect ke login
    return NextResponse.json({
      success: true,
      message: 'Logout berhasil',
      redirect: '/login'
    });
  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat logout' },
      { status: 500 }
    );
  }
}