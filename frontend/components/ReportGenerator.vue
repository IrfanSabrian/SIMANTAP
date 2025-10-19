<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
  >
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
    >
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Generator Laporan
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Pilih jenis laporan untuk melihat preview dan download
        </p>
      </div>
    </div>

    <!-- Report Type Selection -->
    <div class="space-y-6">
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4"
        >
          Pilih Jenis Laporan
        </label>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="reportType in availableReportTypes"
            :key="reportType.value"
            @click="selectReportType(reportType.value)"
            :class="[
              'p-4 rounded-lg border-2 text-left transition-all duration-200 group hover:shadow-md',
              selectedReportType === reportType.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-600',
            ]"
          >
            <div class="flex items-start gap-3">
              <div
                :class="[
                  'p-2 rounded-lg transition-colors',
                  selectedReportType === reportType.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/30',
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
              <div class="flex-1">
                <div class="font-semibold text-sm mb-1">
                  {{ reportType.label }}
                </div>
                <div
                  class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed"
                >
                  {{ reportType.description }}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Location Selection for Jalan Lingkungan -->
    <div v-if="selectedReportType === 'jalan-lingkungan'" class="mt-6">
      <!-- Info Message -->
      <div
        class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
      >
        <div class="flex items-start gap-3">
          <svg
            class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
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
          <div>
            <h4
              class="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1"
            >
              Pilih Lokasi untuk Laporan
            </h4>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              Untuk laporan jalan lingkungan, Anda harus memilih kecamatan dan
              desa terlebih dahulu sebelum dapat melihat preview laporan.
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Pilih Kecamatan <span class="text-red-500">*</span>
          </label>
          <select
            v-model="selectedKecamatan"
            @change="onKecamatanChange"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
            Pilih Desa <span class="text-red-500">*</span>
          </label>
          <select
            v-model="selectedDesa"
            :disabled="!selectedKecamatan"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
          >
            <option value="">Pilih Desa</option>
            <option v-for="desa in availableDesa" :key="desa" :value="desa">
              {{ desa }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Preview Button -->
    <div class="mt-8">
      <button
        @click="previewReport"
        :disabled="isPreviewDisabled || isLoading"
        class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg font-semibold transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
      >
        <svg
          v-if="isLoading"
          class="animate-spin h-6 w-6"
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
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          ></path>
        </svg>
        {{
          isLoading
            ? "Memuat Preview..."
            : selectedReportType === "jalan-lingkungan" && isPreviewDisabled
            ? "Pilih Kecamatan dan Desa Terlebih Dahulu"
            : "Lihat Preview Laporan"
        }}
      </button>
    </div>

    <!-- Status Messages -->
    <div
      v-if="statusMessage"
      class="mt-4 p-3 rounded-lg"
      :class="
        statusMessage.type === 'error'
          ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
          : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
      "
    >
      {{ statusMessage.text }}
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
      "Laporan kondisi dan data jalan lingkungan di wilayah terpilih",
  },
  {
    value: "jembatan-lingkungan",
    label: "Jembatan Lingkungan",
    description:
      "Laporan kondisi dan data jembatan lingkungan di wilayah terpilih",
  },
  {
    value: "drainase-lingkungan",
    label: "Drainase Lingkungan",
    description:
      "Laporan kondisi dan data drainase lingkungan di wilayah terpilih",
  },
  {
    value: "kawasan-permukiman",
    label: "Kawasan Permukiman",
    description:
      "Laporan kondisi dan data kawasan permukiman di wilayah terpilih",
  },
  {
    value: "rumah-layak-tidak-hunian",
    label: "Rumah Tidak Layak Huni",
    description:
      "Laporan kondisi dan data rumah tidak layak huni di wilayah terpilih",
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
const isPreviewDisabled = computed(() => {
  if (!selectedReportType.value) return true;

  // Untuk laporan jalan lingkungan, kecamatan dan desa harus dipilih
  if (selectedReportType.value === "jalan-lingkungan") {
    return !selectedKecamatan.value || !selectedDesa.value;
  }

  // Untuk laporan jenis lain, hanya perlu jenis laporan
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
  clearStatus(); // Clear status message when kecamatan changes
};

const previewReport = async () => {
  if (!selectedReportType.value) {
    statusMessage.value = {
      type: "error",
      text: "Silakan pilih jenis laporan terlebih dahulu",
    };
    return;
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

  // Validasi khusus untuk laporan jalan lingkungan - harus pilih kecamatan dan desa
  if (selectedReportType.value === "jalan-lingkungan") {
    if (!selectedKecamatan.value) {
      statusMessage.value = {
        type: "error",
        text: "Silakan pilih kecamatan terlebih dahulu untuk laporan jalan lingkungan",
      };
      return;
    }

    if (!selectedDesa.value) {
      statusMessage.value = {
        type: "error",
        text: "Silakan pilih desa terlebih dahulu untuk laporan jalan lingkungan",
      };
      return;
    }
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
