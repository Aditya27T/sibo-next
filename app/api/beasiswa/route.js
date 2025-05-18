// app/api/beasiswa/route.js
import { NextResponse } from 'next/server';
import { readData, findOne, insertData, updateData, deleteData } from '@/utils/filedb';
import { getCurrentUser, hasRole } from '@/utils/auth';

// GET semua beasiswa
export async function GET(request) {
  try {
    const beasiswas = readData('beasiswas') || [];
    
    // Filter beasiswa berdasarkan status jika ada query
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    if (status) {
      const filteredBeasiswas = beasiswas.filter(beasiswa => beasiswa.status === status);
      return NextResponse.json({ success: true, data: filteredBeasiswas });
    }
    
    return NextResponse.json({ success: true, data: beasiswas });
  } catch (error) {
    console.error('Error fetching beasiswas:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat mengambil data beasiswa' },
      { status: 500 }
    );
  }
}

// POST beasiswa baru (hanya admin)
export async function POST(request) {
  try {
    const user = getCurrentUser();
    
    // Cek apakah user adalah admin
    if (!user || !hasRole('admin')) {
      return NextResponse.json(
        { success: false, message: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }
    
    const beasiswaData = await request.json();
    
    // Validasi input dasar
    const requiredFields = ['nama', 'deskripsi', 'kuota', 'minIpk', 'tanggalBuka', 'tanggalTutup'];
    for (const field of requiredFields) {
      if (!beasiswaData[field]) {
        return NextResponse.json(
          { success: false, message: `Field ${field} diperlukan` },
          { status: 400 }
        );
      }
    }
    
    // Set status default jika tidak ada
    if (!beasiswaData.status) {
      beasiswaData.status = 'aktif';
    }
    
    // Simpan beasiswa baru
    const createdBeasiswa = insertData('beasiswas', beasiswaData);
    
    return NextResponse.json({
      success: true,
      message: 'Beasiswa berhasil dibuat',
      data: createdBeasiswa
    });
    
  } catch (error) {
    console.error('Create beasiswa error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat membuat beasiswa' },
      { status: 500 }
    );
  }
}