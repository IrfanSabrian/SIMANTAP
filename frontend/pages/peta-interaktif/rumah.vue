<template>
  <div class="app">
    <Navbar @toggle-sidebar="handleToggleSidebar" />

    <!-- Hero Section -->
    <section
      id="hero"
      class="hero-section"
      @mousemove="handleMouseMove"
      @mouseleave="resetMousePosition"
    >
      <!-- Background Image with Parallax -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat hero-background"
        :style="getBackgroundStyle('/slider/rumah_tidak_layak_huni.png')"
      >
        <div class="absolute inset-0 hero-gradient-overlay"></div>
      </div>

      <!-- Hero Content Container -->
      <div class="hero-container">
        <!-- Hero Text Content -->
        <div class="hero-content-center" data-aos="fade-up">
          <h1 class="hero-title-main">Rumah Tidak Layak Huni</h1>
          <h2 class="hero-subtitle">Sistem Informasi Rumah Tidak Layak Huni</h2>
          <p class="hero-description-text">
            Sistem informasi geografis yang menyediakan data dan peta interaktif mengenai 
            rumah tidak layak huni di Kabupaten Kubu Raya, termasuk informasi lokasi, kondisi, 
            dan sebaran untuk mendukung program perbaikan dan pembangunan perumahan yang layak.
          </p>
        </div>

        <!-- Stats Cards -->
        <div class="hero-stats" data-aos="fade-up" data-aos-delay="200">
        <div class="stat-card">
          <div class="stat-icon">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              ></path>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">
              <span id="roadLengthCounter">0</span> Km
            </h3>
            <p class="stat-label">Dipetakan</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number" id="districtsCounter">0</h3>
            <p class="stat-label">Kecamatan</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              ></path>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number" id="villagesCounter">0</h3>
            <p class="stat-label">Desa/Kelurahan</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">
              <span id="goodConditionCounter">0</span> Km
            </h3>
            <p class="stat-label">Rumah Layak Huni</p>
          </div>
        </div>
      </div>
      </div>
    </section>

    <!-- Map Section -->
    <section id="map" class="map-section">
      <div class="section-header" data-aos="fade-up">
        <h2 class="section-title">Peta Interaktif</h2>
        <p class="section-description">
          Jelajahi data rumah tidak layak huni melalui peta interaktif dengan berbagai
          layer informasi dan fitur analisis spasial.
        </p>
      </div>

      <div class="map-container" data-aos="zoom-in" data-aos-delay="200">
        <!-- Map Title Frame -->
        <div id="map-canvas" class="map-title-frame">
          <div class="title-frame-content">
            <h3 class="map-title-text">
              Sistem Informasi Rumah Tidak Layak Huni Kab. Kubu Raya
            </h3>
          </div>
        </div>
        <!-- Map Canvas -->
        <div class="map-canvas-wrapper relative" style="pointer-events: none;">
          <div class="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div class="text-center z-10">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
              </svg>
              <p class="text-xl font-semibold text-gray-600">Dalam Pengembangan</p>
              <p class="text-sm text-gray-500 mt-2">Fitur peta interaktif rumah tidak layak huni sedang dalam pengembangan</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Analisis Section -->
    <section id="analisis" class="analisis-section">
      <div class="section-header" data-aos="fade-up">
        <h2 class="section-title">Analisis Kondisi Rumah Tidak Layak Huni</h2>
        <p class="section-description">
          Visualisasi dan analisis mendalam kondisi rumah tidak layak huni berdasarkan tingkat
          kerusakan, karakteristik rumah, dan sebaran geografis di Kabupaten Kubu
          Raya.
        </p>
      </div>
      <div class="analisis-content">
        <div class="analisis-grid">
          <!-- Material Analysis -->
          <!-- Combined Donut Charts -->
          <div class="analisis-card" data-aos="fade-up" data-aos-delay="100">
            <div class="card-header">
              <h3 class="card-title">Analisis Kondisi & Karakteristik Rumah</h3>
              <div class="flex items-center gap-3">
                <select
                  id="kondisiMaterialFilter"
                  class="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Kecamatan</option>
                </select>
                <svg
                  class="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="dual-donut-container">
              <!-- Condition Donut Chart -->
              <div class="donut-section">
                <h4 class="donut-title">Kondisi Rumah</h4>
                <div class="donut-chart">
                  <canvas id="conditionChart" width="200" height="200"></canvas>
                  <div class="chart-center">
                    <div class="center-number">0</div>
                    <div class="center-label">Km</div>
                  </div>
                </div>
              </div>

              <!-- Material Donut Chart -->
              <div class="donut-section">
                <h4 class="donut-title">Karakteristik Rumah</h4>
                <div class="donut-chart">
                  <canvas id="materialChart" width="200" height="200"></canvas>
                  <div class="chart-center">
                    <div class="center-number">0</div>
                    <div class="center-label">Km</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- District Damage Analysis -->
          <div class="analisis-card" data-aos="fade-up" data-aos-delay="200">
            <div class="card-header">
              <h3 class="card-title">Tingkat Kerusakan per Kecamatan</h3>
              <svg
                class="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
            <div class="chart-container">
              <canvas id="districtChart" width="400" height="300"></canvas>
            </div>
          </div>

          <!-- Condition Assessment -->
          <div class="analisis-card" data-aos="fade-up" data-aos-delay="300">
            <div class="card-header">
              <h3 class="card-title">Tingkat Kerusakan per Material</h3>
              <div class="flex items-center gap-3">
                <select
                  id="materialDamageFilter"
                  class="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Kecamatan</option>
                </select>
                <svg
                  class="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="chart-container">
              <canvas
                id="materialDamageChart"
                width="400"
                height="300"
              ></canvas>
            </div>
          </div>

          <!-- Road Length by District -->
          <div class="analisis-card" data-aos="fade-up" data-aos-delay="400">
            <div class="card-header">
              <h3 class="card-title">Jumlah Rumah per Kecamatan</h3>
              <svg
                class="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
            <div class="chart-container">
              <canvas
                id="districtLengthChart"
                width="400"
                height="300"
              ></canvas>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { CountUp } from "countup.js";
import AOS from "aos";
import "aos/dist/aos.css";
// Import components
import Navbar from "~/components/Navbar.vue";
// import MapView from "~/components/MapView.vue"; // Disabled - Dalam Pengembangan

// Halaman index tidak menggunakan layout default karena sudah punya Navbar sendiri
definePageMeta({
  layout: false,
});

// Refs
const mapViewRef = ref(null);
// Disable map for this page
const isMapDisabled = true;

// Stats refs
const totalRoadLength = ref(0);
const totalDistricts = ref(0);
const totalVillages = ref(0);
const goodConditionLength = ref(0);

// CountUp instances
let roadLengthCounter = null;
let districtsCounter = null;
let villagesCounter = null;
let goodConditionCounter = null;

// Flag to track if data is loaded
const statsLoaded = ref(false);

// Flag to track if animation has been played
const animationPlayed = ref(false);

// Intersection Observer for stat cards
let statsObserver = null;

// Flag to prevent scroll detection during manual scroll
let isManualScrolling = false;
let scrollTimeout = null;

// Parallax effect for hero background
const mousePosition = ref({ x: 50, y: 50 });

const handleMouseMove = (event) => {
  if (event.currentTarget instanceof HTMLElement) {
    const rect = event.currentTarget.getBoundingClientRect();
    mousePosition.value = {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    };
  }
};

const resetMousePosition = () => {
  mousePosition.value = { x: 50, y: 50 };
};

const getBackgroundStyle = (image) => {
  const x = mousePosition.value.x;
  const y = mousePosition.value.y;
  const parallaxX = (x - 50) * 0.02;
  const parallaxY = (y - 50) * 0.02;
  return {
    backgroundImage: `url('${image}')`,
    transform: `translate(${parallaxX}%, ${parallaxY}%) scale(1.1)`,
    transition: "transform 0.3s ease-out",
  };
};

// Handle toggle sidebar from navbar
const handleToggleSidebar = () => {
  // Disabled for development pages
  return;
};

// Open map - scroll directly to the blue map canvas
const openMap = () => {
  // Scroll directly to map canvas (the blue part)
  const element = document.getElementById("map-canvas");
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - 200;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  // Optional: You can add interaction with the map here
  setTimeout(() => {
    console.log("Map canvas focused");
  }, 800);
};

// Initialize CountUp instances
const initializeCounters = () => {
  if (typeof window !== "undefined") {
    roadLengthCounter = new CountUp("roadLengthCounter", 0, {
      decimal: ".",
      decimalPlaces: 2,
      duration: 1.2,
      useEasing: true,
      useGrouping: true,
      separator: ",",
    });

    districtsCounter = new CountUp("districtsCounter", 0, {
      duration: 1.2,
      useEasing: true,
      useGrouping: true,
      separator: ",",
    });

    villagesCounter = new CountUp("villagesCounter", 0, {
      duration: 1.2,
      useEasing: true,
      useGrouping: true,
      separator: ",",
    });

    goodConditionCounter = new CountUp("goodConditionCounter", 0, {
      decimal: ".",
      decimalPlaces: 2,
      duration: 1.2,
      useEasing: true,
      useGrouping: true,
      separator: ",",
    });
  }
};

// Start counter animations sequentially (left to right)
const startCounters = () => {
  if (!statsLoaded.value) return;

  // Prevent animation from playing multiple times
  if (animationPlayed.value) return;

  // Mark animation as played
  animationPlayed.value = true;

  // Reset counters to 0 first
  if (roadLengthCounter) roadLengthCounter.reset();
  if (districtsCounter) districtsCounter.reset();
  if (villagesCounter) villagesCounter.reset();
  if (goodConditionCounter) goodConditionCounter.reset();

  // Start animations sequentially with smooth transitions
  // Card 1: Start immediately (0ms)
  setTimeout(() => {
    if (roadLengthCounter && totalRoadLength.value) {
      roadLengthCounter.update(parseFloat(totalRoadLength.value));
    }
  }, 0);

  // Card 2: Start with slight overlap (700ms)
  setTimeout(() => {
    if (districtsCounter && totalDistricts.value) {
      districtsCounter.update(totalDistricts.value);
    }
  }, 700);

  // Card 3: Start with slight overlap (1400ms)
  setTimeout(() => {
    if (villagesCounter && totalVillages.value) {
      villagesCounter.update(totalVillages.value);
    }
  }, 1400);

  // Card 4: Start with slight overlap (2100ms)
  setTimeout(() => {
    if (goodConditionCounter && goodConditionLength.value) {
      goodConditionCounter.update(parseFloat(goodConditionLength.value));
    }
  }, 2100);
};

// Load hero stats from API
const loadHeroStats = async () => {
  try {
    // Get API URL from runtime config
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiUrl;

    // Fetch summary data for total road length and districts
    const summaryResponse = await fetch(`${apiUrl}/jalan/stats/summary`);
    if (summaryResponse.ok) {
      const summaryResult = await summaryResponse.json();
      if (summaryResult.success && summaryResult.data) {
        // Calculate total road length in Km (API returns totalLength not totalPanjang)
        const totalLengthM = summaryResult.data.totalLength || 0;
        totalRoadLength.value = (totalLengthM / 1000).toFixed(2);

        // Count number of districts from kecamatanStats array
        if (summaryResult.data.kecamatanStats) {
          totalDistricts.value = summaryResult.data.kecamatanStats.length;
        }

        console.log("Total road length loaded:", totalRoadLength.value, "Km");
        console.log("Total districts loaded:", totalDistricts.value);
      }
    }

    // Fetch kondisi data for good condition roads
    const kondisiResponse = await fetch(
      `${apiUrl}/jalan/stats/kondisi-material-filtered`
    );
    if (kondisiResponse.ok) {
      const kondisiResult = await kondisiResponse.json();
      if (
        kondisiResult.success &&
        kondisiResult.data &&
        kondisiResult.data.kondisiStats
      ) {
        // Find "Baik" condition and get the sum of panjangM
        const baikCondition = kondisiResult.data.kondisiStats.find(
          (stat) => stat.keterangan === "Baik"
        );

        if (
          baikCondition &&
          baikCondition._sum &&
          baikCondition._sum.panjangM
        ) {
          const baikPanjangM = baikCondition._sum.panjangM;
          goodConditionLength.value = (baikPanjangM / 1000).toFixed(2);
          console.log(
            "Good condition road length loaded:",
            goodConditionLength.value,
            "Km"
          );
        }
      }
    }

    // Fetch unique desa/kelurahan count
    try {
      console.log("Fetching desa count from API...");
      const desaResponse = await fetch(`${apiUrl}/jalan/filters/desa`);
      console.log("Desa response status:", desaResponse.status);

      if (desaResponse.ok) {
        const desaResult = await desaResponse.json();
        console.log("Desa result:", desaResult);

        if (desaResult.success && desaResult.data) {
          totalVillages.value = desaResult.data.length;
          console.log("Total villages loaded:", totalVillages.value);
        } else {
          console.warn("Desa API returned no data, using fallback");
          // Fallback: use a reasonable number based on typical Indonesian administrative structure
          totalVillages.value = 117; // Based on the GeoJSON data we saw earlier
        }
      } else {
        console.warn("Desa API failed, using fallback");
        totalVillages.value = 117; // Fallback
      }
    } catch (err) {
      console.error("Error fetching desa count:", err);
      // Fallback
      totalVillages.value = 117;
    }

    // Mark stats as loaded (but don't start animation yet)
    statsLoaded.value = true;

    // Start counter animation immediately after data is loaded
    setTimeout(() => {
      startCounters();
    }, 500); // Small delay to ensure DOM is ready

    // Load chart data after hero stats are loaded (lower priority)
    setTimeout(async () => {
      console.log("Hero stats loaded, loading charts...");
      // Call initCharts from the component instance
      if (window.initChartsComponent) {
        await window.initChartsComponent.initCharts();
      }
    }, 1000);
  } catch (error) {
    console.error("Error loading hero stats:", error);
  }
};

// Setup Intersection Observer for stat cards
const setupStatsObserver = () => {
  if (typeof window === "undefined") return;

  const statsElement = document.querySelector(".hero-stats");
  if (!statsElement) return;

  // Create intersection observer with threshold for mobile/desktop
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.3, // Trigger when 30% of the element is visible
  };

  statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && statsLoaded.value && !animationPlayed.value) {
        // Element is visible, start counter animation
        console.log("Stat cards visible, starting animation...");
        setTimeout(() => {
          startCounters();
        }, 100);
      }
    });
  }, options);

  // Start observing the stats element
  statsObserver.observe(statsElement);
  console.log("Stats observer setup complete");

  // Check if element is already visible (for desktop)
  // If stat cards are immediately visible on page load, trigger animation
  setTimeout(() => {
    if (statsLoaded.value && !animationPlayed.value) {
      const rect = statsElement.getBoundingClientRect();
      const isVisible =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth);

      // If at least partially visible in viewport, start animation
      const isPartiallyVisible =
        rect.top <
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom > 0;

      if (isVisible || isPartiallyVisible) {
        console.log(
          "Stat cards already visible on load (desktop), starting animation..."
        );
        setTimeout(() => {
          startCounters();
        }, 100);
      }
    }
  }, 300);
};

// Scroll to section function with proper offset
const scrollToSection = (sectionId) => {
  // Disable auto scroll detection temporarily
  isManualScrolling = true;

  // Clear existing timeout
  if (scrollTimeout) clearTimeout(scrollTimeout);

  // Get the target element
  const element = document.getElementById(sectionId);
  if (!element) return;

  // Calculate exact position
  const navbarHeight = 80; // Height of navbar
  const elementTop = element.offsetTop;
  const scrollPosition = elementTop - navbarHeight;

  // Scroll to the position
  window.scrollTo({
    top: scrollPosition,
    behavior: "smooth",
  });

  // Re-enable auto detection after scroll completes
  scrollTimeout = setTimeout(() => {
    isManualScrolling = false;
    // Force update active section
    const event = new CustomEvent("section-change", {
      detail: { activeSection: sectionId },
    });
    window.dispatchEvent(event);
  }, 1000);
};

// Scroll detection for navbar
const handleScroll = () => {
  // Skip auto-detection during manual scrolling
  if (isManualScrolling) return;

  const sections = ["hero", "map", "analisis"];
  const scrollPosition = window.scrollY + 150; // Add more offset for better detection

  let activeId = "hero"; // Default to hero

  for (const sectionId of sections) {
    const element = document.getElementById(sectionId);
    if (element) {
      const { offsetTop, offsetHeight } = element;
      // Check if scroll position is within section bounds
      if (
        scrollPosition >= offsetTop &&
        scrollPosition < offsetTop + offsetHeight
      ) {
        activeId = sectionId;
        break;
      }
    }
  }

  // Emit event to update navbar active section
  const event = new CustomEvent("section-change", {
    detail: { activeSection: activeId },
  });
  window.dispatchEvent(event);
};

// Add scroll listener on mount
onMounted(async () => {
  window.addEventListener("scroll", handleScroll);

  // Initialize AOS
  AOS.init({
    duration: 1000,
    easing: "ease-out-cubic",
    once: false,
    mirror: true,
    offset: 100,
  });

  // Initialize counters first
  initializeCounters();

  // Load hero stats from API first (priority)
  await loadHeroStats();

  // Setup intersection observer for stat cards (with delay to ensure DOM is ready)
  setTimeout(() => {
    setupStatsObserver();
  }, 200);
});

// Remove scroll listener on unmount
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);

  // Disconnect intersection observer
  if (statsObserver) {
    statsObserver.disconnect();
  }
});

// Set page meta
useHead({
  title: "Sistem Informasi Rumah Tidak Layak Huni Kab. Kubu Raya",
  meta: [
    {
      name: "description",
      content:
        "Web GIS untuk Sistem Informasi Rumah Tidak Layak Huni menggunakan ArcGIS JS API",
    },
  ],
});
</script>

<style scoped>
.app {
  @apply min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300;
}

/* Hero Section */
.hero-section {
  @apply text-white flex flex-col justify-center relative overflow-hidden;
  min-height: 100vh;
  padding: 8vh 0 6vh;
}

/* Hero Container */
.hero-container {
  @apply relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  justify-content: center;
  align-items: center;
}

/* Hero Content Center */
.hero-content-center {
  @apply text-center px-4 max-w-5xl mx-auto;
  animation: fadeInUp 0.8s ease-out;
  margin-bottom: 0.5rem;
}

.hero-title-main {
  @apply text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal mb-2 text-white font-sans;
  letter-spacing: -0.02em;
  line-height: 1.1;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.6), 0 2px 10px rgba(0, 0, 0, 0.4);
}

.hero-subtitle {
  @apply text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-3 text-white/95 font-sans;
  letter-spacing: -0.01em;
  line-height: 1.3;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.5);
  font-weight: 600;
}

.hero-description-text {
  @apply text-xs sm:text-sm md:text-base lg:text-lg text-white/90 leading-relaxed font-sans;
  line-height: 1.6;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  max-width: 40rem;
  margin: 0 auto;
  font-weight: 400;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Parallax Background */
.hero-background {
  will-change: transform;
  transition: transform 0.3s ease-out;
}

/* Hero Gradient Overlay */
.hero-gradient-overlay {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.9) 100%
  );
}

.hero-content {
  @apply w-full relative z-10 flex items-center justify-between;
  padding: 5vh 10vw;
}

.hero-text {
  @apply flex-1 max-w-2xl;
}

.hero-badge {
  @apply inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20;
}

.badge-icon {
  @apply text-lg;
}

.badge-text {
  @apply text-sm font-medium text-blue-100;
}

.hero-title {
  @apply mb-8;
}

.title-line-1 {
  @apply block text-4xl font-light text-white/90;
  transition: transform 0.3s ease, color 0.3s ease;
}

.title-line-1:hover {
  transform: translateX(10px);
  color: rgba(255, 255, 255, 1);
}

.title-line-2 {
  @apply block text-5xl font-bold text-white mt-2;
  transition: transform 0.3s ease, letter-spacing 0.3s ease;
}

.title-line-2:hover {
  transform: scale(1.05);
  letter-spacing: 0.05em;
}

.title-highlight {
  @apply block text-3xl font-semibold text-blue-300 mt-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent;
  transition: transform 0.3s ease;
  background-size: 200% auto;
  animation: gradientShift 3s ease infinite;
}

.title-highlight:hover {
  transform: translateX(10px);
}

.hero-description {
  @apply text-lg text-blue-100 mb-10 leading-relaxed max-w-xl;
  transition: transform 0.3s ease, color 0.3s ease;
}

.hero-description:hover {
  transform: translateY(-2px);
  color: rgba(255, 255, 255, 0.95);
}

.hero-buttons {
  @apply flex flex-wrap gap-6;
}

.btn-primary {
  @apply bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105;
  position: relative;
  overflow: hidden;
  min-height: 48px;
  touch-action: manipulation;
}

.btn-primary::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-secondary {
  @apply bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1;
  position: relative;
  overflow: hidden;
  min-height: 48px;
  touch-action: manipulation;
}

.btn-secondary::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.btn-secondary:hover::before {
  left: 100%;
}

.btn-icon {
  @apply mr-4 p-2 bg-white/20 rounded-lg;
}

.btn-content {
  @apply flex flex-col items-start;
}

.btn-title {
  @apply text-base font-semibold;
}

.btn-subtitle {
  @apply text-sm opacity-80;
}

.hero-visual {
  @apply flex-1 max-w-lg ml-12;
}

.hero-card {
  @apply bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl overflow-hidden;
}

.card-header {
  @apply flex items-center justify-between p-4 bg-white/5 border-b border-white/10;
}

.card-dots {
  @apply flex space-x-2;
}

.dot {
  @apply w-3 h-3 rounded-full;
}

.dot-red {
  @apply bg-red-400;
}

.dot-yellow {
  @apply bg-yellow-400;
}

.dot-green {
  @apply bg-green-400;
}

.card-title {
  @apply text-sm font-medium text-white/80;
}

.card-content {
  @apply p-6;
}

.hero-stats {
  @apply w-full relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
}

.stat-card {
  @apply backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-3 shadow-2xl;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  padding: 1.25rem 1.5rem;
  min-height: 90px;
}

.stat-card:hover {
  transform: translateY(-4px);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.3);
}

.stat-icon {
  @apply bg-white/20 backdrop-blur-sm rounded-xl text-white flex-shrink-0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  padding: 0.75rem;
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.stat-card:hover .stat-icon {
  @apply bg-white/30;
  transform: scale(1.05);
}

.stat-content {
  @apply flex-1 text-center sm:text-left;
  min-width: 0;
}

.stat-number {
  @apply text-xl lg:text-2xl font-bold text-white mb-0.5 font-sans;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.hero-stats .stat-label {
  @apply text-xs font-medium text-white/75 font-sans;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  font-weight: 500;
  line-height: 1.4;
}

/* Section Headers */
.section-header {
  @apply text-center mb-12;
}

.section-title {
  @apply text-4xl font-bold text-gray-900 mb-4;
}

.section-description {
  @apply text-xl text-gray-600 max-w-3xl mx-auto;
}

/* Map Section */
.map-section {
  @apply py-20;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background: linear-gradient(to bottom, #f8fafc 0%, #e0e7ff 100%);
  min-height: 60vh;
}

.map-container {
  @apply container mx-auto px-8;
}

/* Map Title Frame */
.map-title-frame {
  @apply bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg;
  @apply rounded-t-xl;
}

.title-frame-content {
  @apply px-6 py-2 text-left;
}

.map-title-text {
  @apply text-xl font-bold text-white drop-shadow-md;
  @apply tracking-wide;
}

/* Map Canvas Wrapper */
.map-canvas-wrapper {
  @apply rounded-b-xl overflow-hidden shadow-lg;
  border-top: none;
  min-height: 500px;
  position: relative;
}

/* Analisis Section */
.analisis-section {
  @apply py-20 bg-gray-50;
}

.analisis-content {
  @apply container mx-auto px-8;
}

.analisis-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-8;
}

.analisis-card {
  @apply bg-white rounded-xl shadow-lg p-6 border border-gray-200;
}

.card-header {
  @apply flex items-center justify-between mb-6;
}

.card-title {
  @apply text-xl font-semibold text-gray-900;
}

.chart-container {
  @apply p-4;
  height: 300px;
  width: 100%;
}

/* Dual Donut Container Styles */
.dual-donut-container {
  @apply flex flex-col lg:flex-row gap-8 p-4;
}

.donut-section {
  @apply flex-1;
}

.donut-title {
  @apply text-lg font-semibold text-gray-800 mb-4 text-center;
}

.donut-chart {
  @apply relative flex justify-center mb-4;
  min-height: 200px;
  min-width: 200px;
}

.chart-center {
  @apply absolute inset-0 flex flex-col items-center justify-center pointer-events-none;
}

.center-number {
  @apply text-xl font-bold text-gray-900;
}

.center-label {
  @apply text-sm text-gray-600;
}

/* Animations & Keyframes */
@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-section {
    min-height: 100vh;
    padding: 6vh 0 4vh;
  }

  .hero-container {
    gap: 2rem;
  }

  .hero-stats {
    @apply grid-cols-2;
    gap: 0.875rem;
    max-width: 100%;
  }

  .stat-card {
    padding: 1.125rem 1.375rem;
    min-height: 85px;
  }

  .analisis-grid {
    @apply grid-cols-1;
  }

  .dual-donut-container {
    @apply flex-col;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 6vh 0 4vh;
    min-height: 100vh;
  }

  .hero-container {
    gap: 1.75rem;
    padding: 0 1rem;
  }

  .hero-content-center {
    padding: 0;
    margin-bottom: 0.25rem;
  }

  .hero-title-main {
    @apply text-2xl sm:text-3xl;
    margin-bottom: 0.5rem;
  }

  .hero-subtitle {
    @apply text-sm sm:text-base;
    margin-bottom: 0.75rem;
  }

  .hero-description-text {
    @apply text-xs sm:text-sm;
    line-height: 1.5;
  }

  .hero-stats {
    @apply grid-cols-1 gap-2.5;
    padding: 0;
    width: 100%;
  }

  .stat-card {
    padding: 1rem 1.25rem;
    min-height: 80px;
    flex-direction: row;
  }

  .stat-icon {
    padding: 0.625rem;
    width: 2.5rem;
    height: 2.5rem;
  }

  .stat-icon svg {
    width: 1.125rem;
    height: 1.125rem;
  }

  .stat-number {
    @apply text-lg sm:text-xl;
  }

  .hero-stats .stat-label {
    @apply text-xs;
  }

  .analisis-grid {
    @apply grid-cols-1;
  }

  .map-container,
  .analisis-content {
    @apply px-4;
  }

  .map-section {
    @apply py-12;
    min-height: 50vh;
  }

  .map-title-text {
    @apply text-lg;
  }

  .section-title {
    @apply text-2xl;
  }

  .section-description {
    @apply text-lg;
  }

  .card-title {
    @apply text-lg;
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding: 5vh 0 3vh;
    min-height: 100vh;
  }

  .hero-container {
    gap: 1.5rem;
  }

  .hero-title-main {
    @apply text-xl sm:text-2xl;
    margin-bottom: 0.375rem;
  }

  .hero-subtitle {
    @apply text-xs sm:text-sm;
    margin-bottom: 0.5rem;
  }

  .hero-description-text {
    @apply text-xs;
    line-height: 1.4;
  }

  .stat-card {
    padding: 0.875rem 1rem;
    min-height: 75px;
    gap: 0.75rem;
  }

  .stat-icon {
    padding: 0.5rem;
    width: 2.25rem;
    height: 2.25rem;
  }

  .stat-icon svg {
    width: 1rem;
    height: 1rem;
  }

  .stat-number {
    @apply text-base sm:text-lg;
  }

  .hero-stats .stat-label {
    @apply text-xs;
    font-size: 0.625rem;
  }
}
</style>

<script>
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  async mounted() {
    // Set component instance for external access
    window.initChartsComponent = this;

    // Don't call initCharts here, it will be called after hero stats are loaded
    console.log("Component mounted, waiting for hero stats...");
  },
  methods: {
    showChartError(ctx, message) {
      // Clear the canvas and show error message
      ctx.getContext("2d").clearRect(0, 0, ctx.width, ctx.height);
      const parent = ctx.parentElement;
      parent.innerHTML = `
        <div class="flex items-center justify-center h-64 text-gray-500">
          <div class="text-center">
            <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <p class="text-sm">${message}</p>
          </div>
        </div>
      `;
    },
    async loadKecamatanOptions() {
      try {
        const config = useRuntimeConfig();
        const apiUrl = config.public.apiUrl;
        const response = await fetch(`${apiUrl}/jalan/filters/kecamatan`);
        const result = await response.json();

        if (result.success && result.data) {
          const kondisiFilter = document.getElementById(
            "kondisiMaterialFilter"
          );
          const materialFilter = document.getElementById(
            "materialDamageFilter"
          );

          // Clear existing options except first
          [kondisiFilter, materialFilter].forEach((select) => {
            if (select) {
              // Keep first option (Semua Kecamatan)
              const firstOption = select.querySelector('option[value=""]');
              select.innerHTML = "";
              if (firstOption) {
                select.appendChild(firstOption);
              }

              // Add kecamatan options
              result.data.forEach((kecamatan) => {
                const option = document.createElement("option");
                option.value = kecamatan;
                option.textContent = kecamatan;
                select.appendChild(option);
              });
            }
          });
        }
      } catch (error) {
        console.error("Error loading kecamatan options:", error);
      }
    },
    async initCharts() {
      // Wait for DOM to be ready
      await this.$nextTick();

      // Load kecamatan options first
      await this.loadKecamatanOptions();

      // Load initial data for both charts (all kecamatan) - lower priority
      console.log("Loading initial chart data...");
      await this.updateKondisiMaterialCharts("");
      await this.updateMaterialDamageChart("");
      console.log("Initial chart data loaded");

      // District Chart - Real Data
      const districtCtx = document.getElementById("districtChart");
      if (districtCtx) {
        // Fetch real data from API
        try {
          console.log("Fetching data from API...");
          const config = useRuntimeConfig();
          const apiUrl = config.public.apiUrl;
          const response = await fetch(
            `${apiUrl}/jalan/stats/kecamatan-kondisi`,
            {
              method: "GET",
              mode: "cors",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Response status:", response.status);
          console.log("Response ok:", response.ok);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          console.log("API result:", result);

          if (result.success && result.data) {
            // Process data for all kecamatan
            const allKecamatans = result.data;
            const labels = allKecamatans.map((k) => k.kecamatan);

            // Prepare datasets for each condition
            const baikData = allKecamatans.map(
              (k) => k.conditions.Baik?.count || 0
            );
            const sedangData = allKecamatans.map(
              (k) => k.conditions.Sedang?.count || 0
            );
            const rusakRinganData = allKecamatans.map(
              (k) => k.conditions["Rusak Ringan"]?.count || 0
            );
            const rusakBeratData = allKecamatans.map(
              (k) => k.conditions["Rusak Berat"]?.count || 0
            );

            new Chart(districtCtx, {
              type: "bar",
              data: {
                labels: labels,
                datasets: [
                  {
                    label: "Baik",
                    data: baikData,
                    backgroundColor: "#10b981",
                  },
                  {
                    label: "Sedang",
                    data: sedangData,
                    backgroundColor: "#eab308",
                  },
                  {
                    label: "Rusak Ringan",
                    data: rusakRinganData,
                    backgroundColor: "#f97316",
                  },
                  {
                    label: "Rusak Berat",
                    data: rusakBeratData,
                    backgroundColor: "#dc2626",
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  tooltip: {
                    enabled: true,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    titleColor: "white",
                    bodyColor: "white",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    borderWidth: 1,
                    cornerRadius: 8,
                  },
                },
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                    beginAtZero: true,
                  },
                },
              },
            });
          } else {
            console.error("Failed to fetch kecamatan-kondisi data");
            // Show error message instead of dummy data
            this.showChartError(districtCtx, "Gagal memuat data kecamatan");
          }
        } catch (error) {
          console.error("Error fetching kecamatan-kondisi data:", error);
          // Show error message instead of dummy data
          this.showChartError(districtCtx, "Gagal memuat data kecamatan");
        }
      }

      // District Length Chart - Real Data
      const districtLengthCtx = document.getElementById("districtLengthChart");
      if (districtLengthCtx) {
        // Fetch real data from API
        try {
          console.log("Fetching kecamatan length data from API...");
          const config = useRuntimeConfig();
          const apiUrl = config.public.apiUrl;
          const response = await fetch(`${apiUrl}/jalan/stats/summary`, {
            method: "GET",
            mode: "cors",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          console.log("Length response status:", response.status);
          console.log("Length response ok:", response.ok);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          console.log("Length API result:", result);

          if (result.success && result.data && result.data.kecamatanStats) {
            // Process data for all kecamatan
            const kecamatanData = result.data.kecamatanStats;
            const labels = kecamatanData.map((k) => k.kecamatan);
            const lengths = kecamatanData.map((k) =>
              (k._sum.panjangM / 1000).toFixed(1)
            ); // Convert to km

            // Color palette for different kecamatan
            const colors = [
              "#3b82f6", // Blue
              "#10b981", // Green
              "#f59e0b", // Orange
              "#ef4444", // Red
              "#8b5cf6", // Purple
              "#06b6d4", // Cyan
              "#84cc16", // Lime
              "#f97316", // Orange
              "#ec4899", // Pink
              "#6b7280", // Gray
            ];

            new Chart(districtLengthCtx, {
              type: "bar",
              data: {
                labels: labels,
                datasets: [
                  {
                    label: "Jumlah Rumah",
                    data: lengths,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 1,
                    borderColor: "#ffffff",
                  },
                ],
              },
              options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    enabled: true,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    titleColor: "white",
                    bodyColor: "white",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                      label: function (context) {
                        return "Jumlah: " + context.parsed.x;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(0, 0, 0, 0.1)",
                    },
                    ticks: {
                      callback: function (value) {
                        return value;
                      },
                      color: "#6b7280",
                    },
                  },
                  y: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      color: "#6b7280",
                    },
                  },
                },
              },
            });
          } else {
            console.error("Failed to fetch kecamatan length data");
            // Show error message instead of dummy data
            this.showChartError(
              districtLengthCtx,
              "Gagal memuat data panjang jalan"
            );
          }
        } catch (error) {
          console.error("Error fetching kecamatan length data:", error);
          // Show error message instead of dummy data
          this.showChartError(
            districtLengthCtx,
            "Gagal memuat data panjang jalan"
          );
        }
      }

      // Add event listeners for filters
      this.setupFilterListeners();
    },
    setupFilterListeners() {
      // Filter for Analisis Kondisi & Material Jalan
      const kondisiFilter = document.getElementById("kondisiMaterialFilter");
      if (kondisiFilter) {
        kondisiFilter.addEventListener("change", (e) => {
          this.updateKondisiMaterialCharts(e.target.value);
        });
      }

      // Filter for Tingkat Kerusakan per Material
      const materialFilter = document.getElementById("materialDamageFilter");
      if (materialFilter) {
        materialFilter.addEventListener("change", (e) => {
          this.updateMaterialDamageChart(e.target.value);
        });
      }
    },
    async updateKondisiMaterialCharts(kecamatan) {
      try {
        const config = useRuntimeConfig();
        const apiUrl = config.public.apiUrl;
        const url = kecamatan
          ? `${apiUrl}/jalan/stats/kondisi-material-filtered?kecamatan=${encodeURIComponent(
              kecamatan
            )}`
          : `${apiUrl}/jalan/stats/kondisi-material-filtered`;

        const response = await fetch(url);
        const result = await response.json();

        if (result.success && result.data) {
          // Update condition chart
          this.updateConditionChart(result.data.kondisiStats);

          // Update material chart
          this.updateMaterialChart(result.data.materialStats);
        }
      } catch (error) {
        console.error("Error updating kondisi material charts:", error);
      }
    },
    async updateMaterialDamageChart(kecamatan) {
      try {
        const config = useRuntimeConfig();
        const apiUrl = config.public.apiUrl;
        const url = kecamatan
          ? `${apiUrl}/jalan/stats/material-kondisi?kecamatan=${encodeURIComponent(
              kecamatan
            )}`
          : `${apiUrl}/jalan/stats/material-kondisi`;

        const response = await fetch(url);
        const result = await response.json();

        if (result.success && result.data) {
          // Update material damage chart
          this.updateMaterialDamageChartData(result.data);
        }
      } catch (error) {
        console.error("Error updating material damage chart:", error);
      }
    },
    updateConditionChart(kondisiStats) {
      const conditionCtx = document.getElementById("conditionChart");
      if (!conditionCtx) return;

      // Destroy existing chart if it exists
      if (
        window.conditionChart &&
        typeof window.conditionChart.destroy === "function"
      ) {
        window.conditionChart.destroy();
      }

      // Prepare data (convert to km)
      const labels = kondisiStats.map((s) => s.keterangan);
      const data = kondisiStats.map((s) =>
        ((s._sum.panjangM || 0) / 1000).toFixed(2)
      );
      const total = data.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);

      // Update center text (show total km)
      const centerNumber = document.querySelector(
        "#conditionChart + .chart-center .center-number"
      );
      if (centerNumber) {
        centerNumber.textContent = total.toFixed(2);
      }

      // Create new chart
      window.conditionChart = new Chart(conditionCtx, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: [
                "#10b981", // Baik - Green
                "#eab308", // Sedang - Yellow
                "#dc2626", // Rusak Berat - Red (bright)
                "#f97316", // Rusak Ringan - Orange
              ],
              borderWidth: 0,
              hoverOffset: 10,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "white",
              bodyColor: "white",
              borderColor: "rgba(255, 255, 255, 0.2)",
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              callbacks: {
                label: function (context) {
                  const total = context.dataset.data.reduce(
                    (a, b) => parseFloat(a) + parseFloat(b),
                    0
                  );
                  const percentage = (
                    (parseFloat(context.parsed) / total) *
                    100
                  ).toFixed(1);
                  return (
                    context.label +
                    ": " +
                    parseFloat(context.parsed).toFixed(2) +
                    " km (" +
                    percentage +
                    "%)"
                  );
                },
              },
            },
          },
          cutout: "60%",
          animation: {
            animateRotate: true,
            animateScale: true,
          },
        },
      });
    },
    updateMaterialChart(materialStats) {
      const materialCtx = document.getElementById("materialChart");
      if (!materialCtx) return;

      // Destroy existing chart if it exists
      if (
        window.materialChart &&
        typeof window.materialChart.destroy === "function"
      ) {
        window.materialChart.destroy();
      }

      // Prepare data (convert to km)
      const labels = materialStats.map((s) => s.kondisi);
      const data = materialStats.map((s) =>
        ((s._sum.panjangM || 0) / 1000).toFixed(2)
      );
      const total = data.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);

      // Update center text (show total km)
      const centerNumber = document.querySelector(
        "#materialChart + .chart-center .center-number"
      );
      if (centerNumber) {
        centerNumber.textContent = total.toFixed(2);
      }

      // Create new chart
      window.materialChart = new Chart(materialCtx, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: [
                "#6b7280", // Gray
                "#3b82f6", // Blue
                "#10b981", // Green
                "#f59e0b", // Orange
                "#ef4444", // Red
                "#8b5cf6", // Purple
                "#06b6d4", // Cyan
                "#84cc16", // Lime
              ],
              borderWidth: 0,
              hoverOffset: 10,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "white",
              bodyColor: "white",
              borderColor: "rgba(255, 255, 255, 0.2)",
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              callbacks: {
                label: function (context) {
                  const total = context.dataset.data.reduce(
                    (a, b) => parseFloat(a) + parseFloat(b),
                    0
                  );
                  const percentage = (
                    (parseFloat(context.parsed) / total) *
                    100
                  ).toFixed(1);
                  return (
                    context.label +
                    ": " +
                    parseFloat(context.parsed).toFixed(2) +
                    " km (" +
                    percentage +
                    "%)"
                  );
                },
              },
            },
          },
          cutout: "60%",
          animation: {
            animateRotate: true,
            animateScale: true,
          },
        },
      });
    },
    updateMaterialDamageChartData(materialData) {
      const materialDamageCtx = document.getElementById("materialDamageChart");
      if (!materialDamageCtx) return;

      // Destroy existing chart if it exists
      if (
        window.materialDamageChart &&
        typeof window.materialDamageChart.destroy === "function"
      ) {
        window.materialDamageChart.destroy();
      }

      // Process data for top 6 materials
      const topMaterials = materialData.slice(0, 6);
      const labels = topMaterials.map((m) => m.material);

      // Prepare datasets for each condition (convert to km)
      const baikData = topMaterials.map((m) =>
        ((m.conditions.Baik?.length || 0) / 1000).toFixed(2)
      );
      const sedangData = topMaterials.map((m) =>
        ((m.conditions.Sedang?.length || 0) / 1000).toFixed(2)
      );
      const rusakRinganData = topMaterials.map((m) =>
        ((m.conditions["Rusak Ringan"]?.length || 0) / 1000).toFixed(2)
      );
      const rusakBeratData = topMaterials.map((m) =>
        ((m.conditions["Rusak Berat"]?.length || 0) / 1000).toFixed(2)
      );

      // Create new chart
      window.materialDamageChart = new Chart(materialDamageCtx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Baik",
              data: baikData,
              backgroundColor: "#10b981",
              borderColor: "#059669",
              borderWidth: 1,
            },
            {
              label: "Sedang",
              data: sedangData,
              backgroundColor: "#eab308",
              borderColor: "#ca8a04",
              borderWidth: 1,
            },
            {
              label: "Rusak Ringan",
              data: rusakRinganData,
              backgroundColor: "#f97316",
              borderColor: "#ea580c",
              borderWidth: 1,
            },
            {
              label: "Rusak Berat",
              data: rusakBeratData,
              backgroundColor: "#dc2626",
              borderColor: "#b91c1c",
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              enabled: true,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "white",
              bodyColor: "white",
              borderColor: "rgba(255, 255, 255, 0.2)",
              borderWidth: 1,
              cornerRadius: 8,
              callbacks: {
                label: function (context) {
                  return (
                    context.dataset.label +
                    ": " +
                    parseFloat(context.parsed.x).toFixed(2) +
                    " km"
                  );
                },
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return value + " km";
                },
              },
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
};
</script>
