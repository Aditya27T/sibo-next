// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Mendapatkan cookies dari request
  const userId = request.cookies.get('userId')?.value;
  const userRole = request.cookies.get('userRole')?.value;
  
  // URL saat ini dan URL untuk redirect
  const { pathname } = request.nextUrl;
  const loginUrl = new URL('/login', request.url);
  const homeUrl = new URL('/', request.url);
  
  // Tambahkan parameter returnUrl ke URL login untuk redirect setelah login
  loginUrl.searchParams.set('returnUrl', pathname);
  
  // Rute publik yang tidak memerlukan autentikasi
  const publicRoutes = ['/', '/login', '/register', '/api/users/login', '/api/users/register'];
  
  // Cek apakah rute saat ini adalah publik
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/api/users/login') || pathname.startsWith('/api/users/register')
  );
  
  // Jika rute publik, biarkan request lanjut
  if (isPublicRoute) {
    // Jika sudah login dan mencoba akses login/register, redirect ke dashboard
    if (userId && (pathname === '/login' || pathname === '/register')) {
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/mahasiswa/dashboard', request.url));
      }
    }
    
    return NextResponse.next();
  }
  
  // Jika belum login dan mencoba akses rute terproteksi, redirect ke login
  if (!userId) {
    console.log('No userId cookie, redirecting to login');
    return NextResponse.redirect(loginUrl);
  }
  
  // Admin Routes Protection
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (userRole !== 'admin') {
      // Jika bukan admin, redirect ke forbidden atau dashboard mahasiswa
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }
  
  // Mahasiswa Routes Protection
  if (pathname.startsWith('/mahasiswa') || pathname.startsWith('/api/mahasiswa')) {
    if (userRole !== 'mahasiswa') {
      // Jika bukan mahasiswa, redirect ke forbidden atau dashboard admin
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }
  
  // API Routes Protection
  if (pathname.startsWith('/api/') && 
      !pathname.startsWith('/api/users/login') &&
      !pathname.startsWith('/api/users/register') &&
      !pathname.startsWith('/api/users/logout')) {
    
    // Jika belum login, return unauthorized
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Admin only API routes
    const adminApiRoutes = ['/api/beasiswa', '/api/laporan'];
    
    // Cek akses API khusus admin
    if (adminApiRoutes.some(route => pathname.startsWith(route)) && userRole !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }
  }
  
  // Lanjutkan ke request berikutnya jika semua pengecekan sukses
  return NextResponse.next();
}

// Konfigurasi path mana yang akan diproses oleh middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};