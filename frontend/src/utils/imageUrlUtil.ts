/**
 * Image URL Utility
 * Normalizes and transforms image URLs for different backend environments
 */

const RENDER_API_URL = 'https://back-end-servicosja-api.onrender.com';

/**
 * Normalize image URL from different backend sources
 * @param url - Original image URL
 * @returns - Normalized image URL
 */
export function normalizeImageUrl(url: string): string {
    if (!url) return '';

    // Replace local development URLs with production API URL
    if (url.startsWith('http://127.0.0.1:8000')) {
        return url.replace('http://127.0.0.1:8000', RENDER_API_URL);
    }
    if (url.startsWith('http://localhost:8000')) {
        return url.replace('http://localhost:8000', RENDER_API_URL);
    }

    // Keep absolute URLs and data URIs as-is
    if (url.startsWith('http') || url.startsWith('blob:')) return url;

    // Keep static assets as-is
    if (url.startsWith('/img') || url.startsWith('/assets')) return url;

    // Prepend API URL to relative paths
    return `${RENDER_API_URL}${url}`;
}

/**
 * Get fallback image URL for missing provider photos
 */
export function getFallbackProviderImage(): string {
    return '/img/exemples/Group 8.png';
}

/**
 * Get image URL with fallback
 * @param url - Original image URL
 * @param fallback - Fallback image URL
 * @returns - Normalized image URL with fallback
 */
export function normalizeImageUrlWithFallback(
    url: string | null | undefined,
    fallback: string = getFallbackProviderImage()
): string {
    if (!url) return fallback;
    return normalizeImageUrl(url);
}
