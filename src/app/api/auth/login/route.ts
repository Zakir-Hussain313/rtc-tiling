import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { buildCookieHeader, signToken } from 'lib/auth';

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const attempts = new Map<string, { count: number; firstAttempt: number }>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = attempts.get(ip);

    if (!record) {
        attempts.set(ip, { count: 1, firstAttempt: now });
        return false;
    }

    if (now - record.firstAttempt > RATE_LIMIT_WINDOW_MS) {
        attempts.set(ip, { count: 1, firstAttempt: now });
        return false;
    }

    if (record.count >= MAX_ATTEMPTS) {
        return true;
    }

    record.count += 1;
    return false;
}

// ✅ valid dummy hash (IMPORTANT)
const DUMMY_HASH =
    '$2a$10$CwTycUXWue0Thq9StjUM0uJ8c9W9jAq56k97X3CJidb8sRP/6IDdG'; // hash for "dummy123"

export async function POST(req: NextRequest) {
    try {
        const ip =
            req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
            '127.0.0.1';

        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Too many login attempts. Try again later.' },
                { status: 429 }
            );
        }

        let body;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        const { username, password } = body || {};

        if (
            typeof username !== 'string' ||
            typeof password !== 'string'
        ) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        if (!trimmedUsername || !trimmedPassword) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = '$2b$10$4j/EzH6iYxsCdTQn5LmYTekVp6LmovrfsQUr9lV8NVIQ68FWUXQdq';

        if (!adminUsername || !adminPasswordHash) {
            console.error('Missing env credentials');
            return NextResponse.json(
                { error: 'Server misconfiguration' },
                { status: 500 }
            );
        }

        const usernameMatch = trimmedUsername === adminUsername;

        const hashToCompare = usernameMatch
            ? adminPasswordHash
            : DUMMY_HASH;

        console.log('--- LOGIN DEBUG ---');
        console.log('username received:', JSON.stringify(trimmedUsername));
        console.log('ADMIN_USERNAME env:', JSON.stringify(adminUsername));
        console.log('username match:', usernameMatch);
        console.log('hash from env:', JSON.stringify(adminPasswordHash));
        console.log('hash starts with $2:', adminPasswordHash?.startsWith('$2'));
        console.log('password received:', JSON.stringify(trimmedPassword));

        const passwordMatch = await bcrypt.compare(
            trimmedPassword,
            hashToCompare
        );

        if (!usernameMatch || !passwordMatch) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const token = signToken();
        const cookie = buildCookieHeader(token);

        return NextResponse.json(
            { success: true },
            {
                status: 200,
                headers: {
                    'Set-Cookie': cookie,
                },
            }
        );
    } catch (err) {
        console.error('[LOGIN ERROR]', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}