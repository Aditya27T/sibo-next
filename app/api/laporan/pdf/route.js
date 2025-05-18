// app/api/laporan/pdf/route.js
import { NextResponse } from 'next/server';
import { readData, findOne, findData } from '@/utils/filedb';
import { getCurrentUser, hasRole } from '@/utils/auth';
import { renderToBuffer } from '@react-pdf/renderer';
import { BeasiswaReport } from '@/components/BeasiswaReport';

export async function GET(request) {
  try {
    const user = getCurrentUser();
    
    // Cek apakah user adalah admin
    if (!user || !hasRole('admin')) {
      return NextResponse.json(
        { success: false, message: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }
    
    // Get query params
    const { searchParams } = new URL(request.url);
    const beasiswaId = searchParams.get('beasiswaId');
    const status = searchParams.get('status');
    
    if (!beasiswaId) {
      return NextResponse.json(
        { success: false, message: 'Parameter beasiswaId diperlukan' },
        { status: 400 }
      );
    }
    
    // Get beasiswa data
    const beasiswa = findOne('beasiswas', b => b.id === beasiswaId);
    
    if (!beasiswa) {
      return NextResponse.json(
        { success: false, message: 'Beasiswa tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Get pendaftarans for the beasiswa
    let pendaftarans = findData('pendaftarans', p => p.beasiswaId === beasiswaId) || [];
    
    // Filter by status if provided
    if (status && status !== 'semua') {
      pendaftarans = pendaftarans.filter(p => p.status === status);
    }
    
    // Generate PDF using @react-pdf/renderer
    const reportData = {
      beasiswa,
      pendaftarans,
      tanggalCetak: new Date().toISOString(),
      adminName: user.name,
    };
    
    // Render PDF to buffer
    const pdfBuffer = await renderToBuffer(<BeasiswaReport data={reportData} />);
    
    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Laporan_${beasiswa.nama.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat membuat laporan PDF' },
      { status: 500 }
    );
  }
}