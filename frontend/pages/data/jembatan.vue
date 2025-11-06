<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-16">
    <div class="container mx-auto px-4 py-20">
      <div class="max-w-2xl mx-auto">
        <!-- Main Card -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
          <!-- Icon -->
          <div class="mb-8 flex justify-center">
            <div class="relative">
              <div class="absolute inset-0 bg-cyan-100 rounded-full blur-xl opacity-50"></div>
              <div class="relative p-6 bg-cyan-50 rounded-full">
                <svg
                  class="w-16 h-16 text-cyan-500"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                >
                  <path
                    d="M238.6,201.7c-1,0-5.3,0-7.4,0h-19.9c-12.2-34.4-44.8-59-83.4-59c-38.5,0-71.2,24.7-83.4,59H24.8c-2.1,0-6.4,0-7.4,0c-4.1,0-7.4-3.3-7.4-7.4V187v-73.7c0-8.1,6.6-14.8,14.8-14.8h7.4V69H17.4c-4.1,0-7.4-3.3-7.4-7.4c0-4.1,3.3-7.4,7.4-7.4h221.2c4.1,0,7.4,3.3,7.4,7.4c0,4.1-3.3,7.4-7.4,7.4h-14.7v29.5h7.4c8.1,0,14.8,6.6,14.8,14.8V187v7.4C246,198.4,242.7,201.7,238.6,201.7z M76.4,69H46.9v29.5h29.5V69z M120.6,69H91.1v29.5h29.5V69z M164.9,69h-29.5v29.5h29.5V69z M209.1,69h-29.5v29.5h29.5V69z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Badge -->
          <div class="mb-6 flex justify-center">
            <span
              class="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
              Dalam Pengembangan
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Data Jembatan Lingkungan
          </h1>

          <!-- Description -->
          <p class="text-lg text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
            Halaman ini sedang dalam tahap pengembangan. Data lengkap akan segera tersedia.
          </p>

          <!-- Action Button -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <NuxtLink
              to="/data/sijali"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <svg
                class="w-5 h-5"
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
  title: "Data Jembatan Lingkungan - SIMANTAP KUBU RAYA",
  meta: [
    {
      name: "description",
      content: "Data Jembatan Lingkungan Kabupaten Kubu Raya - Halaman dalam pengembangan",
    },
  ],
});
</script>
