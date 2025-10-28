<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Kelola Berita
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage berita untuk Web Profil Dinas Perumahan
        </p>
      </div>
      <button
        @click="openFormModal()"
        class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Tambah Berita
      </button>
    </div>

    <!-- Filters -->
    <div
      class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
    >
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Cari Berita
        </label>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Cari judul berita..."
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          @input="debouncedSearch"
        />
      </div>
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Status
        </label>
        <select
          v-model="filters.status"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          @change="loadBerita"
        >
          <option value="">Semua Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Kategori
        </label>
        <select
          v-model="filters.kategori"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          @change="loadBerita"
        >
          <option value="">Semua Kategori</option>
          <option value="Berita Umum">Berita Umum</option>
          <option value="Pengumuman">Pengumuman</option>
          <option value="Kegiatan">Kegiatan</option>
          <option value="Prestasi">Prestasi</option>
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
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Berita
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Kategori
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Tanggal
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody
            class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
          >
            <tr v-if="loading">
              <td colspan="5" class="px-6 py-12 text-center">
                <div class="flex justify-center items-center">
                  <svg
                    class="animate-spin h-8 w-8 text-purple-500"
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
            <tr v-else-if="beritaList.length === 0">
              <td
                colspan="5"
                class="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
              >
                Tidak ada berita
              </td>
            </tr>
            <tr
              v-else
              v-for="item in beritaList"
              :key="item.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
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
                      {{ item.ringkasan || "Tidak ada ringkasan" }}
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
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    item.status === 'published'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
                  ]"
                >
                  {{ item.status === "published" ? "Published" : "Draft" }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ formatDate(item.tanggalPublikasi || item.diperbaruiPada) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2"
              >
                <button
                  @click="openFormModal(item)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Edit"
                >
                  <svg
                    class="w-5 h-5 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(item)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  title="Hapus"
                >
                  <svg
                    class="w-5 h-5 inline"
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
                </button>
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
          {{
            Math.min(pagination.page * pagination.limit, pagination.total)
          }}
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
    <div
      v-if="showFormModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click.self="closeFormModal"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ formData.id ? "Edit Berita" : "Tambah Berita Baru" }}
            </h3>
            <button
              @click="closeFormModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg
                class="w-6 h-6"
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

          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Judul Berita <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.judul"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="Masukkan judul berita"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Ringkasan
              </label>
              <textarea
                v-model="formData.ringkasan"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ringkasan singkat berita"
              ></textarea>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Konten <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="formData.konten"
                rows="10"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                placeholder="Konten berita (HTML)"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">
                Gunakan HTML untuk formatting
              </p>
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
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Berita Umum">Berita Umum</option>
                  <option value="Pengumuman">Pengumuman</option>
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Prestasi">Prestasi</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Penulis
                </label>
                <input
                  v-model="formData.penulis"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nama penulis"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Waktu Baca
                </label>
                <input
                  v-model="formData.waktuBaca"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="5 menit"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Status
                </label>
                <select
                  v-model="formData.status"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
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
                @change="handleFileUpload"
                accept="image/*"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
              <img
                v-if="formData.thumbnail"
                :src="formData.thumbnail"
                alt="Preview"
                class="mt-2 w-48 h-32 object-cover rounded-lg"
              />
            </div>

            <div
              class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <button
                type="button"
                @click="closeFormModal"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
              >
                <span v-if="submitting">Menyimpan...</span>
                <span v-else>{{ formData.id ? "Update" : "Simpan" }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click.self="showDeleteModal = false"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Konfirmasi Hapus
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Apakah Anda yakin ingin menghapus berita "<strong>{{
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
            @click="deleteBerita"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Toast ref="toast" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

const config = useRuntimeConfig();
const WEB_PROFIL_API = "http://localhost:3003/api";

// Data
const loading = ref(false);
const submitting = ref(false);
const beritaList = ref([]);
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
  pages: 0,
});

const filters = reactive({
  search: "",
  status: "",
  kategori: "",
});

const showFormModal = ref(false);
const showDeleteModal = ref(false);
const itemToDelete = ref(null);

const formData = reactive({
  id: null,
  judul: "",
  ringkasan: "",
  konten: "",
  thumbnail: "",
  kategori: "",
  penulis: "Admin",
  waktuBaca: "",
  status: "draft",
});

// Methods
const loadBerita = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: pagination.page,
      limit: pagination.limit,
    });

    if (filters.status) params.append("status", filters.status);
    if (filters.kategori) params.append("kategori", filters.kategori);
    if (filters.search) params.append("search", filters.search);

    const response = await $fetch(
      `${WEB_PROFIL_API}/berita/admin/all?${params}`
    );

    if (response.success) {
      beritaList.value = response.data;
      Object.assign(pagination, response.pagination);
    }
  } catch (error) {
    console.error("Error loading berita:", error);
    showToast("Gagal memuat data berita", "error");
  } finally {
    loading.value = false;
  }
};

let searchTimeout;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.page = 1;
    loadBerita();
  }, 500);
};

const changePage = (page) => {
  pagination.page = page;
  loadBerita();
};

const openFormModal = (item = null) => {
  if (item) {
    Object.assign(formData, {
      id: item.id,
      judul: item.judul,
      ringkasan: item.ringkasan || "",
      konten: item.konten,
      thumbnail: item.thumbnail || "",
      kategori: item.kategori || "",
      penulis: item.penulis || "Admin",
      waktuBaca: item.waktuBaca || "",
      status: item.status,
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
    ringkasan: "",
    konten: "",
    thumbnail: "",
    kategori: "",
    penulis: "Admin",
    waktuBaca: "",
    status: "draft",
  });
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    const response = await $fetch(`${WEB_PROFIL_API}/upload/image`, {
      method: "POST",
      body: formDataUpload,
    });

    if (response.success) {
      formData.thumbnail = response.data.url;
      showToast("Gambar berhasil diupload", "success");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    showToast("Gagal upload gambar", "error");
  }
};

const submitForm = async () => {
  submitting.value = true;
  try {
    const url = formData.id
      ? `${WEB_PROFIL_API}/berita/admin/${formData.id}`
      : `${WEB_PROFIL_API}/berita/admin`;

    const method = formData.id ? "PUT" : "POST";

    const response = await $fetch(url, {
      method,
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.success) {
      showToast(
        formData.id
          ? "Berita berhasil diupdate"
          : "Berita berhasil ditambahkan",
        "success"
      );
      closeFormModal();
      loadBerita();
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    showToast("Gagal menyimpan berita", "error");
  } finally {
    submitting.value = false;
  }
};

const confirmDelete = (item) => {
  itemToDelete.value = item;
  showDeleteModal.value = true;
};

const deleteBerita = async () => {
  try {
    const response = await $fetch(
      `${WEB_PROFIL_API}/berita/admin/${itemToDelete.value.id}`,
      {
        method: "DELETE",
      }
    );

    if (response.success) {
      showToast("Berita berhasil dihapus", "success");
      showDeleteModal.value = false;
      itemToDelete.value = null;
      loadBerita();
    }
  } catch (error) {
    console.error("Error deleting berita:", error);
    showToast("Gagal menghapus berita", "error");
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

const toast = ref(null);
const showToast = (message, type = "success") => {
  if (toast.value) {
    toast.value.show(message, type);
  }
};

// Lifecycle
onMounted(() => {
  loadBerita();
});
</script>
