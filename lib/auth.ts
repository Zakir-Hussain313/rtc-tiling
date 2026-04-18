import jwt from 'jsonwebtoken';

const JWT_EXPIRES_IN = '8h';
export const COOKIE_NAME = 'rtc_admin_token';

type TokenPayload = {
    role: 'admin';
    iat?: number;
    exp?: number;
};

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    return secret;
}

/**
 * Sign JWT
 */
export function signToken(): string {
    return jwt.sign(
        { role: 'admin' },
        getJwtSecret(),
        { expiresIn: JWT_EXPIRES_IN }
    );
}

/**
 * Verify JWT
 */
export function verifyToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, getJwtSecret());

        if (typeof decoded === 'string') return null;

        return decoded as TokenPayload;
    } catch {
        return null;
    }
}

/**
 * Build auth cookie
 */
export function buildCookieHeader(token: string): string {
    const isProduction = process.env.NODE_ENV === 'production';

    return [
        `${COOKIE_NAME}=${token}`,
        'HttpOnly',
        'Path=/',
        'SameSite=Strict',
        `Max-Age=${8 * 60 * 60}`,
        isProduction ? 'Secure' : '',
    ]
        .filter(Boolean)
        .join('; ');
}

/**
 * Clear auth cookie (logout)
 */
export function clearCookieHeader(): string {
    const isProduction = process.env.NODE_ENV === 'production';

    return [
        `${COOKIE_NAME}=`,
        'HttpOnly',
        'Path=/',
        'SameSite=Strict',
        'Max-Age=0',
        isProduction ? 'Secure' : '',
    ]
        .filter(Boolean)
        .join('; ');
}

/**
 * Extract token from cookie header (VERY useful)
 */
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