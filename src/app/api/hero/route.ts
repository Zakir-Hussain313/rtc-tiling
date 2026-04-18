import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { uploadImage, deleteImage } from '../../../../lib/cloudinary';
import Hero from '../../../../models/Hero';

// ── GET /api/hero ──────────────────────────────────
// Returns the hero document. Used by both the admin
// page (to populate the form) and the public frontend.

export async function GET() {
    try {
        await connectDB();

        let hero = await Hero.findOne();

        // If no document exists yet, return empty defaults
        if (!hero) {
            hero = await Hero.create({});
        }

        return NextResponse.json({ success: true, data: hero }, { status: 200 });
    } catch (error) {
        console.error('[GET /api/hero]', error);
        return NextResponse.json({ error: 'Failed to fetch hero data' }, { status: 500 });
    }
}

// ── PUT /api/hero ──────────────────────────────────
// Updates the hero document.
// If a new base64 image is sent, uploads to Cloudinary
// and deletes the old one. All other fields are optional.

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
            backgroundImage,
            headline,
            subheading,
            buttonText,
            buttonLink,
            overlayOpacity,
        } = body as Record<string, unknown>;

        // Validate overlayOpacity if provided
        if (overlayOpacity !== undefined) {
            const opacity = Number(overlayOpacity);
            if (isNaN(opacity) || opacity < 0 || opacity > 100) {
                return NextResponse.json(
                    { error: 'overlayOpacity must be a number between 0 and 100' },
                    { status: 400 }
                );
            }
        }

        // Get existing hero document
        let hero = await Hero.findOne();
        if (!hero) {
            hero = await Hero.create({});
        }

        const updates: Record<string, unknown> = {};

        // Handle image upload if a new base64 image was sent
        if (typeof backgroundImage === 'string' && backgroundImage.startsWith('data:image/')) {
            // Delete old image from Cloudinary if it exists
            if (hero.backgroundImagePublicId) {
                await deleteImage(hero.backgroundImagePublicId);
            }

            const { url, publicId } = await uploadImage(backgroundImage, 'rtc/hero');
            updates.backgroundImage = url;
            updates.backgroundImagePublicId = publicId;
        }

        // Apply text field updates if provided
        if (typeof headline === 'string')      updates.headline = headline.trim();
        if (typeof subheading === 'string')    updates.subheading = subheading.trim();
        if (typeof buttonText === 'string')    updates.buttonText = buttonText.trim();
        if (typeof buttonLink === 'string')    updates.buttonLink = buttonLink.trim();
        if (overlayOpacity !== undefined)      updates.overlayOpacity = Number(overlayOpacity);

        const updated = await Hero.findOneAndUpdate(
            {},
            { $set: updates },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error) {
        console.error('[PUT /api/hero]', error);
        return NextResponse.json({ error: 'Failed to update hero data' }, { status: 500 });
    }
}