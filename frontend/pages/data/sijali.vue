<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center">
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-4xl mx-auto text-center">
        <div class="mb-8">
          <div class="inline-block p-4 bg-yellow-100 rounded-full mb-6">
            <svg
              class="w-16 h-16 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Data Jalan Lingkungan (SIJALI)
          </h1>
          <div
            class="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-6"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
            Halaman ini sedang dalam pengembangan
          </div>
          <p class="text-xl text-gray-600 mb-8">
            Halaman data tabel untuk Jalan Lingkungan (SIJALI) akan segera hadir.
            Silakan kunjungi halaman Peta Interaktif untuk melihat data dalam format peta.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/peta-interaktif/sijali"
            class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
            class="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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
</template>

<script setup>
definePageMeta({
  layout: "default",
});

useHead({
  title: "Data Jalan Lingkungan (SIJALI) - SIMANTAP KUBU RAYA",
  meta: [
    {
      name: "description",
      content: "Data tabel Jalan Lingkungan (SIJALI) - Halaman dalam pengembangan",
    },
  ],
});
</script>

