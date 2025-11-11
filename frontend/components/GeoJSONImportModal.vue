<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            @click="closeModal"
          ></div>

          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
            >&#8203;</span
          >

          <div
            class="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full"
          >
            <!-- Header -->
            <div
              class="bg-blue-600 text-white px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <h3 class="text-lg lg:text-xl font-bold">
                  Import Data dari GeoJSON
                </h3>
              </div>
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
                  />
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <!-- Left Side - Import Form -->
              <div
                class="w-full lg:w-1/2 border-r-0 lg:border-r border-b lg:border-b-0 border-gray-200 dark:border-gray-700 order-2 lg:order-1 flex flex-col"
              >
                <!-- Scrollable Content -->
                <div class="flex-1 overflow-y-auto p-4 lg:p-6">
                  <!-- File Upload Section -->
                  <div class="space-y-6">
                    <!-- File Upload -->
                    <div>
                      <h4
                        class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                      >
                        Upload File GeoJSON
                      </h4>
                      <div
                        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
                      >
                        <input
                          ref="fileInput"
                          type="file"
                          accept=".geojson,.json"
                          @change="handleFileUpload"
                          class="hidden"
                        />
                        <div
                          v-if="!selectedFile"
                          @click="$refs.fileInput.click()"
                          class="cursor-pointer"
                        >
                          <svg
                            class="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          <p
                            class="mt-2 text-sm text-gray-600 dark:text-gray-400"
                          >
                            Klik untuk memilih file GeoJSON
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-500">
                            Format: .geojson atau .json
                          </p>
                        </div>
                        <div v-else class="text-center">
                          <svg
                            class="mx-auto h-12 w-12 text-green-400"
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
                          <p
                            class="mt-2 text-sm text-gray-900 dark:text-white font-medium"
                          >
                            {{ selectedFile.name }}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-500">
                            {{ (selectedFile.size / 1024).toFixed(1) }} KB
                          </p>
                          <button
                            @click="removeFile"
                            class="mt-2 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Hapus File
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Field Mapping Instructions -->
                    <div>
                      <h4
                        class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                      >
                        Mapping Kolom GeoJSON
                      </h4>
                      <div
                        class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"
                      >
                        <p
                          class="text-sm text-blue-800 dark:text-blue-200 mb-3"
                        >
                          Pastikan file GeoJSON memiliki properti dengan nama
                          berikut:
                        </p>
                        <div
                          class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs"
                        >
                          <div class="flex justify-between">
                            <span class="text-blue-700 dark:text-blue-300"
                              >No_Ruas:</span
                            >
                            <span
                              class="text-blue-900 dark:text-blue-100 font-mono"
                              >No_Ruas</span
                            >
                          </div>
                          <div class="flex justify-between">
                            <span class="text-blue-700 dark:text-blue-300"
                              >Nama_Jalan:</span
                            >
                            <span
                              class="text-blue-900 dark:text-blue-100 font-mono"
                              >Nama_Jalan</span
                            >
                          </div>
                          <div class="flex justify-between">
                            <span class="text-blue-700 dark:text-blue-300"
                              >Kecamatan:</span
                            >
                            <span
                              class="text-blue-900 dark:text-blue-100 font-mono"
                              >Kecamatan</span
                            >
                          </div>
                          <div class="flex justify-between">
                            <span class="text-blue-700 dark:text-blue-300"
                              >Desa:</span
                            >
                            <span
                              class="text-blue-900 dark:text-blue-100 font-mono"
                              >Desa</span
                            >
                          </div>
                          <div class="flex justify-between">
                            <span class="text-blue-700 dark:text-blue-300"
                              >Panjang_M:</span
                            >
                            <span
                              class="text-blue-900 dark:text-blue-100 font-mono"
                              >Panjang_M</span
                            >
                          </div>
                          <div class="flex justify-between">
                            <span class="text-blue-700 dark:text-blue-300"
                              >lebar_m:</span
                            >
                            <span
                              class="text-blue-900 dark:text-blue-100 font-mono"
                              >lebar_m</span
                            >
                          </div>
                          <div class="flex justify-between">
                            <span class="text-blue-700 dark:text-blue-300"
                              >Kondisi:</span
                            >
                            <span
                              class="text-blue-900 dark:text-blue-100 font-mono"
                              >Kondisi</span
                            >
                          </div>
                          <div class="flex justify-between">
                            <span class="text-blue-700 dark:text-blue-300"
                              >Keterangan:</span
                            >
                            <span
                              class="text-blue-900 dark:text-blue-100 font-mono"
                              >Keterangan</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Import Button -->
                    <div v-if="selectedFile && parsedData.length > 0">
                      <button
                        @click="importData"
                        :disabled="importing"
                        class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                      >
                        <svg
                          v-if="importing"
                          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        {{
                          importing
                            ? "Mengimport..."
                            : `Import ${parsedData.length} Data`
                        }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Side - Data Preview -->
              <div class="w-full lg:w-1/2 relative order-1 lg:order-2">
                <div class="h-64 lg:h-full overflow-y-auto p-4 lg:p-6">
                  <div
                    v-if="!parsedData.length"
                    class="flex items-center justify-center h-full"
                  >
                    <div class="text-center">
                      <svg
                        class="mx-auto h-12 w-12 text-gray-400"
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
                      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Upload file GeoJSON untuk melihat preview data
                      </p>
                    </div>
                  </div>
                  <div v-else>
                    <h4
                      class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                    >
                      Preview Data ({{ parsedData.length }} item)
                    </h4>
                    <div class="overflow-x-auto">
                      <table class="min-w-full text-xs">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th
                              class="px-2 py-1 text-left text-gray-600 dark:text-gray-300"
                            >
                              No Ruas
                            </th>
                            <th
                              class="px-2 py-1 text-left text-gray-600 dark:text-gray-300"
                            >
                              Nama Jalan
                            </th>
                            <th
                              class="px-2 py-1 text-left text-gray-600 dark:text-gray-300"
                            >
                              Kecamatan
                            </th>
                            <th
                              class="px-2 py-1 text-left text-gray-600 dark:text-gray-300"
                            >
                              Desa
                            </th>
                            <th
                              class="px-2 py-1 text-left text-gray-600 dark:text-gray-300"
                            >
                              Panjang
                            </th>
                            <th
                              class="px-2 py-1 text-left text-gray-600 dark:text-gray-300"
                            >
                              Lebar
                            </th>
                            <th
                              class="px-2 py-1 text-left text-gray-600 dark:text-gray-300"
                            >
                              Kondisi
                            </th>
                            <th
                              class="px-2 py-1 text-left text-gray-600 dark:text-gray-300"
                            >
                              Koordinat
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                        >
                          <tr
                            v-for="(item, index) in parsedData.slice(0, 10)"
                            :key="index"
                            class="hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <td
                              class="px-2 py-1 text-gray-900 dark:text-white font-mono text-xs"
                            >
                              {{ item.No_Ruas || "-" }}
                            </td>
                            <td
                              class="px-2 py-1 text-gray-900 dark:text-white text-xs"
                            >
                              {{ item.Nama_Jalan || "-" }}
                            </td>
                            <td
                              class="px-2 py-1 text-gray-900 dark:text-white text-xs"
                            >
                              {{ item.Kecamatan || "-" }}
                            </td>
                            <td
                              class="px-2 py-1 text-gray-900 dark:text-white text-xs"
                            >
                              {{ item.Desa || "-" }}
                            </td>
                            <td
                              class="px-2 py-1 text-gray-900 dark:text-white text-xs"
                            >
                              {{ item.Panjang_M || "-" }}
                            </td>
                            <td
                              class="px-2 py-1 text-gray-900 dark:text-white text-xs"
                            >
                              {{ item.lebar_m || "-" }}
                            </td>
                            <td
                              class="px-2 py-1 text-gray-900 dark:text-white text-xs"
                            >
                              {{ item.Kondisi || "-" }}
                            </td>
                            <td
                              class="px-2 py-1 text-gray-900 dark:text-white text-xs"
                            >
                              <span
                                v-if="item.coordinates"
                                class="text-green-600 dark:text-green-400"
                              >
                                ✓ {{ item.coordinates.length }} titik
                              </span>
                              <span
                                v-else
                                class="text-red-600 dark:text-red-400"
                                >✗</span
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <p
                        v-if="parsedData.length > 10"
                        class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center"
                      >
                        Menampilkan 10 dari {{ parsedData.length }} data
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from "vue";
import { useToast } from "~/composables/useToast.js";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "import"]);

const toast = useToast();

const fileInput = ref(null);
const selectedFile = ref(null);
const parsedData = ref([]);
const importing = ref(false);

const closeModal = () => {
  emit("close");
  resetForm();
};

const resetForm = () => {
  selectedFile.value = null;
  parsedData.value = [];
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  selectedFile.value = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const geojson = JSON.parse(e.target.result);

      if (geojson.type === "FeatureCollection" && geojson.features) {
        parsedData.value = geojson.features.map((feature) => {
          const props = feature.properties || {};
          return {
            ...props,
            coordinates: feature.geometry?.coordinates || null,
            geometry: feature.geometry,
          };
        });
      } else {
        toast.error("File bukan format GeoJSON yang valid");
        resetForm();
      }
    } catch (error) {
      console.error("Error parsing GeoJSON:", error);
      toast.error("Error parsing file GeoJSON");
      resetForm();
    }
  };

  reader.readAsText(file);
};

const removeFile = () => {
  resetForm();
};

const importData = async () => {
  if (!parsedData.value.length) return;

  importing.value = true;
  try {
    // Emit data to parent component
    emit("import", parsedData.value);
  } catch (error) {
    console.error("Error importing data:", error);
    toast.error("Error importing data");
  } finally {
    importing.value = false;
  }
};
</script>
