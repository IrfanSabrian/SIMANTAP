<template>
  <div class="min-h-screen flex flex-col">
    <Navbar :force-blue="true" />
    
    <div class="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-16">
      <div class="container mx-auto px-4 py-20">
        <div class="max-w-2xl mx-auto text-center">
          <!-- Logo -->
          <div class="mb-8 flex justify-center">
            <img
              src="/simantap-logo.svg"
              alt="SIMANTAP Logo"
              class="w-32 h-32 object-contain"
            />
          </div>

          <!-- Error Code -->
          <div class="mb-8">
            <h1 class="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {{ error.statusCode || 404 }}
            </h1>
          </div>

          <!-- Error Message -->
          <div class="mb-8">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {{ error.statusCode === 404 ? 'Halaman Tidak Ditemukan' : 'Terjadi Kesalahan' }}
            </h2>
            <p class="text-lg text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
              {{
                error.statusCode === 404
                  ? 'Maaf, halaman yang Anda cari tidak ditemukan. Halaman mungkin telah dipindahkan atau dihapus.'
                  : error.message || 'Terjadi kesalahan saat memuat halaman. Silakan coba lagi nanti.'
              }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <NuxtLink
              to="/"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-lg hover:shadow-xl"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Kembali ke Beranda
            </NuxtLink>
            
            <button
              @click="goBack"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali
            </button>
          </div>

        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
defineProps({
  error: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const goBack = () => {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    router.go(-1);
  } else {
    router.push('/');
  }
};

useHead({
  title: '404 - Halaman Tidak Ditemukan | SIMANTAP KUBU RAYA',
  meta: [
    {
      name: 'description',
      content: 'Halaman yang Anda cari tidak ditemukan. Kembali ke beranda SIMANTAP KUBU RAYA.',
    },
  ],
});
</script>

<style scoped>
/* Additional styles if needed */
</style>

