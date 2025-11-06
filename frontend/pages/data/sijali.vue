<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-16"
  >
    <!-- Main Content -->
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Main Content Area (Table) -->
        <div class="flex-1 min-w-0">
          <!-- Data Table -->
          <div
            class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <!-- Table Header with Summary -->
            <div
              class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200"
            >
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold text-gray-800">
                  Daftar Data Jalan Lingkungan
                </h2>
                <div class="text-sm text-gray-600">
                  <span class="font-semibold text-gray-800">{{
                    filteredRoads.length.toLocaleString("id-ID")
                  }}</span>
                  data ditemukan
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <LoadingSpinner
              v-if="loading"
              message="Memuat data..."
              sub-message="Mohon tunggu sebentar"
              size="lg"
              color="blue"
            />

            <!-- Table -->
            <div
              v-else
              class="overflow-x-auto max-h-[calc(100vh-350px)] min-h-[450px]"
            >
              <table class="min-w-full divide-y divide-gray-200 table-auto">
                <thead
                  class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 sticky top-0 z-20 shadow-lg"
                >
                  <tr>
                    <th
                      v-if="selectMode"
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap sticky left-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-30 border-r border-white/20 w-[60px] min-w-[60px]"
                    >
                      <input
                        type="checkbox"
                        :checked="isAllSelected"
                        @change="toggleSelectAll"
                        class="h-5 w-5 text-white focus:ring-2 focus:ring-white border-white/50 rounded cursor-pointer bg-white/20"
                      />
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[60px]"
                    >
                      No
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[80px]"
                    >
                      FID
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[120px]"
                    >
                      No Ruas
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[80px]"
                    >
                      No Prov
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[80px]"
                    >
                      No Kab
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[80px]"
                    >
                      No Kec
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[80px]"
                    >
                      No Desa
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[100px]"
                    >
                      No Jalan
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider w-[250px] min-w-[200px]"
                    >
                      Nama Jalan
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[150px]"
                    >
                      Kecamatan
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[150px]"
                    >
                      Desa
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[100px]"
                    >
                      Panjang (m)
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[100px]"
                    >
                      Lebar (m)
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[80px]"
                    >
                      Tahun
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[120px]"
                    >
                      Kondisi
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[100px]"
                    >
                      Nilai
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[80px]"
                    >
                      Bobot
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[120px]"
                    >
                      UTM X Awal
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[120px]"
                    >
                      UTM Y Awal
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[130px]"
                    >
                      Pangkalan Awal
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[120px]"
                    >
                      UTM X Akhir
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[120px]"
                    >
                      UTM Y Akhir
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-[130px]"
                    >
                      Pangkalan Akhir
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider w-[200px] min-w-[150px]"
                    >
                      Keterangan
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr v-if="filteredRoads.length === 0">
                    <td
                      :colspan="selectMode ? 26 : 25"
                      class="px-6 py-20 text-center"
                    >
                      <div class="flex flex-col items-center justify-center">
                        <div class="p-4 bg-gray-100 rounded-full mb-4">
                          <svg
                            class="w-16 h-16 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                        </div>
                        <p class="text-gray-600 font-bold text-xl mb-2">
                          Tidak ada data ditemukan
                        </p>
                        <p class="text-gray-500 text-sm">
                          Coba ubah filter atau kata kunci pencarian Anda
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr
                    v-else
                    v-for="(road, index) in paginatedRoads"
                    :key="road.id"
                    @click="
                      selectMode ? toggleRoadSelection(road.id) : viewRoad(road)
                    "
                    :class="[
                      'hover:bg-blue-50/70 transition-all duration-200 cursor-pointer border-b border-gray-100 group',
                      selectedRoads.has(road.id)
                        ? 'bg-blue-50 border-blue-200 shadow-sm'
                        : 'bg-white',
                    ]"
                  >
                    <!-- Checkbox -->
                    <td
                      v-if="selectMode"
                      :class="[
                        'px-4 py-4 whitespace-nowrap text-sm sticky left-0 z-30 border-r border-gray-200 w-[60px] min-w-[60px]',
                        selectedRoads.has(road.id)
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white',
                      ]"
                    >
                      <input
                        type="checkbox"
                        :checked="selectedRoads.has(road.id)"
                        @click.stop="toggleRoadSelection(road.id)"
                        class="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                      />
                    </td>
                    <!-- No -->
                    <td
                      class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-center"
                    >
                      {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                    </td>
                    <!-- FID -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-medium text-center"
                    >
                      {{
                        road.fid !== undefined && road.fid !== null
                          ? road.fid
                          : "-"
                      }}
                    </td>
                    <!-- No Ruas -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-semibold"
                    >
                      {{ road.noRuas || "-" }}
                    </td>
                    <!-- No Prov -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-center"
                    >
                      {{ road.noProv || "-" }}
                    </td>
                    <!-- No Kab -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-center"
                    >
                      {{ road.noKab || "-" }}
                    </td>
                    <!-- No Kec -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-center"
                    >
                      {{ road.noKec || "-" }}
                    </td>
                    <!-- No Desa -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-center"
                    >
                      {{ road.noDesa || "-" }}
                    </td>
                    <!-- No Jalan -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-medium"
                    >
                      {{ road.noJalan || "-" }}
                    </td>
                    <!-- Nama Jalan -->
                    <td class="px-4 py-3 text-sm text-gray-900 font-semibold">
                      <div
                        class="truncate"
                        :title="road.namaJalan || road.nama || '-'"
                      >
                        {{ road.namaJalan || road.nama || "-" }}
                      </div>
                    </td>
                    <!-- Kecamatan -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-700"
                    >
                      <div
                        class="truncate max-w-[150px]"
                        :title="road.kecamatan || '-'"
                      >
                        {{ road.kecamatan || "-" }}
                      </div>
                    </td>
                    <!-- Desa -->
                    <td class="px-4 py-3 text-sm text-gray-700">
                      <div
                        class="truncate max-w-[150px]"
                        :title="road.desa || '-'"
                      >
                        {{ road.desa || "-" }}
                      </div>
                    </td>
                    <!-- Panjang -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right font-semibold"
                    >
                      {{
                        road.panjangM
                          ? road.panjangM.toLocaleString("id-ID", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "-"
                      }}
                    </td>
                    <!-- Lebar -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right font-semibold"
                    >
                      {{
                        road.lebarM
                          ? road.lebarM.toLocaleString("id-ID", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "-"
                      }}
                    </td>
                    <!-- Tahun -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center font-semibold"
                    >
                      {{ road.tahun || "-" }}
                    </td>
                    <!-- Kondisi -->
                    <td class="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        v-if="road.kondisi"
                        :class="getKondisiClass(road.kondisi)"
                        class="px-2.5 py-1 inline-flex text-xs leading-4 font-bold rounded-full shadow-sm whitespace-nowrap"
                      >
                        {{ road.kondisi }}
                      </span>
                      <span v-else class="text-gray-400">-</span>
                    </td>
                    <!-- Nilai -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right font-semibold"
                    >
                      {{
                        road.nilai
                          ? road.nilai.toLocaleString("id-ID", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "-"
                      }}
                    </td>
                    <!-- Bobot -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center font-semibold"
                    >
                      {{ road.bobot || "-" }}
                    </td>
                    <!-- UTM X Awal -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-xs text-gray-600 text-right font-mono"
                    >
                      {{ road.utmXAwal ? road.utmXAwal.toFixed(2) : "-" }}
                    </td>
                    <!-- UTM Y Awal -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-xs text-gray-600 text-right font-mono"
                    >
                      {{ road.utmYAwal ? road.utmYAwal.toFixed(2) : "-" }}
                    </td>
                    <!-- Pangkalan Awal -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-700"
                    >
                      <div
                        class="truncate max-w-[130px]"
                        :title="road.pngnlAwal || '-'"
                      >
                        {{ road.pngnlAwal || "-" }}
                      </div>
                    </td>
                    <!-- UTM X Akhir -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-xs text-gray-600 text-right font-mono"
                    >
                      {{ road.utmXAkhi ? road.utmXAkhi.toFixed(2) : "-" }}
                    </td>
                    <!-- UTM Y Akhir -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-xs text-gray-600 text-right font-mono"
                    >
                      {{ road.utmYAkhi ? road.utmYAkhi.toFixed(2) : "-" }}
                    </td>
                    <!-- Pangkalan Akhir -->
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-700"
                    >
                      <div
                        class="truncate max-w-[130px]"
                        :title="road.pngnlAkhi || '-'"
                      >
                        {{ road.pngnlAkhi || "-" }}
                      </div>
                    </td>
                    <!-- Keterangan -->
                    <td class="px-4 py-3 text-sm">
                      <span
                        v-if="road.keterangan"
                        :class="getKeteranganClass(road.keterangan)"
                        class="px-2.5 py-1 inline-flex text-xs leading-4 font-bold rounded-full shadow-sm whitespace-nowrap"
                      >
                        {{ road.keterangan }}
                      </span>
                      <span v-else class="text-gray-400">-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div
              v-if="filteredRoads.length > 0"
              class="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200"
            >
              <div class="flex items-center justify-between flex-wrap gap-4">
                <div class="text-sm text-gray-700 font-medium">
                  <span class="text-gray-900 font-semibold">{{
                    (currentPage - 1) * itemsPerPage + 1
                  }}</span>
                  -
                  <span class="text-gray-900 font-semibold">{{
                    Math.min(currentPage * itemsPerPage, filteredRoads.length)
                  }}</span>
                  dari
                  <span class="text-blue-600 font-bold">{{
                    filteredRoads.length.toLocaleString("id-ID")
                  }}</span>
                  data
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                    class="px-4 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-white hover:border-blue-500 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-300 disabled:hover:text-gray-500 transition-all font-semibold shadow-sm hover:shadow-md"
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
                  <div
                    class="px-5 py-2.5 bg-white border-2 border-blue-500 rounded-xl shadow-sm"
                  >
                    <span class="text-blue-600 font-bold">{{
                      currentPage
                    }}</span>
                    <span class="text-gray-400 mx-1">/</span>
                    <span class="text-gray-600 font-semibold">{{
                      totalPages
                    }}</span>
                  </div>
                  <button
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                    class="px-4 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-white hover:border-blue-500 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-300 disabled:hover:text-gray-500 transition-all font-semibold shadow-sm hover:shadow-md"
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
          </div>
        </div>

        <!-- Sidebar: Filters and Actions -->
        <div class="w-full lg:w-80 flex-shrink-0">
          <div
            class="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sticky top-20"
          >
            <h2 class="text-lg font-bold text-gray-800 mb-4">Filter & Aksi</h2>

            <!-- Filters -->
            <div class="space-y-4 mb-6">
              <!-- Kecamatan Filter -->
              <div>
                <label
                  class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide"
                >
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Kecamatan
                  </div>
                </label>
                <select
                  v-model="selectedKecamatan"
                  @change="handleKecamatanChange"
                  class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium bg-white hover:border-gray-300"
                >
                  <option value="">Semua Kecamatan</option>
                  <option
                    v-for="kec in kecamatanOptions"
                    :key="kec"
                    :value="kec"
                  >
                    {{ kec }}
                  </option>
                </select>
              </div>

              <!-- Desa Filter -->
              <div>
                <label
                  class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide"
                >
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Desa
                  </div>
                </label>
                <select
                  v-model="selectedDesa"
                  @change="handleDesaChange"
                  :disabled="!selectedKecamatan"
                  class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium bg-white hover:border-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  <option value="">Semua Desa</option>
                  <option v-for="desa in desaOptions" :key="desa" :value="desa">
                    {{ desa }}
                  </option>
                </select>
              </div>

              <!-- Search -->
              <div>
                <label
                  class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide"
                >
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-blue-600"
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
                    Cari Data
                  </div>
                </label>
                <div class="relative">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Cari data..."
                    class="w-full px-3 py-2 pl-10 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium bg-white hover:border-gray-300"
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
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <!-- Download Documents Dropdown -->
              <div class="relative" ref="downloadMenuRef">
                <button
                  @click.stop="showDownloadMenu = !showDownloadMenu"
                  class="w-full px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-between text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                >
                  <div class="flex items-center gap-2">
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span>Download</span>
                  </div>
                  <svg
                    class="w-4 h-4 transition-transform"
                    :class="{ 'rotate-180': showDownloadMenu }"
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

                <!-- Dropdown Menu -->
                <Teleport to="body">
                  <div
                    v-if="showDownloadMenu"
                    data-download-dropdown
                    :style="getDropdownStyle()"
                    @scroll.stop
                    @wheel.stop
                    class="fixed w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] flex flex-col overflow-hidden"
                  >
                    <!-- Fixed Header -->
                    <div class="p-3 border-b border-gray-100 flex-shrink-0">
                      <button
                        @click="
                          downloadDocument('all');
                          showDownloadMenu = false;
                        "
                        :disabled="isDownloading"
                        class="w-full px-4 py-2.5 text-left rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group disabled:opacity-50"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="p-1.5 bg-blue-100 rounded group-hover:bg-blue-200"
                          >
                            <svg
                              class="w-4 h-4 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <div class="text-sm font-semibold text-gray-800">
                              Semua Data
                            </div>
                            <div class="text-xs text-gray-500">
                              GeoJSON format
                            </div>
                          </div>
                        </div>
                        <svg
                          v-if="!isDownloading"
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
                          />
                        </svg>
                        <svg
                          v-else
                          class="animate-spin w-4 h-4 text-blue-600"
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
                      </button>
                    </div>

                    <!-- Scrollable Content -->
                    <div
                      class="overflow-y-auto max-h-[320px] overscroll-contain"
                      @scroll.stop
                      @wheel.stop
                      style="-webkit-overflow-scrolling: touch"
                    >
                      <div class="p-2">
                        <!-- Kecamatan Section -->
                        <div v-if="kecamatanOptions.length > 0">
                          <div
                            class="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide sticky top-0 bg-white z-10"
                          >
                            Kecamatan
                          </div>
                          <div class="space-y-1">
                            <button
                              v-for="kec in kecamatanOptions"
                              :key="`kec-${kec}`"
                              @click="
                                downloadDocument('kecamatan', kec);
                                showDownloadMenu = false;
                              "
                              :disabled="isDownloading"
                              class="w-full px-4 py-2 text-left rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group disabled:opacity-50"
                            >
                              <div
                                class="flex items-center gap-3 flex-1 min-w-0"
                              >
                                <div
                                  class="p-1.5 bg-green-100 rounded group-hover:bg-green-200 flex-shrink-0"
                                >
                                  <svg
                                    class="w-4 h-4 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                  <div
                                    class="text-sm font-medium text-gray-800 truncate"
                                  >
                                    {{ kec }}
                                  </div>
                                </div>
                              </div>
                              <svg
                                v-if="!isDownloading"
                                class="w-4 h-4 text-gray-400 flex-shrink-0"
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

                        <!-- Desa Section -->
                        <template
                          v-if="selectedKecamatan && desaOptions.length > 0"
                        >
                          <div class="border-t border-gray-100 my-2"></div>
                          <div
                            class="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide sticky top-0 bg-white z-10"
                          >
                            Desa
                          </div>
                          <div class="space-y-1">
                            <button
                              v-for="desa in desaOptions"
                              :key="`desa-${desa}`"
                              @click="
                                downloadDocument(
                                  'desa',
                                  selectedKecamatan,
                                  desa
                                );
                                showDownloadMenu = false;
                              "
                              :disabled="isDownloading"
                              class="w-full px-4 py-2 text-left rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group disabled:opacity-50"
                            >
                              <div
                                class="flex items-center gap-3 flex-1 min-w-0"
                              >
                                <div
                                  class="p-1.5 bg-purple-100 rounded group-hover:bg-purple-200 flex-shrink-0"
                                >
                                  <svg
                                    class="w-4 h-4 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                  </svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                  <div
                                    class="text-sm font-medium text-gray-800 truncate"
                                  >
                                    {{ desa }}
                                  </div>
                                </div>
                              </div>
                              <svg
                                v-if="!isDownloading"
                                class="w-4 h-4 text-gray-400 flex-shrink-0"
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
                        </template>
                      </div>
                    </div>
                  </div>
                </Teleport>
              </div>

              <button
                @click="toggleSelectMode"
                :class="[
                  'w-full px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm font-semibold',
                  selectMode
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800',
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {{ selectMode ? "Kembali" : "Pilih Data" }}
              </button>
            </div>

            <!-- Select Mode Actions -->
            <div
              v-if="selectMode"
              class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200"
            >
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-blue-500 rounded-lg text-white">
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
                    <div class="text-sm font-semibold text-blue-900">
                      {{ selectedRoadsCount.toLocaleString("id-ID") }} data
                      dipilih
                    </div>
                    <div class="text-xs text-blue-700">
                      Dari
                      {{ filteredRoads.length.toLocaleString("id-ID") }} data
                      tersaring
                    </div>
                  </div>
                </div>
                <button
                  v-if="hasSelectedRoads"
                  @click="exportSelectedRoads"
                  class="w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export GeoJSON
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Road Detail Modal -->
    <DataRoadViewModal
      :visible="showRoadDetailModal"
      :road="selectedRoad"
      @close="showRoadDetailModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import DataRoadViewModal from "~/components/DataRoadViewModal.vue";
import LoadingSpinner from "~/components/LoadingSpinner.vue";
import { useToast } from "~/composables/useToast.js";

definePageMeta({
  layout: "default",
});

useHead({
  title: "Data Lingkungan SIJALI - SIMANTAP KUBU RAYA",
  meta: [
    {
      name: "description",
      content:
        "Data lengkap jalan lingkungan Kabupaten Kubu Raya dengan fitur export GeoJSON",
    },
  ],
});

// Config
const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl || "http://localhost:3001";

// State
const loading = ref(true);
const isDownloading = ref(false);
const roads = ref([]);
const kecamatanOptions = ref([]);
const desaOptions = ref([]);

// Filters
const selectedKecamatan = ref("");
const selectedDesa = ref("");
const searchQuery = ref("");

// Select Mode
const selectMode = ref(false);
const selectedRoads = ref(new Set());
const showDownloadMenu = ref(false);
const downloadMenuRef = ref(null);

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(25);

// Modal
const showRoadDetailModal = ref(false);
const selectedRoad = ref(null);

// Toast
const toast = useToast();

// Computed
const totalData = computed(() => roads.value.length);

const filteredRoads = computed(() => {
  let data = roads.value;

  // Filter by kecamatan
  if (selectedKecamatan.value) {
    data = data.filter((road) => road.kecamatan === selectedKecamatan.value);
  }

  // Filter by desa
  if (selectedDesa.value) {
    data = data.filter((road) => road.desa === selectedDesa.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    data = data.filter(
      (road) =>
        (road.noRuas && road.noRuas.toLowerCase().includes(query)) ||
        (road.namaJalan && road.namaJalan.toLowerCase().includes(query)) ||
        (road.nama && road.nama.toLowerCase().includes(query)) ||
        (road.kecamatan && road.kecamatan.toLowerCase().includes(query)) ||
        (road.desa && road.desa.toLowerCase().includes(query))
    );
  }

  return data;
});

const paginatedRoads = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredRoads.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredRoads.value.length / itemsPerPage.value);
});

const selectedRoadsCount = computed(() => selectedRoads.value.size);

const isAllSelected = computed(() => {
  return (
    filteredRoads.value.length > 0 &&
    filteredRoads.value.every((road) => selectedRoads.value.has(road.id))
  );
});

const hasSelectedRoads = computed(() => selectedRoads.value.size > 0);

// Methods
const fetchRoads = async () => {
  loading.value = true;
  try {
    const response = await fetch(`${apiBaseUrl}/api/jalan?limit=100000`);
    const result = await response.json();

    if (result.success) {
      roads.value = result.data;
    }
  } catch (error) {
    console.error("Error fetching roads:", error);
    toast.error("Gagal memuat data jalan");
  } finally {
    loading.value = false;
  }
};

const fetchKecamatanOptions = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/jalan/filters/kecamatan`);
    const result = await response.json();

    if (result.success) {
      kecamatanOptions.value = result.data;
    }
  } catch (error) {
    console.error("Error fetching kecamatan:", error);
  }
};

const fetchDesaOptions = async (kecamatan) => {
  try {
    const url = kecamatan
      ? `${apiBaseUrl}/api/jalan/filters/desa?kecamatan=${encodeURIComponent(
          kecamatan
        )}`
      : `${apiBaseUrl}/api/jalan/filters/desa`;

    const response = await fetch(url);
    const result = await response.json();

    if (result.success) {
      desaOptions.value = result.data;
    }
  } catch (error) {
    console.error("Error fetching desa:", error);
  }
};

const handleKecamatanChange = () => {
  selectedDesa.value = "";
  if (selectedKecamatan.value) {
    fetchDesaOptions(selectedKecamatan.value);
  } else {
    desaOptions.value = [];
  }
  currentPage.value = 1;
};

const handleDesaChange = () => {
  currentPage.value = 1;
};

const toggleSelectMode = () => {
  selectMode.value = !selectMode.value;
  if (!selectMode.value) {
    selectedRoads.value.clear();
  }
};

const toggleRoadSelection = (roadId) => {
  if (selectedRoads.value.has(roadId)) {
    selectedRoads.value.delete(roadId);
  } else {
    selectedRoads.value.add(roadId);
  }
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedRoads.value.clear();
  } else {
    filteredRoads.value.forEach((road) => selectedRoads.value.add(road.id));
  }
};

const exportSelectedRoads = async () => {
  console.log("DATA SIJALI - exportSelectedRoads() called");
  console.log("Using POST /api/jalan/export/geojson endpoint");

  if (!hasSelectedRoads.value) {
    toast.warning("Pilih data terlebih dahulu");
    return;
  }

  try {
    const selectedRoadsList = roads.value.filter((road) =>
      selectedRoads.value.has(road.id)
    );

    // Get IDs of selected roads
    const selectedIds = selectedRoadsList.map((road) => road.id);

    console.log(`Requesting GeoJSON export for ${selectedIds.length} roads`);
    console.log(`API URL: ${apiBaseUrl}/api/jalan/export/geojson`);

    // Call API to get GeoJSON with geometry
    const response = await fetch(`${apiBaseUrl}/api/jalan/export/geojson`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: selectedIds }),
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      throw new Error("Failed to export GeoJSON");
    }

    const result = await response.json();

    if (!result.success) {
      console.error(`Export failed:`, result.error);
      throw new Error(result.error || "Failed to export GeoJSON");
    }

    const geojson = result.data;

    console.log(`Features count: ${geojson.features?.length || 0}`);

    if (geojson.features && geojson.features.length > 0) {
      const firstFeature = geojson.features[0];
      const hasGeometry =
        firstFeature.geometry !== null && firstFeature.geometry !== undefined;

      if (hasGeometry) {
        console.log(`Geometry type: ${firstFeature.geometry.type}`);
        console.log(
          `Coordinates count: ${
            firstFeature.geometry.coordinates?.length || 0
          } points`
        );
      } else {
        console.warn("WARNING: Geometry is NULL!");
      }
    }

    // Create and download
    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jalan_lingkungan_${new Date().getTime()}.geojson`;
    document.body.appendChild(a);
    a.click();

    // Cleanup after a short delay
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    console.log("Download triggered successfully");
    toast.success(
      `Berhasil mengexport ${selectedRoadsList.length} data jalan dengan geometry lengkap!`
    );
  } catch (error) {
    console.error("Error exporting roads:", error);
    toast.error(`Gagal mengexport data: ${error.message}`);
  }
};

// REMOVED: exportSelectedRoadsShapefile - Feature disabled due to issues

const downloadDocument = async (type, kecamatan = null, desa = null) => {
  isDownloading.value = true;
  try {
    let url = `${apiBaseUrl}/api/jalan/download/geojson?`;
    const params = new URLSearchParams();

    if (type === "kecamatan" && kecamatan) {
      params.append("kecamatan", kecamatan);
    } else if (type === "desa" && kecamatan && desa) {
      params.append("kecamatan", kecamatan);
      params.append("desa", desa);
    }
    // type === 'all' doesn't need params

    url += params.toString();

    console.log(`Downloading document: ${type}`, { kecamatan, desa });
    console.log(`URL: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }

    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;

    // Get filename from Content-Disposition header or generate one
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = "jalan_lingkungan.geojson";
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    } else {
      // Generate filename
      if (type === "kecamatan" && kecamatan) {
        filename = `jalan_lingkungan_${kecamatan.replace(/\s+/g, "_")}.geojson`;
      } else if (type === "desa" && kecamatan && desa) {
        filename = `jalan_lingkungan_${kecamatan.replace(
          /\s+/g,
          "_"
        )}_${desa.replace(/\s+/g, "_")}.geojson`;
      } else {
        filename = `jalan_lingkungan_all.geojson`;
      }
    }

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);

    toast.success(`Berhasil mendownload ${filename}`);
    console.log(`Download completed: ${filename}`);
  } catch (error) {
    console.error("Error downloading document:", error);
    toast.error(`Gagal mendownload dokumen: ${error.message}`);
  } finally {
    isDownloading.value = false;
  }
};

const viewRoad = (road) => {
  selectedRoad.value = road;
  showRoadDetailModal.value = true;
};

const getKondisiClass = (kondisi) => {
  if (!kondisi) return "bg-gray-100 text-gray-800";

  const kondisiLower = kondisi.toLowerCase();
  if (kondisiLower.includes("baik")) {
    return "bg-green-100 text-green-800";
  } else if (kondisiLower.includes("sedang")) {
    return "bg-yellow-100 text-yellow-800";
  } else if (kondisiLower.includes("rusak")) {
    return "bg-red-100 text-red-800";
  }
  return "bg-gray-100 text-gray-800";
};

const getKeteranganClass = (keterangan) => {
  if (!keterangan) return "bg-gray-100 text-gray-800";

  const ket = keterangan.toLowerCase();
  if (ket.includes("baik")) {
    return "bg-green-100 text-green-800";
  } else if (ket.includes("sedang")) {
    return "bg-yellow-100 text-yellow-800";
  } else if (ket.includes("rusak ringan")) {
    return "bg-orange-100 text-orange-800";
  } else if (ket.includes("rusak") || ket.includes("berat")) {
    return "bg-red-100 text-red-800";
  }
  return "bg-gray-100 text-gray-800";
};

// Watch for filter changes to reset pagination
watch([selectedKecamatan, selectedDesa, searchQuery], () => {
  currentPage.value = 1;
});

// Calculate dropdown position
const getDropdownStyle = () => {
  if (!downloadMenuRef.value) {
    return {};
  }

  const buttonRect = downloadMenuRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const dropdownHeight = Math.min(viewportHeight * 0.5, 350); // Max 50vh or 350px
  const dropdownWidth = 288; // w-72 = 288px
  const gap = 8; // mt-2 = 8px

  // Calculate horizontal position (align to right of button)
  let left = buttonRect.right - dropdownWidth;
  // Ensure dropdown doesn't go off-screen on the left
  if (left < 8) {
    left = 8;
  }
  // Ensure dropdown doesn't go off-screen on the right
  if (left + dropdownWidth > viewportWidth - 8) {
    left = viewportWidth - dropdownWidth - 8;
  }

  // Calculate vertical position - always show below button
  const spaceBelow = viewportHeight - buttonRect.bottom - gap;

  let top = buttonRect.bottom + gap;

  // If not enough space below, adjust dropdown height to fit
  if (spaceBelow < dropdownHeight) {
    // Reduce dropdown height to fit available space
    const adjustedHeight = Math.max(spaceBelow - 20, 200); // Minimum 200px
    return {
      position: "fixed",
      left: `${left}px`,
      top: `${top}px`,
      maxHeight: `${adjustedHeight}px`,
    };
  }

  return {
    position: "fixed",
    left: `${left}px`,
    top: `${top}px`,
    maxHeight: `${dropdownHeight}px`,
  };
};

// Close download menu when clicking outside
const handleClickOutside = (event) => {
  if (downloadMenuRef.value && !downloadMenuRef.value.contains(event.target)) {
    // Also check if click is outside the dropdown menu itself
    const dropdown = document.querySelector("[data-download-dropdown]");
    if (dropdown && !dropdown.contains(event.target)) {
      showDownloadMenu.value = false;
    }
  }
};

// Close dropdown on page scroll (but not when scrolling inside the dropdown)
const handleScroll = (event) => {
  if (!showDownloadMenu.value) return;

  // Check if scroll happened inside the dropdown
  const dropdown = document.querySelector("[data-download-dropdown]");
  if (!dropdown) {
    showDownloadMenu.value = false;
    return;
  }

  // Get the element that triggered the scroll
  const target = event.target;
  const currentTarget = event.currentTarget;

  // If scroll event is from window/document (main page scroll)
  if (
    currentTarget === window ||
    currentTarget === document ||
    currentTarget === document.body ||
    currentTarget === document.documentElement
  ) {
    // Check if the scroll target is inside dropdown
    if (target && dropdown.contains(target)) {
      // Scroll is happening inside dropdown, don't close it
      return;
    }

    // Check if scroll happened in the scrollable content area
    const scrollableContent = dropdown.querySelector(".overflow-y-auto");
    if (
      scrollableContent &&
      (scrollableContent === target || scrollableContent.contains(target))
    ) {
      return;
    }

    // Page scroll happened, close dropdown
    showDownloadMenu.value = false;
    return;
  }

  // For other scroll events, check if it's inside dropdown
  if (target && dropdown.contains(target)) {
    return;
  }

  // Scroll happened outside dropdown, close it
  showDownloadMenu.value = false;
};

// Lifecycle
onMounted(() => {
  console.log("Data SIJALI Page Loaded");
  console.log("Export endpoint: POST /api/jalan/export/geojson");
  fetchRoads();
  fetchKecamatanOptions();

  // Add click outside listener
  document.addEventListener("click", handleClickOutside);
  // Add scroll listener to close dropdown (only on window scroll, not inside dropdown)
  window.addEventListener("scroll", handleScroll, false);
  document.addEventListener("scroll", handleScroll, false);
});

onUnmounted(() => {
  // Remove listeners
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("scroll", handleScroll, false);
  document.removeEventListener("scroll", handleScroll, false);
});
</script>
