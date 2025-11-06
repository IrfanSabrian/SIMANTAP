<template>
  <div class="min-h-screen bg-white pt-16 sm:pt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Dokumentasi Kegiatan
        </h1>
        <div
          class="w-16 sm:w-24 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-transparent rounded-full"
        ></div>
        <p class="mt-4 text-gray-600">
          Dokumentasi kegiatan Dinas Perumahan dan Kawasan Permukiman Kabupaten
          Kubu Raya
        </p>
      </div>

      <!-- Loading -->
      <LoadingSpinner
        v-if="loading"
        message="Memuat dokumentasi..."
        size="md"
        color="blue"
      />

      <!-- Kegiatan Cards Grid - 4 columns -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        <div
          v-for="kegiatan in paginatedDokumentasi.data"
          :key="kegiatan.id"
          @click="
            navigateTo(`/dokumentasi-kegiatan-detail?slug=${kegiatan.slug}`)
          "
          class="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden border border-gray-200 cursor-pointer transition-all duration-300 transform hover:-translate-y-2"
        >
          <!-- Image Container with Blue Style -->
          <div
            class="relative h-52 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50"
          >
            <img
              :src="getThumbnail(kegiatan)"
              :alt="kegiatan.judul"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              @error="handleImageError"
            />
            <!-- Light Gradient Overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
            ></div>
            <!-- Category Badge - Blue Style -->
            <div class="absolute top-4 left-4 z-10">
              <span
                class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-sm text-blue-700 shadow-lg border border-blue-200/60"
            >
              {{ kegiatan.kategori || "Kegiatan" }}
              </span>
            </div>
            <!-- Date Badge - Blue Style -->
            <div class="absolute bottom-4 right-4 z-10">
              <div
                class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-medium text-gray-700 shadow-lg"
              >
              <svg
                  class="w-3.5 h-3.5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{{ formatRelativeDate(kegiatan.tanggal) }}</span>
            </div>
            </div>
          </div>

          <!-- Content Section - Blue Style -->
          <div class="p-5 bg-white">
            <!-- Title -->
            <h3
              class="font-bold text-gray-900 mb-2.5 line-clamp-2 text-sm leading-snug group-hover:text-blue-600 transition-colors duration-200"
            >
              {{ kegiatan.judul }}
            </h3>

            <!-- Description -->
            <p
              class="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed"
            >
              {{ kegiatan.deskripsi }}
            </p>

            <!-- Upload Date Info -->
            <div
              class="flex items-center justify-between pt-3 border-t border-gray-100"
            >
              <div class="flex items-center text-xs text-gray-500">
                <svg
                  class="w-3.5 h-3.5 mr-1.5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="font-medium">{{
                  kegiatan.uploadDate || (kegiatan.dibuatPada ? formatRelativeDate(kegiatan.dibuatPada) : '')
                }}</span>
              </div>
              <div
                class="flex items-center text-xs text-blue-600 font-semibold"
              >
                <span>Baca selengkapnya</span>
                <svg
                  class="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="!loading && dokumentasiList.length === 0"
        class="text-center py-12"
      >
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
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          Belum Ada Dokumentasi
        </h2>
        <p class="text-gray-600">
          Dokumentasi kegiatan akan ditampilkan di sini.
        </p>
      </div>

      <!-- Pagination -->
      <div
        v-if="
          !loading &&
          dokumentasiList.length > 0 &&
          paginatedDokumentasi.totalPages > 1
        "
        class="flex justify-center items-center space-x-2"
      >
        <!-- Previous Button -->
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <!-- Page Numbers -->
        <button
          v-for="page in paginatedDokumentasi.totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-4 py-2 rounded-lg transition-colors',
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 text-gray-700 hover:bg-gray-100',
          ]"
        >
          {{ page }}
        </button>

        <!-- Next Button -->
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === paginatedDokumentasi.totalPages"
          class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// Use default layout
definePageMeta({
  layout: "default",
});

const { getDokumentasiKegiatan } = useContentApi();
const { getThumbnail, handleImageError } = useImagePlaceholder();
const { formatRelativeDate } = useDateFormat();

const dokumentasiList = ref<any[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const perPage = 12; // 3 rows x 4 columns

// Helper function to format date
const formatUploadDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} minggu lalu`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} bulan lalu`;
  }
  const years = Math.floor(diffDays / 365);
  return `${years} tahun lalu`;
};

// Fetch data
onMounted(async () => {
  loading.value = true;
  const { data } = await getDokumentasiKegiatan();
  if (data && Array.isArray(data)) {
    // Add uploadDate to each item
    dokumentasiList.value = data.map((item: any) => ({
      ...item,
      uploadDate: formatUploadDate(item.dibuatPada || item.diperbaruiPada),
    }));
  }
  loading.value = false;
});

// Pagination
const paginatedDokumentasi = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  const end = start + perPage;
  return {
    data: dokumentasiList.value.slice(start, end),
    totalPages: Math.ceil(dokumentasiList.value.length / perPage),
  };
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= paginatedDokumentasi.value.totalPages) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
</script>
