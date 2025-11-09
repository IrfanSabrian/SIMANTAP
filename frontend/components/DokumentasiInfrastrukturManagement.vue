<template>
  <div>
    <!-- Header Banner -->
    <div
      class="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 border-l-4 border-orange-500 mb-6"
    >
      <div>
        <h2
          class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
        >
          Dokumentasi Infrastruktur
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          Kelola dokumentasi infrastruktur perumahan
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Table Area -->
      <div class="flex-1 min-w-0">
        <!-- Table -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
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
                      class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Jenis Infrastruktur
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Link YouTube
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    No Ruas
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Dibuat
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Diperbarui
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
              >
                <tr v-if="loading">
                  <td :colspan="selectMode ? 6 : 5" class="px-6 py-12 text-center">
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
                    :colspan="selectMode ? 6 : 5"
                    class="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    Tidak ada dokumentasi
                  </td>
                </tr>
                <tr
                  v-else
                  v-for="item in dokumentasiList"
                  :key="item.id"
                  @click="canEdit ? (selectMode ? toggleItemSelection(item.id) : openFormModal(item)) : null"
                  :class="[
                    canEdit
                      ? 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer'
                      : '',
                    selectedItems.has(item.id)
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : '',
                  ]"
                >
                  <td
                    v-if="selectMode"
                    class="px-3 py-4 whitespace-nowrap"
                    style="width: 50px"
                    @click.stop
                  >
                    <input
                      type="checkbox"
                      :checked="selectedItems.has(item.id)"
                      @click.stop="toggleItemSelection(item.id)"
                      class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-3 py-1.5 text-xs font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                    >
                      {{ formatJenisInfrastruktur(item.jenisInfrastruktur) }}
                    </span>
                  </td>
                  <td class="px-6 py-4" @click.stop>
                    <button
                      @click.stop="
                        openYouTubeFancybox(
                          item.linkYoutube,
                          item.jenisInfrastruktur,
                          item.noRuas
                        )
                      "
                      class="inline-flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:underline cursor-pointer"
                    >
                      <svg
                        class="w-5 h-5 mr-1.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                        />
                      </svg>
                      <span class="max-w-xs truncate font-medium">
                        Lihat Video
                      </span>
                    </button>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {{ item.noRuas || "-" }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400"
                  >
                    {{ formatDateTime(item.dibuatPada) }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400"
                  >
                    {{ formatDateTime(item.diperbaruiPada) }}
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
      </div>

      <!-- Sidebar: Filters and Actions -->
      <div class="w-full lg:w-80 flex-shrink-0">
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-5 sticky top-20"
        >
          <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Aksi & Filter</h2>

          <!-- Action Buttons -->
          <div v-if="canEdit" class="space-y-3 mb-6">
            <button
              v-if="!selectMode"
              @click="openFormModal()"
              class="w-full px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Tambah Dokumentasi
            </button>
            <button
              @click="toggleSelectMode"
              :class="[
                'w-full px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm font-semibold',
                selectMode
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700',
              ]"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              {{ selectMode ? "Kembali" : "Hapus Data" }}
            </button>
          </div>

          <!-- Select Mode Actions -->
          <div
            v-if="selectMode && canEdit"
            class="mb-6 p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 rounded-lg border-2 border-orange-200 dark:border-orange-600"
          >
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-orange-500 rounded-lg text-white">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-semibold text-orange-900 dark:text-white">
                    {{ selectedItems.size }} data dipilih
                  </div>
                  <div class="text-xs text-orange-700 dark:text-orange-200">
                    Dari {{ dokumentasiList.length }} data
                  </div>
                </div>
              </div>
              <button
                @click="confirmDeleteSelected"
                :disabled="selectedItems.size === 0"
                class="w-full px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Hapus ({{ selectedItems.size }})
              </button>
            </div>
          </div>

          <!-- Filters -->
          <div class="space-y-4">
            <!-- Search -->
            <div>
              <label
                class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide"
              >
                <div class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4 text-orange-600"
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
                  Cari No Ruas
                </div>
              </label>
              <div class="relative">
                <input
                  v-model="filters.search"
                  type="text"
                  placeholder="Cari nomor ruas..."
                  class="w-full px-3 py-2 pl-10 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all text-sm font-medium bg-white dark:bg-gray-700 dark:text-white hover:border-gray-300"
                  @input="debouncedSearch"
                />
                <svg
                  class="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
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

            <!-- Jenis Infrastruktur Filter -->
            <div>
              <label
                class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide"
              >
                <div class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  Jenis Infrastruktur
                </div>
              </label>
              <select
                v-model="filters.jenisInfrastruktur"
                class="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all text-sm font-medium bg-white dark:bg-gray-700 dark:text-white hover:border-gray-300"
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
            class="bg-orange-600 text-white px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between"
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
              <form @submit.prevent="submitForm" class="space-y-6">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Jenis Infrastruktur <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData.jenisInfrastruktur"
                    required
                    :disabled="formData.id !== null"
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    <option value="Jalan_Lingkungan">Jalan Lingkungan</option>
                    <option value="Jembatan_Lingkungan">
                      Jembatan Lingkungan
                    </option>
                    <option value="Drainase_Lingkungan">
                      Drainase Lingkungan
                    </option>
                    <option value="Kawasan_Permukiman">
                      Kawasan Permukiman
                    </option>
                    <option value="Rumah_Tidak_Layak_Huni">
                      Rumah Tidak Layak Huni
                    </option>
                  </select>
                  <p
                    v-if="formData.id"
                    class="mt-1 text-xs text-gray-500 dark:text-gray-400"
                  >
                    Jenis infrastruktur tidak dapat diubah saat edit
                  </p>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Link YouTube <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.linkYoutube"
                    type="url"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://youtu.be/..."
                  />
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Masukkan URL video YouTube dokumentasi infrastruktur
                  </p>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Nomor Ruas <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.noRuas"
                    type="text"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Contoh: 611292005146"
                  />
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Masukkan nomor ruas infrastruktur
                  </p>
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
                class="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50"
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
import { ref, reactive, onMounted, computed, watch, nextTick } from "vue";
import Toast from "./Toast.vue";
import { useToast } from "~/composables/useToast";
import { useAuth } from "~/composables/useAuth";

const config = useRuntimeConfig();
const API_BASE = config.public.apiBaseUrl || "";
const { success: showSuccess, error: showError } = useToast();
const { user, initAuth } = useAuth();

// Local user state untuk memastikan reactive
const currentUser = ref(null);

// Initialize auth on mount
onMounted(() => {
  // Load from localStorage first (faster)
  if (typeof window !== 'undefined') {
    try {
      const storedUser = localStorage.getItem('simantap_user');
      if (storedUser) {
        currentUser.value = JSON.parse(storedUser);
      }
    } catch (e) {
      // Error parsing user from localStorage
    }
  }
  
  // Then init auth (will update if different)
  initAuth();
  
  // Also set from useAuth if available
  if (user.value) {
    currentUser.value = user.value;
  }
});

// Watch user changes from useAuth
watch(() => user.value, (newUser) => {
  if (newUser) {
    currentUser.value = newUser;
  }
}, { immediate: true, deep: true });

// Computed untuk check role - case insensitive dan support berbagai format
const canEdit = computed(() => {
  const userToCheck = currentUser.value || user.value;
  
  if (!userToCheck || !userToCheck.role) {
    // Try localStorage as last resort
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('simantap_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const role = String(parsedUser.role || '').toUpperCase();
          return role === 'ADMIN' || role === 'USER';
        }
      } catch (e) {
        // Ignore
      }
    }
    return false;
  }
  const role = String(userToCheck.role).toUpperCase();
  return role === 'ADMIN' || role === 'USER';
});

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
  jenisInfrastruktur: "",
  linkYoutube: "",
  noRuas: "",
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
      `${API_BASE}/api/dokumentasi-infrastruktur/admin/all?${params}`
    );

    if (response.success) {
      dokumentasiList.value = response.data;
      Object.assign(pagination, response.pagination);
    }
  } catch (error) {
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
      jenisInfrastruktur: item.jenisInfrastruktur,
      linkYoutube: item.linkYoutube || "",
      noRuas: item.noRuas || "",
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
    linkYoutube: "",
    noRuas: "",
  });
};

// Image upload functions removed - no longer needed for YouTube links only

const submitForm = async () => {
  submitting.value = true;
  try {
    const url = formData.id
      ? `${API_BASE}/api/dokumentasi-infrastruktur/admin/${formData.id}`
      : `${API_BASE}/api/dokumentasi-infrastruktur/admin`;

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
        $fetch(`${API_BASE}/api/dokumentasi-infrastruktur/admin/${id}`, {
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
        `${API_BASE}/api/dokumentasi-infrastruktur/admin/${itemToDelete.value.id}`,
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
    showError("Gagal menghapus data");
  }
};

const formatJenisInfrastruktur = (jenis) => {
  if (!jenis) return "-";
  return jenis.replace(/_/g, " ");
};

const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Select mode functions
const toggleSelectMode = () => {
  selectMode.value = !selectMode.value;
  if (!selectMode.value) {
    selectedItems.value.clear();
  }
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

// YouTube URL helper functions
const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";

  // Extract video ID from various YouTube URL formats
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return "";

  return `https://www.youtube.com/embed/${videoId}`;
};

const extractYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const openYouTubeFancybox = (url, jenis, noRuas) => {
  if (typeof window !== "undefined" && window.Fancybox) {
    const videoUrl = getYouTubeEmbedUrl(url);
    const videoTitle = `Video Dokumentasi - ${formatJenisInfrastruktur(
      jenis
    )} - ${noRuas}`;

    window.Fancybox.show(
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
  }
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
