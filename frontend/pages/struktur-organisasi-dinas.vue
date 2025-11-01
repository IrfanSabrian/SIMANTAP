<template>
  <div>
    <!-- Struktur Organisasi Content -->
    <section class="pt-16 sm:pt-20 py-8 sm:py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Header -->
        <div class="text-left mb-12 ml-0 mt-8">
          <h1
            class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Struktur Organisasi
          </h1>
          <div
            class="w-16 sm:w-24 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-transparent rounded-full"
          ></div>
        </div>

        <!-- Struktur Organisasi Section -->
        <div class="py-12 bg-white rounded-lg shadow-sm">
          <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Deskripsi -->
            <div class="mb-8 text-center">
              <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                Diagram struktur organisasi Bidang Perumahan dan Kawasan
                Permukiman, Dinas PUPR Kabupaten Kubu Raya.
              </p>
            </div>

            <!-- Struktur Organisasi Image with Fancybox -->
            <div class="flex justify-center">
              <a
                href="/struktur-organisasi.png"
                data-fancybox="struktur-organisasi"
                data-caption="Struktur Organisasi Bidang Perumahan dan Kawasan Permukiman"
                class="relative block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-blue-400 group max-w-4xl"
              >
                <img
                  src="/struktur-organisasi.png"
                  alt="Struktur Organisasi Bidang Perumahan dan Kawasan Permukiman"
                  class="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                />
                <!-- Hover Overlay -->
                <div
                  class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center"
                >
                  <div
                    class="bg-white rounded-full p-4 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300"
                  >
                    <svg
                      class="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from "vue";

// Use default layout
definePageMeta({
  layout: "default",
});

// Page metadata
useHead({
  title:
    "Struktur Organisasi - Bidang Perumahan dan Kawasan Permukiman, Dinas PUPR Kabupaten Kubu Raya",
  meta: [
    {
      name: "description",
      content:
        "Struktur organisasi Bidang Perumahan dan Kawasan Permukiman, Dinas Pekerjaan Umum dan Perumahan Rakyat (PUPR) Kabupaten Kubu Raya",
    },
  ],
});

// Scroll to top and initialize Fancybox when component mounts
onMounted(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Wait for Fancybox to be loaded from CDN
  nextTick(() => {
    // Initialize Fancybox for struktur organisasi image
    const initFancybox = () => {
      if (typeof window !== "undefined" && window.Fancybox) {
        // Bind fancybox to struktur organisasi image
        window.Fancybox.bind("[data-fancybox='struktur-organisasi']", {
          Toolbar: {
            display: {
              left: ["infobar"],
              middle: [],
              right: ["close"],
            },
          },
          Images: {
            zoom: true,
          },
          closeButton: "top",
          click: "close",
          wheel: "close",
          keyboard: {
            Escape: "close",
          },
        });
        console.log("Fancybox bound to struktur organisasi");
        return true;
      }
      return false;
    };

    if (initFancybox()) {
      return;
    }

    // Wait for script to load
    const checkFancybox = setInterval(() => {
      if (initFancybox()) {
        clearInterval(checkFancybox);
      }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkFancybox);
      if (typeof window !== "undefined" && !window.Fancybox) {
        console.warn("Fancybox failed to load");
      }
    }, 5000);
  });
});
</script>
