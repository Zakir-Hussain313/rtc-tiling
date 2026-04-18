import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { uploadImage } from '../../../../lib/cloudinary';
import Project from '../../../../models/Project';

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

// ── GET /api/projects ──────────────────────────────
// Returns all projects sorted by order field.

export async function GET() {
    try {
        await connectDB();

        const projects = await Project.find().sort({ order: 1, createdAt: -1 });

        return NextResponse.json({ success: true, data: projects }, { status: 200 });
    } catch (error) {
        console.error('[GET /api/projects]', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

// ── POST /api/projects ─────────────────────────────
// Creates a new project.

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

        const { title, description, image, day, month, year } =
            body as Record<string, unknown>;

        // title is required
        if (typeof title !== 'string' || !title.trim()) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const trimmedTitle = title.trim();
        const slug = generateSlug(trimmedTitle);

        // Check for duplicate slug
        const existing = await Project.findOne({ slug });
        if (existing) {
            return NextResponse.json(
                { error: 'A project with this title already exists' },
                { status: 409 }
            );
        }

        let imageUrl = '';
        let imagePublicId = '';

        // Upload image if provided
        if (typeof image === 'string' && image.startsWith('data:image/')) {
            const result = await uploadImage(image, 'rtc/projects');
            imageUrl = result.url;
            imagePublicId = result.publicId;
        }

        // Set order to end of list
        const count = await Project.countDocuments();

        const project = await Project.create({
            title: trimmedTitle,
            description: typeof description === 'string' ? description.trim() : '',
            image: imageUrl,
            imagePublicId,
            day:   typeof day   === 'string' ? day.trim()   : '',
            month: typeof month === 'string' ? month.trim() : '',
            year:  typeof year  === 'string' ? year.trim()  : '',
            slug,
            order: count,
        });

        return NextResponse.json({ success: true, data: project }, { status: 201 });
    } catch (error) {
        console.error('[POST /api/projects]', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}