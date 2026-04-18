import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { uploadImage, deleteImage } from '../../../../lib/cloudinary';
import About from '../../../../models/About';

export async function GET() {
    try {
        await connectDB();

        let about = await About.findOne();

        if (!about) {
            about = await About.create({});
        }

        return NextResponse.json({ success: true, data: about }, { status: 200 });
    } catch (error) {
        console.error('[GET /api/about]', error);
        return NextResponse.json(
            { error: 'Failed to fetch about data' },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();

        let body: unknown;

        try {
            body = await req.json();
        } catch {
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        if (typeof body !== 'object' || body === null) {
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        const { images } = body as Record<string, unknown>;

        if (!Array.isArray(images) || images.length === 0) {
            return NextResponse.json(
                { error: 'images must be a non-empty array' },
                { status: 400 }
            );
        }

        let about = await About.findOne();

        if (!about) {
            about = await About.create({});
        }

        for (const item of images) {
            if (typeof item !== 'object' || item === null) continue;

            const { id, image } = item as Record<string, unknown>;

            if (typeof id !== 'number') continue;

            const slotIndex = about.images.findIndex((s) => s.id === id);
            if (slotIndex === -1) continue;

            if (typeof image === 'string' && image.startsWith('data:image/')) {
                if (about.images[slotIndex].publicId) {
                    await deleteImage(about.images[slotIndex].publicId);
                }

                const result = await uploadImage(image, 'rtc/about');

                about.images[slotIndex].url = result.url;
                about.images[slotIndex].publicId = result.publicId;
            }
        }

        about.markModified('images');
        await about.save();

        return NextResponse.json(
            { success: true, data: about },
            { status: 200 }
        );
    } catch (error) {
        console.error('[PUT /api/about]', error);
        return NextResponse.json(
            { error: 'Failed to update about images' },
            { status: 500 }
        );
    }
}