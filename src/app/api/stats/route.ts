import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Stats from '../../../../models/Stats';

// ── GET /api/stats ─────────────────────────────────

export async function GET() {
    try {
        await connectDB();

        let stats = await Stats.findOne();

        if (!stats) {
            stats = await Stats.create({});
        }

        return NextResponse.json({ success: true, data: stats }, { status: 200 });
    } catch (error) {
        console.error('[GET /api/stats]', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}

// ── PUT /api/stats ─────────────────────────────────
// Replaces the entire stats array. Expects:
// { stats: [{ id, value, suffix, label }, ...] }

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

        // Validate each stat item
        for (const stat of stats) {
            if (
                typeof stat !== 'object' ||
                stat === null ||
                typeof (stat as Record<string, unknown>).value !== 'string' ||
                !['%', '+'].includes((stat as Record<string, unknown>).suffix as string) ||
                typeof (stat as Record<string, unknown>).label !== 'string' ||
                !(stat as Record<string, unknown>).label
            ) {
                return NextResponse.json(
                    { error: 'Each stat must have a value, suffix (+ or %), and label' },
                    { status: 400 }
                );
            }
        }

        const updated = await Stats.findOneAndUpdate(
            {},
            { $set: { stats } },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error) {
        console.error('[PUT /api/stats]', error);
        return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
    }
}