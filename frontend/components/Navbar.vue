<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-[10px] border-b shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]',
      isScrolled && isHomePage
        ? 'bg-[#0f1931]/90 border-gray-700/50'
        : 'bg-white/10 border-white/20',
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left Side: Logo + Nama -->
        <div class="flex items-center flex-1 min-w-0 mr-2">
          <NuxtLink
            to="/"
            class="flex items-center gap-2 sm:gap-3 flex-shrink-0 mr-2 sm:mr-3 hover:opacity-80 transition-opacity"
          >
            <img
              src="/simantap-logo.svg"
              alt="SIMANTAP Logo"
              class="h-10 sm:h-12 md:h-14 w-auto object-contain"
            />
          </NuxtLink>
          <div class="flex flex-col min-w-0 flex-1">
            <h1
              class="text-sm sm:text-base md:text-lg font-bold text-white truncate"
            >
              SIMANTAP KUBU RAYA
            </h1>
            <p class="text-xs sm:text-sm text-white/80 truncate">
              Sistem Informasi Manajemen Tata Permukiman
            </p>
          </div>
        </div>

        <!-- Right Side: Menu + Language Button -->
        <div class="flex items-center space-x-6 flex-shrink-0">
          <!-- Desktop Menu -->
          <div class="hidden md:flex items-baseline space-x-4">
            <!-- Beranda: scrollToSection jika di halaman index, atau NuxtLink jika di halaman lain -->
            <a
              v-if="isHomePage"
              @click.prevent="scrollToSection('hero')"
              href="javascript:void(0)"
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer text-white hover:text-blue-400"
            >
              Beranda
            </a>
            <NuxtLink
              v-else
              to="/"
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors text-white hover:text-blue-400"
            >
              Beranda
            </NuxtLink>

            <div class="relative group">
              <button
                class="px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors text-white hover:text-blue-400"
              >
                Dokumentasi
                <svg
                  class="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <div
                :class="[
                  'absolute left-0 mt-2 w-64 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 backdrop-blur-[10px] border',
                  isScrolled && isHomePage
                    ? 'bg-[#0f1931]/90 border-gray-700/50'
                    : 'bg-[rgba(15,25,49,0.9)] border-white/20',
                ]"
              >
                <div class="py-1">
                  <NuxtLink
                    to="/dokumentasi-infrastruktur"
                    class="block px-4 py-2 text-sm text-white hover:bg-white/20"
                    >Dokumentasi Infrastruktur</NuxtLink
                  >
                  <NuxtLink
                    to="/dokumentasi-kegiatan"
                    class="block px-4 py-2 text-sm text-white hover:bg-white/20"
                    >Dokumentasi Kegiatan</NuxtLink
                  >
                </div>
              </div>
            </div>
            <div class="relative group">
              <button
                class="px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors text-white hover:text-blue-400"
              >
                Peta Interaktif
                <svg
                  class="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <div
                :class="[
                  'absolute left-0 mt-2 w-64 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 backdrop-blur-[10px] border',
                  isScrolled && isHomePage
                    ? 'bg-[#0f1931]/90 border-gray-700/50'
                    : 'bg-[rgba(15,25,49,0.9)] border-white/20',
                ]"
              >
                <div class="py-1">
                  <NuxtLink
                    to="/peta-interaktif/sijali"
                    class="block px-4 py-2 text-sm text-white hover:bg-white/20"
                    >Jalan Lingkungan (SIJALI)</NuxtLink
                  >
                  <NuxtLink
                    to="/peta-interaktif/jembatan"
                    class="block px-4 py-2 text-sm text-white hover:bg-white/20"
                    >Jembatan Lingkungan</NuxtLink
                  >
                  <NuxtLink
                    to="/peta-interaktif/drainase"
                    class="block px-4 py-2 text-sm text-white hover:bg-white/20"
                    >Drainase Lingkungan</NuxtLink
                  >
                  <NuxtLink
                    to="/peta-interaktif/kawasan"
                    class="block px-4 py-2 text-sm text-white hover:bg-white/20"
                    >Kawasan Permukiman</NuxtLink
                  >
                  <NuxtLink
                    to="/peta-interaktif/rumah"
                    class="block px-4 py-2 text-sm text-white hover:bg-white/20"
                    >Rumah Tidak Layak Huni</NuxtLink
                  >
                </div>
              </div>
            </div>
            <div class="relative group">
              <button
                class="px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors text-white hover:text-blue-400"
              >
                Data
                <svg
                  class="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <div
                :class="[
                  'absolute left-0 mt-2 w-64 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 backdrop-blur-[10px] border',
                  isScrolled && isHomePage
                    ? 'bg-[#0f1931]/90 border-gray-700/50'
                    : 'bg-[rgba(15,25,49,0.9)] border-white/20',
                ]"
              >
                <div class="py-1">
                  <NuxtLink
                    to="/data/sijali"
                    class="block px-4 py-2 text-sm text-white hover:bg-white/20"
                    >Jalan Lingkungan (SIJALI)</NuxtLink
                  >
                  <NuxtLink
                    to="/data/jembatan"
                    class="block px-4 py-2 text-sm text-white hover:bg-white/20"
                    >Jembatan Lingkungan</NuxtLink
                  >
                  <NuxtLink
                    to="/data/drainase"
                    class="block px-4 py-2 text-sm text-white hover:bg-white/20"
                    >Drainase Lingkungan</NuxtLink
                  >
                  <NuxtLink
                    to="/data/kawasan"
                    class="block px-4 py-2 text-sm text-white hover:bg-white/20"
                    >Kawasan Permukiman</NuxtLink
                  >
                  <NuxtLink
                    to="/data/rumah"
                    class="block px-4 py-2 text-sm text-white hover:bg-white/20"
                    >Rumah Tidak Layak Huni</NuxtLink
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Translate Button - Desktop (Toggle Switch) -->
          <div class="hidden md:block">
            <button
              @click="handleLanguageToggle"
              :disabled="isChangingLanguage"
              class="relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="currentLanguage === 'id' ? 'bg-red-500' : 'bg-blue-500'"
              :title="
                currentLanguage === 'id'
                  ? 'Switch to English'
                  : 'Beralih ke Indonesia'
              "
            >
              <span
                class="inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 overflow-hidden"
                :class="
                  currentLanguage === 'id' ? 'translate-x-1' : 'translate-x-8'
                "
              >
                <img
                  :src="
                    currentLanguage === 'id'
                      ? '/flags/indonesia.svg'
                      : '/flags/usa.svg'
                  "
                  :alt="currentLanguage === 'id' ? 'Indonesia' : 'USA'"
                  class="w-full h-full object-cover"
                />
              </span>
            </button>
          </div>

          <!-- Mobile: Language Toggle + Hamburger -->
          <div class="flex items-center gap-2 md:hidden flex-shrink-0">
            <!-- Translate Button - Mobile (Toggle Switch) -->
            <button
              @click="handleLanguageToggle"
              :disabled="isChangingLanguage"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              :class="currentLanguage === 'id' ? 'bg-red-500' : 'bg-blue-500'"
              :title="
                currentLanguage === 'id'
                  ? 'Switch to English'
                  : 'Beralih ke Indonesia'
              "
            >
              <span
                class="inline-flex h-4 w-4 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 overflow-hidden"
                :class="
                  currentLanguage === 'id' ? 'translate-x-1' : 'translate-x-6'
                "
              >
                <img
                  :src="
                    currentLanguage === 'id'
                      ? '/flags/indonesia.svg'
                      : '/flags/usa.svg'
                  "
                  :alt="currentLanguage === 'id' ? 'Indonesia' : 'USA'"
                  class="w-full h-full object-cover"
                />
              </span>
            </button>

            <!-- Mobile menu button -->
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="focus:outline-none transition-colors flex-shrink-0 p-1 text-white hover:text-blue-400"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  v-if="!mobileMenuOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-show="mobileMenuOpen" class="md:hidden">
      <div
        :class="[
          'px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t transition-all duration-300 backdrop-blur-[10px]',
          isScrolled && isHomePage
            ? 'bg-[#0f1931]/90 border-gray-700/50'
            : 'bg-[rgba(15,25,49,0.85)] border-white/20',
        ]"
      >
        <a
          v-if="isHomePage"
          @click.prevent="
            scrollToSection('hero');
            closeMobileMenu();
          "
          href="javascript:void(0)"
          class="block px-3 py-2 rounded-md text-base font-medium transition-colors text-white hover:text-blue-400"
          >Beranda</a
        >
        <NuxtLink
          v-else
          to="/"
          @click="closeMobileMenu"
          class="block px-3 py-2 rounded-md text-base font-medium transition-colors text-white hover:text-blue-400"
          >Beranda</NuxtLink
        >

        <!-- Dokumentasi Menu - Mobile -->
        <div class="py-2">
          <button
            @click="dokumentasiMenuOpen = !dokumentasiMenuOpen"
            class="w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between transition-colors text-white hover:text-blue-400"
          >
            Dokumentasi
            <svg
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': dokumentasiMenuOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <div v-show="dokumentasiMenuOpen" class="pl-4 mt-2 space-y-2">
            <NuxtLink
              to="/dokumentasi-infrastruktur"
              @click="closeMobileMenu"
              class="block px-3 py-2 rounded-md text-sm transition-colors text-white/80 hover:text-blue-400"
              >Dokumentasi Infrastruktur</NuxtLink
            >
            <NuxtLink
              to="/dokumentasi-kegiatan"
              @click="closeMobileMenu"
              class="block px-3 py-2 rounded-md text-sm transition-colors text-white/80 hover:text-blue-400"
              >Dokumentasi Kegiatan</NuxtLink
            >
          </div>
        </div>

        <!-- Peta Interaktif Menu - Mobile -->
        <div class="py-2">
          <button
            @click="petaInteraktifMenuOpen = !petaInteraktifMenuOpen"
            class="w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between transition-colors text-white hover:text-blue-400"
          >
            Peta Interaktif
            <svg
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': petaInteraktifMenuOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <div v-show="petaInteraktifMenuOpen" class="pl-4 mt-2 space-y-2">
            <NuxtLink
              to="/peta-interaktif/sijali"
              @click="closeMobileMenu"
              class="block px-3 py-2 rounded-md text-sm transition-colors text-white/80 hover:text-blue-400"
              >Jalan Lingkungan (SIJALI)</NuxtLink
            >
            <NuxtLink
              to="/peta-interaktif/jembatan"
              @click="closeMobileMenu"
              class="block px-3 py-2 rounded-md text-sm transition-colors text-white/80 hover:text-blue-400"
              >Jembatan Lingkungan</NuxtLink
            >
            <NuxtLink
              to="/peta-interaktif/drainase"
              @click="closeMobileMenu"
              class="block px-3 py-2 rounded-md text-sm transition-colors text-white/80 hover:text-blue-400"
              >Drainase Lingkungan</NuxtLink
            >
            <NuxtLink
              to="/peta-interaktif/kawasan"
              @click="closeMobileMenu"
              class="block px-3 py-2 rounded-md text-sm transition-colors text-white/80 hover:text-blue-400"
              >Kawasan Permukiman</NuxtLink
            >
            <NuxtLink
              to="/peta-interaktif/rumah"
              @click="closeMobileMenu"
              class="block px-3 py-2 rounded-md text-sm transition-colors text-white/80 hover:text-blue-400"
              >Rumah Tidak Layak Huni</NuxtLink
            >
          </div>
        </div>

        <!-- Data Menu - Mobile -->
        <div class="py-2">
          <button
            @click="dataMenuOpen = !dataMenuOpen"
            class="w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between transition-colors text-white hover:text-blue-400"
          >
            Data
            <svg
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': dataMenuOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <div v-show="dataMenuOpen" class="pl-4 mt-2 space-y-2">
            <NuxtLink
              to="/data/sijali"
              @click="closeMobileMenu"
              class="block px-3 py-2 rounded-md text-sm transition-colors text-white/80 hover:text-blue-400"
              >Jalan Lingkungan (SIJALI)</NuxtLink
            >
            <NuxtLink
              to="/data/jembatan"
              @click="closeMobileMenu"
              class="block px-3 py-2 rounded-md text-sm transition-colors text-white/80 hover:text-blue-400"
              >Jembatan Lingkungan</NuxtLink
            >
            <NuxtLink
              to="/data/drainase"
              @click="closeMobileMenu"
              class="block px-3 py-2 rounded-md text-sm transition-colors text-white/80 hover:text-blue-400"
              >Drainase Lingkungan</NuxtLink
            >
            <NuxtLink
              to="/data/kawasan"
              @click="closeMobileMenu"
              class="block px-3 py-2 rounded-md text-sm transition-colors text-white/80 hover:text-blue-400"
              >Kawasan Permukiman</NuxtLink
            >
            <NuxtLink
              to="/data/rumah"
              @click="closeMobileMenu"
              class="block px-3 py-2 rounded-md text-sm transition-colors text-white/80 hover:text-blue-400"
              >Rumah Tidak Layak Huni</NuxtLink
            >
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useGoogleTranslate } from "~/composables/useGoogleTranslate";

const route = useRoute();

const mobileMenuOpen = ref(false);
const dokumentasiMenuOpen = ref(false);
const petaInteraktifMenuOpen = ref(false);
const dataMenuOpen = ref(false);
const isScrolled = ref(false);
const isChangingLanguage = ref(false);

// Check if current page is home page
const isHomePage = computed(() => route.path === "/");

// Google Translate functionality
const { currentLanguage, initGoogleTranslate, toggleLanguage } =
  useGoogleTranslate();

// Handle language toggle with loading state
const handleLanguageToggle = () => {
  if (isChangingLanguage.value) return; // Prevent multiple clicks

  console.log("Language toggle clicked!");
  isChangingLanguage.value = true;
  toggleLanguage();
  // The page will reload, so no need to reset isChangingLanguage
};

// Close mobile menu when link is clicked
const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
  dokumentasiMenuOpen.value = false;
  petaInteraktifMenuOpen.value = false;
  dataMenuOpen.value = false;
};

const handleScroll = () => {
  // Detect when user scrolls past the hero section (100vh)
  if (isHomePage.value) {
    isScrolled.value = window.scrollY > window.innerHeight * 0.9;
  } else {
    // For non-home pages, always show scrolled style
    isScrolled.value = window.scrollY > 50;
  }
};

// Scroll to section with offset (for home page)
const scrollToSection = (sectionId: string) => {
  // Get target element
  const element = document.getElementById(sectionId);
  if (!element) return;

  // Calculate scroll position with navbar offset
  const navbarHeight = 50;
  const elementPosition = element.offsetTop;
  const offsetPosition = elementPosition - navbarHeight;

  // Scroll to position
  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

onMounted(() => {
  // Check initial scroll position
  handleScroll();

  window.addEventListener("scroll", handleScroll);

  // Initialize Google Translate
  initGoogleTranslate();

  console.log("Navbar mounted, current language:", currentLanguage.value);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
