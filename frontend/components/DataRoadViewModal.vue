<template>
  <transition name="fade">
    <div
      v-if="visible"
      @click="closeModal"
      class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-2 lg:p-4"
    >
      <div
        @click.stop
        class="w-full max-w-6xl h-[95vh] lg:h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col modal-content"
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
        <div class="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          <!-- Left Side - Road Details -->
          <div
            class="w-full lg:w-1/2 border-r-0 lg:border-r border-b lg:border-b-0 border-gray-200 dark:border-gray-700 order-2 lg:order-1 flex flex-col min-h-0"
          >
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
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Nomor Ruas
                      </label>
                      <p class="text-gray-900 dark:text-white font-mono">
                        {{ road.No_Ruas || road.noRuas }}
                      </p>
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Nama Jalan
                      </label>
                      <p class="text-gray-900 dark:text-white">
                        {{
                          road.Nama_Jalan ||
                          road.namaJalan ||
                          road.Nama ||
                          road.nama
                        }}
                      </p>
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Kecamatan
                      </label>
                      <p class="text-gray-900 dark:text-white">
                        {{ road.Kecamatan || road.kecamatan }}
                      </p>
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Desa/Kelurahan
                      </label>
                      <p class="text-gray-900 dark:text-white">
                        {{ road.Desa || road.desa }}
                      </p>
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Nomor Jalan
                      </label>
                      <p class="text-gray-900 dark:text-white font-mono">
                        {{ road.No_Jalan || road.noJalan || "-" }}
                      </p>
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Panjang (Meter)
                      </label>
                      <p class="text-gray-900 dark:text-white">
                        {{
                          road.Panjang_M?.toLocaleString() ||
                          road.panjangM?.toLocaleString() ||
                          "-"
                        }}
                        m
                      </p>
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Lebar (Meter)
                      </label>
                      <p class="text-gray-900 dark:text-white">
                        {{
                          road.lebar_m?.toLocaleString() ||
                          road.lebarM?.toLocaleString() ||
                          "-"
                        }}
                        m
                      </p>
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
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Keterangan Kondisi
                      </label>
                      <span
                        v-if="road.Keterangan || road.keterangan"
                        :class="
                          getKondisiBadge(road.Keterangan || road.keterangan)
                        "
                        class="inline-flex px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {{ road.Keterangan || road.keterangan }}
                      </span>
                      <span v-else class="text-gray-500 dark:text-gray-400"
                        >-</span
                      >
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Kondisi Material
                      </label>
                      <span
                        v-if="road.Kondisi || road.kondisi"
                        :class="getKondisiBadge(road.Kondisi || road.kondisi)"
                        class="inline-flex px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {{ road.Kondisi || road.kondisi }}
                      </span>
                      <span v-else class="text-gray-500 dark:text-gray-400"
                        >-</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Dokumentasi Video Section -->
                <div v-if="loadingDokumentasi || dokumentasi">
                  <h4
                    class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                  >
                    Dokumentasi Video
                  </h4>
                  <div class="grid grid-cols-1 gap-4">
                    <div v-if="loadingDokumentasi" class="mt-2">
                      <div class="flex items-center justify-center py-8">
                        <svg
                          class="animate-spin h-8 w-8 text-blue-600"
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
                        <span class="ml-2 text-gray-600 dark:text-gray-400">
                          Memuat dokumentasi...
                        </span>
                      </div>
                    </div>
                    <div v-else-if="dokumentasi?.linkYoutube" class="mt-2">
                      <a
                        :href="getYouTubeEmbedUrl(dokumentasi.linkYoutube)"
                        :data-fancybox="`youtube-${road.id || 'video'}`"
                        :data-caption="`Video Dokumentasi - ${
                          road.namaJalan || road.nama || 'Jalan'
                        }`"
                        class="block w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
                        @click.prevent="
                          openYouTubeFancybox(dokumentasi.linkYoutube)
                        "
                      >
                        <div class="relative">
                          <img
                            :src="getYouTubeThumbnail(dokumentasi.linkYoutube)"
                            :alt="'Thumbnail untuk ' + dokumentasi.linkYoutube"
                            class="w-full h-48 object-cover"
                            @error="
                              $event.target.src =
                                '/images/placeholder-video.jpg'
                            "
                          />
                          <div
                            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-200"
                          >
                            <div
                              class="bg-red-600 rounded-full p-4 hover:bg-red-700 transition-colors duration-200"
                            >
                              <svg
                                class="w-8 h-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </a>
                      <div class="mt-2">
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Link YouTube:</strong>
                          <a
                            :href="dokumentasi.linkYoutube"
                            target="_blank"
                            class="text-blue-600 dark:text-blue-400 hover:underline break-all"
                          >
                            {{ dokumentasi.linkYoutube }}
                          </a>
                        </p>
                      </div>
                    </div>
                    <div v-else class="mt-2">
                      <p class="text-gray-500 dark:text-gray-400">
                        Dokumentasi video belum tersedia
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Coordinates Info -->
                <div
                  v-if="getRoadCoordinates() && getRoadCoordinates().length > 0"
                >
                  <h4
                    class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                  >
                    Koordinat Jalan
                  </h4>
                  <div class="space-y-3">
                    <div
                      v-for="(coord, index) in getRoadCoordinates()"
                      :key="index"
                      class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <span
                          class="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Titik {{ index + 1 }}
                        </span>
                        <button
                          @click="copyCoordinates(coord)"
                          class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                          title="Salin koordinat"
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
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                      <div class="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span class="text-gray-600 dark:text-gray-400"
                            >Longitude:</span
                          >
                          <p class="font-mono text-gray-900 dark:text-white">
                            {{ coord[0]?.toFixed(6) || "-" }}
                          </p>
                        </div>
                        <div>
                          <span class="text-gray-600 dark:text-gray-400"
                            >Latitude:</span
                          >
                          <p class="font-mono text-gray-900 dark:text-white">
                            {{ coord[1]?.toFixed(6) || "-" }}
                          </p>
                        </div>
                      </div>
                      <div
                        class="mt-2 text-xs text-gray-500 dark:text-gray-400"
                      >
                        Format: [{{ coord[0]?.toFixed(6) || "0" }},
                        {{ coord[1]?.toFixed(6) || "0" }}]
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Location Codes -->
                <div>
                  <h4
                    class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                  >
                    Kode Lokasi
                  </h4>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <label
                        class="block text-xs font-medium text-blue-700 dark:text-blue-300 mb-1"
                      >
                        Provinsi
                      </label>
                      <p
                        class="text-lg font-bold text-blue-900 dark:text-blue-100 font-mono"
                      >
                        {{ road.No_Prov || road.noProv || "-" }}
                      </p>
                    </div>
                    <div
                      class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg"
                    >
                      <label
                        class="block text-xs font-medium text-green-700 dark:text-green-300 mb-1"
                      >
                        Kabupaten
                      </label>
                      <p
                        class="text-lg font-bold text-green-900 dark:text-green-100 font-mono"
                      >
                        {{ road.No_Kab || road.noKab || "-" }}
                      </p>
                    </div>
                    <div
                      class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg"
                    >
                      <label
                        class="block text-xs font-medium text-yellow-700 dark:text-yellow-300 mb-1"
                      >
                        Kecamatan
                      </label>
                      <p
                        class="text-lg font-bold text-yellow-900 dark:text-yellow-100 font-mono"
                      >
                        {{ road.No_Kec || road.noKec || "-" }}
                      </p>
                    </div>
                    <div
                      class="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg"
                    >
                      <label
                        class="block text-xs font-medium text-purple-700 dark:text-purple-300 mb-1"
                      >
                        Desa
                      </label>
                      <p
                        class="text-lg font-bold text-purple-900 dark:text-purple-100 font-mono"
                      >
                        {{ road.No_Desa || road.noDesa || "-" }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Additional Info -->
                <div>
                  <h4
                    class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                  >
                    Informasi Tambahan
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Tahun
                      </label>
                      <p class="text-gray-900 dark:text-white">
                        {{ road.Tahun || road.tahun || "-" }}
                      </p>
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Nilai
                      </label>
                      <p class="text-gray-900 dark:text-white">
                        {{
                          road.Nilai?.toFixed(2) ||
                          road.nilai?.toFixed(2) ||
                          "-"
                        }}
                      </p>
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Bobot
                      </label>
                      <p class="text-gray-900 dark:text-white">
                        {{ road.Bobot || road.bobot || "-" }}
                      </p>
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        UTM X Awal
                      </label>
                      <p
                        class="text-gray-900 dark:text-white font-mono text-sm"
                      >
                        {{
                          road.UTM_X_AWAL?.toFixed(6) ||
                          road.utmXAwal?.toFixed(6) ||
                          "-"
                        }}
                      </p>
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        UTM Y Awal
                      </label>
                      <p
                        class="text-gray-900 dark:text-white font-mono text-sm"
                      >
                        {{
                          road.UTM_Y_AWAL?.toFixed(6) ||
                          road.utmYAwal?.toFixed(6) ||
                          "-"
                        }}
                      </p>
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        UTM X Akhir
                      </label>
                      <p
                        class="text-gray-900 dark:text-white font-mono text-sm"
                      >
                        {{
                          road.UTM_X_AKHI?.toFixed(6) ||
                          road.utmXAkhi?.toFixed(6) ||
                          "-"
                        }}
                      </p>
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        UTM Y Akhir
                      </label>
                      <p
                        class="text-gray-900 dark:text-white font-mono text-sm"
                      >
                        {{
                          road.UTM_Y_AKHI?.toFixed(6) ||
                          road.utmYAkhi?.toFixed(6) ||
                          "-"
                        }}
                      </p>
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Pangkalan Awal
                      </label>
                      <p class="text-gray-900 dark:text-white">
                        {{ road.Pngnl_Awal || road.pngnlAwal || "-" }}
                      </p>
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Pangkalan Akhir
                      </label>
                      <p class="text-gray-900 dark:text-white">
                        {{ road.Pngnl_Akhi || road.pngnlAkhi || "-" }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side - Map -->
          <div class="w-full lg:w-1/2 relative order-1 lg:order-2">
            <div ref="mapContainer" class="w-full h-64 lg:h-full relative">
              <!-- Map Controls Container -->
              <div class="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <!-- Zoom Controls -->
                <div class="zoom-controls">
                  <button
                    @click="zoomIn"
                    class="p-2 bg-white dark:bg-gray-800 rounded-t-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 border-b-0 text-gray-600 dark:text-gray-400 hover:text-blue-500"
                    title="Zoom In"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <button
                    @click="zoomOut"
                    class="p-2 bg-white dark:bg-gray-800 rounded-b-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-blue-500"
                    title="Zoom Out"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>

                <!-- Basemap Selector Button -->
                <button
                  @click="showBasemapSelector = !showBasemapSelector"
                  class="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-blue-500"
                  title="Pilih Basemap"
                >
                  <FontAwesomeIcon :icon="faLayerGroup" class="text-lg" />
                </button>
              </div>

              <!-- Legend Toggle Button (Top Right) -->
              <div class="absolute top-4 right-4 z-10">
                <button
                  v-if="!legendVisible"
                  @click="legendVisible = true"
                  class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  title="Tampilkan Legenda"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="text-gray-700 dark:text-gray-300"
                  >
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
              </div>

              <!-- Basemap Selector -->
              <div
                v-if="showBasemapSelector"
                class="absolute top-4 left-16 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-xs"
              >
                <div class="flex items-center justify-between mb-3">
                  <h4
                    class="text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Pilih Basemap
                  </h4>
                  <button
                    @click="showBasemapSelector = false"
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <div class="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                  <button
                    v-for="bm in basemapOptions"
                    :key="bm.id"
                    @click="
                      handleBasemapChange(bm.id);
                      showBasemapSelector = false;
                    "
                    :class="[
                      'flex items-center space-x-3 p-2 rounded-lg border transition-colors',
                      currentBasemap === bm.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10',
                    ]"
                  >
                    <img
                      :src="bm.thumbnail"
                      :alt="bm.label"
                      class="w-8 h-8 rounded object-cover"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300">
                      {{ bm.label }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div
              v-if="mapLoading"
              class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700"
            >
              <div class="text-center">
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
                ></div>
                <p class="mt-2 text-gray-600 dark:text-gray-400">
                  Memuat peta...
                </p>
              </div>
            </div>

            <!-- Map Legend -->
            <div
              v-if="legendVisible"
              class="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
                  Legenda
                </h4>
                <button
                  @click="legendVisible = false"
                  class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title="Sembunyikan Legenda"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div class="space-y-1 text-xs">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-0.5 bg-[#3b82f6] rounded"></div>
                  <span class="text-gray-700 dark:text-gray-300"
                    >Kabupaten</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-0.5 bg-[#ec4899] rounded"></div>
                  <span class="text-gray-700 dark:text-gray-300"
                    >Kecamatan</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-0.5 bg-[#a855f7] rounded"></div>
                  <span class="text-gray-700 dark:text-gray-300">Desa</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-1 bg-[#10b981] rounded"></div>
                  <span class="text-gray-700 dark:text-gray-300">Baik</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-1 bg-[#eab308] rounded"></div>
                  <span class="text-gray-700 dark:text-gray-300">Sedang</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-1 bg-[#f97316] rounded"></div>
                  <span class="text-gray-700 dark:text-gray-300"
                    >Rusak Ringan</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-1 bg-[#dc2626] rounded"></div>
                  <span class="text-gray-700 dark:text-gray-300"
                    >Rusak Berat</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useApiService } from "~/composables/useApiService";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useToast } from "~/composables/useToast.js";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";

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

const { fetchRoads } = useApiService();
const toast = useToast();

// SIMANTAP API URL from config
const config = useRuntimeConfig();
const API_BASE = config.public.apiBaseUrl || "";

// YouTube URL helper functions
const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";

  // Extract video ID from various YouTube URL formats
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return "";

  return `https://www.youtube.com/embed/${videoId}`;
};

const extractYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const getYouTubeThumbnail = (url) => {
  const videoId = extractYouTubeVideoId(url);
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;
};

const openYouTubeFancybox = (url) => {
  if (typeof window !== "undefined" && window.Fancybox) {
    const videoUrl = getYouTubeEmbedUrl(url);
    const videoTitle = `Video Dokumentasi - ${
      props.road?.namaJalan || props.road?.nama || "Jalan"
    }`;

    window.Fancybox.show(
      [
        {
          src: videoUrl,
          type: "iframe",
          caption: videoTitle,
        },
      ],
      {
        Toolbar: {
          display: {
            left: ["infobar"],
            middle: [],
            right: ["close"],
          },
        },
        closeButton: "top",
        click: "close",
        wheel: "close",
        keyboard: {
          Escape: "close",
        },
      }
    );
  }
};

// Refs
const mapContainer = ref(null);
const mapLoading = ref(false);
const legendVisible = ref(true);
const currentBasemap = ref("topo");
const showBasemapSelector = ref(false);
const dokumentasi = ref(null);
const loadingDokumentasi = ref(false);

// Map variables
let map = null;
let view = null;
let roadsLayer = null;

// Basemap options
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

const closeModal = () => {
  emit("close");
};

// Fetch dokumentasi berdasarkan no_ruas
const fetchDokumentasiByRuas = async (noRuas) => {
  if (!noRuas) return;

  loadingDokumentasi.value = true;
  try {
    const response = await fetch(
      `${API_BASE}/api/dokumentasi-infrastruktur/by-ruas/${noRuas}`
    );
    const data = await response.json();

    if (data.success && data.data) {
      dokumentasi.value = data.data;
      console.log("✅ Dokumentasi loaded:", dokumentasi.value);
    } else {
      dokumentasi.value = null;
      console.log("ℹ️ No dokumentasi found for ruas:", noRuas);
    }
  } catch (error) {
    console.error("Error fetching dokumentasi:", error);
    dokumentasi.value = null;
  } finally {
    loadingDokumentasi.value = false;
  }
};

const getKondisiBadge = (kondisi) => {
  const kondisiUpper = kondisi?.toUpperCase() || "";

  // Check for specific conditions with color coding
  if (kondisiUpper.includes("BAIK") || kondisiUpper.includes("BAGUS")) {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  } else if (kondisiUpper.includes("SEDANG")) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  } else if (
    kondisiUpper.includes("RUSAK RINGAN") ||
    kondisiUpper.includes("RUSAK_RINGAN")
  ) {
    return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
  } else if (
    kondisiUpper.includes("RUSAK BERAT") ||
    kondisiUpper.includes("RUSAK_BERAT")
  ) {
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  }

  // Default gray for unknown conditions
  return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
};

const getRoadCoordinates = () => {
  if (!props.road) return null;

  console.log("🔍 Debugging road data structure:", {
    road: props.road,
    hasCoordinates: !!props.road.coordinates,
    hasGeometry: !!props.road.geometry,
    utmXAwal: props.road.utmXAwal,
    utmYAwal: props.road.utmYAwal,
    utmXAkhi: props.road.utmXAkhi,
    utmYAkhi: props.road.utmYAkhi,
  });

  // Check various possible coordinate structures
  let coordinates = null;

  // 1. Direct coordinates array
  if (props.road.coordinates && Array.isArray(props.road.coordinates)) {
    coordinates = props.road.coordinates;
    console.log("✅ Found direct coordinates array");
  }
  // 2. Geometry coordinates (GeoJSON format)
  else if (props.road.geometry && props.road.geometry.coordinates) {
    coordinates = props.road.geometry.coordinates;
    console.log("✅ Found geometry coordinates");
  }
  // 3. Parsed geometry string
  else if (props.road.geometry && typeof props.road.geometry === "string") {
    try {
      const parsed = JSON.parse(props.road.geometry);
      if (parsed.coordinates) {
        coordinates = parsed.coordinates;
        console.log("✅ Found parsed geometry string coordinates");
      }
    } catch (e) {
      console.warn("Failed to parse geometry string:", e);
    }
  }
  // 4. UTM coordinates (convert to lat/lng)
  else if (
    props.road.utmXAwal &&
    props.road.utmYAwal &&
    props.road.utmXAkhi &&
    props.road.utmYAkhi
  ) {
    // These are already in lat/lng format based on the API service
    coordinates = [
      [props.road.utmXAwal, props.road.utmYAwal],
      [props.road.utmXAkhi, props.road.utmYAkhi],
    ];
    console.log("✅ Found UTM coordinates, converted to lat/lng");
  }

  console.log("📍 Final coordinates:", coordinates);
  return coordinates;
};

const copyCoordinates = async (coord) => {
  try {
    const coordString = `[${coord[0]?.toFixed(6)}, ${coord[1]?.toFixed(6)}]`;
    await navigator.clipboard.writeText(coordString);

    // Show a brief success message (you could use a toast notification here)
    console.log("Koordinat berhasil disalin:", coordString);

    // Optional: Show a temporary success indicator
    const button = event.target.closest("button");
    if (button) {
      const originalContent = button.innerHTML;
      button.innerHTML = `
        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      `;
      setTimeout(() => {
        button.innerHTML = originalContent;
      }, 2000);
    }
  } catch (error) {
    console.error("Gagal menyalin koordinat:", error);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = `[${coord[0]?.toFixed(6)}, ${coord[1]?.toFixed(6)}]`;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
};

// Map functions
const initMap = async () => {
  if (!mapContainer.value || !props.road?.noRuas) return;

  mapLoading.value = true;

  try {
    // Load ArcGIS modules
    const [
      Map,
      MapView,
      GraphicsLayer,
      Graphic,
      SimpleLineSymbol,
      SimpleFillSymbol,
    ] = await Promise.all([
      import("@arcgis/core/Map"),
      import("@arcgis/core/views/MapView"),
      import("@arcgis/core/layers/GraphicsLayer"),
      import("@arcgis/core/Graphic"),
      import("@arcgis/core/symbols/SimpleLineSymbol"),
      import("@arcgis/core/symbols/SimpleFillSymbol"),
    ]);

    // Create map
    map = new Map.default({
      basemap: "streets-navigation-vector",
    });

    // Create view
    view = new MapView.default({
      container: mapContainer.value,
      map: map,
      center: [109.5, -0.5], // Center on Kubu Raya
      zoom: 10,
      ui: {
        components: [], // Disable all default UI components including zoom
      },
    });

    // Create layers
    const batasKabupatenLayer = new GraphicsLayer.default({
      title: "Batas Kabupaten",
      visible: true,
    });

    const batasKecamatanLayer = new GraphicsLayer.default({
      title: "Batas Kecamatan",
      visible: true,
    });

    const batasDesaLayer = new GraphicsLayer.default({
      title: "Batas Desa",
      visible: true,
    });

    roadsLayer = new GraphicsLayer.default({
      title: "Roads",
      visible: true,
    });

    map.add(batasKabupatenLayer);
    map.add(batasKecamatanLayer);
    map.add(batasDesaLayer);
    map.add(roadsLayer);

    // Wait for view to be ready
    await view.when();

    // Load all data
    await loadAllMapData(
      batasKabupatenLayer,
      batasKecamatanLayer,
      batasDesaLayer,
      roadsLayer
    );

    mapLoading.value = false;
  } catch (error) {
    console.error("Error initializing map:", error);
    mapLoading.value = false;
  }
};

const loadAllMapData = async (
  batasKabupatenLayer,
  batasKecamatanLayer,
  batasDesaLayer,
  roadsLayer
) => {
  try {
    // Load roads data using the same approach as AduanDetailModal
    const config = useRuntimeConfig();
    if (!config.public.apiBaseUrl) {
      console.error("⚠️ NUXT_PUBLIC_API_BASE_URL is not set!");
      return;
    }
    const API_BASE = config.public.apiBaseUrl;

    const response = await fetch(`${API_BASE}/api/jalan/geojson`);
    const data = await response.json();

    if (data.success && data.data.features) {
      console.log("🔍 Looking for road with ID:", props.road.id);
      console.log("🔍 Looking for road with noRuas:", props.road.noRuas);
      console.log("🔍 Props road data:", props.road);
      console.log(
        "🔍 Available roads:",
        data.data.features.slice(0, 3).map((f) => ({
          noRuas: f.properties.noRuas,
          no_ruas: f.properties.no_ruas,
          id: f.properties.id,
        }))
      );

      // Find and show only the specific road
      // PRIORITY 1: Search by ID first (most accurate - ensures each record with same noRuas shows its own coordinates)
      let targetRoad = null;

      if (props.road.id) {
        targetRoad = data.data.features.find(
          (feature) =>
            feature.properties.id === props.road.id ||
            feature.properties.id === Number(props.road.id) ||
            feature.id === props.road.id ||
            feature.id === Number(props.road.id) ||
            String(feature.properties.id) === String(props.road.id) ||
            String(feature.id) === String(props.road.id)
        );

        if (targetRoad) {
          console.log("✅ Found road by ID:", targetRoad.properties.id);
        }
      }

      // PRIORITY 2: If not found by ID, try by noRuas (for backward compatibility)
      if (!targetRoad) {
        console.log("⚠️ Road not found by ID, trying by noRuas...");
        targetRoad = data.data.features.find(
          (feature) =>
            feature.properties.noRuas === props.road.noRuas ||
            feature.properties.noRuas === String(props.road.noRuas) ||
            feature.properties.noRuas === Number(props.road.noRuas) ||
            String(feature.properties.noRuas) === String(props.road.noRuas) ||
            // Also try with No_Ruas property from props.road for backward compatibility
            feature.properties.noRuas === props.road.No_Ruas ||
            feature.properties.noRuas === String(props.road.No_Ruas) ||
            feature.properties.noRuas === Number(props.road.No_Ruas) ||
            String(feature.properties.noRuas) === String(props.road.No_Ruas)
        );
      }

      console.log("🔍 Target road found:", targetRoad);

      if (targetRoad) {
        console.log("✅ Adding road to map and zooming");
        // Add only the specific road to the map
        await addSpecificRoadToMap(targetRoad, roadsLayer);
        await zoomToRoad(targetRoad);
      } else {
        // PRIORITY 3: Try alternative property names with robust comparison
        const alternativeRoad = data.data.features.find(
          (feature) =>
            feature.properties.nomor_ruas === props.road.noRuas ||
            feature.properties.NOMOR_RUAS === props.road.noRuas ||
            feature.properties.no_ruas === props.road.noRuas ||
            String(feature.properties.nomor_ruas) ===
              String(props.road.noRuas) ||
            String(feature.properties.NOMOR_RUAS) ===
              String(props.road.noRuas) ||
            String(feature.properties.no_ruas) === String(props.road.noRuas) ||
            // Also try with No_Ruas property from props.road
            feature.properties.nomor_ruas === props.road.No_Ruas ||
            feature.properties.NOMOR_RUAS === props.road.No_Ruas ||
            feature.properties.no_ruas === props.road.No_Ruas ||
            String(feature.properties.nomor_ruas) ===
              String(props.road.No_Ruas) ||
            String(feature.properties.NOMOR_RUAS) ===
              String(props.road.No_Ruas) ||
            String(feature.properties.no_ruas) === String(props.road.No_Ruas)
        );

        if (alternativeRoad) {
          console.log("✅ Found road with alternative property");
          await addSpecificRoadToMap(alternativeRoad, roadsLayer);
          await zoomToRoad(alternativeRoad);
        } else {
          console.log("❌ No road found, showing all roads for debugging");
          await addAllRoadsToMap(data.data, roadsLayer);
        }
      }
    }

    // Always load kabupaten boundary first
    await loadKabupatenBoundary(batasKabupatenLayer);

    // Always load relevant boundaries (kabupaten + specific kecamatan/desa)
    console.log("Loading relevant boundaries for road");
    await loadRelevantBoundaries(
      batasKabupatenLayer,
      batasKecamatanLayer,
      batasDesaLayer
    );
  } catch (error) {
    console.error("Error loading map data:", error);
  }
};

const addSpecificRoadToMap = async (roadFeature, roadsLayer) => {
  try {
    console.log("🛣️ Adding road to map:", roadFeature.properties);

    const [Graphic, Polyline, SimpleLineSymbol] = await Promise.all([
      import("@arcgis/core/Graphic"),
      import("@arcgis/core/geometry/Polyline"),
      import("@arcgis/core/symbols/SimpleLineSymbol"),
    ]);

    // Handle GeoJSON coordinates format
    let coordinates = roadFeature.geometry.coordinates;

    // If coordinates is a single array of [lng, lat] pairs, wrap it in another array
    if (
      coordinates.length > 0 &&
      Array.isArray(coordinates[0]) &&
      coordinates[0].length === 2
    ) {
      coordinates = [coordinates];
    }

    const polyline = new Polyline.default({
      paths: coordinates,
      spatialReference: { wkid: 4326 },
    });

    const colorHex = getRoadColor(roadFeature);
    console.log(
      "🛣️ Road color:",
      colorHex,
      "Road condition:",
      roadFeature.properties.Keterangan ||
        roadFeature.properties.keterangan ||
        roadFeature.properties.Kondisi ||
        roadFeature.properties.kondisi
    );

    // Convert hex color to RGBA array for ArcGIS
    const color = hexToRgba(colorHex);

    const symbol = new SimpleLineSymbol.default({
      color: color,
      width: 4, // Make it thicker since it's the only road shown
      style: "solid",
    });

    const graphic = new Graphic.default({
      geometry: polyline,
      symbol: symbol,
      attributes: roadFeature.properties,
    });

    roadsLayer.add(graphic);
    console.log("✅ Road graphic added to layer");
  } catch (error) {
    console.error("Error adding specific road to map:", error);
  }
};

const addAllRoadsToMap = async (geoJSON, roadsLayer) => {
  try {
    const [Graphic, Polyline, SimpleLineSymbol] = await Promise.all([
      import("@arcgis/core/Graphic"),
      import("@arcgis/core/geometry/Polyline"),
      import("@arcgis/core/symbols/SimpleLineSymbol"),
    ]);

    const graphics = geoJSON.features.map((feature) => {
      const polyline = new Polyline.default({
        paths: [feature.geometry.coordinates],
        spatialReference: { wkid: 4326 },
      });

      const colorHex = getRoadColor(feature);
      const color = hexToRgba(colorHex);

      const symbol = new SimpleLineSymbol.default({
        color: color,
        width: 1.2,
        style: "solid",
      });

      return new Graphic.default({
        geometry: polyline,
        symbol: symbol,
        attributes: feature.properties,
      });
    });

    roadsLayer.addMany(graphics);
  } catch (error) {
    console.error("Error adding all roads to map:", error);
  }
};

// Convert hex color to RGBA array for ArcGIS
const hexToRgba = (hex) => {
  // Remove # if present
  hex = hex.replace("#", "");

  // Parse hex values
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  return [r, g, b, 1]; // Return RGBA array
};

const getRoadColor = (feature) => {
  let color = "#666666"; // Default color (gray for unknown)

  // Check both Keterangan and keterangan properties
  const keterangan =
    feature.properties.Keterangan || feature.properties.keterangan;
  const kondisi = feature.properties.Kondisi || feature.properties.kondisi;

  switch (keterangan) {
    case "Baik":
      color = "#10b981"; // Green - Good condition
      break;
    case "Sedang":
      color = "#eab308"; // Yellow - Fair condition
      break;
    case "Rusak Ringan":
      color = "#f97316"; // Orange - Light damage
      break;
    case "Rusak Berat":
      color = "#dc2626"; // Red - Heavy damage (bright red)
      break;
    default:
      // Fallback to material type if keterangan not available
      switch (kondisi) {
        case "Beton":
          color = "#10b981"; // Green for concrete
          break;
        case "Aspal":
          color = "#eab308"; // Yellow for asphalt
          break;
        case "Paving":
          color = "#3b82f6"; // Blue for paving
          break;
        case "Tanah":
          color = "#a855f7"; // Purple for dirt
          break;
        default:
          color = "#6b7280"; // Gray for unknown
      }
  }

  return color;
};

const zoomToRoad = async (roadFeature) => {
  try {
    console.log("🔍 Zooming to road:", roadFeature.properties);

    // Create polyline geometry for the road
    const [Polyline] = await Promise.all([
      import("@arcgis/core/geometry/Polyline"),
    ]);

    const polyline = new Polyline.default({
      paths: [roadFeature.geometry.coordinates],
      spatialReference: { wkid: 4326 },
    });

    console.log("🔍 Road geometry created:", polyline);

    // Use the same zoom approach as homepage
    await view.goTo(
      {
        target: polyline,
        zoom: 16, // Zoom in close to see the road
      },
      {
        duration: 1000,
        easing: "ease-in-out",
      }
    );

    console.log("✅ Zoom completed");
  } catch (error) {
    console.error("Error zooming to road:", error);
  }
};

const loadKabupatenBoundary = async (batasKabupatenLayer) => {
  try {
    console.log("=== LOADING KABUPATEN BOUNDARY ===");
    console.log("Kabupaten layer:", batasKabupatenLayer);

    // Clear existing graphics first
    batasKabupatenLayer.removeAll();

    const kabupatenResponse = await fetch(
      "/geojson/Batas Kabupaten Kubu Raya.geojson"
    );
    const kabupatenData = await kabupatenResponse.json();

    console.log(
      "Kabupaten data loaded:",
      kabupatenData.features?.length,
      "features"
    );

    if (kabupatenData.features && kabupatenData.features.length > 0) {
      console.log("Adding kabupaten boundary using homepage method");

      // Import required modules
      const [Graphic, Polygon, SimpleFillSymbol, SimpleLineSymbol] =
        await Promise.all([
          import("@arcgis/core/Graphic"),
          import("@arcgis/core/geometry/Polygon"),
          import("@arcgis/core/symbols/SimpleFillSymbol"),
          import("@arcgis/core/symbols/SimpleLineSymbol"),
        ]);

      // Create graphics from GeoJSON features (same as homepage)
      const graphics = kabupatenData.features.map((feature) => {
        // Convert MultiPolygon to Polygon
        let rings = [];
        if (feature.geometry.type === "MultiPolygon") {
          // Flatten MultiPolygon to single array of rings
          feature.geometry.coordinates.forEach((polygon) => {
            rings.push(...polygon);
          });
        } else if (feature.geometry.type === "Polygon") {
          rings = feature.geometry.coordinates;
        }

        const polygon = new Polygon.default({
          rings: rings,
          spatialReference: { wkid: 4326 },
        });

        // Style for kabupaten boundary - same as homepage
        const symbol = new SimpleFillSymbol.default({
          color: [0, 0, 0, 0], // Transparent fill (no fill)
          outline: new SimpleLineSymbol.default({
            color: [59, 130, 246, 1], // Blue - same as homepage
            width: 1.25,
            style: "solid",
          }),
        });

        return new Graphic.default({
          geometry: polygon,
          symbol: symbol,
          attributes: feature.properties,
        });
      });

      // Add graphics to layer and make visible
      batasKabupatenLayer.addMany(graphics);
      batasKabupatenLayer.visible = true;
      console.log(`Displayed ${graphics.length} kabupaten boundary`);
      console.log("Kabupaten layer visibility:", batasKabupatenLayer.visible);
      console.log(
        "Kabupaten graphics count:",
        batasKabupatenLayer.graphics.length
      );
    } else {
      console.log("No kabupaten features found");
    }
  } catch (error) {
    console.error("Error loading kabupaten boundary:", error);
  }
};

// Filter and display Batas Kecamatan based on selected kecamatan (like homepage)
const filterAndDisplayBatasKecamatan = async (
  kecamatanName,
  batasKecamatanLayer
) => {
  if (!batasKecamatanLayer) return;

  // Clear existing graphics
  batasKecamatanLayer.removeAll();

  // If no kecamatan selected, hide the layer
  if (!kecamatanName) {
    batasKecamatanLayer.visible = false;
    return;
  }

  try {
    // Import required modules
    const [Graphic, Polygon, SimpleFillSymbol, SimpleLineSymbol] =
      await Promise.all([
        import("@arcgis/core/Graphic"),
        import("@arcgis/core/geometry/Polygon"),
        import("@arcgis/core/symbols/SimpleFillSymbol"),
        import("@arcgis/core/symbols/SimpleLineSymbol"),
      ]);

    // Load district boundaries
    const districtResponse = await fetch(
      "/geojson/Batas Kecamatan Kubu Raya.geojson"
    );
    const districtData = await districtResponse.json();

    // Debug: Log the data we're searching for and available data
    console.log("=== KECAMATAN FILTER DEBUG ===");
    console.log("Searching for kecamatan:", kecamatanName);
    console.log(
      "Available kecamatan in GeoJSON:",
      districtData.features.slice(0, 3).map((f) => ({
        nama_kecamatan: f.properties.nama_kecamatan,
        nama_kabupaten: f.properties.nama_kabupaten,
        allProps: Object.keys(f.properties),
      }))
    );

    // Filter features by kecamatan name (same as homepage)
    const filteredFeatures = districtData.features.filter(
      (feature) => feature.properties.nama_kecamatan === kecamatanName
    );

    if (filteredFeatures.length === 0) {
      console.log(`No boundary found for kecamatan: ${kecamatanName}`);
      console.log("Trying alternative search methods...");

      // Try alternative search methods
      const alternativeFeatures = districtData.features.filter(
        (feature) =>
          feature.properties.nama_kecamatan === kecamatanName ||
          feature.properties.nama_kecamatan?.toLowerCase() ===
            kecamatanName?.toLowerCase() ||
          feature.properties.nama_kabupaten?.toLowerCase() ===
            kecamatanName?.toLowerCase() ||
          feature.properties.nama_kecamatan?.includes(kecamatanName) ||
          feature.properties.nama_kabupaten?.includes(kecamatanName)
      );

      if (alternativeFeatures.length > 0) {
        console.log(
          "Found with alternative search:",
          alternativeFeatures[0].properties
        );
        filteredFeatures.push(...alternativeFeatures);
      } else {
        console.log("No boundary found with any search method");
        batasKecamatanLayer.visible = false;
        return;
      }
    }

    // Create graphics from filtered GeoJSON features (same as homepage)
    const graphics = filteredFeatures.map((feature) => {
      let rings = [];
      if (feature.geometry.type === "MultiPolygon") {
        // Flatten MultiPolygon to single array of rings
        feature.geometry.coordinates.forEach((polygon) => {
          rings.push(...polygon);
        });
      } else if (feature.geometry.type === "Polygon") {
        rings = feature.geometry.coordinates;
      }

      const polygon = new Polygon.default({
        rings: rings,
        spatialReference: { wkid: 4326 },
      });

      // Style for kecamatan boundary - same as homepage
      const symbol = new SimpleFillSymbol.default({
        color: [0, 0, 0, 0], // Transparent fill (no fill)
        outline: new SimpleLineSymbol.default({
          color: [236, 72, 153, 1], // Pink - same as homepage
          width: 1,
          style: "solid",
        }),
      });

      return new Graphic.default({
        geometry: polygon,
        symbol: symbol,
        attributes: feature.properties,
      });
    });

    // Add graphics to layer and make visible
    batasKecamatanLayer.addMany(graphics);
    batasKecamatanLayer.visible = true;
    console.log(
      `Displayed ${graphics.length} kecamatan boundary for: ${kecamatanName}`
    );
  } catch (error) {
    console.error("Error filtering and displaying batas kecamatan:", error);
  }
};

// Filter and display Batas Desa based on selected desa (like homepage)
const filterAndDisplayBatasDesa = async (desaName, batasDesaLayer) => {
  if (!batasDesaLayer) return;

  // Clear existing graphics
  batasDesaLayer.removeAll();

  // If no desa selected, hide the layer
  if (!desaName) {
    batasDesaLayer.visible = false;
    return;
  }

  try {
    // Import required modules
    const [Graphic, Polygon, SimpleFillSymbol, SimpleLineSymbol] =
      await Promise.all([
        import("@arcgis/core/Graphic"),
        import("@arcgis/core/geometry/Polygon"),
        import("@arcgis/core/symbols/SimpleFillSymbol"),
        import("@arcgis/core/symbols/SimpleLineSymbol"),
      ]);

    // Load village boundaries
    const villageResponse = await fetch(
      "/geojson/Batas Desa Kubu Raya.geojson"
    );
    const villageData = await villageResponse.json();

    // Debug: Log the data we're searching for and available data
    console.log("=== DESA FILTER DEBUG ===");
    console.log("Searching for desa:", desaName);
    console.log(
      "Available desa in GeoJSON:",
      villageData.features.slice(0, 3).map((f) => ({
        nama_desa: f.properties.nama_desa,
        nama_kecamatan: f.properties.nama_kecamatan,
        allProps: Object.keys(f.properties),
      }))
    );

    // Filter features by desa name (same as homepage)
    const filteredFeatures = villageData.features.filter(
      (feature) => feature.properties.nama_desa === desaName
    );

    if (filteredFeatures.length === 0) {
      console.log(`No boundary found for desa: ${desaName}`);
      console.log("Trying alternative search methods...");

      // Try alternative search methods
      const alternativeFeatures = villageData.features.filter(
        (feature) =>
          feature.properties.nama_desa === desaName ||
          feature.properties.nama_desa?.toLowerCase() ===
            desaName?.toLowerCase() ||
          feature.properties.nama_kecamatan?.toLowerCase() ===
            desaName?.toLowerCase() ||
          feature.properties.nama_desa?.includes(desaName) ||
          feature.properties.nama_kecamatan?.includes(desaName)
      );

      if (alternativeFeatures.length > 0) {
        console.log(
          "Found with alternative search:",
          alternativeFeatures[0].properties
        );
        filteredFeatures.push(...alternativeFeatures);
      } else {
        console.log("No boundary found with any search method");
        batasDesaLayer.visible = false;
        return;
      }
    }

    // Create graphics from filtered GeoJSON features (same as homepage)
    const graphics = filteredFeatures.map((feature) => {
      let rings = [];
      if (feature.geometry.type === "MultiPolygon") {
        // Flatten MultiPolygon to single array of rings
        feature.geometry.coordinates.forEach((polygon) => {
          rings.push(...polygon);
        });
      } else if (feature.geometry.type === "Polygon") {
        rings = feature.geometry.coordinates;
      }

      const polygon = new Polygon.default({
        rings: rings,
        spatialReference: { wkid: 4326 },
      });

      // Style for desa boundary - same as homepage
      const symbol = new SimpleFillSymbol.default({
        color: [0, 0, 0, 0], // Transparent fill (no fill)
        outline: new SimpleLineSymbol.default({
          color: [168, 85, 247, 1], // Purple - same as homepage
          width: 1,
          style: "solid",
        }),
      });

      return new Graphic.default({
        geometry: polygon,
        symbol: symbol,
        attributes: feature.properties,
      });
    });

    // Add graphics to layer and make visible
    batasDesaLayer.addMany(graphics);
    batasDesaLayer.visible = true;
    console.log(`Displayed ${graphics.length} desa boundary for: ${desaName}`);
  } catch (error) {
    console.error("Error filtering and displaying batas desa:", error);
  }
};

// Load relevant boundaries based on road location (like homepage filter)
const loadRelevantBoundaries = async (
  batasKabupatenLayer,
  batasKecamatanLayer,
  batasDesaLayer
) => {
  if (!props.road) return;

  console.log("=== LOADING BOUNDARIES FOR ROAD ===");
  console.log("Road data:", props.road);

  // Always load kabupaten boundary first (Kubu Raya)
  console.log("Step 1: Loading kabupaten boundary...");
  await loadKabupatenBoundary(batasKabupatenLayer);
  console.log("Step 1 completed: Kabupaten boundary loaded");

  // Ensure kabupaten layer is always visible
  batasKabupatenLayer.visible = true;
  console.log("Kabupaten layer forced visible:", batasKabupatenLayer.visible);

  // Load ONLY the specific kecamatan from the road data
  if (props.road.kecamatan) {
    console.log("Loading kecamatan boundary for:", props.road.kecamatan);
    await filterAndDisplayBatasKecamatan(
      props.road.kecamatan,
      batasKecamatanLayer
    );
    // Ensure kabupaten layer remains visible even when kecamatan is loaded
    batasKabupatenLayer.visible = true;
    console.log(
      "Kabupaten layer kept visible after kecamatan load:",
      batasKabupatenLayer.visible
    );
  }

  // Load ONLY the specific desa from the road data
  if (props.road.desa) {
    console.log("Loading desa boundary for:", props.road.desa);
    await filterAndDisplayBatasDesa(props.road.desa, batasDesaLayer);
  }
};

const loadAllBoundaries = async (
  batasKabupatenLayer,
  batasKecamatanLayer,
  batasDesaLayer
) => {
  try {
    // Load all district boundaries
    const districtResponse = await fetch(
      "/geojson/Batas Kecamatan Kubu Raya.geojson"
    );
    const districtData = await districtResponse.json();

    for (const feature of districtData.features) {
      await addBoundaryToLayer(
        feature,
        batasKecamatanLayer,
        [236, 72, 153, 1], // Pink - kecamatan should be pink
        1.25
      );
    }

    // Load all village boundaries
    const villageResponse = await fetch(
      "/geojson/Batas Desa Kubu Raya.geojson"
    );
    const villageData = await villageResponse.json();

    for (const feature of villageData.features) {
      await addBoundaryToLayer(feature, batasDesaLayer, [168, 85, 247, 1], 0.9); // Purple - same as homepage
    }
  } catch (error) {
    console.error("Error loading all boundaries:", error);
  }
};

const addBoundaryToLayer = async (feature, layer, color, width) => {
  try {
    const [Graphic, Polygon, SimpleFillSymbol, SimpleLineSymbol] =
      await Promise.all([
        import("@arcgis/core/Graphic"),
        import("@arcgis/core/geometry/Polygon"),
        import("@arcgis/core/symbols/SimpleFillSymbol"),
        import("@arcgis/core/symbols/SimpleLineSymbol"),
      ]);

    let rings = [];
    if (feature.geometry.type === "MultiPolygon") {
      feature.geometry.coordinates.forEach((polygon) => {
        rings.push(...polygon);
      });
    } else if (feature.geometry.type === "Polygon") {
      rings = feature.geometry.coordinates;
    }

    const polygon = new Polygon.default({
      rings: rings,
      spatialReference: { wkid: 4326 },
    });

    const symbol = new SimpleFillSymbol.default({
      color: [0, 0, 0, 0], // Transparent fill
      outline: new SimpleLineSymbol.default({
        color: color,
        width: width,
        style: "solid",
      }),
    });

    const graphic = new Graphic.default({
      geometry: polygon,
      symbol: symbol,
      attributes: feature.properties,
    });

    layer.add(graphic);
  } catch (error) {
    console.error("Error adding boundary to layer:", error);
  }
};

// Handle basemap change
const handleBasemapChange = async (basemapId) => {
  if (map) {
    try {
      console.log("Changing basemap to:", basemapId);

      // Special handling for National Geographic basemap (uses Portal Item)
      if (basemapId === "national-geographic") {
        try {
          const [Basemap, PortalItem] = await Promise.all([
            import("@arcgis/core/Basemap"),
            import("@arcgis/core/portal/PortalItem"),
          ]);

          // Create basemap from National Geographic Portal Item
          const portalItem = new PortalItem.default({
            id: "d94dcdbe78e141c2b2d3a91d5ca8b9c9", // National Geographic Style basemap
          });

          const natGeoBasemap = new Basemap.default({
            portalItem: portalItem,
          });

          map.basemap = natGeoBasemap;
          console.log("National Geographic basemap loaded successfully");

          // Update current basemap state
          currentBasemap.value = basemapId;
        } catch (natGeoError) {
          console.error(
            "Error loading National Geographic basemap:",
            natGeoError
          );
          throw natGeoError;
        }
      } else {
        // Standard basemap IDs
        map.basemap = basemapId;
        console.log("Basemap changed successfully to:", basemapId);

        // Update current basemap state
        currentBasemap.value = basemapId;
      }
    } catch (error) {
      console.error("Error changing basemap:", error);
      // Fallback to topo if basemap change fails
      try {
        map.basemap = "topo";
        currentBasemap.value = "topo";
        console.log("Fallback to topo successful");
        toast.warning(
          `Basemap "${basemapId}" tidak tersedia, menggunakan Topographic sebagai gantinya.`
        );
      } catch (fallbackError) {
        console.error("Fallback basemap also failed:", fallbackError);
        toast.error("Gagal mengubah basemap. Silakan coba lagi.");
      }
    }
  }
};

const destroyMap = () => {
  if (roadsLayer) {
    roadsLayer.removeAll();
    roadsLayer = null;
  }
  if (view) {
    view.destroy();
    view = null;
  }
  if (map) {
    map = null;
  }
};

const zoomIn = () => {
  if (view) {
    view.goTo(
      {
        zoom: view.zoom + 1,
      },
      {
        duration: 500,
        easing: "ease-in-out",
      }
    );
  }
};

const zoomOut = () => {
  if (view) {
    view.goTo(
      {
        zoom: view.zoom - 1,
      },
      {
        duration: 500,
        easing: "ease-in-out",
      }
    );
  }
};

watch(
  () => props.visible,
  async (newVal) => {
    if (newVal) {
      await nextTick();
      initMap();
      // Fetch dokumentasi by no_ruas
      if (props.road?.noRuas || props.road?.No_Ruas) {
        const noRuas = props.road.noRuas || props.road.No_Ruas;
        fetchDokumentasiByRuas(noRuas);
      }
    } else {
      destroyMap();
      dokumentasi.value = null;
    }
  }
);

watch(
  () => props.road,
  async (newVal) => {
    if (newVal && props.visible) {
      await nextTick();
      initMap();
      // Fetch dokumentasi when road changes
      if (newVal.noRuas || newVal.No_Ruas) {
        const noRuas = newVal.noRuas || newVal.No_Ruas;
        fetchDokumentasiByRuas(noRuas);
      }
    }
  }
);

onUnmounted(() => {
  destroyMap();
});
</script>

<style scoped>
/* Zoom Controls Styling - matching homepage */
.zoom-controls {
  display: flex;
  flex-direction: column;
}

.zoom-controls button {
  display: block;
  width: 100%;
}

.zoom-controls button:hover {
  z-index: 10;
}

.zoom-controls button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile scroll fixes */
@media (max-width: 768px) {
  .modal-content {
    max-height: 95vh;
    overflow: hidden;
    margin: 0 auto;
    width: calc(100% - 1rem);
    max-width: calc(100% - 1rem);
  }

  .scrollable-content {
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
    max-height: calc(95vh - 120px);
    /* Ensure proper scrolling behavior */
    overscroll-behavior: contain;
    /* Fix for iOS Safari */
    position: relative;
    z-index: 1;
  }

  /* Ensure proper touch scrolling on iOS */
  .scrollable-content::-webkit-scrollbar {
    width: 4px;
  }

  .scrollable-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .scrollable-content::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
  }

  /* Additional mobile fixes */
  .modal-content {
    /* Prevent body scroll when modal is open */
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    right: auto;
    bottom: 0;
    margin: 0;
    width: calc(100% - 1rem);
    max-width: calc(100% - 1rem);
  }
}

/* Additional fixes for very small screens */
@media (max-width: 480px) {
  .scrollable-content {
    max-height: calc(95vh - 100px);
    padding: 12px;
  }

  .modal-content {
    margin: 0;
    max-height: calc(100vh - 16px);
    width: calc(100% - 1rem);
    max-width: calc(100% - 1rem);
    left: 50%;
    transform: translateX(-50%);
    right: auto;
  }
}
</style>
