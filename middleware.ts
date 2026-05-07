
import { getTokenFromCookies, verifyToken } from "lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/projects/:path*',
        '/api/services/:path*',
        '/api/hero',
        '/api/about',
        '/api/stats',
        '/api/testimonials',
    ],
};

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('your-cookie-name')?.value;
    console.log('[Middleware] path:', req.nextUrl.pathname);
    console.log('[Middleware] token:', token ?? 'NO TOKEN FOUND');
    const { pathname } = req.nextUrl;

    const isProtected =
        pathname.startsWith('/admin') ||
        pathname.startsWith('/api/projects') ||
        pathname.startsWith('/api/services') ||
        pathname === '/api/hero' ||
        pathname === '/api/about' ||
        pathname === '/api/stats' ||
        pathname === '/api/testimonials';

    if (isProtected) {
        if (req.method === 'GET') return NextResponse.next();

        const token = getTokenFromCookies(req.headers.get('cookie'));
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Actually verify the token isn't expired or tampered
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    return NextResponse.next();
}