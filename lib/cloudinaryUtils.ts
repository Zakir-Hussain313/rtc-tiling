export function optimizeCloudinaryUrl(url: string, width?: number): string {
    if (!url?.includes('res.cloudinary.com')) return url;

    const params = width
        ? `f_auto,q_auto,w_${width},c_limit`
        : `f_auto,q_auto`;

    return url.replace('/upload/', `/upload/${params}/`);
}