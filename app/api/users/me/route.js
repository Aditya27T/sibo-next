// app/api/users/me/route.js
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/utils/auth';

export async function GET() {
  try {
    const user = getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Tidak ditemukan user yang sedang login' },
        { status: 401 }
      );
    }
    
    // Hilangkan password dari response
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Get current user error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat mendapatkan data user' },
      { status: 500 }
    );
  }
}