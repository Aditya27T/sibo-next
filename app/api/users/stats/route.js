// app/api/users/stats/route.js
import { NextResponse } from 'next/server';
import { readData } from '@/utils/filedb';
import { getCurrentUser, hasRole } from '@/utils/auth';

export async function GET() {
  try {
    const user = getCurrentUser();
    
    // Cek apakah user adalah admin
    if (!user || !hasRole('admin')) {
      return NextResponse.json(
        { success: false, message: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }
    
    // Dapatkan semua user
    const users = readData('users') || [];
    
    // Hitung jumlah mahasiswa
    const totalMahasiswa = users.filter(u => u.role === 'mahasiswa').length;
    
    return NextResponse.json({
      success: true,
      totalMahasiswa
    });
    
  } catch (error) {
    console.error('Get user stats error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat mendapatkan statistik user' },
      { status: 500 }
    );
  }
}