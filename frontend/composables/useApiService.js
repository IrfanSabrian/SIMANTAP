export const useApiService = () => {
  const config = useRuntimeConfig();

  if (!config.public.apiBaseUrl && !config.public.apiUrl) {
    console.error(
      "⚠️ NUXT_PUBLIC_API_BASE_URL or NUXT_PUBLIC_API_URL is not set in environment variables!"
    );
  }

  const apiBaseUrl = config.public.apiBaseUrl;
  const apiUrl = config.public.apiUrl || (config.public.apiBaseUrl ? `${config.public.apiBaseUrl}/api` : "");

  // Fetch roads data from backend API
  const fetchRoads = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Add pagination
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);

      // Add filters
      if (params.kecamatan) queryParams.append("kecamatan", params.kecamatan);
      if (params.desa) queryParams.append("desa", params.desa);
      if (params.kondisi) queryParams.append("kondisi", params.kondisi);
      if (params.tahun) queryParams.append("tahun", params.tahun);
      if (params.search) queryParams.append("search", params.search);

      const url = `${apiUrl}/jalan${
        queryParams.toString() ? "?" + queryParams.toString() : ""
      }`;

      const response = await $fetch(url);

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch roads");
      }

      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      console.error("Error fetching roads:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch roads",
      };
    }
  };

  // Fetch road statistics
  const fetchRoadStats = async () => {
    try {
      const response = await $fetch(`${apiUrl}/jalan/stats/summary`);

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch road stats");
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching road stats:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch road stats",
      };
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const response = await $fetch(`${apiUrl}/jalan/filters/options`);

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch filter options");
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching filter options:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch filter options",
      };
    }
  };

  // Fetch road geometry
  const fetchRoadGeometry = async (id) => {
    try {
      const response = await $fetch(`${apiUrl}/jalan/${id}/geometry`);

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch road geometry");
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching road geometry:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch road geometry",
      };
    }
  };

  // Convert road data to GeoJSON format for map display
  const convertRoadsToGeoJSON = (roads) => {
    const features = roads.map((road) => {
      // Data sudah dalam format longitude/latitude (WGS84)
      // Tidak perlu konversi UTM
      const coordinates = [
        [road.utmXAwal, road.utmYAwal], // Longitude, Latitude
        [road.utmXAkhi, road.utmYAkhi], // Longitude, Latitude
      ];

      return {
        type: "Feature",
        properties: {
          id: road.id,
          fid: road.fid,
          noRuas: road.noRuas,
          nama: road.nama,
          namaJalan: road.namaJalan,
          panjangM: road.panjangM,
          lebarM: road.lebarM,
          tahun: road.tahun,
          kondisi: road.kondisi,
          nilai: road.nilai,
          bobot: road.bobot,
          keterangan: road.keterangan,
          kecamatan: road.kecamatan,
          desa: road.desa,
          pngnlAwal: road.pngnlAwal,
          pngnlAkhi: road.pngnlAkhi,
          shapeLeng: road.shapeLeng,
        },
        geometry: {
          type: "LineString",
          coordinates: coordinates,
        },
      };
    });

    return {
      type: "FeatureCollection",
      features: features,
    };
  };

  // Fetch roads as GeoJSON directly from PostGIS
  const fetchRoadsGeoJSON = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Add filters
      if (params.kecamatan) queryParams.append("kecamatan", params.kecamatan);
      if (params.desa) queryParams.append("desa", params.desa);
      if (params.kondisi) queryParams.append("kondisi", params.kondisi);
      if (params.tahun) queryParams.append("tahun", params.tahun);

      const url = `${apiUrl}/jalan/geojson${
        queryParams.toString() ? "?" + queryParams.toString() : ""
      }`;

      const response = await $fetch(url);

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch GeoJSON");
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching GeoJSON:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch GeoJSON",
      };
    }
  };

  // Kirim aduan jalan dengan upload multi-foto (multipart/form-data)
  const postAduan = async ({
    nomorRuas,
    namaPelapor,
    anonim,
    keterangan,
    email,
    files = [],
  }) => {
    try {
      console.log("postAduan: Starting request...");

      const form = new FormData();
      form.append("nomor_ruas", nomorRuas || "");
      if (namaPelapor) form.append("nama_pelapor", namaPelapor);
      form.append("anonim", anonim ? "true" : "false");
      if (keterangan) form.append("description", keterangan);
      if (email) form.append("email", email);

      // Tambahkan banyak file
      files.forEach((file) => form.append("photos", file));

      console.log("postAduan: Sending request to", `${apiUrl}/aduan`);
      console.log("postAduan: Form data entries:", Array.from(form.entries()));

      const response = await $fetch(`${apiUrl}/aduan`, {
        method: "POST",
        body: form,
      });

      console.log("postAduan: Response received:", response);

      if (!response.success) {
        throw new Error(response.error || "Gagal mengirim aduan");
      }

      console.log("postAduan: Success, returning data");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error postAduan:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        data: error.data,
      });
      return { success: false, error: error.message || "Gagal mengirim aduan" };
    }
  };

  // Fetch daftar aduan (untuk admin)
  const fetchAduan = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.status) queryParams.append("status", params.status);

      const url = `${apiUrl}/aduan${
        queryParams.toString() ? "?" + queryParams.toString() : ""
      }`;

      const response = await $fetch(url);

      if (!response.success) {
        throw new Error(response.error || "Gagal mengambil data aduan");
      }

      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      console.error("Error fetchAduan:", error);
      return {
        success: false,
        error: error.message || "Gagal mengambil data aduan",
      };
    }
  };

  // Update status aduan (untuk admin)
  const updateAduanStatus = async (id, { status, description }) => {
    try {
      const response = await $fetch(`${apiUrl}/aduan/${id}/status`, {
        method: "PATCH",
        body: { status, description },
      });

      if (!response.success) {
        throw new Error(response.error || "Gagal update status aduan");
      }

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error updateAduanStatus:", error);
      return {
        success: false,
        error: error.message || "Gagal update status aduan",
      };
    }
  };

  return {
    fetchRoads,
    fetchRoadStats,
    fetchFilterOptions,
    fetchRoadGeometry,
    convertRoadsToGeoJSON,
    fetchRoadsGeoJSON,
    postAduan,
    fetchAduan,
    updateAduanStatus,
  };
};
