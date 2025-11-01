<template>
  <div class="min-h-screen bg-white pt-16 sm:pt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Dokumentasi Infrastruktur
        </h1>
        <div
          class="w-16 sm:w-24 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-transparent rounded-full"
        ></div>
        <p class="mt-4 text-gray-600">
          Video dokumentasi pembangunan dan monitoring infrastruktur di
          Kabupaten Kubu Raya
        </p>
      </div>

      <!-- Category Tabs -->
      <div class="mb-8 overflow-x-auto">
        <div
          class="flex space-x-2 sm:space-x-4 justify-start sm:justify-center min-w-max sm:min-w-0 pb-2"
        >
          <button
            v-for="category in infraCategories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap',
              selectedCategory === category.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <LoadingSpinner
        v-if="loading"
        message="Memuat video..."
        size="md"
        color="blue"
      />

      <!-- Video Grid -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
      >
        <div
          v-for="video in paginatedVideos"
          :key="video.id"
          class="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div
            @click="video.youtubeUrl ? openYouTubeFancybox(video.youtubeUrl, video.title) : null"
            :class="[
              'block relative aspect-video bg-gray-200',
              video.youtubeUrl ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
            ]"
          >
            <!-- Thumbnail -->
            <img
              v-if="video.thumbnail"
              :src="video.thumbnail"
              :alt="video.title"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full bg-gray-300 flex items-center justify-center"
            >
              <div class="text-center">
                <svg
                  class="w-16 h-16 mx-auto text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <p class="text-sm text-gray-500">Video tidak tersedia</p>
              </div>
            </div>

            <!-- Play Button Overlay -->
            <div
              v-if="video.thumbnail"
              class="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center"
            >
              <div
                class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 hover:bg-red-700"
              >
                <svg
                  class="w-8 h-8 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            <!-- Duration Badge -->
            <div
              v-if="video.thumbnail"
              class="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded"
            >
              {{ video.duration }}
            </div>
          </div>

          <!-- Video Info -->
          <div class="p-4">
            <h3
              class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
            >
              {{ video.title }}
            </h3>
            <p class="text-sm text-gray-600 line-clamp-2 mb-3">
              {{ video.description }}
            </p>
            <!-- Category and Time -->
            <div
              class="mt-3 flex items-center justify-between text-xs text-gray-500"
            >
              <div class="flex items-center">
                <svg
                  class="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>{{ video.category }}</span>
              </div>
              <span v-if="video.diperbaruiPada" class="text-gray-400">
                {{ formatRelativeDate(video.diperbaruiPada) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="!loading && paginatedVideos.length === 0"
        class="text-center py-12"
      >
        <svg
          class="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <p class="text-gray-600">Belum ada video untuk kategori ini</p>
      </div>

      <!-- Pagination -->
      <div
        v-if="!loading && totalPages > 1"
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
          v-for="page in totalPages"
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
          :disabled="currentPage === totalPages"
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
import { ref, computed, onMounted, watch, nextTick } from "vue";

// Use default layout
definePageMeta({
  layout: "default",
});

const config = useRuntimeConfig();
const { getDokumentasiInfrastruktur } = useContentApi();
const { formatRelativeDate } = useDateFormat();

const selectedCategory = ref("Jalan_Lingkungan");
const currentPage = ref(1);
const perPage = 9;
const loading = ref(false);
const dokumentasiList = ref<any[]>([]);

const infraCategories = [
  { id: "Jalan_Lingkungan", name: "Jalan Lingkungan", shortId: "jalan" },
  {
    id: "Jembatan_Lingkungan",
    name: "Jembatan Lingkungan",
    shortId: "jembatan",
  },
  {
    id: "Drainase_Lingkungan",
    name: "Drainase Lingkungan",
    shortId: "drainase",
  },
  { id: "Kawasan_Permukiman", name: "Kawasan Permukiman", shortId: "kawasan" },
  {
    id: "Rumah_Tidak_Layak_Huni",
    name: "Rumah Tidak Layak Huni",
    shortId: "rumah",
  },
];

// Helper functions for YouTube
const extractYouTubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const getYouTubeThumbnail = (url: string) => {
  const videoId = extractYouTubeVideoId(url);
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;
};

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return "";
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return "";
  return `https://www.youtube.com/embed/${videoId}`;
};

const openYouTubeFancybox = (url: string, title: string) => {
  if (typeof window !== "undefined" && (window as any).Fancybox) {
    const videoUrl = getYouTubeEmbedUrl(url);
    const videoTitle = title || "Video Dokumentasi";

    (window as any).Fancybox.show(
      [
        {
          src: videoUrl,
          type: "iframe",
          caption: videoTitle,
        },
      ],
      {
        Toolbar: {
          display: {
            left: ["infobar"],
            middle: [],
            right: ["close"],
          },
        },
        closeButton: "top",
        click: "close",
        wheel: "close",
        keyboard: {
          Escape: "close",
        },
      }
    );
  } else {
    // Fallback: open in new tab if Fancybox is not available
    window.open(url, "_blank");
  }
};

const formatJenisInfrastruktur = (jenis: string) => {
  return jenis.replace(/_/g, " ");
};

// Load data from API
const loadDokumentasi = async () => {
  loading.value = true;
  try {
    console.log("[loadDokumentasi] Loading with category:", selectedCategory.value);
    const { data, error } = await getDokumentasiInfrastruktur({
      jenisInfrastruktur: selectedCategory.value,
    });

    console.log("[loadDokumentasi] Response:", { data, error });

    if (error) {
      console.error("Error loading dokumentasi:", error);
      dokumentasiList.value = [];
    } else {
      // API mengembalikan array langsung
      dokumentasiList.value = Array.isArray(data) ? data : [];
      console.log("[loadDokumentasi] Dokumentasi loaded:", dokumentasiList.value.length, "items");
    }
  } catch (error) {
    console.error("Error loading dokumentasi:", error);
    dokumentasiList.value = [];
  } finally {
    loading.value = false;
  }
};

// Transform data for display
const filteredVideos = computed(() => {
  if (!dokumentasiList.value || !Array.isArray(dokumentasiList.value)) {
    return [];
  }

  return dokumentasiList.value.map((item: any) => {
    let title = formatJenisInfrastruktur(item.jenisInfrastruktur);

    // Add road info for Jalan Lingkungan
    if (item.roadInfo && item.roadInfo.namaJalan) {
      title += ` - ${item.roadInfo.namaJalan}`;
      if (item.roadInfo.kecamatan) {
        title += ` - ${item.roadInfo.kecamatan}`;
      }
      if (item.roadInfo.desa) {
        title += ` - ${item.roadInfo.desa}`;
      }
    } else if (item.noRuas) {
      title += ` - ${item.noRuas}`;
    }

    return {
      id: item.id,
      category: formatJenisInfrastruktur(item.jenisInfrastruktur),
      title,
      description: `Video dokumentasi ${formatJenisInfrastruktur(
        item.jenisInfrastruktur
      ).toLowerCase()} dengan nomor ruas ${item.noRuas || ""}`,
      youtubeUrl: item.linkYoutube || "",
      thumbnail: getYouTubeThumbnail(item.linkYoutube || ""),
      duration: "Video",
      roadInfo: item.roadInfo || null,
      dibuatPada: item.dibuatPada || null,
      diperbaruiPada: item.diperbaruiPada || null,
    };
  });
});

const paginatedVideos = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  const end = start + perPage;
  return filteredVideos.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredVideos.value.length / perPage);
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// Reset page when category changes
watch(selectedCategory, () => {
  currentPage.value = 1;
  loadDokumentasi();
});

onMounted(() => {
  loadDokumentasi();

  // Wait for Fancybox to be loaded from CDN
  nextTick(() => {
    // Check if Fancybox is already loaded
    if (typeof window !== "undefined" && (window as any).Fancybox) {
      console.log("Fancybox initialized");
      return;
    }

    // Wait for script to load
    const checkFancybox = setInterval(() => {
      if (typeof window !== "undefined" && (window as any).Fancybox) {
        console.log("Fancybox loaded and initialized");
        clearInterval(checkFancybox);
      }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkFancybox);
      if (typeof window !== "undefined" && !(window as any).Fancybox) {
        console.warn("Fancybox failed to load");
      }
    }, 5000);
  });
});
</script>
