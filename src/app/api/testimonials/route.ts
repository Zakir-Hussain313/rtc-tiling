import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from 'lib/mongodb';
import { deleteImage } from 'lib/cloudinary';
import Testimonial from 'models/Testimonial';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        await connectDB();
        const testimonials = await Testimonial.find({}).sort({ order: 1, createdAt: -1 });
        return NextResponse.json({ success: true, data: testimonials });
    } catch (err) {
        console.error('[GET /api/testimonials]', err);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
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

        const { name, role, review, rating, image, imagePublicId, order } = body as Record<string, unknown>;

        if (typeof name !== 'string' || !name.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }
        if (typeof review !== 'string' || !review.trim()) {
            return NextResponse.json({ error: 'Review is required' }, { status: 400 });
        }
        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be a number between 1 and 5' }, { status: 400 });
        }

        // Images already uploaded to Cloudinary — just save the URL
        const count = await Testimonial.countDocuments();
        const testimonial = await Testimonial.create({
            name: name.trim(),
            role: typeof role === 'string' ? role.trim() : '',
            review: review.trim(),
            rating,
            order: typeof order === 'number' ? order : count,
            image: typeof image === 'string' ? image : '',
            imagePublicId: typeof imagePublicId === 'string' ? imagePublicId : '',
        });

        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, data: testimonial }, { status: 201 });

    } catch (err) {
        console.error('[POST /api/testimonials]', err);
        return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
    }
}

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

        const {
            _id, name, role, review,
            rating, image, order,
            imagePublicId: existingPublicId,
            newPublicId,
            removeImage,
        } = body as Record<string, unknown>;

        if (!_id) {
            return NextResponse.json({ error: '_id is required' }, { status: 400 });
        }

        const testimonial = await Testimonial.findById(_id);
        if (!testimonial) {
            return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
        }

        const updates: Record<string, unknown> = {};

        if (typeof name === 'string') updates.name = name.trim();
        if (typeof role === 'string') updates.role = role.trim();
        if (typeof review === 'string') updates.review = review.trim();
        if (typeof rating === 'number') updates.rating = rating;
        if (typeof order === 'number') updates.order = order;

        // New image already uploaded to Cloudinary — just swap the URL
        if (typeof image === 'string' && image.startsWith('https://res.cloudinary.com')) {
            if (typeof existingPublicId === 'string' && existingPublicId) {
                try {
                    await deleteImage(existingPublicId);
                } catch (err) {
                    console.error('[PUT /api/testimonials] Failed to delete old image:', err);
                }
            }
            updates.image = image;
            updates.imagePublicId = typeof newPublicId === 'string' ? newPublicId : '';
        }

        // Handle image removal
        if (removeImage === true) {
            if (typeof existingPublicId === 'string' && existingPublicId) {
                try {
                    await deleteImage(existingPublicId);
                } catch (err) {
                    console.error('[PUT /api/testimonials] Failed to delete image on removal:', err);
                }
            }
            updates.image = '';
            updates.imagePublicId = '';
        }

        const updated = await Testimonial.findByIdAndUpdate(
            _id,
            { $set: updates },
            { returnDocument: 'after' }
        );

        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, data: updated });

    } catch (err) {
        console.error('[PUT /api/testimonials]', err);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
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

        const { _id } = body as Record<string, unknown>;

        if (!_id) {
            return NextResponse.json({ error: '_id is required' }, { status: 400 });
        }

        const testimonial = await Testimonial.findById(_id);
        if (!testimonial) {
            return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
        }

        // Read publicId from DB, not from client
        if (testimonial.imagePublicId) {
            try {
                await deleteImage(testimonial.imagePublicId);
            } catch (err) {
                console.error('[DELETE /api/testimonials] Failed to delete image:', err);
            }
        }

        await Testimonial.findByIdAndDelete(_id);

        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true });

    } catch (err) {
        console.error('[DELETE /api/testimonials]', err);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}