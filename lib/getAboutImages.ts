import { connectDB } from './mongodb';
import About from '../models/About';
import { unstable_noStore as noStore } from 'next/cache';

export type AboutImage = {
    id: number;
    url: string;
    publicId: string;
};

export async function getAboutImages(): Promise<AboutImage[]> {
    noStore();
    try {
        await connectDB();
        let about = await About.findOne().lean();
        if (!about) return [];
        return about.images ?? [];
    } catch (err) {
        console.error('[getAboutImages]', err);
        return [];
    }
}