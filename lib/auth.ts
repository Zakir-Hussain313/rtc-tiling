import { SignJWT, jwtVerify } from 'jose';

const JWT_EXPIRES_IN = '8h';
export const COOKIE_NAME = 'rtc_admin_token';

type TokenPayload = {
    role: 'admin';
    iat?: number;
    exp?: number;
};

function getJwtSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined');
    return new TextEncoder().encode(secret);
}

export async function signToken(): Promise<string> {
    return await new SignJWT({ role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRES_IN)
        .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, getJwtSecret());
        return payload as TokenPayload;
    } catch {
        return null;
    }
}

export function buildCookieHeader(token: string): string {
    const isProduction = process.env.NODE_ENV === 'production';
    return [
        `${COOKIE_NAME}=${token}`,
        'HttpOnly',
        'Path=/',
        'SameSite=Lax',
        `Max-Age=${8 * 60 * 60}`,
        isProduction ? 'Secure' : '',
    ]
        .filter(Boolean)
        .join('; ');
}

export function clearCookieHeader(): string {
    const isProduction = process.env.NODE_ENV === 'production';
    return [
        `${COOKIE_NAME}=`,
        'HttpOnly',
        'Path=/',
        'SameSite=Lax',
        'Max-Age=0',
        isProduction ? 'Secure' : '',
    ]
        .filter(Boolean)
        .join('; ');
}

export function getTokenFromCookies(cookieHeader: string | null): string | null {
    if (!cookieHeader) return null;
    const cookies = cookieHeader.split(';').map(c => c.trim());
    for (const cookie of cookies) {
        if (cookie.startsWith(`${COOKIE_NAME}=`)) {
            return cookie.substring(COOKIE_NAME.length + 1);
        }
    }
    return null;
}