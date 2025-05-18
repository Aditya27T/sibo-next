// app/api/dokumen/route.js
import { NextResponse } from 'next/server';
import { findOne, findData, insertData, updateData } from '@/utils/filedb';
import { getCurrentUser } from '@/utils/auth';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

// GET semua dokumen milik mahasiswa tertentu
export async function GET(request) {
  try {
    const user = getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }
    
    let dokumens;
    
    // Jika admin, bisa lihat semua dokumen (filter by mahasiswaId jika ada)
    if (user.role === 'admin') {
      const { searchParams } = new URL(request.url);
      const mahasiswaId = searchParams.get('mahasiswaId');
      
      if (mahasiswaId) {
        dokumens = findData('dokumens', d => d.mahasiswaId === mahasiswaId) || [];
      } else {
        dokumens = findData('dokumens', () => true) || [];
      }
    } 
    // Jika mahasiswa, hanya lihat dokumen miliknya
    else {
      dokumens = findData('dokumens', d => d.mahasiswaId === user.id) || [];
    }
    
    return NextResponse.json({
      success: true,
      data: dokumens
    });
    
  } catch (error) {
    console.error('Get dokumens error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat mengambil data dokumen' },
      { status: 500 }
    );
  }
}

// POST upload dokumen baru (hanya mahasiswa)
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
    
    // Parse form data
    const formData = await request.formData();
    const pendaftaranId = formData.get('pendaftaranId');
    const jenisDokumen = formData.get('jenisDokumen');
    const file = formData.get('file');
    
    // Validasi input
    if (!pendaftaranId || !jenisDokumen || !file) {
      return NextResponse.json(
        { success: false, message: 'Semua field diperlukan (pendaftaranId, jenisDokumen, file)' },
        { status: 400 }
      );
    }
    
    // Validasi jenis file (hanya PDF)
    if (!file.name.endsWith('.pdf')) {
      return NextResponse.json(
        { success: false, message: 'Hanya file PDF yang diperbolehkan' },
        { status: 400 }
      );
    }
    
    // Cek apakah pendaftaran ada dan milik mahasiswa ini
    const pendaftaran = findOne(
      'pendaftarans',
      p => p.id === pendaftaranId && p.mahasiswaId === user.id
    );
    
    if (!pendaftaran) {
      return NextResponse.json(
        { success: false, message: 'Pendaftaran tidak ditemukan atau bukan milik Anda' },
        { status: 404 }
      );
    }
    
    // Cek apakah jenis dokumen ini sudah diupload sebelumnya
    const existingDokumen = findOne(
      'dokumens',
      d => d.pendaftaranId === pendaftaranId && d.jenisDokumen === jenisDokumen
    );
    
    if (existingDokumen) {
      return NextResponse.json(
        { success: false, message: `Dokumen ${jenisDokumen} sudah diupload sebelumnya` },
        { status: 400 }
      );
    }
    
    // Buat folder uploads jika belum ada
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Baca file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate nama file unik
    const timestamp = Date.now();
    const fileName = `${user.id}_${pendaftaranId}_${jenisDokumen.replace(/\s+/g, '_')}_${timestamp}.pdf`;
    const filePath = path.join(uploadsDir, fileName);
    
    // Tulis file ke disk
    await writeFile(filePath, buffer);
    
    // Tambahkan data dokumen
    const dokumenData = {
      pendaftaranId,
      mahasiswaId: user.id,
      mahasiswaNama: user.name,
      jenisDokumen,
      fileName,
      filePath: `/uploads/${fileName}`,
      status: 'menunggu',
      createdAt: new Date().toISOString()
    };
    
    const createdDokumen = insertData('dokumens', dokumenData);
    
    return NextResponse.json({
      success: true,
      message: 'Dokumen berhasil diupload',
      data: createdDokumen
    });
    
  } catch (error) {
    console.error('Upload dokumen error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat mengupload dokumen' },
      { status: 500 }
    );
  }
}

// PUT update status dokumen (hanya admin)
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
    
    // Update dokumen
    const dokumen = findOne('dokumens', d => d.id === id);
    
    if (!dokumen) {
      return NextResponse.json(
        { success: false, message: 'Dokumen tidak ditemukan' },
        { status: 404 }
      );
    }
    
    const updatedDokumen = updateData('dokumens', id, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    
    // Tambahkan notifikasi untuk mahasiswa
    if (updateData.status) {
      let notifikasiTitle, notifikasiMessage;
      
      if (updateData.status === 'diterima') {
        notifikasiTitle = 'Dokumen Diterima';
        notifikasiMessage = `Dokumen ${dokumen.jenisDokumen} Anda telah diterima.`;
      } else if (updateData.status === 'ditolak') {
        notifikasiTitle = 'Dokumen Ditolak';
        notifikasiMessage = `Dokumen ${dokumen.jenisDokumen} Anda ditolak. Silakan upload ulang.`;
      }
      
      if (notifikasiTitle && notifikasiMessage) {
        const notifikasi = {
          userId: dokumen.mahasiswaId,
          title: notifikasiTitle,
          message: notifikasiMessage,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        
        insertData('notifikasis', notifikasi);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Dokumen berhasil diperbarui',
      data: updatedDokumen
    });
    
  } catch (error) {
    console.error('Update dokumen error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat memperbarui dokumen' },
      { status: 500 }
    );
  }
}