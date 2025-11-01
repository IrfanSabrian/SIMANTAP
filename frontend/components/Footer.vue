<template>
  <footer class="text-white" style="background-color: #0f1931">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-700"
      >
        <!-- Tentang SIJALI -->
        <div>
          <div class="flex items-start mb-4">
            <div class="flex items-center gap-3 mr-3 flex-shrink-0">
            <img
              src="/assets/images/sijali-logo.svg"
              alt="SIJALI Logo"
                class="h-14 w-auto object-contain"
            />
          </div>
          <div>
              <h3 class="text-xl font-bold text-white">
                SIJALI - Sistem Informasi Jalan Lingkungan
              </h3>
              <p class="text-sm text-gray-200">Kabupaten Kubu Raya</p>
            </div>
          </div>
          <p class="text-gray-200 text-sm leading-relaxed">
            Platform WebGIS untuk pengelolaan data jalan lingkungan di Kabupaten Kubu Raya
          </p>
        </div>

        <!-- Menu Cepat -->
        <div>
          <h4 class="text-base font-semibold mb-4 text-white">Menu Cepat</h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/"
                class="text-gray-200 hover:text-blue-400 transition-colors text-sm"
              >
                Beranda
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/visi-misi-dinas"
                class="text-gray-200 hover:text-blue-400 transition-colors text-sm"
              >
                Visi Misi
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/struktur-organisasi-dinas"
                class="text-gray-200 hover:text-blue-400 transition-colors text-sm"
              >
                Struktur Organisasi
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/berita"
                class="text-gray-200 hover:text-blue-400 transition-colors text-sm"
              >
                Berita
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/dokumentasi-infrastruktur"
                class="text-gray-200 hover:text-blue-400 transition-colors text-sm"
              >
                Dokumentasi Infrastruktur
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/dokumentasi-kegiatan"
                class="text-gray-200 hover:text-blue-400 transition-colors text-sm"
              >
                Dokumentasi Kegiatan
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/ppid"
                class="text-gray-200 hover:text-blue-400 transition-colors text-sm"
              >
                PPID
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Kontak -->
        <div>
          <h4 class="text-base font-semibold mb-4 text-white">Hubungi Kami</h4>
          <div class="space-y-3">
            <div class="flex items-start">
              <i
                class="fas fa-map-marker-alt text-blue-400 mt-1 mr-3 text-sm flex-shrink-0"
              ></i>
              <p class="text-gray-200 text-sm leading-relaxed">
                Jl. Angkasa Pura 2, Tlk. Kapuas, Kec. Sungai Raya, Kabupaten
                Kubu Raya, Kalimantan Barat
              </p>
            </div>
            <div class="flex items-start">
              <i
                class="fas fa-envelope text-blue-400 mt-1 mr-3 text-sm flex-shrink-0"
              ></i>
              <a
                href="mailto:perkim.kuburaya@gmail.com"
                class="text-gray-200 text-sm hover:text-blue-400 transition-colors"
              >
                perkim.kuburaya@gmail.com
              </a>
            </div>
            <div class="flex items-start">
              <i
                class="fas fa-phone-alt text-blue-400 mt-1 mr-3 text-sm flex-shrink-0"
              ></i>
              <a
                href="tel:+62561123456"
                class="text-gray-200 text-sm hover:text-blue-400 transition-colors"
              >
                (0561) 1234567
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="pt-6 text-center">
        <p class="text-gray-200 text-sm">
          © 2025 SIJALI - Sistem Informasi Jalan Lingkungan Kabupaten Kubu Raya
        </p>
        <p class="text-gray-300 text-xs mt-2">All Rights Reserved</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component
</script>
