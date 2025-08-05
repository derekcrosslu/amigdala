/**
 * Utility function to handle image URLs consistently across the application
 * Ensures all uploaded images are served through the API route
 */
export function getImageUrl(path: string | undefined | null): string {
  if (!path) return '';
  
  // For uploaded images, route through the API using query parameter
  if (path.startsWith('/uploads/')) {
    return `/api/image?path=${encodeURIComponent(path)}`;
  }
  
  // For other images (e.g., static assets), use the path as-is
  return path;
}
