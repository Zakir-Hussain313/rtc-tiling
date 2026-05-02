import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Testimonial from '../../../../models/Testimonial';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
        const body = await req.json();
        const { name, role, review, rating, image, order } = body;

        let imageUrl = '';
        let imagePublicId = '';

        if (image && image.startsWith('data:')) {
            const uploaded = await cloudinary.uploader.upload(image, {
                folder: 'testimonials',
            });
            imageUrl = uploaded.secure_url;
            imagePublicId = uploaded.public_id;
        }

        const testimonial = await Testimonial.create({
            name, role, review, rating, order,
            image: imageUrl,
            imagePublicId,
        });

        return NextResponse.json({ success: true, data: testimonial }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/testimonials]', err);
        return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { _id, name, role, review, rating, image, order, imagePublicId: existingPublicId } = body;

        let imageUrl = image;
        let imagePublicId = existingPublicId ?? '';

        if (image && image.startsWith('data:')) {
            if (existingPublicId) {
                await cloudinary.uploader.destroy(existingPublicId);
            }
            const uploaded = await cloudinary.uploader.upload(image, {
                folder: 'testimonials',
            });
            imageUrl = uploaded.secure_url;
            imagePublicId = uploaded.public_id;
        }

        const updated = await Testimonial.findByIdAndUpdate(
            _id,
            { name, role, review, rating, image: imageUrl, imagePublicId, order },
            { new: true }
        );

        return NextResponse.json({ success: true, data: updated });
    } catch (err) {
        console.error('[PUT /api/testimonials]', err);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { _id, imagePublicId } = await req.json();

        if (imagePublicId) {
            await cloudinary.uploader.destroy(imagePublicId);
        }

        await Testimonial.findByIdAndDelete(_id);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[DELETE /api/testimonials]', err);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}