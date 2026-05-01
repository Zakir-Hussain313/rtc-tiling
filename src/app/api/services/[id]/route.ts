import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from 'lib/mongodb';
import { uploadImage, deleteImage } from 'lib/cloudinary';
import Service from 'models/Service';

function generateSlug(title: string): string {
    return '/services/' + title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        let body: unknown;
        try { body = await req.json(); }
        catch { return NextResponse.json({ error: 'Invalid request body' }, { status: 400 }); }

        if (typeof body !== 'object' || body === null)
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });

        const service = await Service.findById(id);
        if (!service)
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });

        const {
            title, description, images, removedPublicIds,
            serviceType, location, estimatedDuration,
            maximumArea, finishStyle, suitableFor,
        } = body as Record<string, unknown>;

        const updates: Record<string, unknown> = {};

        if (typeof title === 'string' && title.trim()) {
            const trimmedTitle = title.trim();
            const newSlug = generateSlug(trimmedTitle);
            const conflict = await Service.findOne({ slug: newSlug, _id: { $ne: id } });
            if (conflict)
                return NextResponse.json({ error: 'A service with this title already exists' }, { status: 409 });
            updates.title = trimmedTitle;
            updates.slug  = newSlug;
        }

        if (typeof description       === 'string') updates.description       = description.trim();
        if (typeof serviceType       === 'string') updates.serviceType       = serviceType.trim();
        if (typeof location          === 'string') updates.location          = location.trim();
        if (typeof estimatedDuration === 'string') updates.estimatedDuration = estimatedDuration.trim();
        if (typeof maximumArea       === 'string') updates.maximumArea       = maximumArea.trim();
        if (typeof finishStyle       === 'string') updates.finishStyle       = finishStyle.trim();
        if (typeof suitableFor       === 'string') updates.suitableFor       = suitableFor.trim();

        const currentImages: string[] = Array.isArray(service.images)
            ? [...service.images]
            : (service as any).image ? [(service as any).image] : [];

        const currentPublicIds: string[] = Array.isArray(service.imagePublicIds)
            ? [...service.imagePublicIds]
            : (service as any).imagePublicId ? [(service as any).imagePublicId] : [];

        if (Array.isArray(removedPublicIds) && removedPublicIds.length > 0) {
            for (const publicId of removedPublicIds) {
                if (typeof publicId === 'string') {
                    await deleteImage(publicId);
                    const idx = currentPublicIds.indexOf(publicId);
                    if (idx !== -1) {
                        currentImages.splice(idx, 1);
                        currentPublicIds.splice(idx, 1);
                    }
                }
            }
        }

        if (Array.isArray(images)) {
            for (const img of images) {
                if (typeof img === 'string' && img.startsWith('data:image/')) {
                    const result = await uploadImage(img, 'rtc/services');
                    currentImages.push(result.url);
                    currentPublicIds.push(result.publicId);
                }
            }
        }

        updates.images         = currentImages;
        updates.imagePublicIds = currentPublicIds;

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

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const service = await Service.findById(id);
        if (!service)
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });

        const publicIds = Array.isArray(service.imagePublicIds)
            ? service.imagePublicIds
            : (service as any).imagePublicId ? [(service as any).imagePublicId] : [];

        for (const publicId of publicIds) {
            if (publicId) await deleteImage(publicId);
        }

        await Service.findByIdAndDelete(id);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('[DELETE /api/services/[id]]', error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}