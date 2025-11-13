<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        @click="closeModal"
      ></div>

      <!-- Modal panel -->
      <div class="flex min-h-full items-center justify-center p-2 lg:p-4">
        <div
          @click.stop
          class="relative w-full max-w-7xl h-[95vh] lg:h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
        >
        <div
          v-if="isProcessingDownload"
          class="absolute inset-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
          aria-live="assertive"
        >
          <svg class="animate-spin h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24">
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
          <div class="text-center px-6">
            <p class="text-base font-semibold text-gray-800 dark:text-gray-100">
              Sedang memproses laporan...
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Mohon tunggu sebentar, proses ini membutuhkan waktu beberapa detik.
            </p>
          </div>
        </div>
        <!-- Header -->
        <div
          class="bg-blue-600 text-white px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between"
        >
          <h3 class="text-lg lg:text-xl font-bold">Preview Laporan</h3>
          <div class="flex gap-2">
            <button
              @click="downloadPDF"
              :disabled="isDownloadingPDF || isDownloadingExcel"
              class="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              <svg
                v-if="isDownloadingPDF"
                class="animate-spin h-4 w-4"
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
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              {{ isDownloadingPDF ? "Downloading..." : "PDF" }}
            </button>
            <button
              @click="downloadExcel"
              :disabled="isDownloadingPDF || isDownloadingExcel"
              class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              <svg
                v-if="isDownloadingExcel"
                class="animate-spin h-4 w-4"
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
                class="h-4 w-4"
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
              {{ isDownloadingExcel ? "Downloading..." : "Excel" }}
            </button>
            <button
              @click="closeModal"
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
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div
          class="flex-1 overflow-auto p-4 lg:p-6 transition duration-200"
          :class="[
            isProcessingDownload
              ? 'pointer-events-none select-none opacity-40 blur-[1px]'
              : '',
          ]"
          :aria-busy="isProcessingDownload"
        >
          <div
            v-if="previewHTML"
            class="preview-container"
            v-html="previewHTML"
          ></div>
          <div
            v-else
            class="flex items-center justify-center h-64 text-gray-500"
          >
            <div class="text-center">
              <svg
                class="animate-spin h-8 w-8 mx-auto mb-4"
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
              <p>Memuat preview laporan...</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { useReportGenerator } from "~/composables/useReportGenerator.js";
import { useToast } from "~/composables/useToast.js";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  reportData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "download-pdf", "download-excel"]);

const { generatePreviewHTML, downloadReport } = useReportGenerator();
const toast = useToast();

const previewHTML = ref(null);
const isDownloadingPDF = ref(false);
const isDownloadingExcel = ref(false);
const isProcessingDownload = ref(false);

// Generate preview when modal opens
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen && props.reportData) {
      try {
        previewHTML.value = generatePreviewHTML(props.reportData);
      } catch (error) {
        console.error("Error generating preview:", error);
        previewHTML.value = "<p>Error generating preview</p>";
      }
    } else {
      previewHTML.value = null;
    }
  },
  { immediate: true }
);

const closeModal = () => {
  emit("close");
};

const downloadPDF = async () => {
  if (!props.reportData) return;

  isDownloadingPDF.value = true;
  isProcessingDownload.value = true;
  try {
    await nextTick();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => setTimeout(resolve, 50));

    const result = await downloadReport(props.reportData, "pdf");
    if (!result?.success) {
      throw new Error(result?.error || "Gagal memproses PDF");
    }

    emit("download-pdf");
    toast.success("PDF berhasil didownload!");
  } catch (error) {
    console.error("Error downloading PDF:", error);
    toast.error(
      error?.message || "Gagal mendownload PDF. Silakan coba lagi."
    );
  } finally {
    isDownloadingPDF.value = false;
    isProcessingDownload.value = false;
  }
};

const downloadExcel = async () => {
  if (!props.reportData) return;

  isDownloadingExcel.value = true;
  isProcessingDownload.value = true;
  try {
    await nextTick();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => setTimeout(resolve, 50));

    const result = await downloadReport(props.reportData, "xlsx");
    if (!result?.success) {
      throw new Error(result?.error || "Gagal memproses Excel");
    }

    emit("download-excel");
    toast.success("Excel berhasil didownload!");
  } catch (error) {
    console.error("Error downloading Excel:", error);
    toast.error(
      error?.message || "Gagal mendownload Excel. Silakan coba lagi."
    );
  } finally {
    isDownloadingExcel.value = false;
    isProcessingDownload.value = false;
  }
};
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

.preview-container {
  /* Ensure the preview looks like the actual PDF */
  font-family: Arial, sans-serif;
  font-size: 12px;
  line-height: 1.4;
}

.preview-container .data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;
  margin: 10px 0;
}

.preview-container .data-table th {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  padding: 6px;
  text-align: center;
  font-weight: bold;
  font-size: 9px;
}

.preview-container .data-table td {
  border: 1px solid #ddd;
  padding: 5px;
  text-align: left;
  vertical-align: top;
}

.preview-container .data-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.preview-container .condition-baik {
  color: #166534;
  font-weight: bold;
}
.preview-container .condition-sedang {
  color: #854d0e;
  font-weight: bold;
}
.preview-container .condition-rusak-ringan {
  color: #9a3412;
  font-weight: bold;
}
.preview-container .condition-rusak-berat {
  color: #991b1b;
  font-weight: bold;
}
</style>
