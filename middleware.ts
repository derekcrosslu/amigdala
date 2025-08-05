import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Intercept direct requests to /uploads/* and redirect to our API route
  if (pathname.startsWith('/uploads/')) {
    console.log(`Redirecting ${pathname} to API route`);
    const url = request.nextUrl.clone();
    url.pathname = '/api/image';
    url.searchParams.set('path', pathname);
    
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/uploads/:path*'],
};
