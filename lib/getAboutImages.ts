import { connectDB } from './mongodb';
import About from '../models/About';

export type AboutImage = {
    id: number;
    url: string;
    publicId: string;
};

export async function getAboutImages(): Promise<AboutImage[]> {
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