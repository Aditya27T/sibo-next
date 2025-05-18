// app/api/notifikasi/route.js
import { NextResponse } from 'next/server';
import { readData, findData, insertData, updateData } from '@/utils/filedb';
import { getCurrentUser } from '@/utils/auth';

// GET notifikasi untuk user yang sedang login
export async function GET(request) {
  try {
    const user = getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }
    
    // Dapatkan notifikasi untuk user
    const notifikasis = findData('notifikasis', n => n.userId === user.id) || [];
    
    // Sort berdasarkan tanggal terbaru
    notifikasis.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return NextResponse.json({
      success: true,
      data: notifikasis
    });
    
  } catch (error) {
    console.error('Get notifikasi error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat mengambil data notifikasi' },
      { status: 500 }
    );
  }
}

// POST menandai notifikasi sebagai sudah dibaca
export async function POST(request) {
  try {
    const user = getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }
    
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID notifikasi diperlukan' },
        { status: 400 }
      );
    }
    
    // Update notifikasi sebagai sudah dibaca
    const updatedNotifikasi = updateData('notifikasis', id, {
      isRead: true,
      updatedAt: new Date().toISOString()
    });
    
    if (!updatedNotifikasi) {
      return NextResponse.json(
        { success: false, message: 'Notifikasi tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Notifikasi ditandai sebagai sudah dibaca',
      data: updatedNotifikasi
    });
    
  } catch (error) {
    console.error('Mark notifikasi error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat menandai notifikasi' },
      { status: 500 }
    );
  }
}