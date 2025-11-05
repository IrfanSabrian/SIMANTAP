<template>
  <transition name="fade">
    <div
      v-if="visible"
      @click="closeModal"
      class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-2 lg:p-4"
    >
      <div
        @click.stop
        class="w-full max-w-4xl h-[95vh] lg:h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col modal-content"
        style="max-height: 95vh"
      >
        <!-- Header -->
        <div
          class="bg-blue-600 text-white px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between"
        >
          <h3 class="text-lg lg:text-xl font-bold">
            Detail Jalan Lingkungan - Ruas {{ road?.noRuas }}
          </h3>
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
        <div class="flex-1 overflow-hidden min-h-0">
          <!-- Road Details (Full Width) -->
          <div class="w-full flex flex-col min-h-0 h-full">
            <!-- Scrollable Content -->
            <div
              class="flex-1 overflow-y-auto p-4 lg:p-6 relative min-h-0 scrollable-content"
              style="max-height: calc(95vh - 120px)"
            >
              <!-- View Mode -->
              <div class="space-y-6">
                <!-- Basic Info -->
                <div>
                  <h4
                    class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                  >
                    Informasi Dasar
                  </h4>
                  <div class="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span class="text-gray-600 dark:text-gray-400"
                        >Nomor Ruas:</span
                      >
                      <span
                        class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                        >{{ road?.noRuas }}</span
                      >
                    </div>
                    <div>
                      <span class="text-gray-600 dark:text-gray-400"
                        >Nama Jalan:</span
                      >
                      <span
                        class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                        >{{ road?.namaJalan || road?.nama }}</span
                      >
                    </div>
                    <div>
                      <span class="text-gray-600 dark:text-gray-400"
                        >Kecamatan:</span
                      >
                      <span
                        class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                        >{{ road?.kecamatan }}</span
                      >
                    </div>
                    <div>
                      <span class="text-gray-600 dark:text-gray-400"
                        >Desa:</span
                      >
                      <span
                        class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                        >{{ road?.desa }}</span
                      >
                    </div>
                    <div>
                      <span class="text-gray-600 dark:text-gray-400"
                        >Panjang:</span
                      >
                      <span
                        class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                        >{{ road?.panjangM?.toFixed(2) }} m</span
                      >
                    </div>
                    <div>
                      <span class="text-gray-600 dark:text-gray-400"
                        >Lebar:</span
                      >
                      <span
                        class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                        >{{ road?.lebarM?.toFixed(2) }} m</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Condition Info -->
                <div>
                  <h4
                    class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                  >
                    Kondisi Jalan
                  </h4>
                  <div class="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span class="text-gray-600 dark:text-gray-400"
                        >Kondisi Material:</span
                      >
                      <span
                        class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                        >{{ road?.kondisi }}</span
                      >
                    </div>
                    <div>
                      <span class="text-gray-600 dark:text-gray-400"
                        >Keterangan Kondisi:</span
                      >
                      <span
                        :class="getKeteranganClass(road?.keterangan)"
                        class="ml-2 px-2 py-0.5 rounded text-xs font-semibold"
                      >
                        {{ road?.keterangan }}
                      </span>
                    </div>
                    <div>
                      <span class="text-gray-600 dark:text-gray-400"
                        >Tahun:</span
                      >
                      <span
                        class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                        >{{ road?.tahun }}</span
                      >
                    </div>
                    <div>
                      <span class="text-gray-600 dark:text-gray-400"
                        >Nilai:</span
                      >
                      <span
                        class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                        >{{ road?.nilai }}</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Administrative Info -->
                <div>
                  <h4
                    class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                  >
                    Informasi Administratif
                  </h4>
                  <div class="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span class="text-gray-600 dark:text-gray-400"
                        >No Prov:</span
                      >
                      <span
                        class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                        >{{ road?.noProv }}</span
                      >
                    </div>
                    <div>
                      <span class="text-gray-600 dark:text-gray-400"
                        >No Kab:</span
                      >
                      <span
                        class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                        >{{ road?.noKab }}</span
                      >
                    </div>
                    <div>
                      <span class="text-gray-600 dark:text-gray-400"
                        >No Kec:</span
                      >
                      <span
                        class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                        >{{ road?.noKec }}</span
                      >
                    </div>
                    <div>
                      <span class="text-gray-600 dark:text-gray-400"
                        >No Desa:</span
                      >
                      <span
                        class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                        >{{ road?.noDesa }}</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Coordinate Info -->
                <div>
                  <h4
                    class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                  >
                    Koordinat
                  </h4>
                  <div class="space-y-3">
                    <div class="border-l-4 border-green-500 pl-3">
                      <p
                        class="text-sm font-semibold text-green-600 dark:text-green-400 mb-2"
                      >
                        Titik Awal
                      </p>
                      <div class="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span class="text-gray-600 dark:text-gray-400"
                            >UTM X:</span
                          >
                          <span
                            class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                            >{{ road?.utmXAwal?.toFixed(6) }}</span
                          >
                        </div>
                        <div>
                          <span class="text-gray-600 dark:text-gray-400"
                            >UTM Y:</span
                          >
                          <span
                            class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                            >{{ road?.utmYAwal?.toFixed(6) }}</span
                          >
                        </div>
                        <div class="col-span-2">
                          <span class="text-gray-600 dark:text-gray-400"
                            >Pangkalan:</span
                          >
                          <span
                            class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                            >{{ road?.pngnlAwal }}</span
                          >
                        </div>
                      </div>
                    </div>
                    <div class="border-l-4 border-red-500 pl-3">
                      <p
                        class="text-sm font-semibold text-red-600 dark:text-red-400 mb-2"
                      >
                        Titik Akhir
                      </p>
                      <div class="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span class="text-gray-600 dark:text-gray-400"
                            >UTM X:</span
                          >
                          <span
                            class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                            >{{ road?.utmXAkhi?.toFixed(6) }}</span
                          >
                        </div>
                        <div>
                          <span class="text-gray-600 dark:text-gray-400"
                            >UTM Y:</span
                          >
                          <span
                            class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                            >{{ road?.utmYAkhi?.toFixed(6) }}</span
                          >
                        </div>
                        <div class="col-span-2">
                          <span class="text-gray-600 dark:text-gray-400"
                            >Pangkalan:</span
                          >
                          <span
                            class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                            >{{ road?.pngnlAkhi }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Shape Info -->
                <div>
                  <h4
                    class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                  >
                    Informasi Shape
                  </h4>
                  <div class="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span class="text-gray-600 dark:text-gray-400"
                        >Shape Length:</span
                      >
                      <span
                        class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                        >{{ road?.shapeLeng }}</span
                      >
                    </div>
                    <div>
                      <span class="text-gray-600 dark:text-gray-400"
                        >Shape LE 1:</span
                      >
                      <span
                        class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                        >{{ road?.shapeLe1 }}</span
                      >
                    </div>
                    <div>
                      <span class="text-gray-600 dark:text-gray-400"
                        >Shape LE 2:</span
                      >
                      <span
                        class="font-medium text-gray-900 dark:text-gray-100 ml-2"
                        >{{ road?.shapeLe2 }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="bg-gray-100 dark:bg-gray-700 px-4 lg:px-6 py-3 lg:py-4 flex justify-end border-t border-gray-200 dark:border-gray-700"
        >
          <button
            @click="closeModal"
            class="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  road: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
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

.modal-content {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
