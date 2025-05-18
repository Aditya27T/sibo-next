// app/api/users/extend-session/route.js
import { NextResponse } from 'next/server';
import { getCurrentUser, extendSession } from '@/utils/auth';

export async function POST() {
  try {
    const user = getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Tidak ditemukan user yang sedang login' },
        { status: 401 }
      );
    }
    
    // Perpanjang session
    extendSession();
    
    return NextResponse.json({
      success: true,
      message: 'Sesi berhasil diperpanjang'
    });
    
  } catch (error) {
    console.error('Extend session error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat memperpanjang sesi' },
      { status: 500 }
    );
  }
}