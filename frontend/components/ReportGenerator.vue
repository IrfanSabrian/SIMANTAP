<template>
  <div class="space-y-8">
    <!-- Main Content: Optimized Layout -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <!-- Left: Report Type Selection (9 columns) -->
      <div class="xl:col-span-8">
        <!-- Report Type Cards -->
        <div>
          <div class="mb-6">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-1"
            >
              Pilih Jenis Laporan
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Pilih salah satu jenis laporan untuk melihat preview
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              v-for="reportType in availableReportTypes"
              :key="reportType.value"
              @click="selectReportType(reportType.value)"
              :class="[
                'group relative p-4 rounded-xl border-2 transition-all duration-300 text-left',
                'hover:shadow-lg hover:-translate-y-0.5',
                selectedReportType === reportType.value
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600',
              ]"
            >
              <!-- Selected Indicator -->
              <div
                v-if="selectedReportType === reportType.value"
                class="absolute top-3 right-3"
              >
                <div
                  class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
                >
                  <svg
                    class="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
              </div>

              <!-- Icon -->
              <div
                :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors',
                  selectedReportType === reportType.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400',
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>

              <!-- Content -->
              <div>
                <h4
                  :class="[
                    'text-sm font-semibold mb-1.5',
                    selectedReportType === reportType.value
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-800 dark:text-gray-200',
                  ]"
                >
                  {{ reportType.label }}
                </h4>
                <p
                  class="text-xs leading-relaxed line-clamp-2"
                  :class="
                    selectedReportType === reportType.value
                      ? 'text-gray-600 dark:text-gray-300'
                      : 'text-gray-500 dark:text-gray-400'
                  "
                >
                  {{ reportType.description }}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Filter & Actions (4 columns) -->
      <div class="xl:col-span-4">
        <div
          class="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6"
        >
          <h4 class="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Filter & Aksi
          </h4>

          <!-- Location Filters -->
          <div class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Kecamatan
              </label>
              <select
                v-model="selectedKecamatan"
                @change="onKecamatanChange"
                class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
              >
                <option value="">Pilih Kecamatan</option>
                <option
                  v-for="kecamatan in kecamatanList"
                  :key="kecamatan"
                  :value="kecamatan"
                >
                  {{ kecamatan }}
                </option>
              </select>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Desa
              </label>
              <select
                v-model="selectedDesa"
                :disabled="!selectedKecamatan"
                class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <option value="">Pilih Desa</option>
                <option v-for="desa in availableDesa" :key="desa" :value="desa">
                  {{ desa }}
                </option>
              </select>
            </div>
          </div>

          <!-- Action Button -->
          <div>
            <button
              @click="previewReport"
              :disabled="isLoading"
              class="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg
                v-if="isLoading"
                class="animate-spin h-5 w-5"
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
              <svg
                v-else
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <span>
                {{ isLoading ? "Memuat..." : "Buat Laporan" }}
              </span>
            </button>
          </div>

          <!-- Status Alert -->
          <div
            v-if="statusMessage"
            class="p-4 rounded-xl text-sm"
            :class="
              statusMessage.type === 'error'
                ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
            "
          >
            <div class="flex items-start gap-3">
              <svg
                v-if="statusMessage.type === 'error'"
                class="w-5 h-5 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <svg
                v-else
                class="w-5 h-5 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p class="flex-1">{{ statusMessage.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <ReportPreviewModal
      :is-open="showPreview"
      :report-data="previewData"
      @close="closePreview"
      @download-pdf="handlePreviewDownload"
      @download-excel="handlePreviewDownload"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import ReportPreviewModal from "~/components/ReportPreviewModal.vue";

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({}),
  },
  conditionStats: {
    type: Object,
    default: () => ({}),
  },
  kecamatanStats: {
    type: Array,
    default: () => [],
  },
  materialStats: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["download-report"]);

const selectedReportType = ref("");
const selectedKecamatan = ref("");
const selectedDesa = ref("");
const statusMessage = ref(null);
const isLoading = ref(false);
const kecamatanList = ref([]);
const desaByKecamatan = ref({});
const reportData = ref(null);
const showPreview = ref(false);
const previewData = ref(null);

const availableReportTypes = [
  {
    value: "jalan-lingkungan",
    label: "Jalan Lingkungan",
    description:
      "Laporan kondisi dan data jalan lingkungan Kabupaten Kubu Raya",
  },
  {
    value: "jembatan-lingkungan",
    label: "Jembatan Lingkungan",
    description:
      "Laporan kondisi dan data jembatan lingkungan Kabupaten Kubu Raya",
  },
  {
    value: "drainase-lingkungan",
    label: "Drainase Lingkungan",
    description:
      "Laporan kondisi dan data drainase lingkungan Kabupaten Kubu Raya",
  },
  {
    value: "kawasan-permukiman",
    label: "Kawasan Permukiman",
    description:
      "Laporan kondisi dan data kawasan permukiman Kabupaten Kubu Raya",
  },
  {
    value: "rumah-layak-tidak-hunian",
    label: "Rumah Tidak Layak Huni",
    description:
      "Laporan kondisi dan data rumah tidak layak huni Kabupaten Kubu Raya",
  },
];

const reportTypeLabels = {
  "jalan-lingkungan": "Jalan Lingkungan",
  "jembatan-lingkungan": "Jembatan Lingkungan",
  "drainase-lingkungan": "Drainase Lingkungan",
  "kawasan-permukiman": "Kawasan Permukiman",
  "rumah-layak-tidak-hunian": "Rumah Tidak Layak Huni",
};

// Computed properties
const availableDesa = computed(() => {
  if (!selectedKecamatan.value) return [];
  return desaByKecamatan.value[selectedKecamatan.value] || [];
});

// Computed property untuk menentukan apakah tombol preview harus disabled
// Sekarang tombol tidak pernah disabled, validasi dilakukan saat klik
const isPreviewDisabled = computed(() => {
  return false;
});

// Methods
const selectReportType = (type) => {
  selectedReportType.value = type;
  clearStatus();

  // Reset location selections when changing report type
  selectedKecamatan.value = "";
  selectedDesa.value = "";
};

const fetchLocations = async () => {
  try {
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiUrl;
    const response = await fetch(`${apiUrl}/jalan/locations`);
    const result = await response.json();

    if (result.success) {
      kecamatanList.value = result.data.kecamatan;
      desaByKecamatan.value = result.data.desa;
    }
  } catch (error) {
    console.error("Error fetching locations:", error);
    statusMessage.value = {
      type: "error",
      text: "Gagal memuat daftar kecamatan dan desa",
    };
  }
};

const fetchReportData = async () => {
  if (selectedReportType.value !== "jalan-lingkungan") return null;

  try {
    isLoading.value = true;
    const params = new URLSearchParams();
    if (selectedKecamatan.value)
      params.append("kecamatan", selectedKecamatan.value);
    if (selectedDesa.value) params.append("desa", selectedDesa.value);

    const config = useRuntimeConfig();
    const apiUrl = config.public.apiUrl;
    const response = await fetch(`${apiUrl}/jalan/report?${params}`);
    const result = await response.json();

    if (result.success) {
      reportData.value = result.data;
      return result.data;
    } else {
      throw new Error(result.error || "Failed to fetch report data");
    }
  } catch (error) {
    console.error("Error fetching report data:", error);
    statusMessage.value = {
      type: "error",
      text: "Gagal memuat data laporan",
    };
    return null;
  } finally {
    isLoading.value = false;
  }
};

const onKecamatanChange = () => {
  selectedDesa.value = "";
  clearStatus();
};

const previewReport = async () => {
  // Clear previous status
  clearStatus();

  // Validasi: harus pilih jenis laporan
  if (!selectedReportType.value) {
    statusMessage.value = {
      type: "error",
      text: "Silakan pilih jenis laporan terlebih dahulu",
    };
    return;
  }

  // Validasi: harus pilih kecamatan dan desa untuk laporan jalan lingkungan
  if (selectedReportType.value === "jalan-lingkungan") {
    if (!selectedKecamatan.value) {
      statusMessage.value = {
        type: "error",
        text: "Silakan pilih kecamatan terlebih dahulu",
      };
      return;
    }

    if (!selectedDesa.value) {
      statusMessage.value = {
        type: "error",
        text: "Silakan pilih desa terlebih dahulu",
      };
      return;
    }
  }

  // Check if selected report type is available (only jalan-lingkungan for now)
  if (selectedReportType.value !== "jalan-lingkungan") {
    statusMessage.value = {
      type: "error",
      text: `Laporan ${
        reportTypeLabels[selectedReportType.value]
      } akan segera tersedia. Saat ini hanya laporan Jalan Lingkungan yang tersedia.`,
    };
    return;
  }

  // Set loading state
  isLoading.value = true;

  try {
    // Fetch report data for jalan lingkungan
    const data = await fetchReportData();
    if (!data) return;

    // Set preview data and show modal
    previewData.value = {
      reportInfo: {
        type: selectedReportType.value,
        label: reportTypeLabels[selectedReportType.value],
        location: {
          kecamatan: selectedKecamatan.value,
          desa: selectedDesa.value,
        },
      },
      data: data,
    };
    showPreview.value = true;
  } finally {
    // Reset loading state
    isLoading.value = false;
  }
};

const closePreview = () => {
  showPreview.value = false;
  previewData.value = null;
};

const handlePreviewDownload = () => {
  // Close preview after download
  closePreview();
};

// Clear status message when selection changes
const clearStatus = () => {
  statusMessage.value = null;
};

// Watch for changes to clear status
watch([selectedReportType, selectedKecamatan, selectedDesa], clearStatus);

// Additional watcher for desa to clear status when selected
watch(selectedDesa, (newValue) => {
  if (newValue) {
    clearStatus();
  }
});

// Lifecycle
onMounted(() => {
  fetchLocations();
});
</script>
