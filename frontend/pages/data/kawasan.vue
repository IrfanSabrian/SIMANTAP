<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-16">
    <div class="container mx-auto px-4 py-20">
      <div class="max-w-2xl mx-auto">
        <!-- Main Card -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
          <!-- Icon -->
          <div class="mb-8 flex justify-center">
            <div class="relative">
              <div class="absolute inset-0 bg-emerald-100 rounded-full blur-xl opacity-50"></div>
              <div class="relative p-6 bg-emerald-50 rounded-full">
                <svg
                  class="w-16 h-16 text-emerald-500"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                >
                  <path
                    d="M127,60.7c-1.2,0.5-71.2,53.6-71.2,54c0,0.7,2.2,1,9.5,1h7.3v38.7v38.8l1.2,1.2c1.1,1.1,1.5,1.2,5.5,1.2h4.3v-25.9c0-25.4,0-25.9,1-27.2l1-1.3h16.5c14.1,0,16.6,0.1,17.5,0.8l1.1,0.7v26.5v26.4H151h30.4l1.2-1.2l1.2-1.2v-38.8v-38.7h7.8c4.4,0,8.1-0.2,8.5-0.5c0.9-0.6,1.5-0.1-14.8-12.4l-12.6-9.5l0-14.9c0-11-0.2-15.2-0.6-16.1l-0.6-1.2L160,60.9c-10.1-0.1-11.6,0-12.4,0.7c-0.7,0.7-0.9,1.7-1,6.3l-0.1,5.4l-8.3-6.2C130.2,61,128.5,60.1,127,60.7z M171.7,142.4c1,1.2,1,1.9,1,13v11.7l-1.2,1.2l-1.2,1.2h-16.4c-15.7,0-16.4,0-17.3-1c-0.9-0.9-1-1.6-1-13.4c0-12.4,0-12.5,1.1-13.2c0.9-0.7,3.4-0.8,17.5-0.8h16.5L171.7,142.4z"
                  />
                  <path
                    d="M29.3,106.9C18.7,115,10,121.8,10,122.1s2,0.5,4.4,0.6l4.3,0.1v21.5c0,12.7,0.2,21.8,0.5,22.2c0.4,0.6,3.6,0.7,24.4,0.7h24l0.1-23.7l0.1-23.7H55.1c-10.8,0-12.7-0.1-12.7-0.7c0-0.4,4.8-4.4,10.6-9c5.8-4.6,10.4-8.5,10.3-8.7c-0.7-1.2-12.5-9.5-13.4-9.5C49.3,92.1,40.1,98.7,29.3,106.9z"
                  />
                  <path
                    d="M198.7,96.7c-3.3,2.5-6.1,4.7-6.2,4.8c0,0,4.8,3.9,10.7,8.6c6,4.7,10.8,8.9,10.8,9.2c0,0.6-2,0.7-12.7,0.7h-12.7l0.1,23.7l0.1,23.7l23,0.1c15.3,0,23.3,0,23.9-0.4c0.9-0.5,1-1.2,1-22.4v-21.9h4.5c2.5,0,4.7-0.2,4.8-0.4c0.4-0.6-38.7-30.1-40.1-30.2C205,92.1,203.2,93.2,198.7,96.7z"
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
            Data Kawasan Permukiman
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
  title: "Data Kawasan Permukiman - SIMANTAP KUBU RAYA",
  meta: [
    {
      name: "description",
      content: "Data Kawasan Permukiman Kabupaten Kubu Raya - Halaman dalam pengembangan",
    },
  ],
});
</script>
