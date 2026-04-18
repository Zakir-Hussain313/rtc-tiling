import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { uploadImage } from '../../../../lib/cloudinary';
import Service from '../../../../models/Service';

function generateSlug(title: string): string {
    return (
        '/services/' +
        title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
    );
}

// ── GET /api/services ──────────────────────────────

export async function GET() {
    try {
        await connectDB();

        const services = await Service.find().sort({ order: 1, createdAt: -1 });

        return NextResponse.json({ success: true, data: services }, { status: 200 });
    } catch (error) {
        console.error('[GET /api/services]', error);
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

// ── POST /api/services ─────────────────────────────

export async function POST(req: NextRequest) {
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

        const { title, description, image } = body as Record<string, unknown>;

        if (typeof title !== 'string' || !title.trim()) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const trimmedTitle = title.trim();
        const slug = generateSlug(trimmedTitle);

        const existing = await Service.findOne({ slug });
        if (existing) {
            return NextResponse.json(
                { error: 'A service with this title already exists' },
                { status: 409 }
            );
        }

        let imageUrl = '';
        let imagePublicId = '';

        if (typeof image === 'string' && image.startsWith('data:image/')) {
            const result = await uploadImage(image, 'rtc/services');
            imageUrl = result.url;
            imagePublicId = result.publicId;
        }

        const count = await Service.countDocuments();

        const service = await Service.create({
            title: trimmedTitle,
            description: typeof description === 'string' ? description.trim() : '',
            image: imageUrl,
            imagePublicId,
            slug,
            order: count,
        });

        return NextResponse.json({ success: true, data: service }, { status: 201 });
    } catch (error) {
        console.error('[POST /api/services]', error);
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
}