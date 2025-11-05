<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-white to-gray-50">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-rose-600 to-rose-800 text-white py-12">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-2">
              Data Rumah Tidak Layak Huni
            </h1>
            <p class="text-rose-100 text-lg">
              Sistem Informasi Rumah Tidak Layak Huni Kabupaten Kubu Raya
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <!-- Icon -->
          <div class="mb-8">
            <div class="inline-block p-6 bg-rose-100 rounded-full mb-6">
              <svg
                class="w-20 h-20 text-rose-600"
                viewBox="0 -32 576 576"
                fill="currentColor"
              >
                <path
                  d="M288 114.96L69.47 307.71c-1.62 1.46-3.69 2.14-5.47 3.35V496c0 8.84 7.16 16 16 16h149.23L192 439.19l104.11-64-60.16-119.22L384 392.75l-104.11 64L319.81 512H496c8.84 0 16-7.16 16-16V311.1c-1.7-1.16-3.72-1.82-5.26-3.2L288 114.96zm282.69 121.32L512 184.45V48c0-8.84-7.16-16-16-16h-64c-8.84 0-16 7.16-16 16v51.69L314.75 10.31C307.12 3.45 297.56.01 288 0s-19.1 3.41-26.7 10.27L5.31 236.28c-6.57 5.91-7.12 16.02-1.21 22.6l21.4 23.82c5.9 6.57 16.02 7.12 22.6 1.21L277.42 81.63c6.05-5.33 15.12-5.33 21.17 0L527.91 283.9c6.57 5.9 16.69 5.36 22.6-1.21l21.4-23.82c5.9-6.57 5.36-16.69-1.22-22.59z"
                />
              </svg>
            </div>
            <div
              class="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold mb-6"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
              Dalam Pengembangan
            </div>
          </div>

          <!-- Content -->
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Halaman Sedang Dikembangkan
          </h2>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Fitur Data Rumah Tidak Layak Huni saat ini sedang dalam tahap
            pengembangan. Halaman ini akan segera tersedia dengan data lengkap
            rumah tidak layak huni di Kabupaten Kubu Raya.
          </p>

          <!-- Features Coming Soon -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
            <div class="bg-gray-50 rounded-lg p-6">
              <div class="flex items-start gap-4">
                <div class="bg-rose-100 p-3 rounded-lg flex-shrink-0">
                  <svg
                    class="w-6 h-6 text-rose-600"
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
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-2">Data Lengkap</h3>
                  <p class="text-sm text-gray-600">
                    Informasi detail rumah termasuk kondisi, lokasi, dan data
                    pemilik
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-6">
              <div class="flex items-start gap-4">
                <div class="bg-rose-100 p-3 rounded-lg flex-shrink-0">
                  <svg
                    class="w-6 h-6 text-rose-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-2">Export Data</h3>
                  <p class="text-sm text-gray-600">
                    Download data dalam format GeoJSON
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-6">
              <div class="flex items-start gap-4">
                <div class="bg-rose-100 p-3 rounded-lg flex-shrink-0">
                  <svg
                    class="w-6 h-6 text-rose-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-2">
                    Filter & Pencarian
                  </h3>
                  <p class="text-sm text-gray-600">
                    Filter berdasarkan lokasi, tingkat kerusakan, dan kriteria
                    lainnya
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-6">
              <div class="flex items-start gap-4">
                <div class="bg-rose-100 p-3 rounded-lg flex-shrink-0">
                  <svg
                    class="w-6 h-6 text-rose-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-2">Detail View</h3>
                  <p class="text-sm text-gray-600">
                    Lihat informasi lengkap setiap rumah dalam modal detail
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              to="/data/sijali"
              class="inline-flex items-center px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
            >
              <svg
                class="w-5 h-5 mr-2"
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
              Lihat Data Jalan Lingkungan
            </NuxtLink>
            <NuxtLink
              to="/peta-interaktif/rumah"
              class="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Lihat Peta Interaktif
            </NuxtLink>
            <NuxtLink
              to="/"
              class="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Kembali ke Beranda
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "default",
});

useHead({
  title: "Data Rumah Tidak Layak Huni - SIMANTAP KUBU RAYA",
  meta: [
    {
      name: "description",
      content:
        "Data Rumah Tidak Layak Huni Kabupaten Kubu Raya - Halaman dalam pengembangan",
    },
  ],
});
</script>
