<template>
  <div>
    <!-- Header Banner -->
    <div
      class="bg-gradient-to-r from-pink-50 to-pink-100 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 border-l-4 border-pink-500 mb-6"
    >
      <div>
        <h2
          class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
        >
          Dokumentasi Kegiatan
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          Kelola dokumentasi kegiatan dinas
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
              class="w-full px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-semibold rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
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
            class="mb-6 p-4 bg-gradient-to-r from-pink-50 to-pink-100 dark:from-gray-700 dark:to-gray-600 rounded-lg border-2 border-pink-200 dark:border-pink-600"
          >
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-pink-500 rounded-lg text-white">
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
                  <div class="text-sm font-semibold text-pink-900 dark:text-white">
                    {{ selectedItems.size }} data dipilih
                  </div>
                  <div class="text-xs text-pink-700 dark:text-pink-200">
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
                    class="w-4 h-4 text-pink-600"
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
                  Cari Dokumentasi
                </div>
              </label>
              <div class="relative">
                <input
                  v-model="filters.search"
                  type="text"
                  placeholder="Cari judul..."
                  class="w-full px-3 py-2 pl-10 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-100 dark:focus:ring-pink-900 transition-all text-sm font-medium bg-white dark:bg-gray-700 dark:text-white hover:border-gray-300"
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

            <!-- Kategori Filter -->
            <div>
              <label
                class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide"
              >
                <div class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4 text-pink-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Kategori
                </div>
              </label>
              <select
                v-model="filters.kategori"
                class="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-100 dark:focus:ring-pink-900 transition-all text-sm font-medium bg-white dark:bg-gray-700 dark:text-white hover:border-gray-300"
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
                    :src="typeof formData.thumbnail === 'string' ? formData.thumbnail : formData.thumbnail.url || formData.thumbnail"
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
                        :src="typeof img === 'string' ? img : img.url"
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
                :disabled="submitting || uploadingImages"
                class="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
              >
                <svg
                  v-if="submitting || uploadingImages"
                  class="animate-spin h-4 w-4"
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
                <span v-if="uploadingImages">Mengupload gambar...</span>
                <span v-else-if="submitting">Menyimpan...</span>
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
import { ref, reactive, onMounted, computed, watch } from "vue";
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

// Store file references for upload
const thumbnailFile = ref(null);
const multipleImageFiles = ref([]);
const uploadingImages = ref(false);

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
      `${API_BASE}/api/dokumentasi-kegiatan/admin/all?${params}`
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
      judul: item.judul,
      deskripsi: item.deskripsi || "",
      konten: item.konten || "",
      kategori: item.kategori || "",
      tanggal: item.tanggal
        ? new Date(item.tanggal).toISOString().split("T")[0]
        : "",
      thumbnail: item.thumbnail || "",
      gambarLainnya: (item.gambarLainnya || []).map((url) => ({
        url,
        isNew: false,
      })),
    });
    // Clear file references when editing (existing images are URLs)
    thumbnailFile.value = null;
    multipleImageFiles.value = [];
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
  thumbnailFile.value = null;
  multipleImageFiles.value = [];
};

const handleThumbnailUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Store file reference for later upload
  thumbnailFile.value = file;

  // Create preview URL
  const reader = new FileReader();
  reader.onload = (e) => {
    formData.thumbnail = e.target.result;
  };
  reader.readAsDataURL(file);
};

const handleMultipleImagesUpload = (event) => {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  // Store file references for later upload
  // Track which indices are new files
  const startIndex = formData.gambarLainnya.length;
  multipleImageFiles.value.push(...files.map((file, idx) => ({
    file,
    previewIndex: startIndex + idx,
  })));

  // Create preview URLs
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.gambarLainnya.push({
        url: e.target.result,
        isNew: true,
      });
    };
    reader.readAsDataURL(file);
  });
};

const removeImage = (index) => {
  const item = formData.gambarLainnya[index];
  
  // Remove from file references if it's a new file
  if (item && item.isNew) {
    // Find and remove the corresponding file reference
    const fileIndex = multipleImageFiles.value.findIndex(
      (f) => f.previewIndex === index
    );
    if (fileIndex !== -1) {
      multipleImageFiles.value.splice(fileIndex, 1);
    }
    // Update preview indices for remaining files
    multipleImageFiles.value.forEach((f) => {
      if (f.previewIndex > index) {
        f.previewIndex--;
      }
    });
  }
  
  formData.gambarLainnya.splice(index, 1);
};

const uploadThumbnail = async () => {
  if (!thumbnailFile.value) {
    // If no file but thumbnail is base64, it means it was just selected but file ref is lost
    // This shouldn't happen, but return existing thumbnail as fallback
    return formData.thumbnail;
  }

  // Validate judul first
  if (!formData.judul || formData.judul.trim() === "") {
    throw new Error("Judul wajib diisi sebelum upload gambar");
  }

  const formDataUpload = new FormData();
  formDataUpload.append("image", thumbnailFile.value);
  formDataUpload.append("folder", "dokumentasi-kegiatan");

  // Generate slug dari judul untuk nama folder
  const slug = generateSlug(formData.judul);
  formDataUpload.append("slug", slug);

  const response = await $fetch(`${API_BASE}/api/upload/image`, {
    method: "POST",
    body: formDataUpload,
  });

  if (response.success) {
    return response.data.url;
  }
  throw new Error("Gagal upload thumbnail");
};

const uploadMultipleImages = async () => {
  if (multipleImageFiles.value.length === 0) return [];

  // Validate judul first
  if (!formData.judul || formData.judul.trim() === "") {
    throw new Error("Judul wajib diisi sebelum upload gambar");
  }

  const formDataUpload = new FormData();
  multipleImageFiles.value.forEach((fileRef) => {
    formDataUpload.append("images", fileRef.file);
  });
  formDataUpload.append("folder", "dokumentasi-kegiatan");

  // Generate slug dari judul untuk nama folder
  const slug = generateSlug(formData.judul);
  formDataUpload.append("slug", slug);

  const response = await $fetch(`${API_BASE}/api/upload/images`, {
    method: "POST",
    body: formDataUpload,
  });

  if (response.success) {
    return response.data.map((img) => img.url);
  }
  throw new Error("Gagal upload gambar");
};

const submitForm = async () => {
  // Validate required fields
  if (!formData.judul || !formData.tanggal) {
    showError("Judul dan tanggal wajib diisi");
    return;
  }

  submitting.value = true;
  uploadingImages.value = true;

  try {
    // Upload images first if there are new files
    let thumbnailUrl = formData.thumbnail;
    let gambarLainnyaUrls = [];

    // Check if thumbnail is a new file that needs to be uploaded
    if (thumbnailFile.value) {
      thumbnailUrl = await uploadThumbnail();
    } else {
      // Use existing thumbnail URL
      thumbnailUrl = formData.thumbnail;
    }

    // Handle multiple images
    if (multipleImageFiles.value.length > 0) {
      // Upload new files
      const uploadedUrls = await uploadMultipleImages();
      
      // Get existing URLs (those that are not new files)
      const existingUrls = formData.gambarLainnya
        .filter((img) => {
          if (typeof img === "string") return true; // Legacy: string URLs
          return !img.isNew; // Objects with isNew: false
        })
        .map((img) => (typeof img === "string" ? img : img.url));
      
      // Combine existing URLs with newly uploaded URLs
      gambarLainnyaUrls = [...existingUrls, ...uploadedUrls];
    } else {
      // No new files to upload, just use existing URLs
      gambarLainnyaUrls = formData.gambarLainnya.map((img) =>
        typeof img === "string" ? img : img.url
      );
    }

    uploadingImages.value = false;

    // Prepare data for submission
    const submitData = {
      judul: formData.judul,
      deskripsi: formData.deskripsi,
      konten: formData.konten,
      kategori: formData.kategori,
      tanggal: formData.tanggal,
      thumbnail: thumbnailUrl,
      gambarLainnya: gambarLainnyaUrls,
    };

    const url = formData.id
      ? `${API_BASE}/api/dokumentasi-kegiatan/admin/${formData.id}`
      : `${API_BASE}/api/dokumentasi-kegiatan/admin`;

    const method = formData.id ? "PUT" : "POST";

    const response = await $fetch(url, {
      method,
      body: JSON.stringify(submitData),
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
    showError(error.message || "Gagal menyimpan data");
  } finally {
    submitting.value = false;
    uploadingImages.value = false;
  }
};

const deleteDokumentasi = async () => {
  try {
    if (itemToDelete.value?.isMultiple) {
      // Delete multiple items
      const deletePromises = Array.from(selectedItems.value).map((id) =>
        $fetch(`${API_BASE}/api/dokumentasi-kegiatan/admin/${id}`, {
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
        `${API_BASE}/api/dokumentasi-kegiatan/admin/${itemToDelete.value.id}`,
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
