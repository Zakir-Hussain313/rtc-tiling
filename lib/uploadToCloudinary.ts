export async function uploadToCloudinary(
    file: File,
    folder: string = 'rtc/projects'
): Promise<{ url: string; publicId: string }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
    formData.append('folder', folder)

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
    )

    if (!res.ok) {
        const err = await res.json()
        throw new Error(err?.error?.message ?? 'Cloudinary upload failed')
    }

    const data = await res.json()
    return { url: data.secure_url, publicId: data.public_id }
}