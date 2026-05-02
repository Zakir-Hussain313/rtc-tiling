import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from 'lib/mongodb';
import { uploadImage } from 'lib/cloudinary';
import Project from 'models/Project';

function generateSlug(title: string): string {
    return title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const featuredOnly = searchParams.get('featured') === 'true';
        const query = featuredOnly ? { featured: true } : {};
        const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
        return NextResponse.json({ success: true, data: projects }, { status: 200 });
    } catch (error) {
        console.error('[GET /api/projects]', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

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

        const {
            title, description, images, type, 
            location, size, designStyle, client, date,
        } = body as Record<string, unknown>;

        if (typeof title !== 'string' || !title.trim()) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const trimmedTitle = title.trim();
        const slug = generateSlug(trimmedTitle);

        const existing = await Project.findOne({ slug });
        if (existing) {
            return NextResponse.json({ error: 'A project with this title already exists' }, { status: 409 });
        }

        const imageUrls: string[] = [];
        const imagePublicIds: string[] = [];

        if (Array.isArray(images)) {
            for (const img of images) {
                if (typeof img === 'string' && img.startsWith('data:image/')) {
                    const result = await uploadImage(img, 'rtc/projects');
                    imageUrls.push(result.url);
                    imagePublicIds.push(result.publicId);
                }
            }
        }

        const count = await Project.countDocuments();

        const project = await Project.create({
            title: trimmedTitle,
            description: typeof description === 'string' ? description.trim() : '',
            images: imageUrls,
            imagePublicIds,
            type: typeof type === 'string' ? type.trim() : '',
            location: typeof location === 'string' ? location.trim() : '',
            size: typeof size === 'string' ? size.trim() : '',
            designStyle: typeof designStyle === 'string' ? designStyle.trim() : '',
            client: typeof client === 'string' ? client.trim() : '',
            date: typeof date === 'string' ? date.trim() : '',
            slug,
            order: count,
        });

        return NextResponse.json({ success: true, data: project }, { status: 201 });
    } catch (error) {
        console.error('[POST /api/projects]', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}