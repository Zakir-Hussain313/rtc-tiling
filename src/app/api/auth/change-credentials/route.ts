import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from 'lib/mongodb';
import Admin from 'models/Admin';
import { verifyToken } from 'lib/auth';

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('rtc_admin_token')?.value;
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { currentPassword, newUsername, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Current password and new password are required' }, { status: 400 });
        }

        await connectDB();
        const admin = await Admin.findOne({});

        if (!admin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        const passwordMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
        if (!passwordMatch) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
        }

        if (newUsername && newUsername.trim()) admin.username = newUsername.trim();
        admin.passwordHash = await bcrypt.hash(newPassword, 10);
        await admin.save();

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error('[CHANGE CREDENTIALS ERROR]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}