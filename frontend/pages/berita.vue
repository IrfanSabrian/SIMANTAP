<template>
  <div>
    <!-- News Content -->
    <section class="pt-16 sm:pt-20 py-8 sm:py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Header -->
        <div class="text-left mb-12 ml-0 mt-8">
          <h1
            class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Berita
          </h1>
          <div
            class="w-16 sm:w-24 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-transparent rounded-full"
          ></div>
        </div>
        <!-- Filter and Search -->
        <div class="mb-12">
          <div
            class="flex flex-col sm:flex-row gap-4 items-center justify-between"
          >
            <div class="flex flex-wrap gap-2">
              <button
                v-for="category in categories"
                :key="category"
                @click="selectedCategory = category"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300',
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-blue-50',
                ]"
              >
                {{ category }}
              </button>
            </div>
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Cari berita..."
                class="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <LoadingSpinner
          v-if="loading"
          message="Memuat berita..."
          size="md"
          color="blue"
        />

        <!-- News Grid -->
        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <article
            v-for="(item, index) in filteredNews"
            :key="item.id"
            class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            @click="navigateTo(`/berita-detail?slug=${item.slug}`)"
          >
            <!-- Image dengan placeholder -->
            <div class="h-48 bg-gray-200 relative overflow-hidden">
              <img
                :src="getThumbnail(item)"
                :alt="item.judul"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                @error="handleImageError"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
              ></div>
              <div class="absolute top-4 left-4">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    item.kategori === 'Berita Umum'
                      ? 'bg-blue-600 text-white'
                      : item.kategori === 'Pengumuman'
                      ? 'bg-green-600 text-white'
                      : item.kategori === 'Kegiatan'
                      ? 'bg-orange-600 text-white'
                      : item.kategori === 'Prestasi'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-600 text-white',
                  ]"
                >
                  {{ item.kategori || "Berita" }}
                </span>
              </div>
              <div class="absolute bottom-4 left-4 text-white">
                <span class="text-sm">{{
                  formatRelativeDate(item.tanggalPublikasi)
                }}</span>
              </div>
            </div>
            <div class="p-6">
              <h3
                class="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2"
              >
                {{ item.judul }}
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {{ getExcerpt(item.konten, 200) }}
              </p>
              <div
                class="mt-4 flex items-center text-blue-600 group-hover:text-blue-800 transition-colors duration-300"
              >
                <span class="text-sm font-medium mr-2">Baca Selengkapnya</span>
                <svg
                  class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
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
          </article>
        </div>

        <!-- Empty State -->
        <div
          v-if="!loading && filteredNews.length === 0"
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
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <p class="text-gray-600">Tidak ada berita ditemukan</p>
        </div>

        <!-- Load More Button -->
        <div class="text-center mt-12">
          <button
            @click="loadMoreNews"
            class="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Muat Lebih Banyak
            <svg
              class="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
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

// Meta tags
useHead({
  title:
    "Berita Terkini - Dinas Perumahan dan Kawasan Permukiman Kabupaten Kubu Raya",
  meta: [
    {
      name: "description",
      content:
        "Dapatkan informasi terbaru tentang pembangunan infrastruktur dan program pemerintah Kabupaten Kubu Raya",
    },
  ],
});

// API composables
const { getBerita } = useContentApi();
const { getThumbnail, handleImageError } = useImagePlaceholder();
const { formatRelativeDate } = useDateFormat();
const { getExcerpt } = useTextUtils();

// Reactive data
const selectedCategory = ref("Semua");
const searchQuery = ref("");
const beritaList = ref<any[]>([]);
const loading = ref(false);

const categories = [
  "Semua",
  "Berita Umum",
  "Pengumuman",
  "Kegiatan",
  "Prestasi",
];

// Fetch berita on mount
onMounted(async () => {
  loading.value = true;
  const { data } = await getBerita();
  if (data && Array.isArray(data)) {
    beritaList.value = data;
  }
  loading.value = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Computed properties
const filteredNews = computed(() => {
  let filtered = beritaList.value;

  // Filter by category
  if (selectedCategory.value !== "Semua") {
    filtered = filtered.filter(
      (item) => item.kategori === selectedCategory.value
    );
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.judul?.toLowerCase().includes(query) ||
        item.konten?.toLowerCase().includes(query) ||
        item.kategori?.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const loadMoreNews = () => {
  console.log("Fitur Muat Lebih Banyak akan datang");
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
