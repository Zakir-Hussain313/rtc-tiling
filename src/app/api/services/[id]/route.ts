import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import { uploadImage, deleteImage } from '../../../../../lib/cloudinary';
import Service from '../../../../../models/Service';

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

// ── PUT /api/services/[id] ─────────────────────────

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }  // 👈 Promise now
) {
    try {
        await connectDB();

        const { id } = await params;  // 👈 await it

        let body: unknown;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        if (typeof body !== 'object' || body === null) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const service = await Service.findById(id);
        if (!service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        const { title, description, image } = body as Record<string, unknown>;

        const updates: Record<string, unknown> = {};

        if (typeof title === 'string' && title.trim()) {
            const trimmedTitle = title.trim();
            const newSlug = generateSlug(trimmedTitle);

            const conflict = await Service.findOne({
                slug: newSlug,
                _id: { $ne: id },
            });

            if (conflict) {
                return NextResponse.json(
                    { error: 'A service with this title already exists' },
                    { status: 409 }
                );
            }

            updates.title = trimmedTitle;
            updates.slug = newSlug;
        }

        if (typeof description === 'string') updates.description = description.trim();

        if (typeof image === 'string' && image.startsWith('data:image/')) {
            if (service.imagePublicId) {
                await deleteImage(service.imagePublicId);
            }
            const result = await uploadImage(image, 'rtc/services');
            updates.image = result.url;
            updates.imagePublicId = result.publicId;
        }

        const updated = await Service.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );

        return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error) {
        console.error('[PUT /api/services/[id]]', error);
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}

// ── DELETE /api/services/[id] ──────────────────────

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }  // 👈 Promise now
) {
    try {
        await connectDB();

        const { id } = await params;  // 👈 await it

        const service = await Service.findById(id);
        if (!service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        if (service.imagePublicId) {
            await deleteImage(service.imagePublicId);
        }

        await Service.findByIdAndDelete(id);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('[DELETE /api/services/[id]]', error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}