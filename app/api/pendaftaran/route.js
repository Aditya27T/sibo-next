// app/api/pendaftaran/route.js
import { NextResponse } from 'next/server';
import { findOne, findData, insertData, updateData } from '@/utils/filedb';
import { getCurrentUser, hasRole } from '@/utils/auth';

// GET semua pendaftaran (admin) atau pendaftaran milik mahasiswa tertentu
export async function GET(request) {
  try {
    const user = getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }
    
    let pendaftarans;
    
    // Jika admin, bisa lihat semua pendaftaran
    if (user.role === 'admin') {
      pendaftarans = findData('pendaftarans', () => true) || [];
      
      // Get query params
      const { searchParams } = new URL(request.url);
      const status = searchParams.get('status');
      const beasiswaId = searchParams.get('beasiswaId');
      
      // Filter berdasarkan status jika ada
      if (status) {
        pendaftarans = pendaftarans.filter(p => p.status === status);
      }
      
      // Filter berdasarkan beasiswaId jika ada
      if (beasiswaId) {
        pendaftarans = pendaftarans.filter(p => p.beasiswaId === beasiswaId);
      }
    } 
    // Jika mahasiswa, hanya lihat pendaftaran miliknya
    else {
      pendaftarans = findData('pendaftarans', p => p.mahasiswaId === user.id) || [];
    }
    
    // Enrich data with beasiswa details for each pendaftaran
    const enrichedPendaftarans = pendaftarans.map(pendaftaran => {
      const beasiswa = findOne('beasiswas', b => b.id === pendaftaran.beasiswaId);
      return {
        ...pendaftaran,
        beasiswaNama: beasiswa ? beasiswa.nama : 'Beasiswa tidak ditemukan'
      };
    });
    
    return NextResponse.json({
      success: true,
      data: enrichedPendaftarans
    });
    
  } catch (error) {
    console.error('Get pendaftarans error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat mengambil data pendaftaran' },
      { status: 500 }
    );
  }
}

// POST pendaftaran baru (hanya mahasiswa)
export async function POST(request) {
  try {
    const user = getCurrentUser();
    
    // Cek apakah user adalah mahasiswa
    if (!user || user.role !== 'mahasiswa') {
      return NextResponse.json(
        { success: false, message: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }
    
    const pendaftaranData = await request.json();
    
    // Validasi input dasar
    const requiredFields = ['beasiswaId', 'ipk', 'alasan'];
    for (const field of requiredFields) {
      if (!pendaftaranData[field]) {
        return NextResponse.json(
          { success: false, message: `Field ${field} diperlukan` },
          { status: 400 }
        );
      }
    }
    
    // Cek apakah beasiswa ada dan masih aktif
    const beasiswa = findOne('beasiswas', b => b.id === pendaftaranData.beasiswaId);
    
    if (!beasiswa) {
      return NextResponse.json(
        { success: false, message: 'Beasiswa tidak ditemukan' },
        { status: 404 }
      );
    }
    
    if (beasiswa.status !== 'aktif') {
      return NextResponse.json(
        { success: false, message: 'Beasiswa tidak aktif' },
        { status: 400 }
      );
    }
    
    // Cek apakah pendaftaran beasiswa ini sudah pernah dilakukan
    const existingPendaftaran = findOne(
      'pendaftarans',
      p => p.mahasiswaId === user.id && p.beasiswaId === pendaftaranData.beasiswaId
    );
    
    if (existingPendaftaran) {
      return NextResponse.json(
        { success: false, message: 'Anda sudah mendaftar untuk beasiswa ini' },
        { status: 400 }
      );
    }
    
    // Cek IPK minimum
    if (parseFloat(pendaftaranData.ipk) < parseFloat(beasiswa.minIpk)) {
      return NextResponse.json(
        { success: false, message: `IPK minimum untuk beasiswa ini adalah ${beasiswa.minIpk}` },
        { status: 400 }
      );
    }
    
    // Buat pendaftaran baru
    const newPendaftaran = {
      ...pendaftaranData,
      mahasiswaId: user.id,
      mahasiswaNama: user.name,
      mahasiswaNim: user.nim,
      status: 'menunggu', // Status default
      createdAt: new Date().toISOString()
    };
    
    const createdPendaftaran = insertData('pendaftarans', newPendaftaran);
    
    // Tambahkan notifikasi
    const notifikasi = {
      userId: user.id,
      title: 'Pendaftaran Beasiswa Berhasil',
      message: `Anda telah berhasil mendaftar untuk beasiswa ${beasiswa.nama}. Pendaftaran Anda sedang ditinjau.`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    insertData('notifikasis', notifikasi);
    
    return NextResponse.json({
      success: true,
      message: 'Pendaftaran beasiswa berhasil',
      data: {
        ...createdPendaftaran,
        beasiswaNama: beasiswa.nama
      }
    });
    
  } catch (error) {
    console.error('Create pendaftaran error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat mendaftar beasiswa' },
      { status: 500 }
    );
  }
}