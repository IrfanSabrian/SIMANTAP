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

      <!-- Kegiatan Cards Grid -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
      >
        <div
          v-for="kegiatan in paginatedDokumentasi.data"
          :key="kegiatan.id"
          @click="
            navigateTo(`/dokumentasi-kegiatan-detail?slug=${kegiatan.slug}`)
          "
          class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
        >
          <!-- Image dengan placeholder -->
          <div class="relative h-48 overflow-hidden">
            <img
              :src="getThumbnail(kegiatan)"
              :alt="kegiatan.judul"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              @error="handleImageError"
            />
            <div
              class="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold"
            >
              {{ kegiatan.kategori || "Kegiatan" }}
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <div class="flex items-center text-sm text-gray-500 mb-2">
              <svg
                class="w-4 h-4 mr-2"
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
            <h3
              class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors"
            >
              {{ kegiatan.judul }}
            </h3>
            <p class="text-gray-600 text-sm line-clamp-3 mb-3">
              {{ kegiatan.deskripsi }}
            </p>
            <!-- Tanggal Metadata -->
            <div
              class="flex flex-col gap-1 text-xs text-gray-400 border-t border-gray-100 pt-3"
            >
              <div class="flex items-center" v-if="kegiatan.dibuatPada">
                <svg
                  class="w-3 h-3 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span
                  >Dibuat: {{ formatRelativeDate(kegiatan.dibuatPada) }}</span
                >
              </div>
              <div class="flex items-center" v-if="kegiatan.diperbaruiPada">
                <svg
                  class="w-3 h-3 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span
                  >Diperbarui:
                  {{ formatRelativeDate(kegiatan.diperbaruiPada) }}</span
                >
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
const perPage = 6;

// Fetch data
onMounted(async () => {
  loading.value = true;
  const { data } = await getDokumentasiKegiatan();
  if (data && Array.isArray(data)) {
    dokumentasiList.value = data;
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
