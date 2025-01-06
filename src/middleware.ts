import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuid } from 'uuid';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Check if the cookie is already set
  const cookie = request.cookies.get('session');

  if (!cookie) {
    // Set the cookie if it doesn't exist
    response.cookies.set('session', uuid(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });
  }

  return response;
}

export const config = {
  matcher: '/:path*', // Apply to all paths
};