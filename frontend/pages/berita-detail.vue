<template>
  <div class="pt-16 sm:pt-20">
    <!-- Loading State -->
    <LoadingSpinner
      v-if="loading"
      message="Memuat berita..."
      size="md"
      color="blue"
      :full-screen="true"
      :overlay="true"
    />

    <!-- News Detail Content -->
    <div v-else-if="news">
      <!-- Breadcrumb Navigation -->
      <div class="bg-white border-b">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav class="flex items-center space-x-2 text-sm">
            <NuxtLink to="/" class="text-gray-500 hover:text-gray-700"
              >Beranda</NuxtLink
            >
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
            <NuxtLink to="/berita" class="text-gray-500 hover:text-gray-700"
              >Berita</NuxtLink
            >
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
            <span class="text-gray-900 font-medium truncate">{{
              news.judul
            }}</span>
          </nav>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Article -->
          <article class="lg:col-span-2">
            <!-- Article Header -->
            <header class="mb-8">
              <!-- Category Badge -->
              <div class="mb-4">
                <span
                  :class="[
                    'inline-block px-3 py-1 rounded-full text-sm font-medium',
                    news.kategori === 'Berita Umum'
                      ? 'bg-blue-100 text-blue-800'
                      : news.kategori === 'Pengumuman'
                      ? 'bg-green-100 text-green-800'
                      : news.kategori === 'Kegiatan'
                      ? 'bg-orange-100 text-orange-800'
                      : news.kategori === 'Prestasi'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ news.kategori || "Berita" }}
                </span>
              </div>

              <!-- Title -->
              <h1
                class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight"
              >
                {{ news.judul }}
              </h1>

              <!-- Meta Information -->
              <div
                class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6"
              >
                <div class="flex items-center">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  {{ formatDate(news.tanggalPublikasi || news.dibuatPada) }}
                </div>
                <div class="flex items-center">
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                  {{ news.penulis || "Admin" }}
                </div>
                <div class="flex items-center" v-if="news.waktuBaca">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  {{ news.waktuBaca }}
                </div>
              </div>

              <!-- Featured Image -->
              <div
                class="w-full h-64 sm:h-80 bg-gray-200 rounded-lg overflow-hidden mb-6"
              >
                <img
                  :src="getThumbnail(news)"
                  :alt="news.judul"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
              </div>
            </header>

            <!-- Article Content -->
            <div class="prose prose-lg max-w-none">
              <!-- Excerpt -->
              <div
                v-if="news.ringkasan"
                class="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-r-lg"
              >
                <p
                  class="text-lg text-gray-700 leading-relaxed font-medium m-0"
                >
                  {{ news.ringkasan }}
                </p>
              </div>

              <!-- Main Content -->
              <div
                class="text-gray-700 leading-relaxed space-y-4"
                v-html="news.konten"
              ></div>

              <!-- Action Buttons -->
              <div class="mt-8 pt-8 border-t border-gray-200">
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <!-- Share Buttons -->
                  <div class="flex items-center space-x-3">
                    <span class="text-sm font-medium text-gray-700"
                      >Bagikan:</span
                    >
                    <button
                      @click="shareToTwitter"
                      class="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm"
                    >
                      <svg
                        class="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                        />
                      </svg>
                      Twitter
                    </button>
                    <button
                      @click="shareToFacebook"
                      class="flex items-center px-3 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors duration-300 text-sm"
                    >
                      <svg
                        class="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                        />
                      </svg>
                      Facebook
                    </button>
                    <button
                      @click="shareToWhatsApp"
                      class="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 text-sm"
                    >
                      <svg
                        class="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"
                        />
                      </svg>
                      WhatsApp
                    </button>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex items-center space-x-3">
                    <button
                      @click="likeNews"
                      :class="[
                        'flex items-center px-3 py-2 rounded-lg transition-colors duration-300 text-sm',
                        isLiked
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                      ]"
                    >
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
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                      </svg>
                      {{ isLiked ? "Disukai" : "Suka" }}
                    </button>
                    <button
                      @click="saveNews"
                      :class="[
                        'flex items-center px-3 py-2 rounded-lg transition-colors duration-300 text-sm',
                        isSaved
                          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                      ]"
                    >
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
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        ></path>
                      </svg>
                      {{ isSaved ? "Disimpan" : "Simpan" }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <!-- Sidebar -->
          <aside class="lg:col-span-1">
            <div class="sticky top-24 space-y-6">
              <!-- Back to News -->
              <div class="bg-white rounded-lg shadow-sm border p-6">
                <NuxtLink
                  to="/berita"
                  class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300 font-medium"
                >
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                  </svg>
                  Kembali ke Daftar Berita
                </NuxtLink>
              </div>

              <!-- Related News -->
              <div class="bg-white rounded-lg shadow-sm border p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  Berita Lainnya
                </h3>
                <div class="space-y-4">
                  <div
                    v-for="(relatedNews, index) in relatedNewsList"
                    :key="`related-${relatedNews.id}-${index}`"
                    class="border-b border-gray-100 pb-4 last:border-b-0"
                  >
                    <NuxtLink
                      :to="`/berita-detail?slug=${relatedNews.slug}`"
                      class="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors duration-200"
                    >
                      <!-- News Image -->
                      <div
                        class="w-full h-32 bg-gray-200 rounded-lg overflow-hidden mb-3"
                      >
                        <img
                          :src="getThumbnail(relatedNews)"
                          :alt="relatedNews.judul"
                          class="w-full h-full object-cover"
                          @error="handleImageError"
                        />
                      </div>

                      <!-- News Content -->
                      <div>
                        <h4
                          class="text-sm font-medium text-gray-900 line-clamp-2 mb-2 hover:text-blue-600 transition-colors duration-200"
                        >
                          {{ relatedNews.judul }}
                        </h4>
                        <div class="flex items-center justify-between">
                          <p class="text-xs text-gray-500">
                            {{
                              formatRelativeDate(
                                relatedNews.tanggalPublikasi ||
                                  relatedNews.dibuatPada
                              )
                            }}
                          </p>
                          <span
                            :class="[
                              'px-2 py-1 rounded-full text-xs font-medium',
                              relatedNews.kategori === 'Berita Umum'
                                ? 'bg-blue-100 text-blue-800'
                                : relatedNews.kategori === 'Pengumuman'
                                ? 'bg-green-100 text-green-800'
                                : relatedNews.kategori === 'Kegiatan'
                                ? 'bg-orange-100 text-orange-800'
                                : relatedNews.kategori === 'Prestasi'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800',
                            ]"
                          >
                            {{ relatedNews.kategori || "Berita" }}
                          </span>
                        </div>
                      </div>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          Berita Tidak Ditemukan
        </h1>
        <p class="text-gray-600 mb-6">
          Berita yang Anda cari tidak ditemukan atau telah dihapus.
        </p>
        <NuxtLink
          to="/berita"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-300"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Kembali ke Berita
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";

// Use default layout
definePageMeta({
  layout: "default",
});

// Get route params and API
const route = useRoute();
const { getBeritaBySlug, getBerita } = useContentApi();
const { getThumbnail, handleImageError } = useImagePlaceholder();
const { formatRelativeDate } = useDateFormat();

const loading = ref(true);
const news = ref<any>(null);
const isSaved = ref(false);
const isLiked = ref(false);
const relatedNewsList = ref<any[]>([]);

// Format date for display
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Function to load news data
const loadNews = async (slug: string) => {
  loading.value = true;

  // Scroll to top immediately when loading new news
  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    // Fetch berita by slug
    const { data, error } = await getBeritaBySlug(slug);

    if (error || !data) {
      console.error("Error loading berita:", error);
      news.value = null;
    } else {
      news.value = data;

      // Load related news (same category or recent)
      const { data: allBerita } = await getBerita({ limit: 4 });
      if (allBerita && Array.isArray(allBerita)) {
        // Filter out current berita and get up to 3 related items
        relatedNewsList.value = allBerita
          .filter((item: any) => item.slug !== slug)
          .slice(0, 3);
      }
    }
  } catch (err) {
    console.error("Error fetching berita:", err);
    news.value = null;
  } finally {
    loading.value = false;
  }
};

// Load news data when component mounts
onMounted(async () => {
  // Scroll to top when component first mounts
  window.scrollTo({ top: 0, behavior: "smooth" });

  const slug = route.query.slug as string;
  if (slug) {
    await loadNews(slug);
  }
});

// Watch for route changes
watch(
  () => route.query.slug,
  async (newSlug) => {
    if (newSlug) {
      await loadNews(newSlug as string);
    }
  }
);

// Share functions
const shareToTwitter = () => {
  if (!news.value) return;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    news.value.judul
  )}&url=${encodeURIComponent(window.location.href)}`;
  window.open(url, "_blank");
};

const shareToFacebook = () => {
  if (!news.value) return;
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    window.location.href
  )}`;
  window.open(url, "_blank");
};

const shareToWhatsApp = () => {
  if (!news.value) return;
  const url = `https://wa.me/?text=${encodeURIComponent(
    news.value.judul + " - " + window.location.href
  )}`;
  window.open(url, "_blank");
};

// Save news function
const saveNews = () => {
  isSaved.value = !isSaved.value;
  // Here you can add logic to save to localStorage or send to API
  if (isSaved.value) {
    // Save to localStorage
    const savedNews = JSON.parse(localStorage.getItem("savedNews") || "[]");
    if (!savedNews.includes(news.value?.id)) {
      savedNews.push(news.value?.id);
      localStorage.setItem("savedNews", JSON.stringify(savedNews));
    }
  } else {
    // Remove from localStorage
    const savedNews = JSON.parse(localStorage.getItem("savedNews") || "[]");
    const filteredNews = savedNews.filter(
      (id: number) => id !== news.value?.id
    );
    localStorage.setItem("savedNews", JSON.stringify(filteredNews));
  }
};

// Like news function
const likeNews = () => {
  isLiked.value = !isLiked.value;
  // Here you can add logic to save to localStorage or send to API
  if (isLiked.value) {
    const likedNews = JSON.parse(localStorage.getItem("likedNews") || "[]");
    if (!likedNews.includes(news.value?.id)) {
      likedNews.push(news.value?.id);
      localStorage.setItem("likedNews", JSON.stringify(likedNews));
    }
  } else {
    const likedNews = JSON.parse(localStorage.getItem("likedNews") || "[]");
    const filteredNews = likedNews.filter(
      (id: number) => id !== news.value?.id
    );
    localStorage.setItem("likedNews", JSON.stringify(filteredNews));
  }
};

// Check if news is saved/liked on mount
watch(news, () => {
  if (news.value) {
    const savedNews = JSON.parse(localStorage.getItem("savedNews") || "[]");
    const likedNews = JSON.parse(localStorage.getItem("likedNews") || "[]");
    isSaved.value = savedNews.includes(news.value.id);
    isLiked.value = likedNews.includes(news.value.id);
  }
});

// Meta tags
useHead({
  title: computed(() =>
    news.value ? `${news.value.judul} - Berita Terkini` : "Berita Terkini"
  ),
  meta: [
    {
      name: "description",
      content: computed(() =>
        news.value
          ? news.value.ringkasan || news.value.judul
          : "Dapatkan informasi terbaru tentang pembangunan infrastruktur dan program pemerintah Kabupaten Kubu Raya"
      ),
    },
  ],
});
</script>

<style scoped>
.prose {
  color: #374151;
}

.prose p {
  margin-bottom: 1.5rem;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
