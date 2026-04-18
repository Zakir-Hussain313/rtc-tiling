import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import { uploadImage, deleteImage } from '../../../../../lib/cloudinary';
import Project from '../../../../../models/Project';

function generateSlug(title: string): string {
    return (
        '/projects/' +
        title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
    );
}

// ── PUT /api/projects/[id] ─────────────────────────
// Updates an existing project by its MongoDB _id.

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

        const { title, description, image, day, month, year } =
            body as Record<string, unknown>;

        const updates: Record<string, unknown> = {};

        // Handle title + slug update
        if (typeof title === 'string' && title.trim()) {
            const trimmedTitle = title.trim();
            const newSlug = generateSlug(trimmedTitle);

            // Check slug conflict with other projects
            const conflict = await Project.findOne({
                slug: newSlug,
                _id: { $ne: id },
            });

            if (conflict) {
                return NextResponse.json(
                    { error: 'A project with this title already exists' },
                    { status: 409 }
                );
            }

            updates.title = trimmedTitle;
            updates.slug = newSlug;
        }

        if (typeof description === 'string') updates.description = description.trim();
        if (typeof day   === 'string')       updates.day   = day.trim();
        if (typeof month === 'string')       updates.month = month.trim();
        if (typeof year  === 'string')       updates.year  = year.trim();

        // Handle image replacement
        if (typeof image === 'string' && image.startsWith('data:image/')) {
            if (project.imagePublicId) {
                await deleteImage(project.imagePublicId);
            }
            const result = await uploadImage(image, 'rtc/projects');
            updates.image = result.url;
            updates.imagePublicId = result.publicId;
        }

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

// ── DELETE /api/projects/[id] ──────────────────────
// Deletes a project and its Cloudinary image.

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

        // Delete image from Cloudinary before removing the document
        if (project.imagePublicId) {
            await deleteImage(project.imagePublicId);
        }

        await Project.findByIdAndDelete(id);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('[DELETE /api/projects/[id]]', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}