import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Stats from '../../../../models/Stats';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        await connectDB();
        const stats = await Stats.findOne();
        return NextResponse.json({ success: true, data: stats ?? null }, { status: 200 });
    } catch (error) {
        console.error('[GET /api/stats]', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();

        let body: unknown;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        if (typeof body !== 'object' || body === null) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const { stats } = body as Record<string, unknown>;

        if (!Array.isArray(stats) || stats.length !== 4) {
            return NextResponse.json(
                { error: 'stats must be an array of exactly 4 items' },
                { status: 400 }
            );
        }

        for (const stat of stats) {
            if (
                typeof stat !== 'object' ||
                stat === null ||
                typeof (stat as Record<string, unknown>).value !== 'string' ||
                typeof (stat as Record<string, unknown>).suffix !== 'string' ||
                !(stat as Record<string, unknown>).suffix ||
                typeof (stat as Record<string, unknown>).label !== 'string' ||
                !(stat as Record<string, unknown>).label
            ) {
                return NextResponse.json(
                    { error: 'Each stat must have a value, suffix, and label' },
                    { status: 400 }
                );
            }
        }

        const updated = await Stats.findOneAndUpdate(
            {},
            { $set: { stats } },
            { new: true, upsert: true }
        );

        revalidatePath('/', 'layout')
        return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error) {
        console.error('[PUT /api/stats]', error);
        return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
    }
}