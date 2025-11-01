/**
 * Composable untuk handling image placeholder
 * Mengatasi gambar yang tidak ditemukan
 */
export const useImagePlaceholder = () => {
  // SVG placeholder inline (tidak perlu file eksternal)
  const svgPlaceholder = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect fill='%23e5e7eb' width='800' height='600'/%3E%3Ctext fill='%239ca3af' font-family='Arial, sans-serif' font-size='32' text-anchor='middle' x='400' y='300'%3ETidak ada gambar%3C/text%3E%3Cpath fill='%239ca3af' d='M300 240h200v40h-200zM280 300h240v20h-240zM320 340h160v20h-160z'/%3E%3C/svg%3E`;

  // Handle image error event
  const handleImageError = (event) => {
    if (event && event.target) {
      event.target.src = svgPlaceholder;
      event.target.alt = "Gambar tidak tersedia";
      event.target.classList.add("placeholder-image");
    }
  };

  // Get image URL dengan fallback
  const getImageUrl = (path, fallback = null) => {
    // Jika tidak ada path, return placeholder
    if (!path) return fallback || svgPlaceholder;

    // Jika sudah full URL (http/https), return as is
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // Jika path lokal (dimulai dengan /), return as is
    if (path.startsWith("/")) {
      return path;
    }

    // Default: tambahkan slash di depan
    return `/${path}`;
  };

  // Get thumbnail/image dengan multiple fallback
  const getThumbnail = (item, field = "thumbnail") => {
    return getImageUrl(item?.[field]);
  };

  // Check if image exists (untuk preload)
  const imageExists = async (url) => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch {
      return false;
    }
  };

  return {
    handleImageError,
    getImageUrl,
    getThumbnail,
    imageExists,
    svgPlaceholder,
  };
};

