import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const isProduction = process.env.DATASET === 'production';
const corsOrigins = isProduction
  ? [
    'domain1',
    'domain2',
    'domain3',
    'domain4',
  ]
  : ['*'];

export function middleware(req: NextRequest) {
  console.log("Call middleware")
  const origin = req.headers.get('origin');
  const res = NextResponse.next();

  // Set CORS headers
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (corsOrigins.includes('*') || corsOrigins.includes(origin || '')) {
    res.headers.set('Access-Control-Allow-Origin', origin || '*');
  }

  return res;
}

export const config = {
  matcher: '/api/:path*', // Match all API routes
};