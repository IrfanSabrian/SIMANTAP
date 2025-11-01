export const useTextUtils = () => {
  /**
   * Strip HTML tags dari string
   */
  const stripHtml = (html) => {
    if (!html) return "";
    // Remove HTML tags
    const text = html.replace(/<[^>]*>/g, "");
    // Decode HTML entities
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

  /**
   * Truncate text dengan batas karakter
   */
  const truncate = (text, maxLength = 150) => {
    if (!text) return "";
    const cleanText = stripHtml(text);
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + "...";
  };

  /**
   * Get excerpt dari HTML content
   */
  const getExcerpt = (htmlContent, maxLength = 150) => {
    return truncate(htmlContent, maxLength);
  };

  return {
    stripHtml,
    truncate,
    getExcerpt,
  };
};

