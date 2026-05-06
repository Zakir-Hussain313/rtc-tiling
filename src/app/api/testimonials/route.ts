import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from 'lib/mongodb';
import { uploadImage, deleteImage } from 'lib/cloudinary';
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

        const { name, role, review, rating, image, order } = body as Record<string, unknown>;

        if (typeof name !== 'string' || !name.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }
        if (typeof review !== 'string' || !review.trim()) {
            return NextResponse.json({ error: 'Review is required' }, { status: 400 });
        }
        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be a number between 1 and 5' }, { status: 400 });
        }

        // 1. Create testimonial first with empty image
        const count = await Testimonial.countDocuments();
        const testimonial = await Testimonial.create({
            name: name.trim(),
            role: typeof role === 'string' ? role.trim() : '',
            review: review.trim(),
            rating,
            order: typeof order === 'number' ? order : count,
            image: '',
            imagePublicId: '',
        });

        // 2. Upload image after DB save
        if (typeof image === 'string' && image.startsWith('data:')) {
            try {
                const { url, publicId } = await uploadImage(image, 'testimonials');
                await Testimonial.findByIdAndUpdate(testimonial._id, {
                    $set: { image: url, imagePublicId: publicId },
                });
            } catch (uploadErr) {
                console.error('[POST /api/testimonials] Image upload failed:', uploadErr);
            }
        }

        const final = await Testimonial.findById(testimonial._id);

        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, data: final }, { status: 201 });

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
        } = body as Record<string, unknown>;

        if (!_id) {
            return NextResponse.json({ error: '_id is required' }, { status: 400 });
        }

        const testimonial = await Testimonial.findById(_id);
        if (!testimonial) {
            return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
        }

        const updates: Record<string, unknown> = {};

        if (typeof name === 'string')   updates.name   = name.trim();
        if (typeof role === 'string')   updates.role   = role.trim();
        if (typeof review === 'string') updates.review = review.trim();
        if (typeof rating === 'number') updates.rating = rating;
        if (typeof order === 'number')  updates.order  = order;

        // Upload new image first, then delete old one
        if (typeof image === 'string' && image.startsWith('data:')) {
            try {
                const { url, publicId } = await uploadImage(image, 'testimonials');

                if (typeof existingPublicId === 'string' && existingPublicId) {
                    try {
                        await deleteImage(existingPublicId);
                    } catch (err) {
                        console.error('[PUT /api/testimonials] Failed to delete old image:', err);
                    }
                }

                updates.image = url;
                updates.imagePublicId = publicId;
            } catch (uploadErr) {
                console.error('[PUT /api/testimonials] Image upload failed:', uploadErr);
            }
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