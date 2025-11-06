<template>
  <div class="sidebar-panel">
    <!-- Header dengan Logo dan Tombol Close (Mobile) -->
    <div class="sidebar-header">
      <div class="logo-section">
        <div class="logo">
          <div class="logo-image">
            <img
              src="/simantap-logo.svg"
              alt="SIMANTAP Logo"
              class="w-12 h-12 object-contain"
            />
          </div>
          <div class="logo-text">
            <h2>SIMANTAP KUBU RAYA</h2>
            <p class="text-xs text-gray-600">
              Sistem Informasi Manajemen Tata Permukiman
            </p>
          </div>
        </div>
      </div>
      <!-- Close Button (Mobile Only) -->
      <button
        @click="$emit('close')"
        class="close-button md:hidden"
        title="Tutup Sidebar"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <!-- Navigation Tabs -->
    <div class="navigation-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
      >
        <div class="tab-icon">
          <font-awesome-icon :icon="tab.icon" />
        </div>
        <span class="hidden md:inline">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Layer Tab -->
      <div v-if="activeTab === 'layer'" class="tab-panel layer-tab-wrapper">
        <!-- Scrollable Filter Section -->
        <div class="filter-section-scrollable">
          <h4 class="section-title">Filter Data Jalan</h4>

          <div class="form-group">
            <label class="form-label">Pilih Kecamatan</label>
            <select v-model="selectedKecamatan" class="form-select">
              <option value="">Semua Kecamatan</option>
              <option
                v-for="kecamatan in kecamatanOptions"
                :key="kecamatan"
                :value="kecamatan"
              >
                {{ kecamatan }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Pilih Desa</label>
            <select
              v-model="selectedDesa"
              class="form-select"
              :disabled="!selectedKecamatan"
            >
              <option value="">Semua Desa</option>
              <option v-for="desa in desaOptions" :key="desa" :value="desa">
                {{ desa }}
              </option>
            </select>
            <p v-if="!selectedKecamatan" class="text-xs text-gray-500 mt-1">
              Pilih kecamatan terlebih dahulu
            </p>
          </div>

          <div class="form-group">
            <label class="form-label">Pilih Tahun/Periode</label>
            <select v-model="selectedTahun" class="form-select">
              <option value="">Semua Tahun</option>
              <option v-for="tahun in tahunOptions" :key="tahun" :value="tahun">
                {{ tahun }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Pilih Kondisi Material</label>
            <select v-model="selectedKondisi" class="form-select">
              <option value="">Semua Kondisi</option>
              <option
                v-for="kondisi in kondisiOptions"
                :key="kondisi"
                :value="kondisi"
              >
                {{ kondisi }}
              </option>
            </select>
          </div>
        </div>

        <!-- Fixed Apply Button -->
        <div class="filter-button-fixed">
          <button class="apply-button" @click="applyLayer">
            Terapkan Filter
          </button>
        </div>
      </div>

      <!-- Pengaturan Tab -->
      <div v-if="activeTab === 'pengaturan'" class="tab-panel">
        <div class="settings-content">
          <h3>Pengaturan Peta</h3>

          <!-- Controls Row -->
          <div class="grid grid-cols-1 gap-4">
            <!-- Opacity Card -->
            <div
              class="p-4 rounded-xl border border-gray-200 shadow-sm bg-white"
            >
              <div class="text-sm font-semibold text-gray-800 mb-3">
                Opasitas Layer
              </div>
              <div class="flex items-center space-x-3">
                <input
                  type="range"
                  v-model="opacity"
                  min="0"
                  max="100"
                  class="flex-1"
                  @input="emit('opacity-change', parseInt($event.target.value))"
                />
                <span class="text-sm text-gray-600 w-10 text-right"
                  >{{ opacity }}%</span
                >
              </div>
            </div>
          </div>

          <!-- Basemap Gallery -->
          <div
            class="mt-4 p-4 rounded-xl border border-gray-200 shadow-sm bg-white"
          >
            <div class="text-sm font-semibold text-gray-800 mb-3">
              Peta Dasar
            </div>
            <div class="grid grid-cols-1 gap-3">
              <div
                v-for="bm in basemapOptions"
                :key="bm.id"
                @click="selectBasemap(bm.id)"
                class="flex items-center space-x-4 p-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition"
                :class="{ 'ring-2 ring-blue-500': selectedBasemap === bm.id }"
              >
                <img
                  :src="resolveThumbnail(bm.thumbnail)"
                  :alt="bm.label"
                  referrerpolicy="no-referrer"
                  loading="lazy"
                  @error="onThumbError($event, bm)"
                  class="w-20 h-20 object-cover rounded-md bg-gray-100 border border-gray-200"
                />
                <div class="text-gray-700 font-medium">{{ bm.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alat Tab -->
      <div v-if="activeTab === 'alat'" class="tab-panel">
        <div class="tools-content">
          <h3>Alat Peta</h3>
          <div class="tool-buttons">
            <!-- Drawing Tools -->
            <div class="tool-section">
              <h4
                class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                Alat Gambar
              </h4>
              <div class="grid grid-cols-3 gap-2">
                <button
                  @click="activateDrawingTool('polyline')"
                  class="tool-button-small"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="4 17 10 11 16 17 22 11" />
                  </svg>
                  <span>Garis</span>
                </button>
                <button
                  @click="activateDrawingTool('polygon')"
                  class="tool-button-small"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                  <span>Poligon</span>
                </button>
                <button
                  @click="activateDrawingTool('rectangle')"
                  class="tool-button-small"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  </svg>
                  <span>Persegi</span>
                </button>
              </div>
              <div class="grid grid-cols-2 gap-2 mt-2">
                <button
                  @click="activateSelectionMode"
                  class="tool-button-small bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                  </svg>
                  <span>Pilih</span>
                </button>
                <button
                  @click="clearDrawing"
                  class="tool-button-small bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path
                      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                    />
                  </svg>
                  <span>Hapus</span>
                </button>
              </div>

              <!-- Shape Info Section -->
              <div
                v-if="shapeInfo"
                class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <h5
                  class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  {{
                    shapeInfo.type === "polyline" ? "Panjang Area" : "Luas Area"
                  }}
                </h5>
                <p
                  class="text-sm font-bold text-blue-600 dark:text-blue-400 mb-3"
                >
                  {{ shapeInfo.measurement }}
                </p>

                <div class="flex items-center justify-between mb-2">
                  <h5
                    class="text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    GeoJSON
                  </h5>
                  <button
                    @click="copyGeoJSON"
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1"
                    title="Copy GeoJSON"
                  >
                    <FontAwesomeIcon :icon="faCopy" class="text-sm" />
                  </button>
                </div>
                <div>
                  <pre
                    class="text-xs bg-white dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-600 overflow-x-auto max-h-48 overflow-y-auto"
                    >{{ shapeInfo.geojson }}</pre
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useToast } from "~/composables/useToast.js";
import {
  faLayerGroup,
  faCog,
  faTools,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: true,
  },
  currentOpacity: {
    type: Number,
    default: 100,
  },
  currentBasemap: {
    type: String,
    default: "topo",
  },
  shapeInfo: {
    type: Object,
    default: null,
  },
});

// Emits
const emit = defineEmits([
  "hide",
  "close",
  "apply-layer",
  "basemap-change",
  "tool-change",
  "opacity-change",
  "drawing-tool",
  "clear-drawing",
  "selection-mode",
]);

const toast = useToast();

// Mobile detection
const isMobile = () => {
  return window.innerWidth <= 768;
};

// Reactive data
const activeTab = ref("layer");

// Initialize filter values from localStorage or default values
const selectedKecamatan = ref("");
const selectedDesa = ref("");
const selectedTahun = ref("");
const selectedKondisi = ref("");

// Load saved filter values from localStorage
const loadSavedFilters = () => {
  if (typeof window !== "undefined") {
    selectedKecamatan.value = localStorage.getItem("sidebar_kecamatan") || "";
    selectedDesa.value = localStorage.getItem("sidebar_desa") || "";
    selectedTahun.value = localStorage.getItem("sidebar_tahun") || "";
    selectedKondisi.value = localStorage.getItem("sidebar_kondisi") || "";
  }
};

// Save filter values to localStorage
const saveFilters = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("sidebar_kecamatan", selectedKecamatan.value);
    localStorage.setItem("sidebar_desa", selectedDesa.value);
    localStorage.setItem("sidebar_tahun", selectedTahun.value);
    localStorage.setItem("sidebar_kondisi", selectedKondisi.value);
  }
};

const selectedBasemap = ref(props.currentBasemap);
const opacity = ref(props.currentOpacity);

// Options for dropdowns
const kecamatanOptions = ref([]);
const desaOptions = ref([]);
const tahunOptions = ref([]);
const kondisiOptions = ref([]);

// Watch for opacity changes and emit event
watch(opacity, (newOpacity) => {
  emit("opacity-change", newOpacity);
});

// Watch for currentOpacity prop changes to sync local state
watch(
  () => props.currentOpacity,
  (newValue) => {
    opacity.value = newValue;
  }
);

// Watch for currentBasemap prop changes to sync local state
watch(
  () => props.currentBasemap,
  (newValue) => {
    selectedBasemap.value = newValue;
  }
);

// Watch shapeInfo prop for debugging
watch(
  () => props.shapeInfo,
  (newValue) => {
    console.log("[SidebarPanel] shapeInfo prop changed:", newValue);
  },
  { deep: true }
);

// Tabs configuration with Font Awesome icons
const tabs = [
  {
    id: "layer",
    label: "Layer",
    icon: faLayerGroup,
  },
  {
    id: "pengaturan",
    label: "Pengaturan",
    icon: faCog,
  },
  {
    id: "alat",
    label: "Alat",
    icon: faTools,
  },
];

// Get runtime config for API URL
const config = useRuntimeConfig();

if (!config.public.apiUrl && !config.public.apiBaseUrl) {
  console.error(
    "⚠️ NUXT_PUBLIC_API_URL or NUXT_PUBLIC_API_BASE_URL is not set in environment variables!"
  );
}

const apiUrl =
  config.public.apiUrl ||
  (config.public.apiBaseUrl ? `${config.public.apiBaseUrl}/api` : "");

// Fetch kecamatan options from API
const fetchKecamatanOptions = async () => {
  try {
    const response = await fetch(`${apiUrl}/jalan/filters/kecamatan`);
    const data = await response.json();
    if (data.success) {
      kecamatanOptions.value = data.data;
    }
  } catch (error) {
    console.error("Error fetching kecamatan options:", error);
  }
};

// Watch for filter changes and save to localStorage
watch(
  [selectedKecamatan, selectedDesa, selectedTahun, selectedKondisi],
  () => {
    saveFilters();
  },
  { deep: true }
);

// Watch for kecamatan changes to reset desa only when kecamatan actually changes
watch(selectedKecamatan, (newKecamatan, oldKecamatan) => {
  if (newKecamatan !== oldKecamatan) {
    selectedDesa.value = "";
    fetchDesaOptions();
  }
});

// Fetch desa options based on selected kecamatan
const fetchDesaOptions = async () => {
  // Clear desa options if no kecamatan selected
  if (!selectedKecamatan.value) {
    desaOptions.value = [];
    selectedDesa.value = "";
    return;
  }

  try {
    let url = `${apiUrl}/jalan/filters/desa`;
    if (selectedKecamatan.value) {
      url += `?kecamatan=${encodeURIComponent(selectedKecamatan.value)}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    if (data.success) {
      desaOptions.value = data.data;
    }
  } catch (error) {
    console.error("Error fetching desa options:", error);
  }
};

// Fetch tahun options from API
const fetchTahunOptions = async () => {
  try {
    const response = await fetch(`${apiUrl}/jalan/filters/tahun`);
    const data = await response.json();
    if (data.success) {
      tahunOptions.value = data.data;
    }
  } catch (error) {
    console.error("Error fetching tahun options:", error);
  }
};

// Fetch kondisi options from API
const fetchKondisiOptions = async () => {
  try {
    const response = await fetch(`${apiUrl}/jalan/filters/kondisi`);
    const data = await response.json();
    if (data.success) {
      kondisiOptions.value = data.data;
    }
  } catch (error) {
    console.error("Error fetching kondisi options:", error);
  }
};

// Methods
const applyLayer = () => {
  // Emit event to parent component
  emit("apply-layer", {
    kecamatan: selectedKecamatan.value,
    desa: selectedDesa.value,
    tahun: selectedTahun.value,
    kondisi: selectedKondisi.value,
  });

  // Close sidebar on mobile after applying filter
  if (isMobile()) {
    emit("close");
  }
};

const handleBasemapChange = () => {
  // Emit basemap change event
  emit("basemap-change", selectedBasemap.value);

  // Close sidebar on mobile after changing basemap
  if (isMobile()) {
    emit("close");
  }
};

const basemapOptions = [
  {
    id: "satellite",
    label: "Imagery",
    thumbnail: "/basemap/imagery.png",
  },
  {
    id: "hybrid",
    label: "Imagery With Labels",
    thumbnail: "/basemap/imageryWithLabels.png",
  },
  {
    id: "streets",
    label: "Streets",
    thumbnail: "/basemap/streets.png",
  },
  {
    id: "topo",
    label: "Topographic",
    thumbnail: "/basemap/topographic.png",
  },
  {
    id: "terrain",
    label: "Terrain With Labels",
    thumbnail: "/basemap/terrainWithLabels.png",
  },
  {
    id: "gray",
    label: "Light Gray Canvas",
    thumbnail: "/basemap/lightGrayCanvas.png",
  },
  {
    id: "national-geographic",
    label: "National Geographic",
    thumbnail: "/basemap/nationalGeographic.png",
  },
  {
    id: "oceans",
    label: "Ocean",
    thumbnail: "/basemap/ocean.png",
  },
  {
    id: "osm",
    label: "OpenStreetMap",
    thumbnail: "/basemap/openStreetMap.png",
  },
];

const selectBasemap = (id) => {
  selectedBasemap.value = id;
  handleBasemapChange();
};

// Drawing tools
const activateDrawingTool = (tool) => {
  emit("drawing-tool", tool);
  console.log(`Drawing tool activated: ${tool}`);

  // Close sidebar on mobile after activating drawing tool
  if (isMobile()) {
    emit("close");
  }
};

const activateSelectionMode = () => {
  emit("selection-mode");
  console.log("Selection mode activated");

  // Close sidebar on mobile after activating selection mode
  if (isMobile()) {
    emit("close");
  }
};

const clearDrawing = () => {
  emit("clear-drawing");
  console.log("Clear all drawings");

  // Close sidebar on mobile after clearing drawings
  if (isMobile()) {
    emit("close");
  }
};

const copyGeoJSON = () => {
  if (props.shapeInfo && props.shapeInfo.geojson) {
    navigator.clipboard
      .writeText(props.shapeInfo.geojson)
      .then(() => {
        toast.success("GeoJSON copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy GeoJSON:", err);
        toast.error("Failed to copy GeoJSON");
      });
  }
};

// Lifecycle hooks
onMounted(() => {
  // Load saved filter values first
  loadSavedFilters();

  // Then fetch options
  fetchKecamatanOptions();
  fetchDesaOptions();
  fetchTahunOptions();
  fetchKondisiOptions();
});

// Thumbnail error fallback
const onThumbError = (event, bm) => {
  // Inline SVG placeholder (gray chequered)
  event.target.src =
    "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23e5e7eb'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='%239ca3af'%3ENo Img%3C/text%3E%3C/svg%3E";
};

// Normalize/resolve incoming thumbnail URLs so they are image URLs
const resolveThumbnail = (thumbnailUrl) => {
  if (!thumbnailUrl) {
    // Return a placeholder SVG if no thumbnail is provided
    return "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23e5e7eb'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='%239ca3af'%3ENo Img%3C/text%3E%3C/svg%3E";
  }
  // Return the thumbnail URL as-is (it's already a direct image URL)
  return thumbnailUrl;
};
</script>

<style scoped>
.sidebar-panel {
  @apply w-full h-full bg-white border-r border-gray-200 flex flex-col shadow-lg;
}

@media (min-width: 768px) {
  .sidebar-panel {
    @apply w-80;
  }
}

.sidebar-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200;
}

.close-button {
  @apply p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors;
}

.logo-section {
  @apply flex items-center space-x-3;
}

.logo {
  @apply flex items-center space-x-2;
}

.logo-image {
  @apply flex items-center justify-center;
}

.logo-text h2 {
  @apply text-lg font-bold text-gray-800;
}

.navigation-tabs {
  @apply flex border-b border-gray-200;
}

.tab-button {
  @apply flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors;
  min-height: 48px;
}

.tab-button.active {
  @apply text-blue-600 border-b-2 border-blue-600 bg-blue-50;
}

.tab-icon {
  @apply w-5 h-5 flex-shrink-0;
}

.tab-icon svg {
  @apply w-5 h-5;
}

.tab-content {
  @apply flex-1 overflow-y-auto;
}

.tab-panel {
  @apply p-4 space-y-4;
}

/* Layer Tab Wrapper - Flex container for scrollable content + fixed button */
.layer-tab-wrapper {
  @apply flex flex-col h-full p-0 space-y-0;
}

/* Scrollable Filter Section */
.filter-section-scrollable {
  @apply flex-1 overflow-y-auto p-4 space-y-4;
}

/* Fixed Apply Button Container */
.filter-button-fixed {
  @apply sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-select {
  @apply w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium bg-white hover:border-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400;
}

.apply-button {
  @apply w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium;
}

.settings-content,
.tools-content {
  @apply space-y-4;
}

.settings-content h3,
.tools-content h3 {
  @apply text-lg font-semibold text-gray-800 mb-4;
}

.setting-item {
  @apply space-y-2;
}

.setting-item label {
  @apply block text-sm font-medium text-gray-700;
}

.slider {
  @apply w-full;
}

.tool-buttons {
  @apply space-y-4;
}

.tool-section {
  @apply space-y-2;
}

.tool-button {
  @apply flex items-center justify-center space-x-3 w-full p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all;
}

.tool-button svg {
  @apply text-gray-600;
}

.tool-button:hover svg {
  @apply text-blue-600;
}

.tool-button-small {
  @apply flex flex-col items-center justify-center space-y-1 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all text-xs font-medium text-gray-700;
}

.tool-button-small svg {
  @apply text-gray-600;
}

.tool-button-small:hover svg {
  @apply text-blue-600;
}

/* Boundary Section Styles */
.boundary-section,
.filter-section {
  @apply space-y-4;
}

.section-title {
  @apply text-base font-semibold text-gray-800 mb-3;
}

.boundary-toggle-item {
  @apply p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors;
}

.boundary-label {
  @apply flex items-center text-sm font-medium text-gray-700;
}

.boundary-description {
  @apply mt-2 text-xs text-gray-500;
}

/* Toggle Switch Styles */
.toggle-switch {
  @apply relative inline-block w-12 h-6 cursor-pointer;
}

.toggle-switch input {
  @apply opacity-0 w-0 h-0;
}

.toggle-slider {
  @apply absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-all duration-300;
}

.toggle-slider:before {
  @apply absolute content-[''] h-5 w-5 left-0.5 bottom-0.5 bg-white rounded-full transition-all duration-300;
}

.toggle-switch input:checked + .toggle-slider {
  @apply bg-blue-600;
}

.toggle-switch input:checked + .toggle-slider:before {
  @apply transform translate-x-6;
}

.toggle-switch input:focus + .toggle-slider {
  @apply ring-2 ring-blue-300;
}

/* Divider */
.divider {
  @apply border-t border-gray-200 my-4;
}

/* Mobile specific styles - smaller sidebar */
@media (max-width: 767px) {
  .sidebar-panel {
    @apply w-72 max-w-[85vw];
  }

  .sidebar-header {
    @apply p-3;
  }

  .logo-text h2 {
    @apply text-base;
  }

  .logo-text p {
    @apply text-xs;
  }

  .tab-button {
    @apply py-2 px-3 text-xs;
    min-height: 40px;
  }

  .tab-icon {
    @apply w-4 h-4;
  }

  .tab-icon svg {
    @apply w-4 h-4;
  }

  .filter-section-scrollable {
    @apply p-3 space-y-3;
  }

  .form-group {
    @apply space-y-1;
  }

  .form-label {
    @apply text-xs;
  }

  .form-select {
    @apply px-2 py-1.5 text-sm;
  }

  .apply-button {
    @apply py-2 px-3 text-sm;
  }

  .settings-content,
  .tools-content {
    @apply space-y-3;
  }

  .settings-content h3,
  .tools-content h3 {
    @apply text-base mb-3;
  }

  .tool-button {
    @apply p-2 space-x-2;
  }

  .tool-button-small {
    @apply p-2 text-xs;
  }

  .section-title {
    @apply text-sm mb-2;
  }

  .boundary-toggle-item {
    @apply p-3;
  }

  .boundary-label {
    @apply text-xs;
  }

  .boundary-description {
    @apply text-xs;
  }

  .filter-button-fixed {
    @apply p-3;
  }
}
</style>
