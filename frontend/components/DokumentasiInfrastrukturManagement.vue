<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Dokumentasi Infrastruktur
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Kelola dokumentasi infrastruktur perumahan
        </p>
      </div>
      <button
        @click="openFormModal()"
        class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
        Tambah Dokumentasi
      </button>
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
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
          @input="debouncedSearch"
        />
      </div>
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Jenis Infrastruktur
        </label>
        <select
          v-model="filters.jenisInfrastruktur"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
          @change="loadDokumentasi"
        >
          <option value="">Semua Jenis</option>
          <option value="Jalan_Lingkungan">Jalan Lingkungan</option>
          <option value="Jembatan_Lingkungan">Jembatan Lingkungan</option>
          <option value="Drainase_Lingkungan">Drainase Lingkungan</option>
          <option value="Kawasan_Permukiman">Kawasan Permukiman</option>
          <option value="Rumah_Tidak_Layak_Huni">Rumah Tidak Layak Huni</option>
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
                Dokumentasi
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Jenis Infrastruktur
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Tahun
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
              <td colspan="4" class="px-6 py-12 text-center">
                <div class="flex justify-center items-center">
                  <svg
                    class="animate-spin h-8 w-8 text-orange-500"
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
                colspan="4"
                class="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
              >
                Tidak ada dokumentasi
              </td>
            </tr>
            <tr
              v-else
              v-for="item in dokumentasiList"
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
                      {{ item.deskripsi || "Tidak ada deskripsi" }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {{ formatJenisInfrastruktur(item.jenisInfrastruktur) }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ item.tahunPembangunan || "-" }}
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
              {{ formData.id ? "Edit Dokumentasi" : "Tambah Dokumentasi Baru" }}
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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Jenis Infrastruktur <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.jenisInfrastruktur"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Pilih Jenis</option>
                  <option value="Jalan_Lingkungan">Jalan Lingkungan</option>
                  <option value="Jembatan_Lingkungan">
                    Jembatan Lingkungan
                  </option>
                  <option value="Drainase_Lingkungan">
                    Drainase Lingkungan
                  </option>
                  <option value="Kawasan_Permukiman">Kawasan Permukiman</option>
                  <option value="Rumah_Tidak_Layak_Huni">
                    Rumah Tidak Layak Huni
                  </option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Tahun Pembangunan
                </label>
                <input
                  v-model="formData.tahunPembangunan"
                  type="text"
                  maxlength="4"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  placeholder="2024"
                />
              </div>
            </div>

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
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
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
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="Deskripsi singkat"
              ></textarea>
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
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
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
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
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
                class="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50"
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
const dokumentasiList = ref([]);
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
  pages: 0,
});

const filters = reactive({
  search: "",
  jenisInfrastruktur: "",
});

const showFormModal = ref(false);
const showDeleteModal = ref(false);
const itemToDelete = ref(null);

const formData = reactive({
  id: null,
  jenisInfrastruktur: "",
  judul: "",
  deskripsi: "",
  idJalanLingkungan: null,
  thumbnail: "",
  gambarLainnya: [],
  tahunPembangunan: "",
});

// Methods
const loadDokumentasi = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: pagination.page,
      limit: pagination.limit,
    });

    if (filters.jenisInfrastruktur)
      params.append("jenisInfrastruktur", filters.jenisInfrastruktur);
    if (filters.search) params.append("search", filters.search);

    const response = await $fetch(
      `${WEB_PROFIL_API}/dokumentasi-infrastruktur/admin/all?${params}`
    );

    if (response.success) {
      dokumentasiList.value = response.data;
      Object.assign(pagination, response.pagination);
    }
  } catch (error) {
    console.error("Error loading dokumentasi:", error);
    showToast("Gagal memuat data", "error");
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
      jenisInfrastruktur: item.jenisInfrastruktur,
      judul: item.judul,
      deskripsi: item.deskripsi || "",
      idJalanLingkungan: item.idJalanLingkungan || null,
      thumbnail: item.thumbnail || "",
      gambarLainnya: item.gambarLainnya || [],
      tahunPembangunan: item.tahunPembangunan || "",
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
    jenisInfrastruktur: "",
    judul: "",
    deskripsi: "",
    idJalanLingkungan: null,
    thumbnail: "",
    gambarLainnya: [],
    tahunPembangunan: "",
  });
};

const handleThumbnailUpload = async (event) => {
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

const handleMultipleImagesUpload = async (event) => {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  try {
    const formDataUpload = new FormData();
    files.forEach((file) => {
      formDataUpload.append("images", file);
    });

    const response = await $fetch(`${WEB_PROFIL_API}/upload/images`, {
      method: "POST",
      body: formDataUpload,
    });

    if (response.success) {
      const urls = response.data.map((img) => img.url);
      formData.gambarLainnya.push(...urls);
      showToast(`${urls.length} gambar berhasil diupload`, "success");
    }
  } catch (error) {
    console.error("Error uploading images:", error);
    showToast("Gagal upload gambar", "error");
  }
};

const removeImage = (index) => {
  formData.gambarLainnya.splice(index, 1);
};

const submitForm = async () => {
  submitting.value = true;
  try {
    const url = formData.id
      ? `${WEB_PROFIL_API}/dokumentasi-infrastruktur/admin/${formData.id}`
      : `${WEB_PROFIL_API}/dokumentasi-infrastruktur/admin`;

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
          ? "Dokumentasi berhasil diupdate"
          : "Dokumentasi berhasil ditambahkan",
        "success"
      );
      closeFormModal();
      loadDokumentasi();
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    showToast("Gagal menyimpan data", "error");
  } finally {
    submitting.value = false;
  }
};

const confirmDelete = (item) => {
  itemToDelete.value = item;
  showDeleteModal.value = true;
};

const deleteDokumentasi = async () => {
  try {
    const response = await $fetch(
      `${WEB_PROFIL_API}/dokumentasi-infrastruktur/admin/${itemToDelete.value.id}`,
      {
        method: "DELETE",
      }
    );

    if (response.success) {
      showToast("Dokumentasi berhasil dihapus", "success");
      showDeleteModal.value = false;
      itemToDelete.value = null;
      loadDokumentasi();
    }
  } catch (error) {
    console.error("Error deleting dokumentasi:", error);
    showToast("Gagal menghapus data", "error");
  }
};

const formatJenisInfrastruktur = (jenis) => {
  if (!jenis) return "-";
  return jenis.replace(/_/g, " ");
};

const toast = ref(null);
const showToast = (message, type = "success") => {
  if (toast.value) {
    toast.value.show(message, type);
  }
};

// Lifecycle
onMounted(() => {
  loadDokumentasi();
});
</script>
