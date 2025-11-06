<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-16">
    <div class="container mx-auto px-4 py-20">
      <div class="max-w-2xl mx-auto">
        <!-- Main Card -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
          <!-- Icon -->
          <div class="mb-8 flex justify-center">
            <div class="relative">
              <div class="absolute inset-0 bg-teal-100 rounded-full blur-xl opacity-50"></div>
              <div class="relative p-6 bg-teal-50 rounded-full">
                <svg
                  class="w-16 h-16 text-teal-500"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                >
                  <path d="M10,210.5h236v16.8H10V210.5L10,210.5z" />
                  <path
                    d="M90.8,28.8H18v9.9h60.1v70.4H18v9.9h72.8L90.8,28.8L90.8,28.8z"
                  />
                  <path
                    d="M106.2,119.1c-0.4,20.8,0,87.4,0,87.4h67c0,0-2.2-76.5-9.5-96.9c-7.3-20.4-28.8-59.7-69.6-65.5v60.4C94.1,104.5,106.9,105.2,106.2,119.1z"
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
            Data Drainase Lingkungan
          </h1>

          <!-- Description -->
          <p class="text-lg text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
            Halaman ini sedang dalam tahap pengembangan. Data lengkap akan segera tersedia.
          </p>

          <!-- Action Button -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <NuxtLink
              to="/data/jalan-lingkungan"
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
  title: "Data Drainase Lingkungan - SIMANTAP KUBU RAYA",
  meta: [
    {
      name: "description",
      content: "Data Drainase Lingkungan Kabupaten Kubu Raya - Halaman dalam pengembangan",
    },
  ],
});
</script>
