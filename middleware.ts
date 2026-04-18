import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromCookies } from 'lib/auth';

export function middleware(req: NextRequest) {
    console.log('🔥 MIDDLEWARE RUNNING:', req.nextUrl.pathname);

    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/admin')) {
        const token = getTokenFromCookies(req.headers.get('cookie'));

        // ✅ Just check existence (not verify)
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};