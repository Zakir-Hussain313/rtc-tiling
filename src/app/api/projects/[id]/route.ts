import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectDB } from '../../../../../lib/mongodb';
import Project from '../../../../../models/Project';
import { deleteImage } from '../../../../../lib/cloudinary';

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
            title, description, images, imagePublicIds,
            removedPublicIds, type, location,
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
        if (typeof size === 'string') updates.size = size.trim();
        if (typeof designStyle === 'string') updates.designStyle = designStyle.trim();
        if (typeof client === 'string') updates.client = client.trim();
        if (typeof date === 'string') updates.date = date.trim();
        if (typeof featured === 'boolean') updates.featured = featured;

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
            const toRemove: number[] = [];

            for (const publicId of removedPublicIds) {
                if (typeof publicId === 'string') {
                    try {
                        await deleteImage(publicId);
                    } catch (err) {
                        console.error('[PUT] Failed to delete image from Cloudinary:', publicId, err);
                    }
                    const idx = currentPublicIds.indexOf(publicId);
                    if (idx !== -1) toRemove.push(idx);
                }
            }

            // Splice in reverse so index shifting doesn't affect remaining indexes
            for (const idx of toRemove.sort((a, b) => b - a)) {
                currentImages.splice(idx, 1);
                currentPublicIds.splice(idx, 1);
            }
        }

        // Images already uploaded to Cloudinary — just append the new URLs
        if (Array.isArray(images)) {
            for (const img of images) {
                if (typeof img === 'string' && img.startsWith('https://res.cloudinary.com')) {
                    if (!currentImages.includes(img)) {
                        currentImages.push(img);
                    }
                }
            }
        }

        if (Array.isArray(imagePublicIds)) {
            for (const pid of imagePublicIds) {
                if (typeof pid === 'string' && !currentPublicIds.includes(pid)) {
                    currentPublicIds.push(pid);
                }
            }
        }

        updates.images = currentImages;
        updates.imagePublicIds = currentPublicIds;

        const updated = await Project.findByIdAndUpdate(
            id,
            { $set: updates },
            { returnDocument: 'after' }
        );

        revalidatePath('/', 'layout');
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

        await Promise.allSettled(
            publicIds.filter(Boolean).map((pid: string) => deleteImage(pid))
        );

        await Project.findByIdAndDelete(id);

        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error('[DELETE /api/projects/[id]]', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}