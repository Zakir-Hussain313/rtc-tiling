import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure:     true,
});

/**
 * Uploads a base64 image string to Cloudinary.
 * Returns the secure URL and public_id for future deletion.
 *
 * @param base64   - Full base64 data URI (e.g. "data:image/jpeg;base64,...")
 * @param folder   - Cloudinary folder to organise uploads (e.g. "rtc/projects")
 */
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

/**
 * Deletes an image from Cloudinary by its public_id.
 * Call this when a project/service image is replaced or deleted.
 *
 * @param publicId - The public_id returned when the image was uploaded
 */
export async function deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
}