<template>
  <div>
    <!-- PPID Content -->
    <section class="pt-16 sm:pt-20 py-8 sm:py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Header -->
        <div class="text-left mb-12 ml-0 mt-8">
          <h1
            class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            PPID
          </h1>
          <div
            class="w-16 sm:w-24 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-transparent rounded-full"
          ></div>
        </div>

        <!-- Filters -->
        <div class="mb-8 flex flex-wrap gap-4">
          <!-- Kategori Filter -->
          <select
            v-model="selectedKategori"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="kat in kategoriList" :key="kat" :value="kat">
              {{ kat }}
            </option>
          </select>

          <!-- Tahun Filter -->
          <select
            v-model="selectedTahun"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="thn in tahunList" :key="thn" :value="thn">
              Tahun {{ thn }}
            </option>
          </select>
        </div>

        <!-- Loading -->
        <LoadingSpinner
          v-if="loading"
          message="Memuat dokumen..."
          size="md"
          color="blue"
        />

        <!-- Dokumen List -->
        <div v-else-if="filteredDokumen.length > 0" class="space-y-4">
          <div
            v-for="dok in filteredDokumen"
            :key="dok.id"
            class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            :class="downloading ? 'cursor-wait opacity-60' : 'cursor-pointer'"
            @click="
              downloadDokumen(dok.urlFile, dok.id, dok.judul, dok.namaFile)
            "
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span
                    class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                  >
                    {{ dok.kategori || "Dokumen" }}
                  </span>
                  <span v-if="dok.tahun" class="text-sm text-gray-500">{{
                    dok.tahun
                  }}</span>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">
                  {{ dok.judul }}
                </h3>
                <p v-if="dok.deskripsi" class="text-gray-600 text-sm mb-3">
                  {{ dok.deskripsi }}
                </p>
                <div class="flex items-center gap-4 text-xs text-gray-500">
                  <span>📄 {{ dok.namaFile }}</span>
                  <span>📥 {{ dok.jumlahUnduhan || 0 }} unduhan</span>
                </div>
              </div>
              <button
                :disabled="downloading"
                class="flex-shrink-0 ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span
                  v-if="downloading"
                  class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                ></span>
                <span>{{ downloading ? "Mengunduh..." : "Unduh" }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="py-20 bg-white rounded-lg shadow-sm">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <svg
              class="w-24 h-24 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              Belum Ada Dokumen
            </h2>
            <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Dokumen informasi publik akan ditampilkan di sini.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// Use default layout
definePageMeta({
  layout: "default",
});

const { getDokumenPpid } = useContentApi();
const { formatDate } = useDateFormat();

const dokumenList = ref<any[]>([]);
const loading = ref(false);
const downloading = ref(false);
const selectedKategori = ref("Semua");
const selectedTahun = ref("Semua");

// Page metadata
useHead({
  title: "PPID - Disperkim Kabupaten Kubu Raya",
  meta: [
    {
      name: "description",
      content:
        "Pejabat Pengelola Informasi dan Dokumentasi Dinas Perumahan Rakyat dan Kawasan Permukiman Kabupaten Kubu Raya",
    },
  ],
});

onMounted(async () => {
  loading.value = true;
  const { data } = await getDokumenPpid();
  if (data && Array.isArray(data)) {
    dokumenList.value = data;
  }
  loading.value = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Get unique categories and years
const kategoriList = computed(() => {
  const unique = [
    ...new Set(dokumenList.value.map((d) => d.kategori).filter(Boolean)),
  ];
  return ["Semua", ...unique];
});

const tahunList = computed(() => {
  const unique = [
    ...new Set(dokumenList.value.map((d) => d.tahun).filter(Boolean)),
  ];
  return ["Semua", ...unique.sort().reverse()];
});

// Filter
const filteredDokumen = computed(() => {
  return dokumenList.value.filter((dok) => {
    const matchKategori =
      selectedKategori.value === "Semua" ||
      dok.kategori === selectedKategori.value;
    const matchTahun =
      selectedTahun.value === "Semua" || dok.tahun === selectedTahun.value;
    return matchKategori && matchTahun;
  });
});

const downloadDokumen = async (
  url: string,
  dokId: number,
  judul: string,
  namaFile: string
) => {
  if (downloading.value) return; // Prevent multiple downloads

  downloading.value = true;

  try {
    // Download file directly from backend (local storage)
    const config = useRuntimeConfig();

    if (!config.public.apiBaseUrl) {
      console.error(
        "⚠️ NUXT_PUBLIC_API_BASE_URL is not set in environment variables!"
      );
      return;
    }

    const baseURL = config.public.apiBaseUrl;
    const downloadUrl = `${baseURL}/api/dokumen-ppid/download-file/${dokId}`;

    console.log("Downloading file from:", downloadUrl);

    // Trigger download using window.open or fetch + blob
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = ""; // Let backend set filename via Content-Disposition header
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);

    console.log("Download triggered successfully");
  } catch (error: unknown) {
    console.error("Error downloading file:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn(`Error downloading: ${errorMessage}`);
    alert("Gagal mengunduh file. Silakan coba lagi.");
  } finally {
    downloading.value = false;
  }
};
</script>
