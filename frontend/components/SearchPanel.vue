<template>
  <div
    class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-80 h-full overflow-y-auto custom-scrollbar transition-colors duration-300"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Pencarian Lokasi
      </h3>
      <button
        @click="$emit('close')"
        class="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="text-gray-500 dark:text-gray-400"
        >
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Search Input -->
    <div class="mb-6">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari alamat, koordinat, atau lokasi..."
          class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          @keyup.enter="performSearch"
        />
        <svg
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
      <button
        @click="performSearch"
        :disabled="!searchQuery.trim()"
        class="w-full mt-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Cari Lokasi
      </button>
    </div>

    <!-- Quick Search Categories -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Kategori Pencarian
      </h4>
      <div class="space-y-2">
        <button
          v-for="category in searchCategories"
          :key="category.id"
          @click="selectCategory(category)"
          class="w-full flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
            :style="{
              backgroundColor: category.color + '20',
              color: category.color,
            }"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path :d="category.icon" />
            </svg>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ category.name }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ category.description }}
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="searchResults.length > 0" class="mb-6">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Hasil Pencarian
      </h4>
      <div class="space-y-2 max-h-64 overflow-y-auto">
        <div
          v-for="result in searchResults"
          :key="result.id"
          @click="selectResult(result)"
          class="p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer transition-colors"
        >
          <div class="flex items-start">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="text-primary-500 mt-1 mr-2 flex-shrink-0"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
              />
            </svg>
            <div class="flex-1">
              <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ result.name }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ result.address }}
              </div>
              <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {{ result.coordinates.lat.toFixed(6) }},
                {{ result.coordinates.lng.toFixed(6) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Coordinate Input -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Input Koordinat
      </h4>
      <div class="space-y-3">
        <div>
          <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Latitude
          </label>
          <input
            v-model="coordinates.lat"
            type="number"
            step="any"
            placeholder="-0.0263"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Longitude
          </label>
          <input
            v-model="coordinates.lng"
            type="number"
            step="any"
            placeholder="109.3425"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <button
          @click="goToCoordinates"
          :disabled="!coordinates.lat || !coordinates.lng"
          class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Pergi ke Koordinat
        </button>
      </div>
    </div>

    <!-- Recent Searches -->
    <div v-if="recentSearches.length > 0">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Pencarian Terakhir
      </h4>
      <div class="space-y-1">
        <button
          v-for="search in recentSearches"
          :key="search.id"
          @click="selectRecentSearch(search)"
          class="w-full flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="text-gray-400 mr-2"
          >
            <path
              d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
            />
          </svg>
          <span class="text-sm text-gray-600 dark:text-gray-400 truncate">
            {{ search.query }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useToast } from "~/composables/useToast.js";

const emit = defineEmits([
  "close",
  "location-selected",
  "coordinates-selected",
]);

const { isAuthenticated, canAccessLayers } = useAuth();
const toast = useToast();

// Search state
const searchQuery = ref("");
const searchResults = ref([]);
const coordinates = reactive({ lat: "", lng: "" });
const isSearching = ref(false);
const recentSearches = ref([
  { id: 1, query: "Sungai Kakap" },
  { id: 2, query: "Kali Mas" },
  { id: 3, query: "Jl. Parit" },
]);

// Search categories - updated with real data categories
const searchCategories = ref([
  {
    id: "kecamatan",
    name: "Kecamatan",
    description: "Pencarian berdasarkan kecamatan",
    color: "#3c8dbc",
    icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  },
  {
    id: "jalan",
    name: "Nama Jalan",
    description: "Pencarian berdasarkan nama jalan",
    color: "#f39c12",
    icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z",
  },
  {
    id: "desa",
    name: "Desa/Kelurahan",
    description: "Pencarian berdasarkan desa",
    color: "#e74c3c",
    icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  },
  {
    id: "kondisi",
    name: "Kondisi Jalan",
    description: "Pencarian berdasarkan kondisi",
    color: "#27ae60",
    icon: "M19 3H5c-1.66 0-3 1.34-3 3v12c0 1.66 1.34 3 3 3h14c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z",
  },
]);

// Methods
const performSearch = async () => {
  if (!searchQuery.value.trim()) return;

  if (!isAuthenticated.value || !canAccessLayers.value) {
    toast.warning(
      "Silakan login terlebih dahulu untuk menggunakan fitur pencarian."
    );
    return;
  }

  isSearching.value = true;

  try {
    // Simple search implementation - can be enhanced later with API calls
    const mockResults = [
      {
        id: "search_1",
        name: `Hasil pencarian untuk "${searchQuery.value}"`,
        address: "Kabupaten Kubu Raya, Kalimantan Barat",
        coordinates: { lat: -0.0263, lng: 109.3425 },
        type: "search",
        layer: "Pencarian",
      },
    ];

    searchResults.value = mockResults;

    // Add to recent searches
    const newSearch = {
      id: Date.now(),
      query: searchQuery.value,
    };
    recentSearches.value.unshift(newSearch);
    if (recentSearches.value.length > 5) {
      recentSearches.value.pop();
    }

    // Save to localStorage
    localStorage.setItem(
      "simantap_recent_searches",
      JSON.stringify(recentSearches.value)
    );
  } catch (error) {
    console.error("Search error:", error);
    toast.error("Terjadi kesalahan saat melakukan pencarian.");
  } finally {
    isSearching.value = false;
  }
};

const selectCategory = (category) => {
  let searchTerm = "";

  switch (category.id) {
    case "kecamatan":
      searchTerm = "Kecamatan";
      break;
    case "jalan":
      searchTerm = "Jl.";
      break;
    case "desa":
      searchTerm = "Desa";
      break;
    case "kondisi":
      searchTerm = "Baik";
      break;
    default:
      searchTerm = category.name;
  }

  searchQuery.value = searchTerm;
  performSearch();
};

const selectResult = (result) => {
  emit("location-selected", result);

  // Add to recent searches
  const newSearch = {
    id: Date.now(),
    query: result.name,
  };
  recentSearches.value.unshift(newSearch);
  if (recentSearches.value.length > 5) {
    recentSearches.value.pop();
  }
  localStorage.setItem(
    "simantap_recent_searches",
    JSON.stringify(recentSearches.value)
  );
};

const selectRecentSearch = (search) => {
  searchQuery.value = search.query;
  performSearch();
};

const goToCoordinates = () => {
  if (coordinates.lat && coordinates.lng) {
    emit("coordinates-selected", {
      lat: parseFloat(coordinates.lat),
      lng: parseFloat(coordinates.lng),
    });
  }
};

// Load recent searches from localStorage
onMounted(() => {
  const saved = localStorage.getItem("simantap_recent_searches");
  if (saved) {
    try {
      recentSearches.value = JSON.parse(saved);
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  }
});
</script>
