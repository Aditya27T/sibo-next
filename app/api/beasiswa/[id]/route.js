// app/api/beasiswa/[id]/route.js
import { NextResponse } from 'next/server';
import { findOne, updateData, deleteData } from '@/utils/filedb';
import { getCurrentUser, hasRole } from '@/utils/auth';

// GET beasiswa berdasarkan ID
export async function GET(request, { params }) {
  try {
    const id = params.id;
    const beasiswa = findOne('beasiswas', b => b.id === id);
    
    if (!beasiswa) {
      return NextResponse.json(
        { success: false, message: 'Beasiswa tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: beasiswa });
  } catch (error) {
    console.error('Get beasiswa error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat mengambil data beasiswa' },
      { status: 500 }
    );
  }
}

// PUT update beasiswa (hanya admin)
export async function PUT(request, { params }) {
  try {
    const user = getCurrentUser();
    
    // Cek apakah user adalah admin
    if (!user || !hasRole('admin')) {
      return NextResponse.json(
        { success: false, message: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }
    
    const id = params.id;
    const updateDataContent = await request.json();
    
    // Update beasiswa
    const updatedBeasiswa = updateData('beasiswas', id, updateDataContent);
    
    if (!updatedBeasiswa) {
      return NextResponse.json(
        { success: false, message: 'Beasiswa tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Beasiswa berhasil diperbarui',
      data: updatedBeasiswa
    });
    
  } catch (error) {
    console.error('Update beasiswa error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat memperbarui beasiswa' },
      { status: 500 }
    );
  }
}

// DELETE beasiswa (hanya admin)
export async function DELETE(request, { params }) {
  try {
    const user = getCurrentUser();
    
    // Cek apakah user adalah admin
    if (!user || !hasRole('admin')) {
      return NextResponse.json(
        { success: false, message: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }
    
    const id = params.id;
    
    // Hapus beasiswa
    const isDeleted = deleteData('beasiswas', id);
    
    if (!isDeleted) {
      return NextResponse.json(
        { success: false, message: 'Beasiswa tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Beasiswa berhasil dihapus'
    });
    
  } catch (error) {
    console.error('Delete beasiswa error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat menghapus beasiswa' },
      { status: 500 }
    );
  }
}