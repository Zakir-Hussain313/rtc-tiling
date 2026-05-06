import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from 'lib/mongodb';
import { uploadImage, deleteImage } from 'lib/cloudinary';
import Hero from 'models/Hero';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        await connectDB();
        const hero = await Hero.findOne();
        return NextResponse.json({ success: true, data: hero ?? null }, { status: 200 });
    } catch (error) {
        console.error('[GET /api/hero]', error);
        return NextResponse.json({ error: 'Failed to fetch hero data' }, { status: 500 });
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
            backgroundImage,
            headline,
            subheading,
            buttonText,
            buttonLink,
            overlayOpacity,
        } = body as Record<string, unknown>;

        if (overlayOpacity !== undefined) {
            const opacity = Number(overlayOpacity);
            if (isNaN(opacity) || opacity < 0 || opacity > 100) {
                return NextResponse.json(
                    { error: 'overlayOpacity must be a number between 0 and 100' },
                    { status: 400 }
                );
            }
        }

        let hero = await Hero.findOne();
        if (!hero) {
            hero = await Hero.create({});
        }

        const updates: Record<string, unknown> = {};

        if (typeof backgroundImage === 'string' && backgroundImage.startsWith('data:image/')) {
            const { url, publicId } = await uploadImage(backgroundImage, 'rtc/hero');

            if (hero.backgroundImagePublicId) {
                try {
                    await deleteImage(hero.backgroundImagePublicId);
                } catch (err) {
                    console.error('[PUT /api/hero] Failed to delete old image:', err);
                }
            }

            updates.backgroundImage = url;
            updates.backgroundImagePublicId = publicId;
        }

        if (typeof headline === 'string')   updates.headline = headline.trim();
        if (typeof subheading === 'string') updates.subheading = subheading.trim();
        if (typeof buttonText === 'string') updates.buttonText = buttonText.trim();
        if (typeof buttonLink === 'string') updates.buttonLink = buttonLink.trim();
        if (overlayOpacity !== undefined)   updates.overlayOpacity = Number(overlayOpacity);

        const updated = await Hero.findOneAndUpdate(
            {},
            { $set: updates },
            { new: true, upsert: true }
        );

        revalidatePath('/','layout');

        return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error) {
        console.error('[PUT /api/hero]', error);
        return NextResponse.json({ error: 'Failed to update hero data' }, { status: 500 });
    }
}