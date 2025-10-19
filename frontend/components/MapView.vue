<template>
  <div
    class="bg-white dark:bg-gray-800 overflow-hidden transition-colors duration-300 h-[80vh] w-full"
  >
    <div class="relative h-[80vh] w-full">
      <!-- Mobile Overlay -->
      <transition name="fade">
        <div
          v-if="showMainSidebar"
          class="absolute inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          @click="showMainSidebar = false"
        ></div>
      </transition>

      <!-- Main Sidebar Panel - Inside Canvas -->
      <transition name="slide-sidebar">
        <div
          v-if="showMainSidebar"
          :class="[
            'absolute top-0 left-0 h-full z-[9998] transition-all duration-300 ease-in-out',
            'w-[85%] md:w-80',
          ]"
        >
          <SidebarPanel
            :current-opacity="currentOpacity"
            :current-basemap="currentBasemap"
            :shape-info="shapeInfo"
            @apply-layer="handleApplyLayer"
            @basemap-change="handleBasemapChange"
            @tool-change="handleToolChange"
            @opacity-change="handleOpacityChange"
            @drawing-tool="handleDrawingTool"
            @clear-drawing="handleClearDrawing"
            @selection-mode="handleSelectionMode"
            @close="showMainSidebar = false"
          />
        </div>
      </transition>

      <!-- Legacy Left Sidebar - Inside Canvas -->
      <div
        v-if="showLeftSidebar && !showMainSidebar"
        class="absolute top-0 left-0 h-full w-full md:w-80 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
      >
        <SearchPanel
          v-if="leftSidebarType === 'search'"
          @close="showLeftSidebar = false"
          @location-selected="handleLocationSelected"
          @coordinates-selected="handleCoordinatesSelected"
        />
        <LayerPanel
          v-else-if="leftSidebarType === 'layers'"
          @close="showLeftSidebar = false"
          @basemap-changed="handleBasemapChange"
          @layer-changed="handleLayerChange"
          @layer-loaded="handleLayerLoaded"
        />
        <DrawingSidebar
          v-else-if="leftSidebarType === 'drawing'"
          @close="showLeftSidebar = false"
          @tool-changed="handleToolChange"
          @style-changed="handleStyleChange"
          @import-geojson="handleImportGeoJSON"
          @export-geojson="handleExportGeoJSON"
          @clear-all="handleClearAll"
        />
        <MeasurementTools
          v-else-if="leftSidebarType === 'measurement'"
          ref="measurementToolsRef"
          @close="showLeftSidebar = false"
          @measurement-started="handleMeasurementStart"
          @measurement-cleared="handleMeasurementClear"
        />
      </div>

      <!-- Map Container - Full Width -->
      <div class="w-full h-full relative">
        <!-- Loading Indicator -->
        <div
          v-if="loading"
          class="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-800/90 z-50"
        >
          <div class="text-center">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"
            ></div>
            <p class="text-gray-600 dark:text-gray-400">
              Memuat peta dan data batas wilayah...
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Mohon tunggu sebentar
            </p>
          </div>
        </div>

        <!-- Roads Loading Indicator -->
        <div
          v-if="roadsLoading"
          class="absolute top-4 left-4 z-[9999] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-2"
        >
          <div class="flex items-center">
            <div
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"
            ></div>
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >Memuat data jalan...</span
            >
          </div>
        </div>

        <!-- Roads Error Indicator -->
        <div
          v-if="roadsError"
          class="absolute top-4 left-4 z-[9999] bg-red-100 dark:bg-red-900 rounded-lg shadow-lg border border-red-200 dark:border-red-700 px-3 py-2"
        >
          <div class="flex items-center">
            <svg
              class="w-4 h-4 text-red-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="text-sm text-red-600 dark:text-red-400"
              >Error: {{ roadsError }}</span
            >
          </div>
        </div>

        <!-- Map Canvas -->
        <div ref="mapDiv" class="w-full h-full min-h-[500px] bg-gray-100"></div>

        <!-- Left Control Panel -->
        <!-- Sidebar Toggle Container (shifts with sidebar state) -->
        <div
          :class="[
            'absolute top-4 transition-all duration-300 ease-in-out',
            showMainSidebar || showLeftSidebar
              ? 'controls-container--sidebar-open'
              : 'controls-container--sidebar-closed',
          ]"
        >
          <!-- Main Sidebar Toggle Button -->
          <button
            @click="toggleMainSidebar"
            class="sidebar-toggle-btn px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:text-blue-600 inline-flex items-center gap-3 whitespace-nowrap"
            :title="showMainSidebar ? 'Tutup Sidebar' : 'Buka Sidebar'"
          >
            <template v-if="showMainSidebar">
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
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </template>
            <template v-else>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-gray-700 dark:text-gray-300"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
              <img
                src="/assets/images/sijali-logo.svg"
                alt="SIJALI Logo"
                class="h-12 w-12 object-contain flex-shrink-0"
              />
              <div class="leading-tight text-left">
                <div class="text-base font-extrabold tracking-wide">SIJALI</div>
                <div class="text-[11px] text-gray-500 dark:text-gray-400">
                  Kab. Kubu Raya
                </div>
              </div>
            </template>
          </button>
        </div>

        <!-- Zoom Controls Container (shifts with sidebar state) -->
        <div
          :class="[
            'zoom-controls-container absolute top-28 transition-all duration-300 ease-in-out',
            showMainSidebar || showLeftSidebar
              ? 'controls-container--sidebar-open'
              : 'controls-container--sidebar-closed',
          ]"
        >
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
        </div>

        <!-- Search Control Container (separate, below zoom controls) -->
        <div
          :class="[
            'search-controls-container absolute transition-all duration-300 ease-in-out',
            showMainSidebar || showLeftSidebar
              ? 'controls-container--sidebar-open'
              : 'controls-container--sidebar-closed',
          ]"
          style="top: 12.5rem"
        >
          <div class="search-control">
            <button
              @click="toggleSearchBox"
              class="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:text-blue-500"
              :class="
                searchBoxOpen
                  ? 'text-blue-500'
                  : 'text-gray-600 dark:text-gray-400'
              "
              title="Cari Jalan"
              style="width: 44px"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>

            <!-- Search Box (appears below search button) -->
            <transition name="slide-down">
              <div
                v-if="searchBoxOpen"
                class="search-box absolute left-0 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                style="top: 52px"
              >
                <div class="p-3">
                  <div class="relative">
                    <input
                      v-model="searchQuery"
                      @input="handleSearchInput"
                      @focus="searchFocused = true"
                      type="text"
                      placeholder="Cari nomor ruas atau nama jalan..."
                      class="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    />
                    <button
                      v-if="searchQuery"
                      @click="clearSearch"
                      class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

                  <!-- Autocomplete Results -->
                  <div
                    v-if="searchResults.length > 0 && searchFocused"
                    class="mt-2 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <button
                      v-for="(result, index) in searchResults"
                      :key="index"
                      @click="selectSearchResult(result)"
                      class="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                    >
                      <div>
                        <div
                          class="text-sm font-medium text-gray-800 dark:text-white"
                        >
                          {{ result.nama }}
                        </div>
                        <div
                          class="text-xs text-gray-500 dark:text-gray-400 mt-0.5"
                        >
                          {{ result.desa }}, {{ result.kecamatan }}
                        </div>
                        <div
                          v-if="result.noRuas && result.noRuas !== '-'"
                          class="text-xs text-gray-600 dark:text-gray-300 mt-1"
                        >
                          • No. Ruas: {{ result.noRuas }}
                        </div>
                      </div>
                    </button>
                  </div>

                  <!-- No Results -->
                  <div
                    v-if="
                      searchQuery &&
                      searchResults.length === 0 &&
                      !searchLoading
                    "
                    class="mt-2 text-center py-3 text-sm text-gray-500 dark:text-gray-400"
                  >
                    Tidak ada hasil ditemukan
                  </div>

                  <!-- Loading -->
                  <div
                    v-if="searchLoading"
                    class="mt-2 text-center py-3 text-sm text-gray-500 dark:text-gray-400"
                  >
                    <div
                      class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto"
                    ></div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Legend (Top Right) -->
        <div class="absolute top-4 right-4 z-40">
          <!-- Legend Toggle Button (when hidden) -->
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

          <!-- Legend Content -->
          <div
            v-if="legendVisible"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div class="p-3">
              <!-- Header with Close Button -->
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm font-bold text-gray-800 dark:text-white">
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

              <!-- Boundaries Section -->
              <div class="mb-3">
                <p
                  class="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2"
                >
                  Batas Wilayah
                </p>
                <div class="space-y-1.5">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-0.5 bg-[#3b82f6] rounded"></div>
                    <span class="text-xs text-gray-700 dark:text-gray-300"
                      >Kabupaten</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-0.5 bg-[#ec4899] rounded"></div>
                    <span class="text-xs text-gray-700 dark:text-gray-300"
                      >Kecamatan</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-0.5 bg-[#a855f7] rounded"></div>
                    <span class="text-xs text-gray-700 dark:text-gray-300"
                      >Desa</span
                    >
                  </div>
                </div>
              </div>

              <!-- Road Conditions Section -->
              <div class="border-t border-gray-200 dark:border-gray-700 pt-2">
                <p
                  class="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2"
                >
                  Kondisi Jalan
                </p>
                <div class="space-y-1.5">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-1 bg-[#10b981] rounded"></div>
                    <span class="text-xs text-gray-700 dark:text-gray-300"
                      >Baik</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-1 bg-[#eab308] rounded"></div>
                    <span class="text-xs text-gray-700 dark:text-gray-300"
                      >Sedang</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-1 bg-[#f97316] rounded"></div>
                    <span class="text-xs text-gray-700 dark:text-gray-300"
                      >Rusak Ringan</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-1 bg-[#dc2626] rounded"></div>
                    <span class="text-xs text-gray-700 dark:text-gray-300"
                      >Rusak Berat</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Road Info Box (Bottom Right) -->
        <transition name="slide-up">
          <div
            v-if="roadInfoVisible && selectedRoadInfo"
            class="absolute bottom-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            <!-- Header -->
            <div
              class="bg-blue-600 dark:bg-blue-700 text-white px-4 py-3 flex items-center justify-between"
            >
              <h3 class="font-bold text-lg">
                {{ selectedRoadInfo.nama || "Informasi Jalan" }}
              </h3>
              <button
                @click="closeRoadInfo"
                class="text-white hover:text-gray-200 transition-colors"
                title="Tutup"
              >
                <svg
                  width="20"
                  height="20"
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

            <!-- Content -->
            <div class="p-4 space-y-3 max-h-96 overflow-y-auto">
              <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p class="text-xs text-gray-500 dark:text-gray-400">No Ruas</p>
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white mt-1"
                >
                  {{ selectedRoadInfo.nomorRuas || "-" }}
                </p>
              </div>

              <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p class="text-xs text-gray-500 dark:text-gray-400">Periode</p>
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white mt-1"
                >
                  {{ selectedRoadInfo.periode || "-" }}
                </p>
              </div>

              <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Nama Jalan
                </p>
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white mt-1"
                >
                  {{ selectedRoadInfo.nama || "-" }}
                </p>
              </div>

              <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Kecamatan
                </p>
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white mt-1"
                >
                  {{ selectedRoadInfo.kecamatan || "-" }}
                </p>
              </div>

              <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p class="text-xs text-gray-500 dark:text-gray-400">Desa</p>
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white mt-1"
                >
                  {{ selectedRoadInfo.desa || "-" }}
                </p>
              </div>

              <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p class="text-xs text-gray-500 dark:text-gray-400">Kondisi</p>
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white mt-1"
                >
                  {{ selectedRoadInfo.kondisi || "-" }}
                </p>
              </div>

              <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Keterangan
                </p>
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white mt-1"
                >
                  {{ selectedRoadInfo.keterangan || "-" }}
                </p>
              </div>

              <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p class="text-xs text-gray-500 dark:text-gray-400">Panjang</p>
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white mt-1"
                >
                  {{
                    selectedRoadInfo.panjangM
                      ? selectedRoadInfo.panjangM.toFixed(2) + " m"
                      : "-"
                  }}
                </p>
              </div>

              <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p class="text-xs text-gray-500 dark:text-gray-400">Lebar</p>
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white mt-1"
                >
                  {{
                    selectedRoadInfo.lebarM
                      ? selectedRoadInfo.lebarM + " m"
                      : "-"
                  }}
                </p>
              </div>

              <div class="pb-2">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Dokumentasi
                </p>
                <div
                  @click="openVideoPopup"
                  class="relative cursor-pointer group rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-all"
                >
                  <img
                    src="https://img.youtube.com/vi/1cxs89NrDJo/maxresdefault.jpg"
                    alt="Video Dokumentasi"
                    class="w-full h-32 object-cover"
                  />
                  <div
                    class="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 flex items-center justify-center transition-all"
                  >
                    <div
                      class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                    >
                      <svg
                        class="w-8 h-8 text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Button Laporkan Aduan (dipindah ke footer statis di bawah) -->
            </div>
            <div
              class="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <button
                @click="openAduanForm"
                class="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                title="Laporkan kondisi jalan ini"
              >
                <i class="fas fa-exclamation-triangle"></i>
                <span class="text-sm font-semibold">Laporkan Aduan Jalan</span>
              </button>
            </div>
          </div>
        </transition>

        <!-- Video Popup Modal -->
        <transition name="fade">
          <div
            v-if="videoPopupVisible"
            @click="closeVideoPopup"
            class="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-center justify-center p-4"
          >
            <div
              @click.stop
              class="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl"
            >
              <!-- YouTube Video Embed -->
              <div class="relative" style="padding-bottom: 56.25%">
                <iframe
                  v-if="videoPopupVisible"
                  class="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
                  title="Video Dokumentasi Jalan"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          </div>
        </transition>

        <!-- Aduan Modal -->
        <transition name="fade">
          <div
            v-if="aduanModalVisible"
            @click="aduanModalVisible = false"
            class="absolute inset-0 bg-black bg-opacity-60 z-[10000] flex items-center justify-center p-4"
          >
            <div
              @click.stop
              class="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[75vh]"
            >
              <div
                class="bg-blue-600 text-white px-4 py-3 flex items-center justify-between"
              >
                <h3 class="font-bold">
                  Form Aduan Ruas {{ aduanForm.nomorRuas || "-" }}
                </h3>
                <button
                  @click="aduanModalVisible = false"
                  class="text-white hover:text-gray-200 transition-colors"
                  title="Tutup"
                >
                  <svg
                    width="20"
                    height="20"
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
              <div class="p-4 space-y-4 overflow-y-auto">
                <div
                  class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <label
                      class="block text-sm text-gray-600 dark:text-gray-300"
                      >Nama Pelapor</label
                    >
                    <input
                      type="text"
                      v-model="aduanForm.namaPelapor"
                      :disabled="aduanForm.anonim"
                      class="mt-1 w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Boleh kosong bila anonim"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm text-gray-600 dark:text-gray-300"
                      >Email</label
                    >
                    <input
                      type="email"
                      v-model="aduanForm.email"
                      :disabled="aduanForm.anonim"
                      class="mt-1 w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@contoh.com (opsional)"
                    />
                  </div>
                </div>

                <div
                  class="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                >
                  <label
                    class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <input
                      type="radio"
                      value="false"
                      v-model="aduanForm.anonimString"
                    />
                    <span>Tidak Anonim</span>
                  </label>
                  <label
                    class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <input
                      type="radio"
                      value="true"
                      v-model="aduanForm.anonimString"
                    />
                    <span>Anonim</span>
                  </label>
                </div>

                <div
                  class="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                >
                  <label class="block text-sm text-gray-600 dark:text-gray-300"
                    >Keterangan</label
                  >
                  <textarea
                    v-model="aduanForm.keterangan"
                    rows="3"
                    class="mt-1 w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tuliskan keterangan aduan"
                  ></textarea>
                </div>

                <div
                  class="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                >
                  <label
                    class="block text-sm text-gray-600 dark:text-gray-300 mb-1"
                    >Foto (bisa banyak)
                    <span class="text-red-500">*</span></label
                  >
                  <input
                    type="file"
                    multiple
                    @change="onSelectFiles"
                    accept="image/*"
                  />
                  <div
                    v-if="aduanForm.files.length"
                    class="mt-2 text-xs text-gray-600 dark:text-gray-300 space-y-1"
                  >
                    <div>
                      <strong>{{ aduanForm.files.length }}</strong> file
                      dipilih:
                    </div>
                    <ul class="list-disc list-inside max-h-24 overflow-auto">
                      <li v-for="(f, idx) in aduanForm.files" :key="idx">
                        {{ f.name }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="flex items-center justify-end gap-2 pt-2">
                  <button
                    @click="aduanModalVisible = false"
                    class="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                  >
                    Batal
                  </button>
                  <button
                    @click="submitAduan"
                    :disabled="submitLoading"
                    class="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
                  >
                    <span v-if="!submitLoading">Kirim Aduan</span>
                    <span v-else>Mengirim...</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>

  <!-- Toast Notifications -->
  <Toast />
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  watch,
  markRaw,
} from "vue";
import DrawingSidebar from "./DrawingSidebar.vue";
import LayerPanel from "./LayerPanel.vue";
import LegendPanel from "./LegendPanel.vue";
import MeasurementTools from "./MeasurementTools.vue";
import SearchPanel from "./SearchPanel.vue";
import SidebarPanel from "./SidebarPanel.vue";
import Toast from "./Toast.vue";
import { useApiService } from "~/composables/useApiService";
import { useToast } from "~/composables/useToast";

// API Service
const { fetchRoadsGeoJSON } = useApiService();
const toast = useToast();

// Function to calculate optimal bounds for Kubu Raya district
const calculateAllDataBounds = () => {
  // Approximate central coordinate for Kabupaten Kubu Raya (near Kuala Dua–Ambawang)
  // Around: 0°5' S, 109°20' E
  const kubuRayaCenter = {
    longitude: 109.3333, // 109°20' E
    latitude: -0.0833, // 0°5' S
  };

  // Adjusted bounds to frame Kubu Raya more evenly
  const bounds = {
    minLon: 108.9, // Western boundary
    maxLon: 109.8, // Eastern boundary
    minLat: -0.5, // Southern boundary
    maxLat: 0.3, // Northern boundary
  };

  // Calculate zoom level to fit entire Kalimantan Barat province
  const lonRange = bounds.maxLon - bounds.minLon;
  const latRange = bounds.maxLat - bounds.minLat;
  const maxRange = Math.max(lonRange, latRange);

  // Add padding to ensure entire province is visible
  const paddedRange = maxRange * 1.1;

  let zoomLevel;
  if (paddedRange > 5.0) {
    zoomLevel = 6; // Very large area (entire province)
  } else if (paddedRange > 2.0) {
    zoomLevel = 7; // Large area
  } else if (paddedRange > 1.0) {
    zoomLevel = 8; // Medium-large area
  } else if (paddedRange > 0.5) {
    zoomLevel = 9; // Medium area
  } else {
    zoomLevel = 10; // Smaller area
  }

  return {
    center: [kubuRayaCenter.longitude, kubuRayaCenter.latitude],
    zoom: zoomLevel,
    bounds: bounds,
  };
};

// Refs
const mapDiv = ref(null);
const loading = ref(true);
// Sidebar: open by default on desktop, closed on mobile
const showMainSidebar = ref(
  typeof window !== "undefined" ? window.innerWidth >= 768 : true
);
const showLeftSidebar = ref(false); // Legacy sidebar panels
const showRightSidebar = ref(false);
const showHelp = ref(false);
const leftSidebarType = ref("search"); // 'search', 'layers', 'drawing', 'measurement'
const measurementToolsRef = ref(null);

// Map variables
let map = null;
let view = null;
let sketch = null;
let graphicsLayer = null;
let measurementLayer = null;
let roadsLayer = null;
let geometryEngine = null;
let batasKabupatenLayer = null;
let batasKecamatanLayer = null;
let batasDesaLayer = null;

// GeoJSON data storage
let batasKabupatenGeoJSON = null;
let batasKecamatanGeoJSON = null;
let batasDesaGeoJSON = null;

// Widget variables
let scaleBar = null;

// Road data
const roadsData = ref([]);
const roadsLoading = ref(false);
const roadsError = ref(null);

// Search state
const searchBoxOpen = ref(false);
const searchQuery = ref("");
const searchResults = ref([]);
const searchLoading = ref(false);
const searchFocused = ref(false);
const selectedRoadGraphic = ref(null); // Track selected road graphic
let searchDebounceTimeout = null;

// Road info box state
const roadInfoVisible = ref(false);
const selectedRoadInfo = ref(null);

// Legend state
const legendVisible = ref(false);

// Video popup state
const videoPopupVisible = ref(false);

// Aduan modal state
const aduanModalVisible = ref(false);
const submitLoading = ref(false);
const aduanForm = reactive({
  nomorRuas: "",
  namaPelapor: "",
  anonimString: "false",
  get anonim() {
    return this.anonimString === "true";
  },
  keterangan: "",
  email: "",
  files: [],
});

// Watch for anonim changes to clear name and email fields
watch(
  () => aduanForm.anonimString,
  (newValue) => {
    if (newValue === "true") {
      aduanForm.namaPelapor = "";
      aduanForm.email = "";
    }
  }
);

// Calculate optimal view for all road data
const optimalView = calculateAllDataBounds();

// Map state
const currentZoom = ref(optimalView.zoom);
const currentScale = ref(50000);
const mapCenter = reactive({
  longitude: optimalView.center[0].toString(),
  latitude: optimalView.center[1].toString(),
});
const mouseCoordinates = reactive({
  longitude: optimalView.center[0].toString(),
  latitude: optimalView.center[1].toString(),
});

// Drawing state
const currentDrawingTool = ref("select");
const currentStyle = ref({
  fillColor: "#3c8dbc",
  strokeColor: "#2c5aa0",
  strokeWidth: 2,
});

// Opacity state
const currentOpacity = ref(100);

// Basemap state
const currentBasemap = ref("topo");

// Load roads data from API as GeoJSON
const loadRoadsData = async (params = {}) => {
  try {
    roadsLoading.value = true;
    roadsError.value = null;

    const result = await fetchRoadsGeoJSON({
      ...params,
    });

    if (result.success) {
      const geoJSON = result.data;
      const featureCount = geoJSON.features ? geoJSON.features.length : 0;
      console.log(`Loaded ${featureCount} roads from API`);

      // Add GeoJSON to map
      if (roadsLayer && geoJSON) {
        await addRoadsToMap(geoJSON);
      }
    } else {
      roadsError.value = result.error;
      console.error("Failed to load roads:", result.error);
    }
  } catch (error) {
    roadsError.value = error.message;
    console.error("Error loading roads:", error);
  } finally {
    roadsLoading.value = false;
  }
};

// Get color based on road condition
const getRoadColor = (feature) => {
  let color = "#666666"; // Default color (gray for unknown)

  switch (feature.properties.keterangan) {
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
      switch (feature.properties.kondisi) {
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

// Function to highlight selected road with cyan outline border
const highlightRoad = async (graphic) => {
  try {
    // Import required modules
    const [SimpleLineSymbol, Graphic] = await Promise.all([
      import("@arcgis/core/symbols/SimpleLineSymbol"),
      import("@arcgis/core/Graphic"),
    ]);

    // Remove previous highlight from measurement layer
    if (measurementLayer) {
      // Remove only highlight graphics (not measurement graphics)
      const highlightGraphics = measurementLayer.graphics.filter(
        (g) => g.attributes && g.attributes.isHighlight
      );
      measurementLayer.removeMany(highlightGraphics);
    }

    // Create cyan outline border as separate graphics on measurement layer
    if (graphic && graphic.geometry) {
      // Get original road color
      const originalColor = getRoadColor({ properties: graphic.attributes });

      // 1. Create thicker cyan line as outer border
      const outlineSymbol = new SimpleLineSymbol.default({
        color: [6, 182, 212, 1], // Cyan color (#06b6d4)
        width: 6, // Thicker for border effect
        style: "solid",
        cap: "round",
        join: "round",
      });

      const outlineGraphic = new Graphic.default({
        geometry: graphic.geometry,
        symbol: outlineSymbol,
        attributes: {
          isHighlight: true, // Mark as highlight graphic
          highlightType: "outline",
        },
      });

      // 2. Create inner line with original color (appears on top of cyan)
      const innerSymbol = new SimpleLineSymbol.default({
        color: originalColor,
        width: 3, // Slightly thicker than original to show better
        style: "solid",
        cap: "round",
        join: "round",
      });

      const innerGraphic = new Graphic.default({
        geometry: graphic.geometry,
        symbol: innerSymbol,
        attributes: {
          isHighlight: true, // Mark as highlight graphic
          highlightType: "inner",
        },
      });

      // Add both graphics to measurement layer (outline first, then inner)
      if (measurementLayer) {
        measurementLayer.add(outlineGraphic);
        measurementLayer.add(innerGraphic);
      }

      selectedRoadGraphic.value = graphic;
    }
  } catch (error) {
    console.error("Error highlighting road:", error);
  }
};

// Function to clear road highlight
const clearRoadHighlight = async () => {
  if (measurementLayer) {
    // Remove only highlight graphics (not measurement graphics)
    const highlightGraphics = measurementLayer.graphics.filter(
      (g) => g.attributes && g.attributes.isHighlight
    );
    measurementLayer.removeMany(highlightGraphics);
  }
  selectedRoadGraphic.value = null;
};

// Add roads to map as graphics
const addRoadsToMap = async (geoJSON) => {
  try {
    // Clear existing roads
    if (roadsLayer) {
      roadsLayer.removeAll();
    }

    // Import required modules
    const [Graphic, Polyline, SimpleLineSymbol] = await Promise.all([
      import("@arcgis/core/Graphic"),
      import("@arcgis/core/geometry/Polyline"),
      import("@arcgis/core/symbols/SimpleLineSymbol"),
    ]);

    // Create graphics from GeoJSON features
    const graphics = geoJSON.features.map((feature) => {
      const polyline = new Polyline.default({
        paths: [feature.geometry.coordinates],
        spatialReference: { wkid: 4326 },
      });

      const color = getRoadColor(feature);

      const symbol = new SimpleLineSymbol.default({
        color: color,
        width: 1.2, // Fixed width
        style: "solid",
      });

      return new Graphic.default({
        geometry: polyline,
        symbol: symbol,
        attributes: feature.properties,
      });
    });

    // Add graphics to roads layer
    roadsLayer.addMany(graphics);
    console.log(`Added ${graphics.length} road graphics to map`);
  } catch (error) {
    console.error("Error adding roads to map:", error);
  }
};

// Load Batas Kabupaten GeoJSON - ONLY for boundary visualization on map
// NOT for statistics or data analysis - use API for that
const loadBatasKabupaten = async () => {
  try {
    const response = await fetch("/geojson/Batas Kabupaten Kubu Raya.geojson");
    batasKabupatenGeoJSON = await response.json();
    console.log(
      `Loaded ${batasKabupatenGeoJSON.features.length} kabupaten boundaries for map visualization`
    );
  } catch (error) {
    console.error("Error loading batas kabupaten:", error);
  }
};

// Display Batas Kabupaten (for "Semua Kecamatan" selection)
const displayBatasKabupaten = async () => {
  if (!batasKabupatenLayer || !batasKabupatenGeoJSON) return;

  // Clear existing graphics
  batasKabupatenLayer.removeAll();

  try {
    // Import required modules
    const [Graphic, Polygon, SimpleFillSymbol, SimpleLineSymbol] =
      await Promise.all([
        import("@arcgis/core/Graphic"),
        import("@arcgis/core/geometry/Polygon"),
        import("@arcgis/core/symbols/SimpleFillSymbol"),
        import("@arcgis/core/symbols/SimpleLineSymbol"),
      ]);

    // Create graphics from GeoJSON features
    const graphics = batasKabupatenGeoJSON.features.map((feature) => {
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

      // Style for kabupaten boundary - no fill, only outline
      const symbol = new SimpleFillSymbol.default({
        color: [0, 0, 0, 0], // Transparent fill (no fill)
        outline: new SimpleLineSymbol.default({
          color: [59, 130, 246, 1], // Blue - tidak nabrak dengan warna jalan
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
  } catch (error) {
    console.error("Error displaying batas kabupaten:", error);
  }
};

// Load Batas Kecamatan GeoJSON - ONLY for boundary visualization on map
// NOT for statistics or data analysis - use API for that
const loadBatasKecamatan = async () => {
  try {
    const response = await fetch("/geojson/Batas Kecamatan Kubu Raya.geojson");
    batasKecamatanGeoJSON = await response.json();
    console.log(
      `Loaded ${batasKecamatanGeoJSON.features.length} kecamatan boundaries for map visualization`
    );
  } catch (error) {
    console.error("Error loading batas kecamatan:", error);
  }
};

// Function to zoom to boundary extent (dynamic zoom based on GeoJSON size)
const zoomToBoundaryExtent = async (layer) => {
  if (!layer || !view || layer.graphics.length === 0) return;

  try {
    // Import Extent module
    const Extent = await import("@arcgis/core/geometry/Extent");

    // Calculate bounds from all graphics in the layer
    let minLon = Infinity,
      maxLon = -Infinity;
    let minLat = Infinity,
      maxLat = -Infinity;

    layer.graphics.forEach((graphic) => {
      if (graphic.geometry && graphic.geometry.rings) {
        graphic.geometry.rings.forEach((ring) => {
          ring.forEach(([lon, lat]) => {
            minLon = Math.min(minLon, lon);
            maxLon = Math.max(maxLon, lon);
            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
          });
        });
      }
    });

    // Check if we have valid bounds
    if (
      minLon !== Infinity &&
      maxLon !== -Infinity &&
      minLat !== Infinity &&
      maxLat !== -Infinity
    ) {
      // Create extent from bounds
      const extent = new Extent.default({
        xmin: minLon,
        ymin: minLat,
        xmax: maxLon,
        ymax: maxLat,
        spatialReference: { wkid: 4326 },
      });

      // Zoom to extent with padding factor (1.2 = 20% padding around the boundary)
      // ArcGIS will automatically calculate the best zoom level to fit the extent
      await view.goTo(extent.expand(1.2), {
        duration: 1000,
        easing: "ease-in-out",
      });

      console.log(
        `Zoomed to boundary extent: [${minLon.toFixed(4)}, ${minLat.toFixed(
          4
        )}] to [${maxLon.toFixed(4)}, ${maxLat.toFixed(4)}]`
      );
    }
  } catch (error) {
    console.error("Error zooming to boundary extent:", error);
  }
};

// Filter and display Batas Kecamatan based on selected kecamatan
const filterAndDisplayBatasKecamatan = async (kecamatanName) => {
  if (!batasKecamatanLayer || !batasKecamatanGeoJSON) return;

  // Clear existing graphics
  batasKecamatanLayer.removeAll();

  // If no kecamatan selected, show kabupaten boundary instead
  if (!kecamatanName) {
    batasKecamatanLayer.visible = false;
    // Display kabupaten boundary
    if (batasKabupatenLayer) {
      await displayBatasKabupaten();
      // Zoom to kabupaten
      setTimeout(() => zoomToBoundaryExtent(batasKabupatenLayer), 500);
    }
    return;
  }

  // Hide kabupaten layer when kecamatan is selected
  if (batasKabupatenLayer) {
    batasKabupatenLayer.removeAll();
    batasKabupatenLayer.visible = false;
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

    // Filter features by kecamatan name
    const filteredFeatures = batasKecamatanGeoJSON.features.filter(
      (feature) => feature.properties.nama_kecamatan === kecamatanName
    );

    if (filteredFeatures.length === 0) {
      console.log(`No boundary found for kecamatan: ${kecamatanName}`);
      batasKecamatanLayer.visible = false;
      return;
    }

    // Create graphics from filtered GeoJSON features
    const graphics = filteredFeatures.map((feature) => {
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

      // Style for kecamatan boundary - no fill, only outline
      const symbol = new SimpleFillSymbol.default({
        color: [0, 0, 0, 0], // Transparent fill (no fill)
        outline: new SimpleLineSymbol.default({
          color: [236, 72, 153, 1], // Pink - tidak nabrak dengan warna jalan
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

    // Zoom to kecamatan boundary after adding graphics
    setTimeout(() => zoomToBoundaryExtent(batasKecamatanLayer), 300);
  } catch (error) {
    console.error("Error filtering and displaying batas kecamatan:", error);
  }
};

// Load Batas Desa GeoJSON - ONLY for boundary visualization on map
// NOT for statistics or data analysis - use API for that
const loadBatasDesa = async () => {
  try {
    const response = await fetch("/geojson/Batas Desa Kubu Raya.geojson");
    batasDesaGeoJSON = await response.json();
    console.log(
      `Loaded ${batasDesaGeoJSON.features.length} desa boundaries for map visualization`
    );
  } catch (error) {
    console.error("Error loading batas desa:", error);
  }
};

// Filter and display Batas Desa based on selected desa
const filterAndDisplayBatasDesa = async (desaName) => {
  if (!batasDesaLayer || !batasDesaGeoJSON) return;

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

    // Filter features by desa name
    const filteredFeatures = batasDesaGeoJSON.features.filter(
      (feature) => feature.properties.nama_desa === desaName
    );

    if (filteredFeatures.length === 0) {
      console.log(`No boundary found for desa: ${desaName}`);
      batasDesaLayer.visible = false;
      return;
    }

    // Create graphics from filtered GeoJSON features
    const graphics = filteredFeatures.map((feature) => {
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

      // Style for desa boundary - no fill, only outline
      const symbol = new SimpleFillSymbol.default({
        color: [0, 0, 0, 0], // Transparent fill (no fill)
        outline: new SimpleLineSymbol.default({
          color: [168, 85, 247, 1], // Purple - tidak nabrak dengan warna jalan
          width: 0.9,
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

    // Zoom to desa boundary after adding graphics
    setTimeout(() => zoomToBoundaryExtent(batasDesaLayer), 300);
  } catch (error) {
    console.error("Error filtering and displaying batas desa:", error);
  }
};

onMounted(async () => {
  try {
    // Configure ArcGIS API
    const config = await import("@arcgis/core/config");
    // Use a free API key or leave empty for basic basemaps
    // config.default.apiKey = "your-api-key-here";

    // Dynamic import ArcGIS modules
    const [
      Map,
      MapView,
      GraphicsLayer,
      Sketch,
      ScaleBar,
      Graphic,
      GeometryEngine,
    ] = await Promise.all([
      import("@arcgis/core/Map"),
      import("@arcgis/core/views/MapView"),
      import("@arcgis/core/layers/GraphicsLayer"),
      import("@arcgis/core/widgets/Sketch"),
      import("@arcgis/core/widgets/ScaleBar"),
      import("@arcgis/core/Graphic"),
      import("@arcgis/core/geometry/geometryEngine"),
    ]);

    // Store geometryEngine globally for shape calculations
    // Try multiple ways to access geometryEngine
    geometryEngine = GeometryEngine.default || GeometryEngine;
    console.log("[onMounted] GeometryEngine module:", GeometryEngine);
    console.log("[onMounted] GeometryEngine.default:", GeometryEngine.default);
    console.log("[onMounted] geometryEngine stored:", geometryEngine);

    if (
      !geometryEngine ||
      typeof geometryEngine.geodesicLength !== "function"
    ) {
      console.error("[onMounted] geometryEngine not properly loaded!");
    } else {
      console.log("[onMounted] ✅ geometryEngine ready!");
    }

    // Create graphics layers
    graphicsLayer = new GraphicsLayer.default({
      title: "Drawing Layer",
    });

    measurementLayer = new GraphicsLayer.default({
      title: "Measurement Layer",
    });

    // Create roads layer
    roadsLayer = new GraphicsLayer.default({
      title: "Jalan Lingkungan",
      visible: true,
    });

    // Create batas kabupaten layer (initially hidden)
    batasKabupatenLayer = new GraphicsLayer.default({
      title: "Batas Kabupaten",
      visible: false,
    });

    // Create batas kecamatan layer (initially hidden)
    batasKecamatanLayer = new GraphicsLayer.default({
      title: "Batas Kecamatan",
      visible: false,
    });

    // Create batas desa layer (initially hidden)
    batasDesaLayer = new GraphicsLayer.default({
      title: "Batas Desa",
      visible: false,
    });

    // Create map with basic basemap that doesn't require API key
    // Layer order: bottom to top (batas desa, batas kecamatan, batas kabupaten, roads, drawing, measurement)
    map = new Map.default({
      basemap: "topo", // Topographic basemap as default
      layers: [
        batasDesaLayer,
        batasKecamatanLayer,
        batasKabupatenLayer,
        roadsLayer,
        graphicsLayer,
        measurementLayer,
      ],
    });

    // Create map view
    view = new MapView.default({
      container: mapDiv.value,
      map: map,
      center: optimalView.center, // Center of Kalimantan Barat province
      zoom: optimalView.zoom,
      ui: {
        components: ["attribution"], // Remove default zoom widget, only keep attribution
      },
      constraints: {
        snapToZoom: false,
      },
    });

    // Create sketch widget
    sketch = new Sketch.default({
      layer: graphicsLayer,
      view: view,
      creationMode: "update", // Allows both creation and updating/deleting
      visibleElements: {
        createTools: {
          point: false,
          polyline: false,
          polygon: false,
          rectangle: false,
          circle: false,
        },
        selectionTools: {
          "lasso-selection": true, // Enable lasso selection
          "rectangle-selection": true, // Enable rectangle selection
        },
        settingsMenu: false,
        undoRedoMenu: true, // Enable undo/redo for better UX
      },
      // Enable deletion of selected graphics
      defaultUpdateOptions: {
        tool: "reshape",
        enableZ: false,
        toggleToolOnClick: false,
      },
    });

    // Add event listener for delete operation
    sketch.on("delete", (event) => {
      console.log("Graphics deleted:", event.graphics.length);
      // Clear shape info when graphic is deleted
      shapeInfo.value = null;
    });

    // Add event listener for create (when drawing is in progress and finished)
    sketch.on("create", async (event) => {
      console.log("Sketch create event:", event.state, event.graphic);
      if (event.state === "complete" && event.graphic) {
        console.log("Shape created - calculating info");
        // Calculate and display shape info
        await calculateShapeInfo(event.graphic);
      }
    });

    // Add event listener for update (when shape is selected or moved)
    sketch.on("update", async (event) => {
      console.log("Sketch update event:", event.state, event.graphics.length);
      if (event.state === "start" && event.graphics.length > 0) {
        console.log("Shape selected - calculating info");
        // Calculate and display shape info for selected shape
        await calculateShapeInfo(event.graphics[0]);
      } else if (event.state === "complete" && event.graphics.length > 0) {
        // Recalculate after shape is moved/resized
        console.log("Shape updated - recalculating info");
        await calculateShapeInfo(event.graphics[0]);
      }
    });

    // Add widgets
    scaleBar = new ScaleBar.default({
      view: view,
      unit: "metric",
    });

    // Add widgets to view (initial positioning, will be adjusted later)
    view.ui.add(scaleBar, {
      position: "manual",
    });

    // Add sketch widget (hidden by default)
    view.ui.add(sketch, "top-right");
    sketch.container.style.display = "none";

    // Wait for view to load
    await view.when();

    console.log("Map view loaded successfully");
    console.log("Map container:", mapDiv.value);
    console.log("View container:", view.container);
    console.log("Current basemap:", map.basemap);
    console.log("Available basemaps:", map.basemap?.baseLayers);

    // Add event listeners
    view.on("pointer-move", (event) => {
      const point = view.toMap({ x: event.x, y: event.y });
      if (point) {
        mouseCoordinates.longitude = point.longitude.toFixed(6);
        mouseCoordinates.latitude = point.latitude.toFixed(6);
      }
    });

    // Add click event listener for road selection
    view.on("click", async (event) => {
      try {
        const response = await view.hitTest(event, {
          include: [roadsLayer],
        });

        if (response.results.length > 0) {
          const graphic = response.results[0].graphic;
          if (graphic && graphic.attributes) {
            // Highlight the selected road
            await highlightRoad(graphic);

            // Show road info box
            selectedRoadInfo.value = {
              nomorRuas:
                graphic.attributes.noRuas || graphic.attributes.no_ruas || null,
              periode: graphic.attributes.tahun || null,
              nama: graphic.attributes.nama || null,
              kecamatan: graphic.attributes.kecamatan || null,
              desa: graphic.attributes.desa || null,
              kondisi: graphic.attributes.kondisi || null,
              keterangan: graphic.attributes.keterangan || null,
              panjangM:
                graphic.attributes.panjangM ||
                graphic.attributes.panjang_m ||
                null,
              lebarM:
                graphic.attributes.lebarM || graphic.attributes.lebar_m || null,
            };
            roadInfoVisible.value = true;
            // Prefill nomor ruas ke form aduan
            aduanForm.nomorRuas = selectedRoadInfo.value.nomorRuas || "";
          }
        } else {
          // Click on empty area - close info box (which also clears highlight)
          await closeRoadInfo();
        }
      } catch (error) {
        console.error("Error handling road click:", error);
      }
    });

    view.watch("zoom", (newZoom) => {
      currentZoom.value = Math.round(newZoom);
      currentScale.value = Math.round(view.scale);
    });

    view.watch("center", (newCenter) => {
      mapCenter.longitude = newCenter.longitude.toFixed(6);
      mapCenter.latitude = newCenter.latitude.toFixed(6);
    });

    view.watch("scale", (newScale) => {
      currentScale.value = Math.round(newScale);
    });

    // Hide loading indicator
    loading.value = false;

    console.log("Map loaded successfully");

    // Load boundary GeoJSON data for map visualization only (NOT for statistics)
    // Statistics should come from API backend
    await loadBatasKabupaten();
    await loadBatasKecamatan();
    await loadBatasDesa();

    // Display kabupaten boundary by default (pertama kali dimuat)
    await displayBatasKabupaten();

    // Set initial view to kabupaten boundary immediately (using extent)
    if (batasKabupatenLayer && batasKabupatenLayer.graphics.length > 0) {
      const Extent = await import("@arcgis/core/geometry/Extent");

      // Calculate kabupaten bounds
      let minLon = Infinity,
        maxLon = -Infinity;
      let minLat = Infinity,
        maxLat = -Infinity;

      batasKabupatenLayer.graphics.forEach((graphic) => {
        if (graphic.geometry && graphic.geometry.rings) {
          graphic.geometry.rings.forEach((ring) => {
            ring.forEach(([lon, lat]) => {
              minLon = Math.min(minLon, lon);
              maxLon = Math.max(maxLon, lon);
              minLat = Math.min(minLat, lat);
              maxLat = Math.max(maxLat, lat);
            });
          });
        }
      });

      if (minLon !== Infinity && maxLon !== -Infinity) {
        // Create extent and expand for padding
        const extent = new Extent.default({
          xmin: minLon,
          ymin: minLat,
          xmax: maxLon,
          ymax: maxLat,
          spatialReference: { wkid: 4326 },
        });

        // Zoom to extent immediately (no animation for initial load)
        await view.goTo(extent.expand(1.2), {
          animate: false,
        });

        console.log(
          "Initial view set to Kabupaten Kubu Raya boundary (instant)"
        );
      }
    }

    // Load roads data from API (after view is set)
    await loadRoadsData();

    // Set initial widget positioning after view is created
    adjustWidgetPositioning();

    // Add window resize listener for responsive scale bar
    window.addEventListener("resize", adjustWidgetPositioning);
  } catch (error) {
    console.error("Error loading map:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    loading.value = false;

    // Show detailed error message to user
    let errorMessage = "Gagal memuat peta. ";

    if (error.message.includes("Failed to fetch")) {
      errorMessage +=
        "Tidak dapat terhubung ke server backend. Pastikan server backend berjalan di port 3001.";
    } else if (error.message.includes("CORS")) {
      errorMessage += "Error CORS. Periksa konfigurasi CORS di backend.";
    } else if (error.message.includes("ArcGIS")) {
      errorMessage += "Error memuat library ArcGIS. Periksa koneksi internet.";
    } else {
      errorMessage += `Detail error: ${error.message}`;
    }

    toast.error(errorMessage);
  }
});

onUnmounted(() => {
  // Clear search timeout
  if (searchDebounceTimeout) {
    clearTimeout(searchDebounceTimeout);
  }

  // Remove window resize listener
  window.removeEventListener("resize", adjustWidgetPositioning);

  if (view) {
    view.destroy();
  }
});

// Watch for sidebar state changes and adjust widget positioning
watch(
  [showMainSidebar, showLeftSidebar],
  () => {
    adjustWidgetPositioning();
  },
  { deep: true }
);

// Sidebar management
const toggleMainSidebar = () => {
  showMainSidebar.value = !showMainSidebar.value;
  // Hide legacy sidebar when main sidebar is shown
  if (showMainSidebar.value) {
    showLeftSidebar.value = false;
  }
  // Adjust widget positioning when sidebar state changes
  adjustWidgetPositioning();
};

// Function to adjust ESRI widget positioning based on sidebar state
const adjustWidgetPositioning = () => {
  if (!view || !scaleBar) return;

  // Determine positioning based on sidebar state
  const isSidebarOpen = showMainSidebar.value || showLeftSidebar.value;

  // Position scale bar based on sidebar state
  const scaleBarContainer = scaleBar.container;
  if (scaleBarContainer) {
    if (isSidebarOpen) {
      // When sidebar is open on desktop, shift scale bar right
      scaleBarContainer.style.left =
        window.innerWidth >= 768 ? "21rem" : "1rem";
    } else {
      // When sidebar is closed, position at left
      scaleBarContainer.style.left = "1rem";
    }
    scaleBarContainer.style.bottom = "1rem";
    scaleBarContainer.style.position = "absolute";
    scaleBarContainer.style.transition = "left 0.3s ease-in-out";
  }
};

const toggleLeftSidebar = (type) => {
  if (leftSidebarType.value === type && showLeftSidebar.value) {
    showLeftSidebar.value = false;
  } else {
    leftSidebarType.value = type;
    showLeftSidebar.value = true;
    // Hide main sidebar when legacy sidebar is shown
    showMainSidebar.value = false;
  }
  // Adjust widget positioning when sidebar state changes
  adjustWidgetPositioning();
};

// Basemap and layer handlers
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

const handleApplyLayer = async (layerData) => {
  console.log("Applying layer filter from sidebar:", layerData);

  // Reset selected road when applying new filter (closes info box and clears highlight)
  await closeRoadInfo();

  // Load roads data with filters
  await loadRoadsData({
    kecamatan: layerData.kecamatan || undefined,
    desa: layerData.desa || undefined,
    tahun: layerData.tahun || undefined,
    kondisi: layerData.kondisi || undefined,
  });

  // Filter and display boundaries based on selection
  await filterAndDisplayBatasKecamatan(layerData.kecamatan || "");
  await filterAndDisplayBatasDesa(layerData.desa || "");

  // Show notification
  let filterText = "Semua data";
  if (layerData.kecamatan) {
    filterText = `Kecamatan: ${layerData.kecamatan}`;
    if (layerData.desa) {
      filterText += `, Desa: ${layerData.desa}`;
    }
  }
  if (layerData.tahun) {
    filterText += `, Tahun: ${layerData.tahun}`;
  }
  if (layerData.kondisi) {
    filterText += `, Kondisi: ${layerData.kondisi}`;
  }

  console.log(`Layer diterapkan untuk: ${filterText}`);

  // Zoom to boundary extent (prioritas: desa > kecamatan > kabupaten)
  setTimeout(() => {
    if (
      layerData.desa &&
      batasDesaLayer &&
      batasDesaLayer.graphics.length > 0
    ) {
      // Zoom to desa boundary
      zoomToBoundaryExtent(batasDesaLayer);
    } else if (
      layerData.kecamatan &&
      batasKecamatanLayer &&
      batasKecamatanLayer.graphics.length > 0
    ) {
      // Zoom to kecamatan boundary
      zoomToBoundaryExtent(batasKecamatanLayer);
    } else if (batasKabupatenLayer && batasKabupatenLayer.graphics.length > 0) {
      // Zoom to kabupaten boundary
      zoomToBoundaryExtent(batasKabupatenLayer);
    }
  }, 500);
};

// Function to zoom to the extent of loaded roads data
const zoomToRoadsExtent = () => {
  if (!roadsLayer || !roadsLayer.graphics || roadsLayer.graphics.length === 0) {
    console.log("No roads data to zoom to");
    return;
  }

  try {
    // Calculate bounds from all road graphics
    let minLon = Infinity,
      maxLon = -Infinity;
    let minLat = Infinity,
      maxLat = -Infinity;

    roadsLayer.graphics.forEach((graphic) => {
      if (graphic.geometry && graphic.geometry.paths) {
        graphic.geometry.paths.forEach((path) => {
          path.forEach(([lon, lat]) => {
            minLon = Math.min(minLon, lon);
            maxLon = Math.max(maxLon, lon);
            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
          });
        });
      }
    });

    // Check if we have valid bounds
    if (
      minLon !== Infinity &&
      maxLon !== -Infinity &&
      minLat !== Infinity &&
      maxLat !== -Infinity
    ) {
      // Calculate center point
      const centerLon = (minLon + maxLon) / 2;
      const centerLat = (minLat + maxLat) / 2;

      // Calculate appropriate zoom level based on extent
      const lonRange = maxLon - minLon;
      const latRange = maxLat - minLat;
      const maxRange = Math.max(lonRange, latRange);

      // Determine zoom level based on extent size
      let zoomLevel;
      if (maxRange > 0.1) {
        zoomLevel = 9; // Large area
      } else if (maxRange > 0.05) {
        zoomLevel = 11; // Medium area
      } else if (maxRange > 0.01) {
        zoomLevel = 13; // Small area
      } else {
        zoomLevel = 15; // Very small area
      }

      // Zoom to the calculated extent
      view.goTo({
        center: [centerLon, centerLat],
        zoom: zoomLevel,
      });

      console.log(
        `Zoomed to roads extent: center [${centerLon}, ${centerLat}], zoom ${zoomLevel}`
      );
      console.log(`Bounds: [${minLon}, ${minLat}] to [${maxLon}, ${maxLat}]`);
    } else {
      console.log("Invalid bounds calculated from roads data");
    }
  } catch (error) {
    console.error("Error zooming to roads extent:", error);
  }
};

// Function to zoom to the extent of GeoJSON data
const zoomToGeoJSONExtent = (geoJsonData) => {
  if (
    !geoJsonData ||
    !geoJsonData.features ||
    geoJsonData.features.length === 0
  ) {
    console.log("No GeoJSON data to zoom to");
    return;
  }

  try {
    // Calculate bounds from all GeoJSON features
    let minLon = Infinity,
      maxLon = -Infinity;
    let minLat = Infinity,
      maxLat = -Infinity;

    geoJsonData.features.forEach((feature) => {
      if (feature.geometry && feature.geometry.coordinates) {
        const processCoordinates = (coords) => {
          if (Array.isArray(coords[0])) {
            // Multi-dimensional array (LineString, Polygon, etc.)
            coords.forEach(processCoordinates);
          } else {
            // Single coordinate pair [lon, lat]
            const [lon, lat] = coords;
            minLon = Math.min(minLon, lon);
            maxLon = Math.max(maxLon, lon);
            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
          }
        };

        processCoordinates(feature.geometry.coordinates);
      }
    });

    // Check if we have valid bounds
    if (
      minLon !== Infinity &&
      maxLon !== -Infinity &&
      minLat !== Infinity &&
      maxLat !== -Infinity
    ) {
      // Calculate center point
      const centerLon = (minLon + maxLon) / 2;
      const centerLat = (minLat + maxLat) / 2;

      // Calculate appropriate zoom level based on extent
      const lonRange = maxLon - minLon;
      const latRange = maxLat - minLat;
      const maxRange = Math.max(lonRange, latRange);

      // Determine zoom level based on extent size
      let zoomLevel;
      if (maxRange > 0.1) {
        zoomLevel = 9; // Large area
      } else if (maxRange > 0.05) {
        zoomLevel = 11; // Medium area
      } else if (maxRange > 0.01) {
        zoomLevel = 13; // Small area
      } else {
        zoomLevel = 15; // Very small area
      }

      // Zoom to the calculated extent
      view.goTo({
        center: [centerLon, centerLat],
        zoom: zoomLevel,
      });

      console.log(
        `Zoomed to GeoJSON extent: center [${centerLon}, ${centerLat}], zoom ${zoomLevel}`
      );
      console.log(`Bounds: [${minLon}, ${minLat}] to [${maxLon}, ${maxLat}]`);
    } else {
      console.log("Invalid bounds calculated from GeoJSON data");
    }
  } catch (error) {
    console.error("Error zooming to GeoJSON extent:", error);
  }
};

const handleOpacityChange = (opacityValue) => {
  console.log("Opacity changed to:", opacityValue);

  // Update current opacity state
  currentOpacity.value = opacityValue;

  if (map && map.layers) {
    // Convert opacity from 0-100 to 0-1 range
    const opacity = opacityValue / 100;

    // Apply opacity to specific operational layers
    map.layers.forEach((layer) => {
      // Apply to roads layer, graphics layer, measurement layer, and GeoJSON layers
      if (
        layer.title === "Jalan Lingkungan" ||
        layer.title === "Drawing Layer" ||
        layer.title === "Measurement Layer" ||
        layer.type === "graphics" ||
        layer.type === "geojson"
      ) {
        layer.opacity = opacity;
        console.log(
          `Applied opacity ${opacity} to layer: ${layer.title || layer.id}`
        );
      }
    });

    console.log(`Applied opacity ${opacity} to all operational layers`);
  }
};

// Zoom controls
const zoomIn = () => {
  if (view) {
    view.goTo({
      zoom: view.zoom + 1,
    });
  }
};

const zoomOut = () => {
  if (view) {
    view.goTo({
      zoom: view.zoom - 1,
    });
  }
};

// Search functions
const toggleSearchBox = () => {
  searchBoxOpen.value = !searchBoxOpen.value;
  if (!searchBoxOpen.value) {
    // Clear search input when closing search box
    searchQuery.value = "";
    searchResults.value = [];
    searchLoading.value = false;
    searchFocused.value = false;

    if (searchDebounceTimeout) {
      clearTimeout(searchDebounceTimeout);
    }
  }
};

const handleSearchInput = () => {
  // Clear previous timeout
  if (searchDebounceTimeout) {
    clearTimeout(searchDebounceTimeout);
  }

  // If query is empty, clear results
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    searchLoading.value = false;
    return;
  }

  // Set loading state
  searchLoading.value = true;

  // Debounce search (wait 300ms after user stops typing)
  searchDebounceTimeout = setTimeout(async () => {
    await performSearch();
  }, 300);
};

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    searchLoading.value = false;
    return;
  }

  try {
    const query = searchQuery.value.trim().toLowerCase();

    // Search through roads layer graphics
    if (roadsLayer && roadsLayer.graphics) {
      const results = [];

      roadsLayer.graphics.forEach((graphic) => {
        const props = graphic.attributes;
        if (props) {
          // Check if road name or noRuas contains search query
          const namaMatch =
            props.nama && props.nama.toLowerCase().includes(query);
          const noRuasMatch =
            props.noRuas && String(props.noRuas).toLowerCase().includes(query);

          if (namaMatch || noRuasMatch) {
            // Use markRaw to prevent Vue from making geometry reactive
            results.push({
              noRuas: props.noRuas || "-",
              nama: props.nama || "-",
              kecamatan: props.kecamatan || "-",
              desa: props.desa || "-",
              keterangan: props.keterangan || props.kondisi || "-",
              geometry: markRaw(graphic.geometry), // Prevent Vue reactivity on ArcGIS objects
            });
          }
        }
      });

      // Limit results to top 10
      searchResults.value = results.slice(0, 10);
    } else {
      searchResults.value = [];
    }
  } catch (error) {
    console.error("Error performing search:", error);
    searchResults.value = [];
  } finally {
    searchLoading.value = false;
  }
};

const selectSearchResult = async (result) => {
  if (!view || !result.geometry) return;

  try {
    // Find the selected road graphic
    // Use noRuas as primary identifier (more unique than nama)
    const selectedGraphic = roadsLayer?.graphics.find((g) => {
      if (result.noRuas && result.noRuas !== "-") {
        return g.attributes?.noRuas === result.noRuas;
      }
      return g.attributes?.nama === result.nama;
    });

    if (selectedGraphic) {
      // Highlight the selected road with cyan outline border
      await highlightRoad(selectedGraphic);

      // Zoom to the road geometry
      await view.goTo(
        {
          target: result.geometry,
          zoom: 16, // Zoom in close to see the road
        },
        {
          duration: 1000,
          easing: "ease-in-out",
        }
      );

      // Show road info box for the selected road
      if (selectedGraphic.attributes) {
        selectedRoadInfo.value = {
          nomorRuas:
            selectedGraphic.attributes.noRuas ||
            selectedGraphic.attributes.no_ruas ||
            null,
          periode: selectedGraphic.attributes.tahun || null,
          nama: selectedGraphic.attributes.nama || null,
          kecamatan: selectedGraphic.attributes.kecamatan || null,
          desa: selectedGraphic.attributes.desa || null,
          kondisi: selectedGraphic.attributes.kondisi || null,
          keterangan: selectedGraphic.attributes.keterangan || null,
          panjangM:
            selectedGraphic.attributes.panjangM ||
            selectedGraphic.attributes.panjang_m ||
            null,
          lebarM:
            selectedGraphic.attributes.lebarM ||
            selectedGraphic.attributes.lebar_m ||
            null,
        };
        roadInfoVisible.value = true;
      }

      // Close search box after selection
      searchBoxOpen.value = false;
      searchFocused.value = false;
      clearSearch();

      console.log(
        `Zoomed to road: ${result.nama} (highlighted with cyan outline border)`
      );
    }
  } catch (error) {
    console.error("Error zooming to search result:", error);
  }
};

// Close road info box and clear highlight
const closeRoadInfo = async () => {
  roadInfoVisible.value = false;
  selectedRoadInfo.value = null;
  // Clear cyan outline when info box is closed
  await clearRoadHighlight();
};

// Open video popup
const openVideoPopup = () => {
  videoPopupVisible.value = true;
};

// Close video popup
const closeVideoPopup = () => {
  videoPopupVisible.value = false;
};

// Open aduan modal
const openAduanForm = () => {
  // Prefill nomor ruas bila tersedia
  if (selectedRoadInfo.value?.nomorRuas) {
    aduanForm.nomorRuas = selectedRoadInfo.value.nomorRuas;
  }
  aduanModalVisible.value = true;
};

const onSelectFiles = (e) => {
  const files = Array.from(e.target.files || []);
  aduanForm.files = files;
};

const { postAduan } = useApiService();
const submitAduan = async () => {
  if (!aduanForm.nomorRuas?.trim()) {
    toast.warning("Nomor ruas wajib diisi");
    return;
  }
  // Email validation removed - now optional

  console.log("Starting aduan submission...");
  submitLoading.value = true;

  try {
    console.log("Calling postAduan with data:", {
      nomorRuas: aduanForm.nomorRuas,
      namaPelapor: aduanForm.namaPelapor,
      anonim: aduanForm.anonim,
      keterangan: aduanForm.keterangan,
      email: aduanForm.email,
      filesCount: aduanForm.files.length,
    });

    const resp = await postAduan({
      nomorRuas: aduanForm.nomorRuas,
      namaPelapor: aduanForm.namaPelapor,
      anonim: aduanForm.anonim,
      keterangan: aduanForm.keterangan,
      email: aduanForm.email,
      files: aduanForm.files,
    });

    console.log("postAduan response:", resp);

    if (!resp.success) {
      throw new Error(resp.error || "Gagal mengirim aduan");
    }

    console.log("Aduan submitted successfully, showing success toast...");
    toast.success(
      "Aduan berhasil terkirim! Aduan Anda akan segera diproses. Terima kasih telah melapor.",
      5000
    );

    // Close modal and reset form
    aduanModalVisible.value = false;
    aduanForm.namaPelapor = "";
    aduanForm.anonimString = "false";
    aduanForm.keterangan = "";
    aduanForm.email = "";
    aduanForm.files = [];

    console.log("Form reset and modal closed");
  } catch (e) {
    console.error("Error in submitAduan:", e);
    toast.error(e.message || "Gagal mengirim aduan");
  } finally {
    console.log("Setting submitLoading to false");
    submitLoading.value = false;
  }
};

const clearSearch = () => {
  searchQuery.value = "";
  searchResults.value = [];
  searchLoading.value = false;
  searchFocused.value = false;

  if (searchDebounceTimeout) {
    clearTimeout(searchDebounceTimeout);
  }

  // Close search box when X button is clicked
  searchBoxOpen.value = false;
};

// Close search results when clicking outside
if (typeof document !== "undefined") {
  document.addEventListener("click", (e) => {
    const searchBox = document.querySelector(".search-box");
    const searchButton = e.target.closest('[title="Cari Jalan"]');

    if (
      searchBox &&
      !searchBox.contains(e.target) &&
      !searchButton &&
      searchFocused.value
    ) {
      searchFocused.value = false;
    }
  });
}

const handleLayerChange = (layerData) => {
  console.log("Layer changed:", layerData);
  // Implement layer visibility and opacity changes
};

// Measurement handlers (from sidebar)
const handleMeasurementTool = async (type) => {
  console.log("Activating measurement tool:", type);

  if (!view) {
    console.error("MapView not initialized");
    return;
  }

  try {
    // Import measurement widgets
    const [DistanceMeasurement2D, AreaMeasurement2D] = await Promise.all([
      import("@arcgis/core/widgets/DistanceMeasurement2D"),
      import("@arcgis/core/widgets/AreaMeasurement2D"),
    ]);

    // Clear existing measurement widgets
    const existingWidgets = view.ui.find("measurement-widget");
    if (existingWidgets) {
      view.ui.remove(existingWidgets);
    }

    if (type === "distance") {
      const distanceWidget = new DistanceMeasurement2D.default({
        view: view,
        id: "measurement-widget",
      });
      view.ui.add(distanceWidget, "top-right");
      distanceWidget.viewModel.start();
      console.log("Distance measurement tool activated");
    } else if (type === "area") {
      const areaWidget = new AreaMeasurement2D.default({
        view: view,
        id: "measurement-widget",
      });
      view.ui.add(areaWidget, "top-right");
      areaWidget.viewModel.start();
      console.log("Area measurement tool activated");
    }
  } catch (error) {
    console.error("Error activating measurement tool:", error);
    toast.error("Gagal mengaktifkan alat ukur");
  }
};

const handleClearMeasurement = () => {
  console.log("Clearing all measurements");

  if (!view) return;

  // Remove ALL measurement widgets (they might have different IDs)
  // Get all widgets and remove only measurement-related ones
  const allWidgets = view.ui._components;
  if (allWidgets) {
    allWidgets.forEach((widget) => {
      if (
        widget.id === "measurement-widget" ||
        widget.declaredClass === "esri.widgets.DistanceMeasurement2D" ||
        widget.declaredClass === "esri.widgets.AreaMeasurement2D"
      ) {
        view.ui.remove(widget);
        console.log("Removed measurement widget");
      }
    });
  }

  // Clear measurement graphics from view.graphics (only non-highlight graphics)
  if (view.graphics) {
    // Keep track of graphics to remove
    const graphicsToRemove = [];
    view.graphics.forEach((graphic) => {
      // Only remove if it's not a highlight graphic
      if (!graphic.attributes || !graphic.attributes.isHighlight) {
        graphicsToRemove.push(graphic);
      }
    });
    view.graphics.removeMany(graphicsToRemove);
    console.log(
      `Removed ${graphicsToRemove.length} measurement graphics from view`
    );
  }

  console.log("All measurements cleared");
};

// Measurement handlers (legacy)
const handleMeasurementStart = async (measurementData) => {
  console.log("Measurement started:", measurementData);

  if (!view) return;

  try {
    // Import measurement widgets
    const [DistanceMeasurement2D, AreaMeasurement2D, CoordinateConversion] =
      await Promise.all([
        import("@arcgis/core/widgets/DistanceMeasurement2D"),
        import("@arcgis/core/widgets/AreaMeasurement2D"),
        import("@arcgis/core/widgets/CoordinateConversion"),
      ]);

    // Clear existing measurement widgets
    const existingWidgets = view.ui.find("measurement-widget");
    if (existingWidgets) {
      view.ui.remove(existingWidgets);
    }

    if (measurementData.type === "distance") {
      const distanceWidget = new DistanceMeasurement2D.default({
        view: view,
        id: "measurement-widget",
      });
      view.ui.add(distanceWidget, "top-right");
      distanceWidget.viewModel.start();
    } else if (measurementData.type === "area") {
      const areaWidget = new AreaMeasurement2D.default({
        view: view,
        id: "measurement-widget",
      });
      view.ui.add(areaWidget, "top-right");
      areaWidget.viewModel.start();
    } else if (measurementData.type === "coordinate") {
      const coordWidget = new CoordinateConversion.default({
        view: view,
        id: "measurement-widget",
      });
      view.ui.add(coordWidget, "top-right");
    } else if (measurementData.type === "stop") {
      // Remove measurement widgets
      const widgets = view.ui.find("measurement-widget");
      if (widgets) {
        view.ui.remove(widgets);
      }
    }
  } catch (error) {
    console.error("Error starting measurement:", error);
    toast.error("Gagal memulai pengukuran");
  }
};

const handleMeasurementClear = () => {
  console.log("Measurements cleared");

  if (!view) return;

  // Remove measurement widgets
  const widgets = view.ui.find("measurement-widget");
  if (widgets) {
    view.ui.remove(widgets);
  }

  // Clear measurement graphics
  if (measurementLayer) {
    measurementLayer.removeAll();
  }

  // Clear graphics from the view
  if (view.graphics) {
    view.graphics.removeAll();
  }
};

// Print and export handlers
const printMap = () => {
  if (view) {
    view.takeScreenshot().then((screenshot) => {
      const link = document.createElement("a");
      link.href = screenshot.dataUrl;
      link.download = `peta-sijali-${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.click();
    });
  }
};

const exportMap = () => {
  // Create export options dialog
  const exportOptions = [
    { format: "PNG", extension: "png" },
    { format: "JPEG", extension: "jpg" },
    { format: "PDF", extension: "pdf" },
  ];

  const format = prompt(
    `Pilih format export:\n${exportOptions
      .map((opt, i) => `${i + 1}. ${opt.format}`)
      .join("\n")}`
  );

  if (format && format >= 1 && format <= exportOptions.length) {
    const selectedFormat = exportOptions[format - 1];

    if (view) {
      view
        .takeScreenshot({ format: selectedFormat.extension })
        .then((screenshot) => {
          const link = document.createElement("a");
          link.href = screenshot.dataUrl;
          link.download = `peta-sijali-${
            new Date().toISOString().split("T")[0]
          }.${selectedFormat.extension}`;
          link.click();
        });
    }
  }
};

// Shape info state for sidebar
const shapeInfo = ref(null);

// Calculate shape info (length or area + GeoJSON)
const calculateShapeInfo = async (graphic) => {
  console.log("[calculateShapeInfo] Called with graphic:", graphic);

  if (!graphic || !graphic.geometry) {
    console.log("[calculateShapeInfo] No graphic or geometry");
    shapeInfo.value = null;
    return;
  }

  if (!geometryEngine) {
    console.error("[calculateShapeInfo] geometryEngine not initialized!");
    shapeInfo.value = null;
    return;
  }

  try {
    console.log("[calculateShapeInfo] Using geometryEngine:", geometryEngine);

    const geometry = graphic.geometry;
    console.log("[calculateShapeInfo] Geometry type:", geometry.type);

    let measurement = "";
    let type = "";

    if (geometry.type === "polyline") {
      // Calculate geodesic length
      console.log("[calculateShapeInfo] Calculating polyline length...");
      const lengthMeters = geometryEngine.geodesicLength(geometry, "meters");
      console.log("[calculateShapeInfo] Length:", lengthMeters, "meters");
      type = "polyline";

      if (lengthMeters >= 1000) {
        measurement = `${(lengthMeters / 1000).toFixed(2)} Km`;
      } else {
        measurement = `${lengthMeters.toFixed(2)} M`;
      }
    } else if (geometry.type === "polygon") {
      // Calculate geodesic area
      console.log("[calculateShapeInfo] Calculating polygon area...");
      const areaSquareMeters = geometryEngine.geodesicArea(
        geometry,
        "square-meters"
      );
      console.log("[calculateShapeInfo] Area:", areaSquareMeters, "m²");
      type = "polygon";

      if (areaSquareMeters >= 10000) {
        // Convert to hectares if >= 1 ha
        measurement = `${(areaSquareMeters / 10000).toFixed(2)} Ha`;
      } else {
        measurement = `${areaSquareMeters.toFixed(2)} M²`;
      }
    } else {
      console.log("[calculateShapeInfo] Unknown geometry type:", geometry.type);
      shapeInfo.value = null;
      return;
    }

    // Generate GeoJSON
    console.log("[calculateShapeInfo] Generating GeoJSON...");
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: geometry.toJSON(),
        },
      ],
    };

    const newInfo = {
      type: type,
      measurement: measurement,
      geojson: JSON.stringify(geojson, null, 2),
    };

    console.log("[calculateShapeInfo] Setting shapeInfo.value to:", newInfo);
    shapeInfo.value = newInfo;
    console.log(
      "[calculateShapeInfo] shapeInfo.value after set:",
      shapeInfo.value
    );
    console.log(
      "[calculateShapeInfo] DONE - Shape info successfully calculated!"
    );
  } catch (error) {
    console.error("[calculateShapeInfo] ERROR:", error);
    console.error("[calculateShapeInfo] Error stack:", error.stack);
    shapeInfo.value = null;
  }
};

// Drawing tool handlers (from sidebar)
const handleDrawingTool = (tool) => {
  console.log("Activating drawing tool:", tool);

  // Clear shape info when starting new drawing
  shapeInfo.value = null;

  if (sketch) {
    // Cancel any active sketch operation
    sketch.cancel();

    // Activate the selected drawing tool
    switch (tool) {
      case "polyline":
        sketch.create("polyline");
        break;
      case "polygon":
        sketch.create("polygon");
        break;
      case "rectangle":
        sketch.create("rectangle");
        break;
      default:
        break;
    }

    console.log(`Drawing tool "${tool}" activated`);
  } else {
    console.error("Sketch widget not initialized");
  }
};

const handleSelectionMode = () => {
  console.log("Activating selection mode");

  if (sketch) {
    // Cancel any active drawing operation
    sketch.cancel();

    // Enable update mode (selection) - this allows clicking on graphics to select and move them
    console.log(
      "Selection mode activated - click on drawn shapes to select and move"
    );
  } else {
    console.error("Sketch widget not initialized");
  }
};

const handleClearDrawing = () => {
  console.log("Clearing all drawings");

  // Clear shape info
  shapeInfo.value = null;

  if (graphicsLayer) {
    graphicsLayer.removeAll();
    console.log("All drawings cleared");
  }

  // Also cancel any active sketch operation
  if (sketch) {
    sketch.cancel();
  }
};

// Drawing tool handlers (legacy)
const handleToolChange = ({ tool, style }) => {
  currentDrawingTool.value = tool;
  currentStyle.value = style;

  if (sketch) {
    // Reset sketch widget
    sketch.cancel();

    // Set active tool
    switch (tool) {
      case "point":
        sketch.create("point");
        break;
      case "polyline":
        sketch.create("polyline");
        break;
      case "polygon":
        sketch.create("polygon");
        break;
      case "rectangle":
        sketch.create("rectangle");
        break;
      case "select":
        // Enable selection mode
        break;
      default:
        break;
    }
  }
};

const handleStyleChange = (style) => {
  currentStyle.value = style;
  // Update existing graphics with new style
  if (graphicsLayer) {
    graphicsLayer.graphics.forEach((graphic) => {
      updateGraphicStyle(graphic, style);
    });
  }
};

const updateGraphicStyle = (graphic, style) => {
  const { fillColor, strokeColor, strokeWidth } = style;

  if (graphic.geometry.type === "point") {
    graphic.symbol = {
      type: "simple-marker",
      color: fillColor,
      outline: {
        color: strokeColor,
        width: strokeWidth,
      },
      size: 8,
    };
  } else if (graphic.geometry.type === "polyline") {
    graphic.symbol = {
      type: "simple-line",
      color: strokeColor,
      width: strokeWidth,
    };
  } else if (graphic.geometry.type === "polygon") {
    graphic.symbol = {
      type: "simple-fill",
      color: fillColor + "80", // Add transparency
      outline: {
        color: strokeColor,
        width: strokeWidth,
      },
    };
  }
};

const handleImportGeoJSON = async (geojson) => {
  try {
    const [Graphic, geometryEngine] = await Promise.all([
      import("@arcgis/core/Graphic"),
      import("@arcgis/core/geometry/geometryEngine"),
    ]);

    // Clear existing graphics
    graphicsLayer.removeAll();

    // Convert GeoJSON to ArcGIS graphics
    if (geojson.type === "FeatureCollection") {
      geojson.features.forEach((feature) => {
        const graphic = new Graphic.default({
          geometry: feature.geometry,
          attributes: feature.properties,
        });
        updateGraphicStyle(graphic, currentStyle.value);
        graphicsLayer.add(graphic);
      });
    } else if (geojson.type === "Feature") {
      const graphic = new Graphic.default({
        geometry: geojson.geometry,
        attributes: geojson.properties,
      });
      updateGraphicStyle(graphic, currentStyle.value);
      graphicsLayer.add(graphic);
    }

    // Zoom to imported graphics
    if (graphicsLayer.graphics.length > 0) {
      view.goTo(graphicsLayer.graphics);
    }
  } catch (error) {
    console.error("Error importing GeoJSON:", error);
    toast.error("Error importing GeoJSON");
  }
};

const handleExportGeoJSON = () => {
  try {
    const features = [];

    graphicsLayer.graphics.forEach((graphic) => {
      const feature = {
        type: "Feature",
        geometry: graphic.geometry.toJSON(),
        properties: graphic.attributes || {},
      };
      features.push(feature);
    });

    const geojson = {
      type: "FeatureCollection",
      features: features,
    };

    // Download as file
    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sijali-drawings.geojson";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting GeoJSON:", error);
    toast.error("Error exporting GeoJSON");
  }
};

const handleClearAll = () => {
  if (graphicsLayer) {
    graphicsLayer.removeAll();
  }
};

// Search handlers
const handleLocationSelected = (location) => {
  if (view) {
    view.goTo({
      center: [location.coordinates.lng, location.coordinates.lat],
      zoom: 16,
    });
  }
};

const handleCoordinatesSelected = (coordinates) => {
  if (view) {
    view.goTo({
      center: [coordinates.lng, coordinates.lat],
      zoom: 16,
    });
  }
};

// Handle layer loaded from data service
const handleLayerLoaded = async (layerData) => {
  if (!view || !layerData || !layerData.data) return;

  try {
    // Import GeoJSON module
    const GeoJSONLayer = await import("@arcgis/core/layers/GeoJSONLayer");

    // Create a blob URL for the GeoJSON data
    const blob = new Blob([JSON.stringify(layerData.data)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    // Create GeoJSON layer
    const geoJsonLayer = new GeoJSONLayer.default({
      url: url,
      title: layerData.name,
      visible: layerData.visible,
      opacity: layerData.opacity || 1.0,
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-line",
          color: layerData.style.color || "#FFD700",
          width: layerData.style.width || 3,
        },
      },
      popupTemplate: {
        title: "{Nama_Jalan}",
        content: [
          {
            type: "fields",
            fieldInfos: [
              { fieldName: "Nama_Jalan", label: "Nama Jalan" },
              { fieldName: "Panjang_M", label: "Panjang (m)" },
              { fieldName: "Lebar_m_", label: "Lebar (m)" },
              { fieldName: "Kondisi", label: "Kondisi" },
              { fieldName: "Keterangan", label: "Keterangan" },
              { fieldName: "Tahun", label: "Tahun" },
              { fieldName: "Kecamatan", label: "Kecamatan" },
              { fieldName: "Desa", label: "Desa" },
            ],
          },
        ],
      },
    });

    // Add layer to map
    map.add(geoJsonLayer);

    // Zoom to layer extent if center and zoom are provided, or auto-calculate extent
    if (layerData.center && layerData.zoom) {
      view.goTo({
        center: layerData.center,
        zoom: layerData.zoom,
      });
    } else {
      // Auto-calculate extent from GeoJSON data and zoom to it
      zoomToGeoJSONExtent(layerData.data);
    }

    // Clean up blob URL after layer is loaded
    geoJsonLayer.when(() => {
      URL.revokeObjectURL(url);
    });

    console.log(`Layer ${layerData.name} loaded successfully`);
  } catch (error) {
    console.error("Error adding layer to map:", error);
    toast.error("Gagal menambahkan layer ke peta");
  }
};

// Expose methods to parent component
defineExpose({
  toggleMainSidebar,
  handleApplyLayer,
  handleBasemapChange,
  handleToolChange,
  handleOpacityChange,
  zoomToRoadsExtent,
  zoomToGeoJSONExtent,
  calculateAllDataBounds,
  handleLocationSelected,
  handleCoordinatesSelected,
  handleLayerChange,
  handleLayerLoaded,
  handleStyleChange,
  handleImportGeoJSON,
  handleExportGeoJSON,
  handleClearAll,
  handleMeasurementStart,
  handleMeasurementClear,
});
</script>

<style scoped>
/* Fade Animation for Overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Sidebar Slide Animation */
.slide-sidebar-enter-active,
.slide-sidebar-leave-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.slide-sidebar-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-sidebar-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-sidebar-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-sidebar-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Slide down transition for search box */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Controls Container - holds both toggle button and zoom controls */
.controls-container {
  display: flex;
  flex-direction: column;
}

/* When sidebar is closed - normal position at left */
.controls-container--sidebar-closed {
  left: 1rem; /* left-4 */
}

/* When sidebar is open - shift right on desktop */
.controls-container--sidebar-open {
  left: 1rem; /* left-4 */
}

/* Desktop styles - shift controls when sidebar is open */
@media (min-width: 768px) {
  .controls-container--sidebar-open {
    left: 21rem; /* 320px (w-80) + 16px (left-4) */
  }

  .controls-container--sidebar-closed {
    left: 1rem; /* left-4 */
  }
}

/* Mobile styles - keep controls in place */
@media (max-width: 767px) {
  .controls-container--sidebar-open,
  .controls-container--sidebar-closed {
    left: 1rem; /* left-4 - stay at left on mobile */
  }
}

/* Zoom Controls Styling */
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

/* Search Controls Container */
.search-controls-container {
  width: 44px; /* Fixed width to match zoom controls */
}

/* Search Control Styling (separate from zoom) */
.search-control {
  position: relative;
  width: 44px; /* Fixed width, same as zoom buttons */
}

.search-control button {
  display: block;
}

.search-control button:hover {
  z-index: 10;
}

.search-control button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Search box absolute positioning to not affect button width */
.search-box {
  z-index: 9999;
}

/* Slide up transition for road info box */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
