<template>
  <div class="pt-16 sm:pt-20">
    <!-- Loading State -->
    <LoadingSpinner
      v-if="loading"
      message="Memuat dokumentasi..."
      size="md"
      color="blue"
      :full-screen="true"
      :overlay="true"
    />

    <!-- Dokumentasi Detail Content -->
    <div v-else-if="dokumentasi">
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
            <NuxtLink
              to="/dokumentasi-kegiatan"
              class="text-gray-500 hover:text-gray-700"
              >Dokumentasi Kegiatan</NuxtLink
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
              dokumentasi.judul
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
                    getCategoryBadgeClass(dokumentasi.kategori),
                  ]"
                >
                  {{ dokumentasi.kategori || "Kegiatan" }}
                </span>
              </div>

              <!-- Title -->
              <h1
                class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight"
              >
                {{ dokumentasi.judul }}
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  {{ formatDate(dokumentasi.tanggal) }}
                </div>
                <div class="flex items-center" v-if="dokumentasi.dibuatPada">
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
                  {{ formatRelativeDate(dokumentasi.dibuatPada) }}
                </div>
              </div>

              <!-- Featured Image -->
              <div
                class="w-full h-64 sm:h-80 bg-gray-200 rounded-lg overflow-hidden mb-6"
              >
                <img
                  :src="getThumbnail(dokumentasi)"
                  :alt="dokumentasi.judul"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
              </div>
            </header>

            <!-- Article Content -->
            <div class="prose prose-lg max-w-none">
              <!-- Description -->
              <div
                v-if="dokumentasi.deskripsi"
                class="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-r-lg"
              >
                <p
                  class="text-lg text-gray-700 leading-relaxed font-medium m-0"
                >
                  {{ dokumentasi.deskripsi }}
                </p>
              </div>

              <!-- Main Content -->
              <div
                v-if="dokumentasi.konten"
                class="text-gray-700 leading-relaxed space-y-4"
                v-html="dokumentasi.konten"
              ></div>

              <!-- Image Gallery -->
              <div
                v-if="
                  dokumentasi.gambarLainnya &&
                  dokumentasi.gambarLainnya.length > 0
                "
                class="mt-10 pt-8 border-t border-gray-200"
              >
                <h3 class="text-2xl font-bold text-gray-900 mb-6">
                  Galeri Foto Kegiatan
                </h3>
                <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <a
                    v-for="(image, index) in dokumentasi.gambarLainnya"
                    :key="index"
                    :href="image"
                    data-fancybox="gallery"
                    :data-caption="`${dokumentasi.judul} - Foto ${index + 1}`"
                    class="group relative block rounded-lg overflow-hidden aspect-video cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      :src="image"
                      :alt="`${dokumentasi.judul} - ${index + 1}`"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      @error="handleImageError"
                    />
                    <div
                      class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center"
                    >
                      <svg
                        class="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </a>
                </div>
              </div>

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
                      @click="likeDokumentasi"
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
                      @click="saveDokumentasi"
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
              <!-- Back to Dokumentasi -->
              <div class="bg-white rounded-lg shadow-sm border p-6">
                <NuxtLink
                  to="/dokumentasi-kegiatan"
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
                  Kembali ke Dokumentasi Kegiatan
                </NuxtLink>
              </div>

              <!-- Related Dokumentasi -->
              <div class="bg-white rounded-lg shadow-sm border p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  Dokumentasi Lainnya
                </h3>
                <div class="space-y-4">
                  <div
                    v-for="(item, index) in relatedDokumentasi"
                    :key="`related-${item.id}-${index}`"
                    class="border-b border-gray-100 pb-4 last:border-b-0"
                  >
                    <NuxtLink
                      :to="`/dokumentasi-kegiatan-detail?slug=${item.slug}`"
                      class="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors duration-200"
                    >
                      <!-- Image -->
                      <div
                        class="w-full h-32 bg-gray-200 rounded-lg overflow-hidden mb-3"
                      >
                        <img
                          :src="getThumbnail(item)"
                          :alt="item.judul"
                          class="w-full h-full object-cover"
                          @error="handleImageError"
                        />
                      </div>

                      <!-- Content -->
                      <div>
                        <h4
                          class="text-sm font-medium text-gray-900 line-clamp-2 mb-2 hover:text-blue-600 transition-colors duration-200"
                        >
                          {{ item.judul }}
                        </h4>
                        <div class="flex items-center justify-between">
                          <p class="text-xs text-gray-500">
                            {{ formatRelativeDate(item.tanggal) }}
                          </p>
                          <span
                            :class="[
                              'px-2 py-1 rounded-full text-xs font-medium',
                              getCategoryBadgeClass(item.kategori),
                            ]"
                          >
                            {{ item.kategori || "Kegiatan" }}
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
          Dokumentasi Tidak Ditemukan
        </h1>
        <p class="text-gray-600 mb-6">
          Dokumentasi yang Anda cari tidak ditemukan atau telah dihapus.
        </p>
        <NuxtLink
          to="/dokumentasi-kegiatan"
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
          Kembali ke Dokumentasi Kegiatan
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
const { getDokumentasiKegiatanBySlug, getDokumentasiKegiatan } =
  useContentApi();
const { getThumbnail, handleImageError } = useImagePlaceholder();
const { formatRelativeDate } = useDateFormat();

const loading = ref(true);
const dokumentasi = ref<any>(null);
const isSaved = ref(false);
const isLiked = ref(false);
const relatedDokumentasi = ref<any[]>([]);

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

// Category badge class
const getCategoryBadgeClass = (kategori: string) => {
  const kategoriMap: Record<string, string> = {
    "Rapat Koordinasi": "bg-blue-100 text-blue-800",
    "Kunjungan Lapangan": "bg-green-100 text-green-800",
    "Monitoring & Evaluasi (Monev)": "bg-orange-100 text-orange-800",
    "Sosialisasi Program": "bg-purple-100 text-purple-800",
    "Pelatihan Teknis": "bg-yellow-100 text-yellow-800",
    "Serah Terima / Peresmian": "bg-red-100 text-red-800",
  };
  return kategoriMap[kategori] || "bg-gray-100 text-gray-800";
};

// Function to load dokumentasi data
const loadDokumentasi = async (slug: string) => {
  loading.value = true;

  // Scroll to top immediately when loading new dokumentasi
  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    // Fetch dokumentasi by slug
    const { data, error } = await getDokumentasiKegiatanBySlug(slug);

    if (error || !data) {
      console.error("Error loading dokumentasi:", error);
      dokumentasi.value = null;
    } else {
      dokumentasi.value = data;

      // Load related dokumentasi (same category or recent)
      const { data: allDokumentasi } = await getDokumentasiKegiatan({
        limit: 4,
      });
      if (allDokumentasi && Array.isArray(allDokumentasi)) {
        // Filter out current dokumentasi and get up to 3 related items
        relatedDokumentasi.value = allDokumentasi
          .filter((item: any) => item.slug !== slug)
          .slice(0, 3);
      }

      // Initialize Fancybox for gallery
      nextTick(() => {
        // Wait for Fancybox to be loaded from CDN
        const initFancybox = () => {
          if (typeof window !== "undefined" && (window as any).Fancybox) {
            // Bind fancybox to gallery images
            (window as any).Fancybox.bind("[data-fancybox='gallery']", {
              Toolbar: {
                display: {
                  left: ["infobar"],
                  middle: [],
                  right: ["close"],
                },
              },
              Images: {
                zoom: true,
              },
              closeButton: "top",
              click: "close",
              wheel: "close",
              keyboard: {
                Escape: "close",
              },
            });
            console.log("Fancybox bound to gallery");
            return true;
          }
          return false;
        };

        if (initFancybox()) {
          return;
        }

        // Wait for script to load
        const checkFancybox = setInterval(() => {
          if (initFancybox()) {
            clearInterval(checkFancybox);
          }
        }, 100);

        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkFancybox);
        }, 5000);
      });
    }
  } catch (err) {
    console.error("Error fetching dokumentasi:", err);
    dokumentasi.value = null;
  } finally {
    loading.value = false;
  }
};

// Load dokumentasi data when component mounts
onMounted(async () => {
  // Scroll to top when component first mounts
  window.scrollTo({ top: 0, behavior: "smooth" });

  const slug = route.query.slug as string;
  if (slug) {
    await loadDokumentasi(slug);
  }
});

// Watch for route changes
watch(
  () => route.query.slug,
  async (newSlug) => {
    if (newSlug) {
      await loadDokumentasi(newSlug as string);
    }
  }
);

// Share functions
const shareToTwitter = () => {
  if (!dokumentasi.value) return;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    dokumentasi.value.judul
  )}&url=${encodeURIComponent(window.location.href)}`;
  window.open(url, "_blank");
};

const shareToFacebook = () => {
  if (!dokumentasi.value) return;
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    window.location.href
  )}`;
  window.open(url, "_blank");
};

const shareToWhatsApp = () => {
  if (!dokumentasi.value) return;
  const url = `https://wa.me/?text=${encodeURIComponent(
    dokumentasi.value.judul + " - " + window.location.href
  )}`;
  window.open(url, "_blank");
};

// Save dokumentasi function
const saveDokumentasi = () => {
  isSaved.value = !isSaved.value;
  if (isSaved.value) {
    const savedDokumentasi = JSON.parse(
      localStorage.getItem("savedDokumentasi") || "[]"
    );
    if (!savedDokumentasi.includes(dokumentasi.value?.id)) {
      savedDokumentasi.push(dokumentasi.value?.id);
      localStorage.setItem(
        "savedDokumentasi",
        JSON.stringify(savedDokumentasi)
      );
    }
  } else {
    const savedDokumentasi = JSON.parse(
      localStorage.getItem("savedDokumentasi") || "[]"
    );
    const filtered = savedDokumentasi.filter(
      (id: number) => id !== dokumentasi.value?.id
    );
    localStorage.setItem("savedDokumentasi", JSON.stringify(filtered));
  }
};

// Like dokumentasi function
const likeDokumentasi = () => {
  isLiked.value = !isLiked.value;
  if (isLiked.value) {
    const likedDokumentasi = JSON.parse(
      localStorage.getItem("likedDokumentasi") || "[]"
    );
    if (!likedDokumentasi.includes(dokumentasi.value?.id)) {
      likedDokumentasi.push(dokumentasi.value?.id);
      localStorage.setItem(
        "likedDokumentasi",
        JSON.stringify(likedDokumentasi)
      );
    }
  } else {
    const likedDokumentasi = JSON.parse(
      localStorage.getItem("likedDokumentasi") || "[]"
    );
    const filtered = likedDokumentasi.filter(
      (id: number) => id !== dokumentasi.value?.id
    );
    localStorage.setItem("likedDokumentasi", JSON.stringify(filtered));
  }
};

// Check if dokumentasi is saved/liked on mount
watch(dokumentasi, () => {
  if (dokumentasi.value) {
    const savedDokumentasi = JSON.parse(
      localStorage.getItem("savedDokumentasi") || "[]"
    );
    const likedDokumentasi = JSON.parse(
      localStorage.getItem("likedDokumentasi") || "[]"
    );
    isSaved.value = savedDokumentasi.includes(dokumentasi.value.id);
    isLiked.value = likedDokumentasi.includes(dokumentasi.value.id);
  }
});

// Meta tags
useHead({
  title: computed(() =>
    dokumentasi.value
      ? `${dokumentasi.value.judul} - Dokumentasi Kegiatan`
      : "Dokumentasi Kegiatan"
  ),
  meta: [
    {
      name: "description",
      content: computed(() =>
        dokumentasi.value
          ? dokumentasi.value.deskripsi || dokumentasi.value.judul
          : "Dokumentasi kegiatan Bidang Perumahan dan Kawasan Permukiman, Dinas PUPR Kabupaten Kubu Raya"
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
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
