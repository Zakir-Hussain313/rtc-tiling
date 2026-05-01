import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { buildCookieHeader, signToken } from 'lib/auth';
import { connectDB } from 'lib/mongodb';
import Admin from 'models/Admin';

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

    if (record.count >= MAX_ATTEMPTS) return true;

    record.count += 1;
    return false;
}

const DUMMY_HASH = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8c9W9jAq56k97X3CJidb8sRP/6IDdG';

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

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
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const { username, password } = body || {};

        if (typeof username !== 'string' || typeof password !== 'string') {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        if (!trimmedUsername || !trimmedPassword) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        await connectDB();
        const admin = await Admin.findOne({ username: trimmedUsername });

        const hashToCompare = admin ? admin.passwordHash : DUMMY_HASH;
        const passwordMatch = await bcrypt.compare(trimmedPassword, hashToCompare);

        if (!admin || !passwordMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = signToken();
        const cookie = buildCookieHeader(token);

        return NextResponse.json(
            { success: true },
            { status: 200, headers: { 'Set-Cookie': cookie } }
        );
    } catch (err) {
        console.error('[LOGIN ERROR]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}