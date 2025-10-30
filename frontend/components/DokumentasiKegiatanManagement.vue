<template>
  <div class="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
    >
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Dokumentasi Kegiatan
        </h2>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
          Kelola dokumentasi kegiatan dinas
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-if="!selectMode"
          @click="openFormModal()"
          class="inline-flex items-center px-3 sm:px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <svg
            class="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span class="hidden sm:inline">Tambah Dokumentasi</span>
          <span class="sm:hidden">Tambah</span>
        </button>
        <button
          v-if="!selectMode"
          @click="toggleSelectMode"
          class="inline-flex items-center px-3 sm:px-4 py-2 text-sm sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
        >
          <svg
            class="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span class="hidden sm:inline">Hapus</span>
        </button>
        <div v-else class="flex flex-wrap gap-2">
          <button
            @click="confirmDeleteSelected"
            :disabled="selectedItems.size === 0"
            class="inline-flex items-center px-3 sm:px-4 py-2 text-sm sm:text-base bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-all duration-200"
          >
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span class="hidden sm:inline"
              >Hapus ({{ selectedItems.size }})</span
            >
            <span class="sm:hidden">({{ selectedItems.size }})</span>
          </button>
          <button
            @click="cancelSelectMode"
            class="inline-flex items-center px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
          >
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span class="hidden sm:inline">Batal</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
    >
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Cari Dokumentasi
        </label>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Cari judul..."
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
          @input="debouncedSearch"
        />
      </div>
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Kategori
        </label>
        <select
          v-model="filters.kategori"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
          @change="loadDokumentasi"
        >
          <option value="">Semua Kategori</option>
          <option value="Rapat Koordinasi">Rapat Koordinasi</option>
          <option value="Kunjungan Lapangan">Kunjungan Lapangan</option>
          <option value="Monitoring & Evaluasi (Monev)">Monitoring & Evaluasi (Monev)</option>
          <option value="Sosialisasi Program">Sosialisasi Program</option>
          <option value="Pelatihan Teknis">Pelatihan Teknis</option>
          <option value="Serah Terima / Peresmian">Serah Terima / Peresmian</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                v-if="selectMode"
                class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                style="width: 50px"
              >
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Dokumentasi
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Kategori
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Tanggal
              </th>
            </tr>
          </thead>
          <tbody
            class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
          >
            <tr v-if="loading">
              <td :colspan="selectMode ? 4 : 3" class="px-6 py-12 text-center">
                <div class="flex justify-center items-center">
                  <svg
                    class="animate-spin h-8 w-8 text-pink-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              </td>
            </tr>
            <tr v-else-if="dokumentasiList.length === 0">
              <td
                :colspan="selectMode ? 4 : 3"
                class="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
              >
                Tidak ada dokumentasi
              </td>
            </tr>
            <tr
              v-else
              v-for="item in dokumentasiList"
              :key="item.id"
              @click="
                selectMode ? toggleItemSelection(item.id) : openFormModal(item)
              "
              :class="[
                'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer',
                selectedItems.has(item.id)
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : '',
              ]"
            >
              <td
                v-if="selectMode"
                class="px-3 py-4 whitespace-nowrap"
                style="width: 50px"
              >
                <input
                  type="checkbox"
                  :checked="selectedItems.has(item.id)"
                  @click.stop="toggleItemSelection(item.id)"
                  class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <img
                    v-if="item.thumbnail"
                    :src="item.thumbnail"
                    :alt="item.judul"
                    class="w-16 h-16 rounded-lg object-cover mr-3"
                  />
                  <div
                    class="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg mr-3 flex items-center justify-center"
                    v-else
                  >
                    <svg
                      class="w-8 h-8 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="max-w-md">
                    <p
                      class="font-semibold text-gray-900 dark:text-white truncate"
                    >
                      {{ item.judul }}
                    </p>
                    <p
                      class="text-sm text-gray-500 dark:text-gray-400 truncate"
                    >
                      {{ item.deskripsi || "Tidak ada deskripsi" }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {{ item.kategori || "-" }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ formatDate(item.tanggal) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination.pages > 1"
        class="bg-gray-50 dark:bg-gray-900 px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700"
      >
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to
          {{ Math.min(pagination.page * pagination.limit, pagination.total) }}
          of {{ pagination.total }} entries
        </div>
        <div class="flex space-x-2">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Previous
          </button>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page >= pagination.pages"
            class="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <transition name="fade">
      <div
        v-if="showFormModal"
        @click="closeFormModal"
        class="fixed inset-0 !mt-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-2 lg:p-4"
      >
        <div
          @click.stop
          class="w-full max-w-4xl h-[95vh] lg:h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
        >
          <!-- Header -->
          <div
            class="bg-pink-600 text-white px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between"
          >
            <h3 class="text-lg lg:text-xl font-bold">
              {{ formData.id ? "Edit Dokumentasi" : "Tambah Dokumentasi Baru" }}
            </h3>
            <button
              @click="closeFormModal"
              class="text-white hover:text-gray-200 transition-colors p-2"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 flex flex-col overflow-hidden">
            <div class="flex-1 p-4 lg:p-6 overflow-y-auto">
              <form @submit.prevent="submitForm" class="space-y-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Judul <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.judul"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Masukkan judul"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Deskripsi
                  </label>
                  <textarea
                    v-model="formData.deskripsi"
                    rows="2"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Deskripsi singkat"
                  ></textarea>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Konten
                  </label>
                  <textarea
                    v-model="formData.konten"
                    rows="8"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                    placeholder="Konten detail (HTML)"
                  ></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Kategori
                    </label>
                    <select
                      v-model="formData.kategori"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Rapat Koordinasi">Rapat Koordinasi</option>
                      <option value="Kunjungan Lapangan">Kunjungan Lapangan</option>
                      <option value="Monitoring & Evaluasi (Monev)">Monitoring & Evaluasi (Monev)</option>
                      <option value="Sosialisasi Program">Sosialisasi Program</option>
                      <option value="Pelatihan Teknis">Pelatihan Teknis</option>
                      <option value="Serah Terima / Peresmian">Serah Terima / Peresmian</option>
                    </select>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Tanggal <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="formData.tanggal"
                      type="date"
                      required
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Thumbnail
                  </label>
                  <input
                    type="file"
                    @change="handleThumbnailUpload"
                    accept="image/*"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                  />
                  <img
                    v-if="formData.thumbnail"
                    :src="formData.thumbnail"
                    alt="Preview"
                    class="mt-2 w-48 h-32 object-cover rounded-lg"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Gambar Lainnya (Multiple)
                  </label>
                  <input
                    type="file"
                    @change="handleMultipleImagesUpload"
                    accept="image/*"
                    multiple
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                  />
                  <div
                    v-if="formData.gambarLainnya.length > 0"
                    class="mt-2 grid grid-cols-3 md:grid-cols-5 gap-2"
                  >
                    <div
                      v-for="(img, idx) in formData.gambarLainnya"
                      :key="idx"
                      class="relative group"
                    >
                      <img
                        :src="img"
                        alt="Preview"
                        class="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        @click="removeImage(idx)"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Fixed Footer with Action Buttons -->
          <div
            class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 lg:px-6 py-4"
          >
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="closeFormModal"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                @click="submitForm"
                :disabled="submitting"
                class="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50"
              >
                <span v-if="submitting">Menyimpan...</span>
                <span v-else>{{ formData.id ? "Update" : "Simpan" }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      @click="showDeleteModal = false"
      class="fixed inset-0 !mt-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-2 lg:p-4"
    >
      <div
        @click.stop
        class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div class="bg-white dark:bg-gray-800 p-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Konfirmasi Hapus
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Apakah Anda yakin ingin menghapus dokumentasi "<strong>{{
              itemToDelete?.judul
            }}</strong
            >"?
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Batal
            </button>
            <button
              @click="deleteDokumentasi"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import Toast from "./Toast.vue";
import { useToast } from "~/composables/useToast";

const config = useRuntimeConfig();
const WEB_PROFIL_API = config.public.webProfilApiUrl;
const { success: showSuccess, error: showError } = useToast();

// Data
const loading = ref(false);
const submitting = ref(false);
const dokumentasiList = ref([]);
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
  pages: 0,
});

const filters = reactive({
  search: "",
  kategori: "",
});

const showFormModal = ref(false);
const showDeleteModal = ref(false);
const itemToDelete = ref(null);

// Select mode
const selectMode = ref(false);
const selectedItems = ref(new Set());

// Computed
const isAllSelected = computed(() => {
  return (
    dokumentasiList.value.length > 0 &&
    selectedItems.value.size === dokumentasiList.value.length
  );
});

const formData = reactive({
  id: null,
  judul: "",
  deskripsi: "",
  konten: "",
  kategori: "Rapat Koordinasi",
  tanggal: "",
  thumbnail: "",
  gambarLainnya: [],
});

// Helper function to generate slug
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

// Methods
const loadDokumentasi = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: pagination.page,
      limit: pagination.limit,
    });

    if (filters.kategori) params.append("kategori", filters.kategori);
    if (filters.search) params.append("search", filters.search);

    const response = await $fetch(
      `${WEB_PROFIL_API}/dokumentasi-kegiatan/admin/all?${params}`
    );

    if (response.success) {
      dokumentasiList.value = response.data;
      Object.assign(pagination, response.pagination);
    }
  } catch (error) {
    console.error("Error loading dokumentasi:", error);
    showError("Gagal memuat data");
  } finally {
    loading.value = false;
  }
};

let searchTimeout;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.page = 1;
    loadDokumentasi();
  }, 500);
};

const changePage = (page) => {
  pagination.page = page;
  loadDokumentasi();
};

const openFormModal = (item = null) => {
  if (item) {
    Object.assign(formData, {
      id: item.id,
      judul: item.judul,
      deskripsi: item.deskripsi || "",
      konten: item.konten || "",
      kategori: item.kategori || "",
      tanggal: item.tanggal
        ? new Date(item.tanggal).toISOString().split("T")[0]
        : "",
      thumbnail: item.thumbnail || "",
      gambarLainnya: item.gambarLainnya || [],
    });
  } else {
    resetForm();
  }
  showFormModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;
  resetForm();
};

const resetForm = () => {
  Object.assign(formData, {
    id: null,
    judul: "",
    deskripsi: "",
    konten: "",
    kategori: "Rapat Koordinasi",
    tanggal: "",
    thumbnail: "",
    gambarLainnya: [],
  });
};

const handleThumbnailUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate judul first
  if (!formData.judul || formData.judul.trim() === "") {
    showError("Mohon isi judul terlebih dahulu sebelum upload gambar");
    event.target.value = ""; // Reset file input
    return;
  }

  try {
    const formDataUpload = new FormData();
    formDataUpload.append("image", file);
    formDataUpload.append("folder", "dokumentasi-kegiatan");

    // Generate slug dari judul untuk nama folder
    const slug = generateSlug(formData.judul);
    formDataUpload.append("slug", slug);

    const response = await $fetch(`${WEB_PROFIL_API}/upload/image`, {
      method: "POST",
      body: formDataUpload,
    });

    if (response.success) {
      formData.thumbnail = response.data.url;
      showSuccess("Gambar berhasil diupload");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    showError("Gagal upload gambar");
  }
};

const handleMultipleImagesUpload = async (event) => {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  // Validate judul first
  if (!formData.judul || formData.judul.trim() === "") {
    showError("Mohon isi judul terlebih dahulu sebelum upload gambar");
    event.target.value = ""; // Reset file input
    return;
  }

  try {
    const formDataUpload = new FormData();
    files.forEach((file) => {
      formDataUpload.append("images", file);
    });
    formDataUpload.append("folder", "dokumentasi-kegiatan");

    // Generate slug dari judul untuk nama folder
    const slug = generateSlug(formData.judul);
    formDataUpload.append("slug", slug);

    const response = await $fetch(`${WEB_PROFIL_API}/upload/images`, {
      method: "POST",
      body: formDataUpload,
    });

    if (response.success) {
      const urls = response.data.map((img) => img.url);
      formData.gambarLainnya.push(...urls);
      showSuccess(`${urls.length} gambar berhasil diupload`);
    }
  } catch (error) {
    console.error("Error uploading images:", error);
    showError("Gagal upload gambar");
  }
};

const removeImage = (index) => {
  formData.gambarLainnya.splice(index, 1);
};

const submitForm = async () => {
  submitting.value = true;
  try {
    const url = formData.id
      ? `${WEB_PROFIL_API}/dokumentasi-kegiatan/admin/${formData.id}`
      : `${WEB_PROFIL_API}/dokumentasi-kegiatan/admin`;

    const method = formData.id ? "PUT" : "POST";

    const response = await $fetch(url, {
      method,
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.success) {
      showSuccess(
        formData.id
          ? "Dokumentasi berhasil diupdate"
          : "Dokumentasi berhasil ditambahkan"
      );
      closeFormModal();
      loadDokumentasi();
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    showError("Gagal menyimpan data");
  } finally {
    submitting.value = false;
  }
};

const deleteDokumentasi = async () => {
  try {
    if (itemToDelete.value?.isMultiple) {
      // Delete multiple items
      const deletePromises = Array.from(selectedItems.value).map((id) =>
        $fetch(`${WEB_PROFIL_API}/dokumentasi-kegiatan/admin/${id}`, {
          method: "DELETE",
        })
      );

      await Promise.all(deletePromises);
      showSuccess(`${selectedItems.value.size} dokumentasi berhasil dihapus`);
      selectedItems.value.clear();
      selectMode.value = false;
    } else {
      // Delete single item
      const response = await $fetch(
        `${WEB_PROFIL_API}/dokumentasi-kegiatan/admin/${itemToDelete.value.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.success) {
        showSuccess("Dokumentasi berhasil dihapus");
      }
    }

    showDeleteModal.value = false;
    itemToDelete.value = null;
    loadDokumentasi();
  } catch (error) {
    console.error("Error deleting dokumentasi:", error);
    showError("Gagal menghapus data");
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Select mode functions
const toggleSelectMode = () => {
  selectMode.value = true;
  selectedItems.value.clear();
};

const cancelSelectMode = () => {
  selectMode.value = false;
  selectedItems.value.clear();
};

const toggleItemSelection = (id) => {
  if (selectedItems.value.has(id)) {
    selectedItems.value.delete(id);
  } else {
    selectedItems.value.add(id);
  }
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedItems.value.clear();
  } else {
    dokumentasiList.value.forEach((item) => selectedItems.value.add(item.id));
  }
};

const confirmDeleteSelected = () => {
  if (selectedItems.value.size === 0) return;

  showDeleteModal.value = true;
  itemToDelete.value = {
    judul: `${selectedItems.value.size} dokumentasi`,
    isMultiple: true,
  };
};

// Lifecycle
onMounted(() => {
  loadDokumentasi();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
