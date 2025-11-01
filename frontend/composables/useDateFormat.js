/**
 * Composable untuk format tanggal Indonesia
 */
export const useDateFormat = () => {
  // Format tanggal ke format Indonesia
  const formatDate = (dateString, options = {}) => {
    if (!dateString) return "-";

    const defaultOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...options,
    };

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", defaultOptions);
    } catch (error) {
      console.error("Date format error:", error);
      return "-";
    }
  };

  // Format tanggal relatif (2 hari yang lalu, dll)
  const formatRelativeDate = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now - date;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) return "Hari ini";
      if (diffInDays === 1) return "Kemarin";
      if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
      if (diffInDays < 30)
        return `${Math.floor(diffInDays / 7)} minggu yang lalu`;
      if (diffInDays < 365)
        return `${Math.floor(diffInDays / 30)} bulan yang lalu`;
      return `${Math.floor(diffInDays / 365)} tahun yang lalu`;
    } catch (error) {
      console.error("Relative date error:", error);
      return "-";
    }
  };

  // Format tanggal pendek (25 Jan 2025)
  const formatShortDate = (dateString) => {
    return formatDate(dateString, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return {
    formatDate,
    formatRelativeDate,
    formatShortDate,
  };
};

