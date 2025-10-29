<template>
  <div class="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
    >
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Dokumen PPID
        </h2>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
          Kelola dokumen informasi publik (PPID)
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-if="!selectMode"
          @click="openFormModal()"
          class="inline-flex items-center px-3 sm:px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
          <span class="hidden sm:inline">Tambah Dokumen</span>
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
      class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
    >
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Cari Dokumen
        </label>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Cari judul..."
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
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
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          @change="loadDokumen"
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
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          @change="loadDokumen"
        >
          <option value="">Semua Kategori</option>
          <option value="Informasi Berkala">Informasi Berkala</option>
          <option value="Informasi Serta Merta">Informasi Serta Merta</option>
          <option value="Informasi Setiap Saat">Informasi Setiap Saat</option>
          <option value="Regulasi">Regulasi</option>
          <option value="Laporan">Laporan</option>
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
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Dokumen
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
                Unduhan
              </th>
            </tr>
          </thead>
          <tbody
            class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
          >
            <tr v-if="loading">
              <td :colspan="selectMode ? 5 : 4" class="px-6 py-12 text-center">
                <div class="flex justify-center items-center">
                  <svg
                    class="animate-spin h-8 w-8 text-green-500"
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
            <tr v-else-if="dokumenList.length === 0">
              <td
                :colspan="selectMode ? 5 : 4"
                class="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
              >
                Tidak ada dokumen
              </td>
            </tr>
            <tr
              v-else
              v-for="item in dokumenList"
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
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div
                    class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mr-3 flex items-center justify-center"
                  >
                    <svg
                      class="w-6 h-6 text-green-600 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
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
                      {{ item.namaFile }}
                    </p>
                    <p
                      v-if="item.nomorDokumen"
                      class="text-xs text-gray-400 dark:text-gray-500"
                    >
                      No: {{ item.nomorDokumen }}
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
                {{ item.jumlahUnduhan || 0 }}x
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
            class="bg-green-600 text-white px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between"
          >
            <h3 class="text-lg lg:text-xl font-bold">
              {{ formData.id ? "Edit Dokumen" : "Tambah Dokumen Baru" }}
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
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Masukkan judul dokumen"
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
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Deskripsi singkat"
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
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Informasi Berkala">
                        Informasi Berkala
                      </option>
                      <option value="Informasi Serta Merta">
                        Informasi Serta Merta
                      </option>
                      <option value="Informasi Setiap Saat">
                        Informasi Setiap Saat
                      </option>
                      <option value="Regulasi">Regulasi</option>
                      <option value="Laporan">Laporan</option>
                    </select>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Tahun
                    </label>
                    <input
                      v-model="formData.tahun"
                      type="number"
                      min="1900"
                      max="2100"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder="2024"
                    />
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Nomor Dokumen
                    </label>
                    <input
                      v-model="formData.nomorDokumen"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder="No: XXX/YYY/2024"
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
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
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
                    Upload File PDF <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    @change="handleFileUpload"
                    :disabled="uploading"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Format: PDF, DOC, DOCX, XLS, XLSX (Max: 10MB)
                  </p>
                  <!-- Upload Progress -->
                  <div
                    v-if="uploading"
                    class="mt-2 flex items-center text-sm text-blue-600"
                  >
                    <svg
                      class="animate-spin h-4 w-4 mr-2"
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
                    Mengupload file...
                  </div>
                  <!-- File Info -->
                  <div
                    v-if="formData.urlFile"
                    class="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800"
                  >
                    <p class="text-xs text-green-700 dark:text-green-400">
                      ✓ File terupload: {{ formData.namaFile }}
                    </p>
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
                class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50"
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
            Apakah Anda yakin ingin menghapus dokumen "<strong>{{
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
              @click="deleteDokumen"
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
const WEB_PROFIL_API = "http://localhost:3003/api";
const { success: showSuccess, error: showError } = useToast();

// Data
const loading = ref(false);
const submitting = ref(false);
const uploading = ref(false);
const dokumenList = ref([]);
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

// Select mode
const selectMode = ref(false);
const selectedItems = ref(new Set());

// Computed
const isAllSelected = computed(() => {
  return (
    dokumenList.value.length > 0 &&
    selectedItems.value.size === dokumenList.value.length
  );
});

const formData = reactive({
  id: null,
  judul: "",
  deskripsi: "",
  kategori: "Informasi Berkala",
  urlFile: "",
  namaFile: "",
  tahun: "",
  nomorDokumen: "",
  status: "draft",
});

// Methods
const loadDokumen = async () => {
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
      `${WEB_PROFIL_API}/dokumen-ppid/admin/all?${params}`
    );

    if (response.success) {
      dokumenList.value = response.data;
      Object.assign(pagination, response.pagination);
    }
  } catch (error) {
    console.error("Error loading dokumen:", error);
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
    loadDokumen();
  }, 500);
};

const changePage = (page) => {
  pagination.page = page;
  loadDokumen();
};

const openFormModal = (item = null) => {
  if (item) {
    Object.assign(formData, {
      id: item.id,
      judul: item.judul,
      deskripsi: item.deskripsi || "",
      kategori: item.kategori || "",
      urlFile: item.urlFile,
      namaFile: item.namaFile,
      tahun: item.tahun || "",
      nomorDokumen: item.nomorDokumen || "",
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
    deskripsi: "",
    kategori: "Informasi Berkala",
    urlFile: "",
    namaFile: "",
    tahun: "",
    nomorDokumen: "",
    status: "draft",
  });
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validasi ukuran file (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    showError("Ukuran file maksimal 10MB");
    event.target.value = ""; // Reset file input
    return;
  }

  uploading.value = true;
  try {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("folder", "dokumen_ppid");

    const response = await $fetch(`${WEB_PROFIL_API}/upload/file`, {
      method: "POST",
      body: formDataUpload,
    });

    console.log("Upload response:", response);

    if (response.success && response.data && response.data.url) {
      formData.urlFile = response.data.url;
      formData.namaFile = file.name;
      console.log("File uploaded:", formData.urlFile);
      showSuccess("File berhasil diupload");
    } else {
      console.error("Invalid response format:", response);
      showError("Format response upload tidak valid");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    showError("Gagal upload file: " + error.message);
  } finally {
    uploading.value = false;
  }
};

const submitForm = async () => {
  submitting.value = true;
  try {
    const url = formData.id
      ? `${WEB_PROFIL_API}/dokumen-ppid/admin/${formData.id}`
      : `${WEB_PROFIL_API}/dokumen-ppid/admin`;

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
          ? "Dokumen berhasil diupdate"
          : "Dokumen berhasil ditambahkan"
      );
      closeFormModal();
      loadDokumen();
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    showError("Gagal menyimpan data");
  } finally {
    submitting.value = false;
  }
};

const deleteDokumen = async () => {
  try {
    if (itemToDelete.value?.isMultiple) {
      // Delete multiple items
      const deletePromises = Array.from(selectedItems.value).map((id) =>
        $fetch(`${WEB_PROFIL_API}/dokumen-ppid/admin/${id}`, {
          method: "DELETE",
        })
      );

      await Promise.all(deletePromises);
      showSuccess(`${selectedItems.value.size} dokumen berhasil dihapus`);
      selectedItems.value.clear();
      selectMode.value = false;
    } else {
      // Delete single item
      const response = await $fetch(
        `${WEB_PROFIL_API}/dokumen-ppid/admin/${itemToDelete.value.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.success) {
        showSuccess("Dokumen berhasil dihapus");
      }
    }

    showDeleteModal.value = false;
    itemToDelete.value = null;
    loadDokumen();
  } catch (error) {
    console.error("Error deleting dokumen:", error);
    showError("Gagal menghapus data");
  }
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
    dokumenList.value.forEach((item) => selectedItems.value.add(item.id));
  }
};

const confirmDeleteSelected = () => {
  if (selectedItems.value.size === 0) return;

  showDeleteModal.value = true;
  itemToDelete.value = {
    judul: `${selectedItems.value.size} dokumen`,
    isMultiple: true,
  };
};

// Lifecycle
onMounted(() => {
  loadDokumen();
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
