// app/api/pendaftaran/[id]/route.js
import { NextResponse } from 'next/server';
import { findOne, insertData, updateData } from '@/utils/filedb';
import { getCurrentUser, hasRole } from '@/utils/auth';

// GET pendaftaran by ID
export async function GET(request, { params }) {
  try {
    const user = getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }
    
    const id = params.id;
    const pendaftaran = findOne('pendaftarans', p => p.id === id);
    
    if (!pendaftaran) {
      return NextResponse.json(
        { success: false, message: 'Pendaftaran tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Cek izin akses (admin atau pemilik pendaftaran)
    if (user.role !== 'admin' && pendaftaran.mahasiswaId !== user.id) {
      return NextResponse.json(
        { success: false, message: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }
    
    // Get beasiswa details
    const beasiswa = findOne('beasiswas', b => b.id === pendaftaran.beasiswaId);
    
    return NextResponse.json({
      success: true,
      data: {
        ...pendaftaran,
        beasiswaNama: beasiswa ? beasiswa.nama : 'Beasiswa tidak ditemukan'
      }
    });
    
  } catch (error) {
    console.error('Get pendaftaran error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat mengambil data pendaftaran' },
      { status: 500 }
    );
  }
}

// PUT update status pendaftaran (hanya admin)
export async function PUT(request, { params }) {
  try {
    const user = getCurrentUser();
    
    // Cek apakah user adalah admin
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }
    
    const id = params.id;
    const updateData = await request.json();
    
    // Validasi status
    const validStatus = ['menunggu', 'diterima', 'ditolak'];
    if (updateData.status && !validStatus.includes(updateData.status)) {
      return NextResponse.json(
        { success: false, message: 'Status tidak valid' },
        { status: 400 }
      );
    }
    
    // Update pendaftaran
    const pendaftaran = findOne('pendaftarans', p => p.id === id);
    
    if (!pendaftaran) {
      return NextResponse.json(
        { success: false, message: 'Pendaftaran tidak ditemukan' },
        { status: 404 }
      );
    }
    
    const updatedPendaftaran = updateData('pendaftarans', id, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    
    // Tambahkan notifikasi untuk mahasiswa
    let notifikasiTitle, notifikasiMessage;
    
    if (updateData.status === 'diterima') {
      notifikasiTitle = 'Pendaftaran Beasiswa Diterima';
      notifikasiMessage = `Selamat! Pendaftaran beasiswa Anda telah diterima.`;
    } else if (updateData.status === 'ditolak') {
      notifikasiTitle = 'Pendaftaran Beasiswa Ditolak';
      notifikasiMessage = `Maaf, pendaftaran beasiswa Anda ditolak.`;
    }
    
    if (notifikasiTitle && notifikasiMessage) {
      const notifikasi = {
        userId: pendaftaran.mahasiswaId,
        title: notifikasiTitle,
        message: notifikasiMessage,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      
      insertData('notifikasis', notifikasi);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil diperbarui',
      data: updatedPendaftaran
    });
    
  } catch (error) {
    console.error('Update pendaftaran error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat memperbarui pendaftaran' },
      { status: 500 }
    );
  }
}