import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from 'lib/mongodb';
import { uploadImage, deleteImage } from 'lib/cloudinary';
import Project from 'models/Project';

function generateSlug(title: string): string {
    return title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        let body: unknown;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        if (typeof body !== 'object' || body === null) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const project = await Project.findById(id);
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const {
            title, description, images,
            removedPublicIds,
            type, location, completionYear,
            size, designStyle, client, date,
            featured,
        } = body as Record<string, unknown>;

        const updates: Record<string, unknown> = {};

        if (typeof title === 'string' && title.trim()) {
            const trimmedTitle = title.trim();
            const newSlug = generateSlug(trimmedTitle);
            const conflict = await Project.findOne({ slug: newSlug, _id: { $ne: id } });
            if (conflict) {
                return NextResponse.json({ error: 'A project with this title already exists' }, { status: 409 });
            }
            updates.title = trimmedTitle;
            updates.slug = newSlug;
        }

        if (typeof description === 'string') updates.description = description.trim();
        if (typeof type === 'string') updates.type = type.trim();
        if (typeof location === 'string') updates.location = location.trim();
        if (typeof completionYear === 'string') updates.completionYear = completionYear.trim();
        if (typeof size === 'string') updates.size = size.trim();
        if (typeof designStyle === 'string') updates.designStyle = designStyle.trim();
        if (typeof client === 'string') updates.client = client.trim();
        if (typeof date === 'string') updates.date = date.trim();
        if (typeof featured === 'boolean') updates.featured = featured;

        // Handle images — support old single image field and new array field
        const currentImages: string[] = Array.isArray(project.images)
            ? [...project.images]
            : (project as any).image
            ? [(project as any).image]
            : [];

        const currentPublicIds: string[] = Array.isArray(project.imagePublicIds)
            ? [...project.imagePublicIds]
            : (project as any).imagePublicId
            ? [(project as any).imagePublicId]
            : [];

        // Remove marked images
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

        // Upload new images
        if (Array.isArray(images)) {
            for (const img of images) {
                if (typeof img === 'string' && img.startsWith('data:image/')) {
                    const result = await uploadImage(img, 'rtc/projects');
                    currentImages.push(result.url);
                    currentPublicIds.push(result.publicId);
                }
            }
        }

        updates.images = currentImages;
        updates.imagePublicIds = currentPublicIds;

        const updated = await Project.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );

        return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error) {
        console.error('[PUT /api/projects/[id]]', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const project = await Project.findById(id);
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const publicIds = Array.isArray(project.imagePublicIds)
            ? project.imagePublicIds
            : (project as any).imagePublicId
            ? [(project as any).imagePublicId]
            : [];

        for (const publicId of publicIds) {
            if (publicId) await deleteImage(publicId);
        }

        await Project.findByIdAndDelete(id);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('[DELETE /api/projects/[id]]', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}