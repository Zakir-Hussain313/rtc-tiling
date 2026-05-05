import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure:     true,
});

export async function uploadImage(
    base64: string,
    folder: string
): Promise<{ url: string; publicId: string }> {
    const result = await cloudinary.uploader.upload(base64, {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });

    return {
        url:      result.secure_url,
        publicId: result.public_id,
    };
}

export async function deleteImage(publicId: string): Promise<void> {
    if (!publicId) return;

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok' && result.result !== 'not found') {
        throw new Error(`Cloudinary deletion failed for ${publicId}: ${result.result}`);
    }

    console.log(`[Cloudinary] Deleted: ${publicId} — ${result.result}`);
}