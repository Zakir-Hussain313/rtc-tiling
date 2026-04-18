import { NextResponse } from 'next/server';
import { clearCookieHeader } from 'lib/auth';

export async function POST() {
    try {
        const cookie = clearCookieHeader();

        return NextResponse.json(
            { success: true },
            {
                status: 200,
                headers: { 'Set-Cookie': cookie },
            }
        );
    } catch (error) {
        console.error('[AUTH LOGOUT]', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}