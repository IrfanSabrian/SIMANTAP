<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold mb-2">
              Data Lingkungan SIJALI
            </h1>
            <p class="text-blue-100 text-base md:text-lg">
              Sistem Informasi Jalan Lingkungan Kabupaten Kubu Raya
            </p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold">{{ totalData }}</div>
              <div class="text-sm text-blue-100">Total Data</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-6">
      <!-- Filters and Actions -->
      <div class="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
        <div
          class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between"
        >
          <!-- Filters -->
          <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <!-- Kecamatan Filter -->
            <div class="w-full sm:w-48">
              <label class="block text-xs font-semibold text-gray-700 mb-1">
                Kecamatan
              </label>
              <select
                v-model="selectedKecamatan"
                @change="handleKecamatanChange"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
              >
                <option value="">Semua Kecamatan</option>
                <option v-for="kec in kecamatanOptions" :key="kec" :value="kec">
                  {{ kec }}
                </option>
              </select>
            </div>

            <!-- Desa Filter -->
            <div class="w-full sm:w-48">
              <label class="block text-xs font-semibold text-gray-700 mb-1">
                Desa
              </label>
              <select
                v-model="selectedDesa"
                @change="handleDesaChange"
                :disabled="!selectedKecamatan"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm disabled:bg-gray-100"
              >
                <option value="">Semua Desa</option>
                <option v-for="desa in desaOptions" :key="desa" :value="desa">
                  {{ desa }}
                </option>
              </select>
            </div>

            <!-- Search -->
            <div class="w-full sm:w-64">
              <label class="block text-xs font-semibold text-gray-700 mb-1">
                Cari
              </label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari data..."
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2 w-full lg:w-auto justify-end">
            <button
              @click="toggleSelectMode"
              :class="[
                'px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 text-sm font-medium',
                selectMode
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
              ]"
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ selectMode ? "Kembali" : "Select" }}
            </button>
          </div>
        </div>

        <!-- Select Mode Actions -->
        <div
          v-if="selectMode"
          class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div class="flex items-center justify-between flex-wrap gap-3">
            <span class="text-sm font-medium text-blue-800">
              {{ selectedRoadsCount }} data dipilih
            </span>
            <div class="flex gap-2">
              <button
                v-if="hasSelectedRoads"
                @click="exportSelectedRoads"
                class="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export GeoJSON
              </button>
              <button
                v-if="hasSelectedRoads"
                @click="exportSelectedRoadsShapefile"
                class="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export Shapefile
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <svg
              class="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
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
            <p class="text-gray-600">Memuat data...</p>
          </div>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table
            class="min-w-full divide-y divide-gray-200"
            style="table-layout: fixed"
          >
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-if="selectMode"
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-gray-50 z-10"
                  style="width: 50px; min-width: 50px"
                >
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  No
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  FID
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  No Ruas
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  No Prov
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  No Kab
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  No Kec
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  No Desa
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  No Jalan
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]"
                >
                  Nama Jalan
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Kecamatan
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Desa
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Panjang (m)
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Lebar (m)
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Tahun
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Kondisi
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Nilai
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Bobot
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  UTM X Awal
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  UTM Y Awal
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Pangkalan Awal
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  UTM X Akhir
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  UTM Y Akhir
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Pangkalan Akhir
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]"
                >
                  Keterangan
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredRoads.length === 0">
                <td
                  :colspan="selectMode ? 26 : 25"
                  class="px-6 py-8 text-center text-gray-500"
                >
                  Tidak ada data
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
                  'hover:bg-gray-50 transition-colors cursor-pointer',
                  selectedRoads.has(road.id) ? 'bg-blue-50' : '',
                ]"
              >
                <!-- Checkbox -->
                <td
                  v-if="selectMode"
                  :class="[
                    'px-3 py-3 whitespace-nowrap text-sm text-gray-900 sticky left-0 z-10',
                    selectedRoads.has(road.id) ? 'bg-blue-50' : 'bg-white',
                  ]"
                  style="width: 50px; min-width: 50px"
                >
                  <input
                    type="checkbox"
                    :checked="selectedRoads.has(road.id)"
                    @click.stop="toggleRoadSelection(road.id)"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <!-- No -->
                <td
                  class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 font-medium"
                >
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <!-- FID -->
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{
                    road.fid !== undefined && road.fid !== null ? road.fid : "-"
                  }}
                </td>
                <!-- No Ruas -->
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ road.noRuas || "-" }}
                </td>
                <!-- No Prov -->
                <td
                  class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center"
                >
                  {{ road.noProv || "-" }}
                </td>
                <!-- No Kab -->
                <td
                  class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center"
                >
                  {{ road.noKab || "-" }}
                </td>
                <!-- No Kec -->
                <td
                  class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center"
                >
                  {{ road.noKec || "-" }}
                </td>
                <!-- No Desa -->
                <td
                  class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center"
                >
                  {{ road.noDesa || "-" }}
                </td>
                <!-- No Jalan -->
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ road.noJalan || "-" }}
                </td>
                <!-- Nama Jalan -->
                <td class="px-3 py-3 text-sm text-gray-900 font-medium">
                  {{ road.namaJalan || road.nama || "-" }}
                </td>
                <!-- Kecamatan -->
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ road.kecamatan || "-" }}
                </td>
                <!-- Desa -->
                <td class="px-3 py-3 text-sm text-gray-900">
                  {{ road.desa || "-" }}
                </td>
                <!-- Panjang -->
                <td
                  class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right"
                >
                  {{ road.panjangM?.toFixed(2) || "-" }}
                </td>
                <!-- Lebar -->
                <td
                  class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right"
                >
                  {{ road.lebarM?.toFixed(2) || "-" }}
                </td>
                <!-- Tahun -->
                <td
                  class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center"
                >
                  {{ road.tahun || "-" }}
                </td>
                <!-- Kondisi -->
                <td class="px-3 py-3 whitespace-nowrap text-sm">
                  <span
                    v-if="road.kondisi"
                    :class="getKondisiClass(road.kondisi)"
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ road.kondisi }}
                  </span>
                  <span v-else>-</span>
                </td>
                <!-- Nilai -->
                <td
                  class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right"
                >
                  {{ road.nilai?.toFixed(2) || "-" }}
                </td>
                <!-- Bobot -->
                <td
                  class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center"
                >
                  {{ road.bobot || "-" }}
                </td>
                <!-- UTM X Awal -->
                <td
                  class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right"
                >
                  {{ road.utmXAwal?.toFixed(2) || "-" }}
                </td>
                <!-- UTM Y Awal -->
                <td
                  class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right"
                >
                  {{ road.utmYAwal?.toFixed(2) || "-" }}
                </td>
                <!-- Pangkalan Awal -->
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ road.pngnlAwal || "-" }}
                </td>
                <!-- UTM X Akhir -->
                <td
                  class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right"
                >
                  {{ road.utmXAkhi?.toFixed(2) || "-" }}
                </td>
                <!-- UTM Y Akhir -->
                <td
                  class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right"
                >
                  {{ road.utmYAkhi?.toFixed(2) || "-" }}
                </td>
                <!-- Pangkalan Akhir -->
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ road.pngnlAkhi || "-" }}
                </td>
                <!-- Keterangan -->
                <td class="px-3 py-3 text-sm">
                  <span
                    v-if="road.keterangan"
                    :class="getKeteranganClass(road.keterangan)"
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ road.keterangan }}
                  </span>
                  <span v-else>-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="filteredRoads.length > 0"
          class="px-6 py-4 bg-gray-50 border-t border-gray-200"
        >
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div class="text-sm text-gray-600">
              Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
              {{ Math.min(currentPage * itemsPerPage, filteredRoads.length) }}
              dari {{ filteredRoads.length }} data
            </div>
            <div class="flex gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
              <span class="px-4 py-2 border border-gray-300 rounded-lg">
                {{ currentPage }} / {{ totalPages }}
              </span>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

    <!-- Road Detail Modal -->
    <DataRoadViewModal
      :visible="showRoadDetailModal"
      :road="selectedRoad"
      @close="showRoadDetailModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import DataRoadViewModal from "~/components/DataRoadViewModal.vue";
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
  console.log(
    "🔵 DATA SIJALI - exportSelectedRoads() called - VERSION 3.0 [NEW API]"
  );
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

    console.log(
      `📤 DATA SIJALI - Requesting GeoJSON export for ${selectedIds.length} roads`
    );
    console.log(`📍 API URL: ${apiBaseUrl}/api/jalan/export/geojson`);
    console.log(`📋 Method: POST with IDs:`, selectedIds);

    // Call API to get GeoJSON with geometry
    const response = await fetch(`${apiBaseUrl}/api/jalan/export/geojson`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: selectedIds }),
    });

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      throw new Error("Failed to export GeoJSON");
    }

    const result = await response.json();

    if (!result.success) {
      console.error(`❌ Export failed:`, result.error);
      throw new Error(result.error || "Failed to export GeoJSON");
    }

    const geojson = result.data;

    console.log("=== 📊 RESPONSE DATA ===");
    console.log(`Features count: ${geojson.features?.length || 0}`);

    if (geojson.features && geojson.features.length > 0) {
      const firstFeature = geojson.features[0];
      const hasGeometry =
        firstFeature.geometry !== null && firstFeature.geometry !== undefined;

      console.log(
        `First feature has geometry: ${hasGeometry ? "✅ YES" : "❌ NO (NULL)"}`
      );

      if (hasGeometry) {
        console.log(`Geometry type: ${firstFeature.geometry.type}`);
        console.log(
          `Coordinates count: ${
            firstFeature.geometry.coordinates?.length || 0
          } points`
        );
        console.log(
          `First coordinate:`,
          firstFeature.geometry.coordinates?.[0]
        );
      } else {
        console.error(
          "⚠️ WARNING: Geometry is NULL! This should not happen with new API!"
        );
        console.log(
          "Full first feature:",
          JSON.stringify(firstFeature, null, 2)
        );
      }
    }
    console.log("========================");

    // Create and download
    console.log("📥 Creating download file...");
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

    console.log("✅ Download triggered successfully");
    toast.success(
      `Berhasil mengexport ${selectedRoadsList.length} data jalan dengan geometry lengkap!`
    );
  } catch (error) {
    console.error("❌ Error exporting roads:", error);
    toast.error(`Gagal mengexport data: ${error.message}`);
  }
};

const exportSelectedRoadsShapefile = async () => {
  console.log("🔵 DATA SIJALI - exportSelectedRoadsShapefile() called");

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

    console.log(
      `📤 DATA SIJALI - Requesting Shapefile export for ${selectedIds.length} roads`
    );
    console.log(`📍 API URL: ${apiBaseUrl}/api/jalan/export/shapefile`);
    console.log(`📋 Method: POST with IDs:`, selectedIds);

    // Call API to get Shapefile ZIP
    const response = await fetch(`${apiBaseUrl}/api/jalan/export/shapefile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: selectedIds }),
    });

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to export Shapefile");
    }

    // Get the blob from response
    const blob = await response.blob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jalan_lingkungan_${new Date().getTime()}.zip`;
    document.body.appendChild(a);
    a.click();

    // Cleanup after a short delay
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    console.log("✅ Shapefile download triggered successfully");
    toast.success(
      `Berhasil mengexport ${selectedRoadsList.length} data jalan sebagai Shapefile!`
    );
  } catch (error) {
    console.error("❌ Error exporting roads as Shapefile:", error);
    toast.error(`Gagal mengexport Shapefile: ${error.message}`);
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

// Lifecycle
onMounted(() => {
  console.log("🎯 Data SIJALI Page Loaded - VERSION 3.0 [NEW API ENDPOINT]");
  console.log("Export endpoint: POST /api/jalan/export/geojson");
  fetchRoads();
  fetchKecamatanOptions();
});
</script>
