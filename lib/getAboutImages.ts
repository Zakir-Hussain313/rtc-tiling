import { connectDB } from './mongodb';
import About from '../models/About';
import { unstable_cache } from 'next/cache';

export type AboutImage = {
    id: number;
    url: string;
    publicId: string;
};

export const getAboutImages = unstable_cache(
    async (): Promise<AboutImage[]> => {
        try {
            await connectDB();
            const about = await About.findOne().lean();
            if (!about) return [];
            return (about as unknown as { images: AboutImage[] }).images ?? [];
        } catch (err) {
            console.error('[getAboutImages]', err);
            return [];
        }
    },
    ['about-images'],
    { revalidate: 60, tags: ['about-images'] }
);