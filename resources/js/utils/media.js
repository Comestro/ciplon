/**
 * Resolve a product or media image object/string into a displayable URL.
 * Prefers the backend-resolved `url` (e.g. Cloudflare R2 public URL or static `/images/...` path),
 * falling back to `file_path` only when `url` is unavailable.
 */
export function resolveImageUrl(image) {
  if (!image) return null;

  if (typeof image === 'string') {
    if (
      image.startsWith('http://') ||
      image.startsWith('https://') ||
      image.startsWith('/') ||
      image.startsWith('data:') ||
      image.startsWith('blob:')
    ) {
      return image;
    }

    return `/${image}`;
  }

  if (image.url) return image.url;
  if (image.image_url) return image.image_url;

  if (image.file_path) {
    if (
      image.file_path.startsWith('http://') ||
      image.file_path.startsWith('https://') ||
      image.file_path.startsWith('/')
    ) {
      return image.file_path;
    }

    return `/${image.file_path}`;
  }

  return null;
}

/**
 * Resolve the primary display image URL for a product record.
 */
export function resolveProductImageUrl(product, fallback = null) {
  if (!product) return fallback;

  return (
    product.imageUrl ||
    product.image_url ||
    product.image ||
    resolveImageUrl(product.primary_image) ||
    resolveImageUrl(product.primaryImage) ||
    (Array.isArray(product.images) && product.images.length > 0
      ? resolveImageUrl(product.images[0])
      : null) ||
    fallback
  );
}
