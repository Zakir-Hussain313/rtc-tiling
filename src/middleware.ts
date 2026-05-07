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
        const isAdminPage = pathname.startsWith('/admin');
        const isApiRoute = pathname.startsWith('/api');

        if (isApiRoute && req.method === 'GET') return NextResponse.next();

        const token = getTokenFromCookies(req.headers.get('cookie'));
        if (!token) {
            if (isAdminPage) {
                return NextResponse.redirect(new URL('/login', req.url));
            }
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            if (isAdminPage) {
                return NextResponse.redirect(new URL('/login', req.url));
            }
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    return NextResponse.next();
}