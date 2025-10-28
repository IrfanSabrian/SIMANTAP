<template>
  <div class="space-y-6">
    <!-- Key Metrics Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <!-- Total Panjang Jalan -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Panjang Jalan
            </p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ formatDistanceShort(stats.totalLength) }}
            </p>
          </div>
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <svg
              class="w-6 h-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              ></path>
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-gray-500 dark:text-gray-400"
            >Total Ruas: {{ formatNumber(stats.totalRoads) }}</span
          >
        </div>
      </div>

      <!-- Kondisi Baik -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Kondisi Baik
            </p>
            <p class="text-3xl font-bold text-green-600 dark:text-green-400">
              {{ formatDistanceShort(conditionLengthStats.baik) }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ getPercentage(conditionLengthStats.baik, stats.totalLength) }}%
              dari total panjang
            </p>
          </div>
          <div class="p-3 bg-green-100 dark:bg-green-900 rounded-full">
            <svg
              class="w-6 h-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Kondisi Sedang -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Kondisi Sedang
            </p>
            <p class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {{ formatDistanceShort(conditionLengthStats.sedang) }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{
                getPercentage(conditionLengthStats.sedang, stats.totalLength)
              }}% dari total panjang
            </p>
          </div>
          <div class="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
            <svg
              class="w-6 h-6 text-yellow-600 dark:text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Rusak Ringan -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Rusak Ringan
            </p>
            <p class="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {{ formatDistanceShort(conditionLengthStats.rusakRingan) }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{
                getPercentage(
                  conditionLengthStats.rusakRingan,
                  stats.totalLength
                )
              }}% dari total panjang
            </p>
          </div>
          <div class="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
            <svg
              class="w-6 h-6 text-orange-600 dark:text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Rusak Berat -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Rusak Berat
            </p>
            <p class="text-3xl font-bold text-red-600 dark:text-red-400">
              {{ formatDistanceShort(conditionLengthStats.rusakBerat) }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{
                getPercentage(
                  conditionLengthStats.rusakBerat,
                  stats.totalLength
                )
              }}% dari total panjang
            </p>
          </div>
          <div class="p-3 bg-red-100 dark:bg-red-900 rounded-full">
            <svg
              class="w-6 h-6 text-red-600 dark:text-red-400"
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
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Condition Distribution Chart -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Distribusi Panjang Jalan per Kondisi
        </h3>
        <div class="h-80 relative">
          <canvas ref="conditionChart"></canvas>
          <div
            v-if="!conditionStats || Object.keys(conditionStats).length === 0"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div class="text-center">
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"
              ></div>
              <p class="text-gray-500 dark:text-gray-400">Memuat data...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Kecamatan Distribution Chart -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Panjang Jalan per Kecamatan
        </h3>
        <div class="h-80 relative">
          <canvas ref="kecamatanChart"></canvas>
          <div
            v-if="!kecamatanStats || kecamatanStats.length === 0"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div class="text-center">
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"
              ></div>
              <p class="text-gray-500 dark:text-gray-400">Memuat data...</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Analysis Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Kecamatan dengan Kondisi Terburuk -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Kecamatan dengan Kondisi Terburuk
        </h3>
        <div class="space-y-3">
          <div
            v-for="(kecamatan, index) in worstConditionKecamatan"
            :key="kecamatan.kecamatan"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center"
              >
                <span
                  class="text-sm font-bold text-red-600 dark:text-red-400"
                  >{{ index + 1 }}</span
                >
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ kecamatan.kecamatan }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ kecamatan.totalRoads }} ruas total
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold text-red-600 dark:text-red-400">
                {{ kecamatan.rusakPercentage }}%
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">rusak</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Prioritas Perbaikan -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Prioritas Perbaikan
        </h3>
        <div class="space-y-4">
          <div
            class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
          >
            <div class="flex items-center space-x-2 mb-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <h4 class="font-semibold text-red-800 dark:text-red-200">
                Rusak Berat
              </h4>
            </div>
            <p class="text-sm text-red-700 dark:text-red-300">
              {{ conditionStats.rusakBerat || 0 }} ruas jalan memerlukan
              perbaikan segera
            </p>
            <p class="text-xs text-red-600 dark:text-red-400 mt-1">
              Prioritas tertinggi - perbaikan mendesak
            </p>
          </div>

          <div
            class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
          >
            <div class="flex items-center space-x-2 mb-2">
              <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
              <h4 class="font-semibold text-orange-800 dark:text-orange-200">
                Rusak Ringan
              </h4>
            </div>
            <p class="text-sm text-orange-700 dark:text-orange-300">
              {{ conditionStats.rusakRingan || 0 }} ruas jalan perlu perawatan
              rutin
            </p>
            <p class="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Prioritas menengah - perawatan preventif
            </p>
          </div>

          <div
            class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
          >
            <div class="flex items-center space-x-2 mb-2">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <h4 class="font-semibold text-yellow-800 dark:text-yellow-200">
                Kondisi Sedang
              </h4>
            </div>
            <p class="text-sm text-yellow-700 dark:text-yellow-300">
              {{ conditionStats.sedang || 0 }} ruas jalan perlu monitoring
              berkala
            </p>
            <p class="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              Prioritas rendah - monitoring rutin
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Road Condition by District -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Kondisi Jalan per Kecamatan
      </h3>
      <div class="h-80 relative">
        <canvas ref="conditionByDistrictChart"></canvas>
        <div
          v-if="!kecamatanStats || kecamatanStats.length === 0"
          class="absolute inset-0 flex items-center justify-center"
        >
          <div class="text-center">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"
            ></div>
            <p class="text-gray-500 dark:text-gray-400">Memuat data...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Material Analysis -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Analisis Material Jalan
        </h3>

        <!-- Filter Controls -->
        <div class="flex flex-col sm:flex-row gap-3">
          <select
            v-model="selectedKecamatan"
            @change="fetchMaterialStats"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="">Semua Kecamatan</option>
            <option v-for="kec in kecamatanList" :key="kec" :value="kec">
              {{ kec }}
            </option>
          </select>

          <select
            v-model="selectedDesa"
            @change="fetchMaterialStats"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
            :disabled="!selectedKecamatan"
          >
            <option value="">Semua Desa</option>
            <option v-for="desa in desaList" :key="desa" :value="desa">
              {{ desa }}
            </option>
          </select>

          <button
            @click="resetFilters"
            class="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          >
            Reset
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="material in filteredMaterialStats.length > 0
            ? filteredMaterialStats
            : materialStats"
          :key="material.material"
          class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium text-gray-900 dark:text-white">
              {{ material.material }}
            </h4>
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >{{ material.totalRoads }} ruas</span
            >
          </div>
          <div class="space-y-2">
            <div
              v-for="(condition, key) in material.conditions"
              :key="key"
              class="flex justify-between text-sm"
            >
              <span class="text-gray-600 dark:text-gray-400">{{ key }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{
                condition.count
              }}</span>
            </div>
          </div>
          <div class="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Total: {{ formatDistance(material.totalLength) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Insights -->
    <div
      class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700"
    >
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Insights & Rekomendasi
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">
            Kondisi Infrastruktur
          </h4>
          <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>
              • {{ getPercentage(conditionStats.baik, stats.totalRoads) }}%
              jalan dalam kondisi baik
            </li>
            <li>
              •
              {{ getPercentage(conditionStats.rusakRingan, stats.totalRoads) }}%
              jalan rusak ringan
            </li>
            <li>
              •
              {{ getPercentage(conditionStats.rusakBerat, stats.totalRoads) }}%
              jalan rusak berat
            </li>
            <li>
              • Rata-rata panjang jalan:
              {{ formatDistance(stats.totalLength / stats.totalRoads) }}
            </li>
          </ul>
        </div>
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">
            Prioritas Perbaikan
          </h4>
          <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>
              • {{ conditionStats.rusakBerat || 0 }} ruas jalan rusak berat
              perlu perbaikan segera
            </li>
            <li>
              • {{ conditionStats.rusakRingan || 0 }} ruas jalan rusak ringan
              perlu perawatan
            </li>
            <li>
              • Fokus pada {{ worstConditionKecamatan[0]?.kecamatan }} ({{
                worstConditionKecamatan[0]?.rusakPercentage
              }}% rusak)
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

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
  yearStats: {
    type: Array,
    default: () => [],
  },
  materialStats: {
    type: Array,
    default: () => [],
  },
  kecamatanList: {
    type: Array,
    default: () => [],
  },
});

const conditionChart = ref(null);
const kecamatanChart = ref(null);
const conditionByDistrictChart = ref(null);

// Chart instances for cleanup
let conditionChartInstance = null;
let kecamatanChartInstance = null;
let conditionByDistrictChartInstance = null;

// Filter state
const selectedKecamatan = ref("");
const selectedDesa = ref("");
const desaList = ref([]);
const filteredMaterialStats = ref([]);

// Computed properties
const worstConditionKecamatan = computed(() => {
  return [...props.kecamatanStats]
    .map((kecamatan) => {
      const totalRusak =
        (kecamatan.conditions["Rusak Ringan"]?.count || 0) +
        (kecamatan.conditions["Rusak Berat"]?.count || 0);
      const rusakPercentage =
        kecamatan.totalRoads > 0
          ? ((totalRusak / kecamatan.totalRoads) * 100).toFixed(1)
          : 0;

      return {
        ...kecamatan,
        totalRusak,
        rusakPercentage: parseFloat(rusakPercentage),
      };
    })
    .sort((a, b) => b.rusakPercentage - a.rusakPercentage)
    .slice(0, 5);
});

// Length-based condition stats
const conditionLengthStats = computed(() => {
  if (!props.kecamatanStats || props.kecamatanStats.length === 0) {
    return {
      baik: 0,
      sedang: 0,
      rusakRingan: 0,
      rusakBerat: 0,
    };
  }

  let baik = 0;
  let sedang = 0;
  let rusakRingan = 0;
  let rusakBerat = 0;

  props.kecamatanStats.forEach((kecamatan) => {
    baik += kecamatan.conditions["Baik"]?.length || 0;
    sedang += kecamatan.conditions["Sedang"]?.length || 0;
    rusakRingan += kecamatan.conditions["Rusak Ringan"]?.length || 0;
    rusakBerat += kecamatan.conditions["Rusak Berat"]?.length || 0;
  });

  return {
    baik,
    sedang,
    rusakRingan,
    rusakBerat,
  };
});

// Methods
const formatNumber = (num) => {
  if (!num) return "0";
  return new Intl.NumberFormat("id-ID").format(num);
};

const formatDistance = (meters) => {
  if (!meters) return "0 m";
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${meters.toFixed(0)} m`;
};

const formatDistanceShort = (meters) => {
  if (!meters) return "0m";
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}km`;
  }
  return `${meters.toFixed(0)}m`;
};

const getPercentage = (value, total) => {
  if (!total || total === 0) return "0";
  return ((value / total) * 100).toFixed(1);
};

const getMostUsedMaterial = () => {
  if (!props.materialStats.length) return "Tidak ada data";
  const sorted = [...props.materialStats].sort(
    (a, b) => b.totalRoads - a.totalRoads
  );
  return sorted[0]?.material || "Tidak ada data";
};

// Filter methods
const fetchMaterialStats = async () => {
  try {
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiUrl;
    let url = `${apiUrl}/jalan/stats/material-kondisi`;
    const params = new URLSearchParams();

    if (selectedKecamatan.value) {
      params.append("kecamatan", selectedKecamatan.value);
    }
    if (selectedDesa.value) {
      params.append("desa", selectedDesa.value);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.success) {
      filteredMaterialStats.value = data.data;
    }
  } catch (error) {
    console.error("Error fetching material stats:", error);
  }
};

const fetchDesaList = async () => {
  if (!selectedKecamatan.value) {
    desaList.value = [];
    return;
  }

  try {
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiUrl;
    const response = await fetch(
      `${apiUrl}/jalan/filters/desa?kecamatan=${selectedKecamatan.value}`
    );
    const data = await response.json();

    if (data.success) {
      desaList.value = data.data;
    }
  } catch (error) {
    console.error("Error fetching desa list:", error);
  }
};

const resetFilters = () => {
  selectedKecamatan.value = "";
  selectedDesa.value = "";
  desaList.value = [];
  filteredMaterialStats.value = props.materialStats;
};

// Chart creation methods
const createConditionChart = () => {
  if (!conditionChart.value) return;

  // Destroy existing chart
  if (conditionChartInstance) {
    conditionChartInstance.destroy();
  }

  const ctx = conditionChart.value.getContext("2d");

  conditionChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Baik", "Sedang", "Rusak Ringan", "Rusak Berat"],
      datasets: [
        {
          data: [
            conditionLengthStats.value.baik || 0,
            conditionLengthStats.value.sedang || 0,
            conditionLengthStats.value.rusakRingan || 0,
            conditionLengthStats.value.rusakBerat || 0,
          ],
          backgroundColor: [
            "rgba(34, 197, 94, 0.8)",
            "rgba(251, 191, 36, 0.8)",
            "rgba(249, 115, 22, 0.8)",
            "rgba(239, 68, 68, 0.8)",
          ],
          borderColor: [
            "rgba(34, 197, 94, 1)",
            "rgba(251, 191, 36, 1)",
            "rgba(249, 115, 22, 1)",
            "rgba(239, 68, 68, 1)",
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            usePointStyle: true,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.parsed;
              const formatted = formatDistanceShort(value);
              return `${context.label}: ${formatted}`;
            },
          },
        },
      },
    },
  });
};

const createKecamatanChart = () => {
  if (!kecamatanChart.value) return;

  // Destroy existing chart
  if (kecamatanChartInstance) {
    kecamatanChartInstance.destroy();
  }

  const ctx = kecamatanChart.value.getContext("2d");
  // Show all kecamatan, not just top 5
  const allKecamatan = [...props.kecamatanStats].sort(
    (a, b) => (b.totalLength || 0) - (a.totalLength || 0)
  );

  kecamatanChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: allKecamatan.map((k) => k.kecamatan),
      datasets: [
        {
          label: "Panjang (km)",
          data: allKecamatan.map((k) => (k.totalLength || 0) / 1000),
          backgroundColor: "rgba(99, 102, 241, 0.8)",
          borderColor: "rgba(99, 102, 241, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Panjang (km)",
          },
          ticks: {
            callback: function (value) {
              return value.toFixed(1) + "km";
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            afterLabel: function (context) {
              const kecamatan = topKecamatan[context.dataIndex];
              return [
                `Total Ruas: ${kecamatan.totalRoads}`,
                `Total Panjang: ${formatDistanceShort(kecamatan.totalLength)}`,
              ];
            },
          },
        },
      },
    },
  });
};

const createConditionByDistrictChart = () => {
  if (!conditionByDistrictChart.value) return;

  // Destroy existing chart
  if (conditionByDistrictChartInstance) {
    conditionByDistrictChartInstance.destroy();
  }

  const ctx = conditionByDistrictChart.value.getContext("2d");
  const data = props.kecamatanStats; // Show all kecamatan

  if (!data || data.length === 0) return;

  conditionByDistrictChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map((k) => k.kecamatan),
      datasets: [
        {
          label: "Baik",
          data: data.map((k) => (k.conditions["Baik"]?.length || 0) / 1000),
          backgroundColor: "rgba(34, 197, 94, 0.8)",
          borderColor: "rgba(34, 197, 94, 1)",
          borderWidth: 1,
        },
        {
          label: "Sedang",
          data: data.map((k) => (k.conditions["Sedang"]?.length || 0) / 1000),
          backgroundColor: "rgba(251, 191, 36, 0.8)",
          borderColor: "rgba(251, 191, 36, 1)",
          borderWidth: 1,
        },
        {
          label: "Rusak Ringan",
          data: data.map(
            (k) => (k.conditions["Rusak Ringan"]?.length || 0) / 1000
          ),
          backgroundColor: "rgba(249, 115, 22, 0.8)",
          borderColor: "rgba(249, 115, 22, 1)",
          borderWidth: 1,
        },
        {
          label: "Rusak Berat",
          data: data.map(
            (k) => (k.conditions["Rusak Berat"]?.length || 0) / 1000
          ),
          backgroundColor: "rgba(239, 68, 68, 0.8)",
          borderColor: "rgba(239, 68, 68, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: "Kecamatan",
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45,
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          title: {
            display: true,
            text: "Panjang Jalan (km)",
          },
          ticks: {
            callback: function (value) {
              return value.toFixed(1) + "km";
            },
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 11,
            },
          },
        },
        tooltip: {
          callbacks: {
            afterLabel: function (context) {
              const kecamatan = data[context.dataIndex];
              return [
                `Total Ruas: ${kecamatan.totalRoads}`,
                `Total Panjang: ${formatDistanceShort(kecamatan.totalLength)}`,
              ];
            },
          },
        },
      },
    },
  });
};

// Function to create all charts
const createAllCharts = () => {
  // Add small delay to ensure DOM is ready
  setTimeout(() => {
    if (props.conditionStats && Object.keys(props.conditionStats).length > 0) {
      createConditionChart();
    }
    if (props.kecamatanStats && props.kecamatanStats.length > 0) {
      createKecamatanChart();
      createConditionByDistrictChart();
    }
  }, 50);
};

// Watchers
watch(selectedKecamatan, () => {
  selectedDesa.value = "";
  fetchDesaList();
  fetchMaterialStats();
});

watch(selectedDesa, () => {
  fetchMaterialStats();
});

// Watch for props changes to recreate charts when data is available
watch(
  () => [props.conditionStats, props.kecamatanStats],
  (newValues) => {
    const [conditionStats, kecamatanStats] = newValues;

    // Only recreate charts if we have data
    if (
      (conditionStats && Object.keys(conditionStats).length > 0) ||
      (kecamatanStats && kecamatanStats.length > 0)
    ) {
      nextTick(() => {
        createAllCharts();
      });
    }
  },
  { deep: true, immediate: false }
);

onMounted(async () => {
  await nextTick();

  // Initialize filtered data
  filteredMaterialStats.value = props.materialStats;

  // Create charts with delay to ensure canvas elements are rendered
  setTimeout(() => {
    createAllCharts();
  }, 100);
});
</script>
