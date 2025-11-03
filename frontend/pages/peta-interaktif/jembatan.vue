<template>
  <div class="min-h-screen bg-gray-50 flex items-center">
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Peta Interaktif Jembatan Lingkungan
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Halaman ini sedang dalam pengembangan
        </p>
        <NuxtLink
          to="/peta-interaktif/sijali"
          class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Kembali ke Jalan Lingkungan (SIJALI)
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "default",
});

useHead({
  title: "Peta Interaktif Jembatan Lingkungan - SIMANTAP KUBU RAYA",
});
</script>
