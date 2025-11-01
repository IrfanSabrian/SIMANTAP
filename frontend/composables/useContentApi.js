/**
 * Composable untuk API Content (Berita, Dokumentasi, PPID)
 * Mengambil data dari backend SIJALI
 */
export const useContentApi = () => {
  const config = useRuntimeConfig();

  if (!config.public.apiBaseUrl && !config.public.apiUrl) {
    console.error(
      "⚠️ NUXT_PUBLIC_API_BASE_URL or NUXT_PUBLIC_API_URL is not set in environment variables!"
    );
    return {
      getBerita: () => Promise.resolve({ data: null, error: "API URL not configured" }),
      getBeritaBySlug: () => Promise.resolve({ data: null, error: "API URL not configured" }),
      getDokumentasiKegiatan: () => Promise.resolve({ data: null, error: "API URL not configured" }),
      getDokumentasiKegiatanBySlug: () => Promise.resolve({ data: null, error: "API URL not configured" }),
      getDokumentasiInfrastruktur: () => Promise.resolve({ data: null, error: "API URL not configured" }),
      getDokumentasiInfrastrukturById: () => Promise.resolve({ data: null, error: "API URL not configured" }),
      getDokumentasiInfrastrukturByRuas: () => Promise.resolve({ data: null, error: "API URL not configured" }),
      getDokumenPpid: () => Promise.resolve({ data: null, error: "API URL not configured" }),
      getDokumenPpidBySlug: () => Promise.resolve({ data: null, error: "API URL not configured" }),
      getStats: () => Promise.resolve({ data: null, error: "API URL not configured" }),
      baseURL: "",
    };
  }

  // Determine base URL from env variables only
  // Priority: apiUrl > apiBaseUrl + /api
  const getBaseURL = () => {
    if (config.public.apiUrl) {
      return config.public.apiUrl;
    }
    if (config.public.apiBaseUrl) {
      return `${config.public.apiBaseUrl}/api`;
    }
    return "";
  };

  const baseURL = getBaseURL();

  // Generic fetch dengan error handling
  const fetchData = async (endpoint, options = {}) => {
    if (!baseURL) {
      return { data: null, error: "API base URL is not configured" };
    }

    // Build final URL
    // Remove /api from endpoint if baseURL already includes /api
    const cleanEndpoint = endpoint.startsWith("/api") 
      ? endpoint.replace("/api", "") 
      : endpoint;
    const url = `${baseURL}${cleanEndpoint}`;

    try {
      console.log(`[useContentApi] Fetching: ${url}`, {
        endpoint,
        baseURL,
        cleanURL: url,
      });

      const response = await $fetch(url, options);
      return { data: response, error: null };
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      console.error(`[useContentApi] Failed URL: ${url}`);
      return { data: null, error: error.message || "Terjadi kesalahan" };
    }
  };

  return {
    // ===== BERITA =====
    getBerita: (params = {}) => fetchData("/api/berita", { params }),
    getBeritaBySlug: (slug) => fetchData(`/api/berita/slug/${slug}`),

    // ===== DOKUMENTASI KEGIATAN =====
    getDokumentasiKegiatan: (params = {}) =>
      fetchData("/api/dokumentasi-kegiatan", { params }),
    getDokumentasiKegiatanBySlug: (slug) =>
      fetchData(`/api/dokumentasi-kegiatan/slug/${slug}`),

    // ===== DOKUMENTASI INFRASTRUKTUR =====
    getDokumentasiInfrastruktur: (params = {}) =>
      fetchData("/api/dokumentasi-infrastruktur", { params }),
    getDokumentasiInfrastrukturById: (id) =>
      fetchData(`/api/dokumentasi-infrastruktur/${id}`),
    getDokumentasiInfrastrukturByRuas: (noRuas) =>
      fetchData(`/api/dokumentasi-infrastruktur/by-ruas/${noRuas}`),

    // ===== DOKUMEN PPID =====
    getDokumenPpid: (params = {}) => fetchData("/api/dokumen-ppid", { params }),
    getDokumenPpidBySlug: (slug) => fetchData(`/api/dokumen-ppid/slug/${slug}`),

    // ===== STATISTIK =====
    getStats: () => fetchData("/api/stats"),

    // Base URL untuk asset references
    baseURL: baseURL,
  };
};

