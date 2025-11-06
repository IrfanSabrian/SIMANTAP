<template>
  <div>
    <!-- Hero Section with Slider -->
    <section
      id="home"
      class="relative min-h-screen flex items-center justify-center overflow-hidden"
      @mousemove="handleMouseMove"
      @mouseleave="resetMousePosition"
    >
      <!-- Slider Background -->
      <Swiper
        :modules="heroSwiperModules"
        :autoplay="{
          delay: 5000,
          disableOnInteraction: false,
        }"
        :loop="true"
        :effect="'fade'"
        :speed="1000"
        :allow-touch-move="false"
        @swiper="setHeroSwiper"
        @slideChange="onHeroSlideChange"
        class="hero-swiper"
      >
        <SwiperSlide
          v-for="(slide, index) in heroSlides"
          :key="index"
          class="hero-slide"
        >
          <div
            class="absolute inset-0 bg-cover bg-center bg-no-repeat hero-background"
            :style="getBackgroundStyle(slide.image)"
          >
            <div class="absolute inset-0 hero-gradient-overlay"></div>
          </div>

          <!-- Content Overlay -->
          <div
            class="relative z-10 w-full h-full flex flex-col justify-end pb-8 px-4 sm:px-6 lg:px-8"
          >
            <div class="max-w-7xl mx-auto w-full">
              <div
                class="flex flex-col lg:flex-row lg:items-end lg:justify-start w-full gap-6 lg:gap-8"
              >
                <!-- Left Side: Branding Text -->
                <div
                  class="w-full lg:max-w-lg lg:flex-shrink-0 order-1 lg:order-1"
                >
                  <div class="relative">
                    <h1
                      class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight font-sans mb-2"
                    >
                      <span class="block"> SIMANTAP </span>
                      <span
                        class="block text-lg sm:text-xl md:text-2xl lg:text-3xl mt-1"
                      >
                        KUBU RAYA
                      </span>
                    </h1>
                    <h2
                      class="text-sm sm:text-base md:text-lg text-white/90 font-semibold mb-4"
                    >
                      Sistem Informasi Manajemen Tata Permukiman
                    </h2>
                    <p
                      class="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed font-sans italic"
                    >
                      "Platform spasial cerdas untuk manajemen dan perencanaan
                      permukiman Kubu Raya."
                    </p>
                  </div>
                </div>

                <!-- Right Side: Content with Thumbnail -->
                <div
                  class="w-full lg:w-auto lg:flex-shrink-0 order-2 lg:order-2 lg:max-w-[450px] lg:ml-auto"
                >
                  <div class="flex flex-col gap-4">
                    <!-- Content Text Block (Above Thumbnail) -->
                    <div
                      class="relative hero-content-wrapper bg-white/5 backdrop-blur-sm rounded-lg p-4 lg:p-5"
                      :key="currentSlideIndex"
                    >
                      <!-- Judul -->
                      <div class="mb-3 flex-shrink-0">
                        <h3
                          class="text-xl sm:text-2xl font-bold text-white leading-tight font-sans hero-title"
                        >
                          <span class="inline-block hero-title-text">
                            {{ currentSlide.title }}
                          </span>
                        </h3>
                      </div>

                      <!-- Deskripsi -->
                      <div class="mb-4 flex-shrink-0">
                        <p
                          class="text-sm sm:text-base text-white/90 leading-relaxed font-sans hero-description line-clamp-3"
                        >
                          {{ currentSlide.brandingDescription }}
                        </p>
                      </div>

                      <!-- Tombol -->
                      <div class="flex-shrink-0">
                        <NuxtLink
                          :to="currentSlide.link"
                          class="hero-button inline-flex items-center gap-3 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold rounded-lg transition-all duration-300 text-sm sm:text-base group shadow-lg hover:shadow-xl relative overflow-hidden"
                          @click="handleButtonClick"
                        >
                          <span class="relative z-10 flex items-center gap-3">
                            Lihat Peta Interaktif
                            <svg
                              class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              ></path>
                            </svg>
                          </span>
                        </NuxtLink>
                      </div>
                    </div>

                    <!-- Thumbnail Navigation -->
                    <div class="hero-thumbnail-container">
                      <button
                        v-for="(slide, index) in heroSlides"
                        :key="index"
                        @click="goToSlide(index)"
                        class="relative transition-opacity duration-300 rounded-lg overflow-hidden border-2 hero-thumbnail"
                        :class="
                          currentSlideIndex === index
                            ? 'border-white shadow-lg ring-2 ring-white/50'
                            : 'border-white/30 opacity-60 hover:opacity-80'
                        "
                      >
                        <img
                          :src="slide.image"
                          :alt="slide.title"
                          class="object-cover"
                        />
                        <div
                          v-if="currentSlideIndex === index"
                          class="absolute inset-0 bg-white/10"
                        ></div>
                        <div
                          v-if="currentSlideIndex === index"
                          :key="`progress-${currentSlideIndex}`"
                          class="absolute bottom-0 left-0 right-0 h-1 bg-white/50 hero-progress-bar"
                        ></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <!-- Progress Indicator -->
      <div
        class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden lg:flex items-center justify-center"
      >
        <div class="flex gap-2 items-center">
          <div
            v-for="(slide, index) in heroSlides"
            :key="index"
            class="h-1 w-8 rounded-full overflow-hidden bg-white/20"
          >
            <div
              v-if="currentSlideIndex === index"
              :key="`indicator-${currentSlideIndex}`"
              class="h-full bg-white hero-progress-indicator"
              :style="{ animationDuration: '5s' }"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tentang Section -->
    <section
      id="tentang"
      class="pt-12 sm:pt-16 lg:pt-20 pb-6 sm:pb-8 lg:pb-10 bg-white relative overflow-hidden"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12" data-aos="fade-up">
          <h2
            class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Tentang
          </h2>
          <p class="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
            Platform digital terintegrasi untuk manajemen dan perencanaan tata
            permukiman di Kabupaten Kubu Raya.
          </p>
        </div>

        <!-- Content: Text Left, Image Right -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          <!-- Left Column: Text Content and Statistics -->
          <div
            class="lg:col-span-3 flex flex-col justify-start space-y-8"
            data-aos="fade-right"
          >
            <!-- Text Content -->
            <div class="space-y-4 text-gray-700">
              <p class="text-base sm:text-lg leading-relaxed">
                SIMANTAP KUBU RAYA adalah Sistem Informasi Manajemen Tata
                Permukiman yang dirancang untuk memberikan akses informasi
                spasial yang komprehensif mengenai infrastruktur permukiman di
                Kabupaten Kubu Raya. Platform ini memungkinkan pengguna untuk
                mengakses data jalan lingkungan, jembatan, drainase, kawasan
                permukiman, dan rumah tidak layak huni secara interaktif melalui
                peta digital.
              </p>
              <p class="text-base sm:text-lg leading-relaxed">
                Fokus utama sistem ini adalah menyediakan informasi yang akurat
                dan terupdate untuk mendukung perencanaan pembangunan,
                monitoring infrastruktur, serta memfasilitasi partisipasi
                masyarakat dalam pengaduan dan aspirasi terkait tata permukiman.
                Dengan teknologi geospasial yang terintegrasi, SIMANTAP membantu
                mewujudkan tata permukiman yang lebih teratur, efisien, dan
                berkelanjutan.
              </p>
            </div>

            <!-- Statistics Row -->
            <div
              id="tentangStatsRow"
              class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <!-- Stat 1: Panjang Jalan Lingkungan -->
              <div class="text-center">
                <div
                  id="tentangRoadLengthCounter"
                  class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1"
                >
                  0
                </div>
                <div class="text-xs sm:text-sm text-gray-600 font-medium">
                  Panjang Jalan Lingkungan (km)
                </div>
              </div>

              <!-- Stat 2: Drainase Lingkungan -->
              <div class="text-center">
                <div
                  id="tentangDrainaseCounter"
                  class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1"
                >
                  0
                </div>
                <div class="text-xs sm:text-sm text-gray-600 font-medium">
                  Drainase Lingkungan
                </div>
              </div>

              <!-- Stat 3: Jembatan Lingkungan -->
              <div class="text-center">
                <div
                  id="tentangJembatanCounter"
                  class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1"
                >
                  0
                </div>
                <div class="text-xs sm:text-sm text-gray-600 font-medium">
                  Jembatan Lingkungan
                </div>
              </div>

              <!-- Stat 4: Perumahan -->
              <div class="text-center">
                <div
                  id="tentangPerumahanCounter"
                  class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1"
                >
                  0
                </div>
                <div class="text-xs sm:text-sm text-gray-600 font-medium">
                  Perumahan
                </div>
              </div>

              <!-- Stat 5: Rumah Tidak Layak Huni -->
              <div class="text-center">
                <div
                  id="tentangRumahCounter"
                  class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1"
                >
                  0
                </div>
                <div class="text-xs sm:text-sm text-gray-600 font-medium">
                  Rumah Tidak Layak Huni
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Image with Overlay -->
          <div class="lg:col-span-2 relative" data-aos="fade-left">
            <!-- Container untuk gambar dan kotak teks -->
            <div class="relative w-full h-full min-h-[350px] sm:min-h-[350px]">
              <!-- Image positioned at top left -->
              <div class="absolute top-0 left-0 w-[85%] sm:w-[80%]">
                <div class="relative rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src="/tentang.png"
                    alt="SIMANTAP KUBU RAYA"
                    class="w-full h-auto object-cover"
                  />
                </div>
              </div>
              <!-- Overlay Text Box positioned at bottom right -->
              <div
                class="absolute bottom-10 sm:bottom-8 right-0 bg-white/95 backdrop-blur-sm rounded-lg p-4 sm:p-6 max-w-xs shadow-xl z-10"
              >
                <p class="text-sm sm:text-base text-gray-800 leading-relaxed">
                  "Mengoptimalkan pengelolaan infrastruktur permukiman melalui
                  sistem informasi terpadu"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Dokumentasi Section Header -->
    <section
      id="dokumentasi-header"
      class="pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 lg:pb-10 bg-white relative overflow-hidden"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12" data-aos="fade-up">
          <h2
            class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Dokumentasi
          </h2>
          <p class="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
            Dokumentasi lengkap mengenai infrastruktur dan kegiatan yang
            dilakukan dalam pengelolaan tata permukiman di Kabupaten Kubu Raya.
          </p>
        </div>
      </div>
    </section>

    <!-- Dokumentasi Section (Infrastruktur & Kegiatan) -->
    <section
      id="dokumentasi"
      class="pt-6 sm:pt-8 lg:pt-10 pb-12 sm:pb-16 lg:pb-20 bg-white relative overflow-hidden"
    >
      <!-- Decorative background -->
      <div
        class="absolute top-10 left-10 w-96 h-96 bg-gray-100 rounded-full opacity-20 blur-3xl"
      ></div>
      <div
        class="absolute bottom-10 right-10 w-96 h-96 bg-gray-100 rounded-full opacity-20 blur-3xl"
      ></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div>
          <!-- Dokumentasi Section -->
          <div>
            <div
              class="mb-8 flex items-center justify-between"
              data-aos="fade-right"
            >
              <h2
                class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 relative inline-block"
              >
                Dokumentasi Infrastruktur
                <div
                  class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-transparent rounded-full"
                ></div>
              </h2>

              <!-- Lihat Selengkapnya Button (moved to top right) -->
              <NuxtLink
                to="/dokumentasi-infrastruktur"
                class="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-yellow-400 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                data-aos="fade-left"
              >
                Lihat Selengkapnya
                <svg
                  class="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </NuxtLink>
            </div>

            <!-- Dokumentasi Infrastruktur Grid - 4 columns, newest first -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                v-for="(video, index) in filteredVideos"
                :key="video.id"
                class="group relative bg-white rounded-lg shadow-lg hover:shadow-xl overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all duration-300"
                data-aos="zoom-in"
                :data-aos-delay="index * 50"
              >
                <!-- Thumbnail Container with Tech Style -->
                <div
                  @click="
                    video.youtubeUrl
                      ? openYouTubeFancybox(video.youtubeUrl, video.title)
                      : null
                  "
                  :class="[
                    'relative aspect-video bg-gray-900 overflow-hidden',
                    video.youtubeUrl
                      ? 'cursor-pointer'
                      : 'cursor-not-allowed opacity-60',
                  ]"
                >
                  <!-- Thumbnail Image -->
                  <img
                    v-if="video.thumbnail"
                    :src="video.thumbnail"
                    :alt="video.title"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900"
                  >
                    <div class="text-center">
                      <svg
                        class="w-12 h-12 mx-auto text-gray-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <p class="text-xs text-gray-400 font-medium">
                        Video tidak tersedia
                      </p>
                    </div>
                  </div>

                  <!-- Dark Overlay -->
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                  ></div>

                  <!-- Category Badge - Tech Style -->
                  <div class="absolute top-3 left-3 z-10">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-blue-600 text-white shadow-lg uppercase tracking-wide"
                    >
                      {{ video.category }}
                    </span>
                  </div>

                  <!-- Play Button - Prominent -->
                  <div
                    class="absolute inset-0 flex items-center justify-center"
                  >
                    <div
                      class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 transform group-hover:scale-110 transition-transform duration-300"
                    >
                      <svg
                        class="w-8 h-8 text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  <!-- Video Badge - Bottom Right -->
                  <div
                    class="absolute bottom-3 right-3 bg-black/90 text-white text-xs px-2.5 py-1 rounded font-bold uppercase tracking-wide"
                  >
                    Video
                  </div>
                </div>

                <!-- Content Section - Compact Tech Style -->
                <div class="p-4 bg-white">
                  <!-- Title -->
                  <h3
                    class="font-bold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 transition-colors duration-200"
                  >
                    {{ video.title }}
                  </h3>

                  <!-- Description -->
                  <p
                    class="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed"
                  >
                    {{ video.description }}
                  </p>

                  <!-- Date Info - Single Line -->
                  <div
                    class="flex items-center justify-between pt-2 border-t border-gray-200"
                  >
                    <div class="flex items-center text-xs text-gray-500">
                      <svg
                        class="w-3.5 h-3.5 mr-1.5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span class="font-semibold">{{ video.uploadDate }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredVideos.length === 0" class="text-center py-12">
              <svg
                class="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p class="text-gray-600">Belum ada video untuk kategori ini</p>
            </div>

            <!-- Dokumentasi Kegiatan Section -->
            <div id="dokumentasi-kegiatan" class="mt-16">
              <div
                class="mb-8 flex items-center justify-between"
                data-aos="fade-right"
              >
                <h2
                  class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 relative inline-block"
                >
                  Dokumentasi Kegiatan
                  <div
                    class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-transparent rounded-full"
                  ></div>
                </h2>

                <!-- Lihat Selengkapnya Button (moved to top right) -->
                <NuxtLink
                  to="/dokumentasi-kegiatan"
                  class="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-yellow-400 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                  data-aos="fade-left"
                >
                  Lihat Selengkapnya
                  <svg
                    class="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </NuxtLink>
              </div>

              <!-- Kegiatan Cards Grid - 4 columns -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                  v-for="(kegiatan, index) in dokumentasiKegiatanHome"
                  :key="kegiatan.id"
                  @click="
                    navigateTo(
                      `/dokumentasi-kegiatan-detail?slug=${kegiatan.slug}`
                    )
                  "
                  class="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden border border-gray-200 cursor-pointer transition-all duration-300 transform hover:-translate-y-2"
                  data-aos="fade-up"
                  :data-aos-delay="index * 50"
                >
                  <!-- Image Container with Blue Style -->
                  <div
                    class="relative h-52 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50"
                  >
                    <img
                      :src="getThumbnail(kegiatan)"
                      :alt="kegiatan.judul"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      @error="handleImageError"
                    />
                    <!-- Light Gradient Overlay -->
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
                    ></div>
                    <!-- Category Badge - Blue Style -->
                    <div class="absolute top-4 left-4 z-10">
                      <span
                        class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-sm text-blue-700 shadow-lg border border-blue-200/60"
                      >
                        {{ kegiatan.kategori || "Kegiatan" }}
                      </span>
                    </div>
                    <!-- Date Badge - Blue Style -->
                    <div class="absolute bottom-4 right-4 z-10">
                      <div
                        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-medium text-gray-700 shadow-lg"
                      >
                        <svg
                          class="w-3.5 h-3.5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{{ formatRelativeDate(kegiatan.tanggal) }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Content Section - Blue Style -->
                  <div class="p-5 bg-white">
                    <!-- Title -->
                    <h3
                      class="font-bold text-gray-900 mb-2.5 line-clamp-2 text-sm leading-snug group-hover:text-blue-600 transition-colors duration-200"
                    >
                      {{ kegiatan.judul }}
                    </h3>

                    <!-- Description -->
                    <p
                      class="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed"
                    >
                      {{ kegiatan.deskripsi }}
                    </p>

                    <!-- Upload Date Info -->
                    <div
                      class="flex items-center justify-between pt-3 border-t border-gray-100"
                    >
                      <div class="flex items-center text-xs text-gray-500">
                        <svg
                          class="w-3.5 h-3.5 mr-1.5 text-blue-500"
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
                        <span class="font-medium">{{
                          kegiatan.uploadDate
                        }}</span>
                      </div>
                      <div
                        class="flex items-center text-xs text-blue-600 font-semibold"
                      >
                        <span>Baca selengkapnya</span>
                        <svg
                          class="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty state -->
              <div
                v-if="dokumentasiKegiatanHome.length === 0"
                class="text-center py-12 bg-white rounded-2xl"
              >
                <svg
                  class="w-16 h-16 mx-auto text-gray-400 mb-4"
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
                <p class="text-gray-500">Belum ada dokumentasi kegiatan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import AOS from "aos";
import "aos/dist/aos.css";
import { CountUp } from "countup.js";

const config = useRuntimeConfig();
// Use SIMANTAP's useContentApi instead of useWebProfilApi
const { baseURL } = useContentApi();
// baseURL already includes /api if needed, so we use it directly
const API_URL = baseURL;

// API composables
const { getDokumentasiKegiatan, getStats } = useContentApi();
const { getThumbnail, handleImageError } = useImagePlaceholder();
const { formatRelativeDate } = useDateFormat();

// Swiper modules
const swiperModules = [Pagination, Autoplay];
const heroSwiperModules = [Autoplay, EffectFade];
const descriptionSwiperModules = [EffectFade];

// Swiper instances
let heroSwiperInstance: any = null;
let descriptionSwiperInstance: any = null;
const currentSlideIndex = ref(0);

// Interactive effects for hero section - Parallax
const mousePosition = ref({ x: 50, y: 50 });

const handleMouseMove = (event: MouseEvent) => {
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

const getBackgroundStyle = (image: string) => {
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

const handleButtonClick = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement;
  const ripple = document.createElement("span");
  ripple.classList.add("ripple-effect");

  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
};

// Computed property for current slide
const currentSlide = computed(() => {
  return heroSlides.value[currentSlideIndex.value] || heroSlides.value[0];
});

const setHeroSwiper = (swiper: any) => {
  heroSwiperInstance = swiper;
  // Initialize current slide index
  currentSlideIndex.value = swiper.realIndex;
};

const onHeroSlideChange = (swiper: any) => {
  const realIndex = swiper.realIndex;
  currentSlideIndex.value = realIndex;
  // Sync description slider when hero changes (autoplay)
  if (
    descriptionSwiperInstance &&
    descriptionSwiperInstance.realIndex !== realIndex
  ) {
    descriptionSwiperInstance.slideToLoop(realIndex, 0); // Instant sync
  }
};

const setDescriptionSwiper = (swiper: any) => {
  descriptionSwiperInstance = swiper;
  // Initialize description position
  if (heroSwiperInstance) {
    descriptionSwiperInstance.slideToLoop(heroSwiperInstance.realIndex);
  }
};

const onDescriptionSlideChange = (swiper: any) => {
  // Keep description in sync with hero
};

const goToSlide = (index: number) => {
  if (heroSwiperInstance) {
    heroSwiperInstance.slideToLoop(index, 1000); // Smooth transition
  }
};

// Hero slider data
const heroSlides = ref([
  {
    image: "/slider/jalan_lingkungan.png",
    title: "Jalan Lingkungan",
    description:
      "Data komprehensif infrastruktur jalan lingkungan di Kabupaten Kubu Raya.",
    brandingDescription:
      "Jalan lingkungan adalah infrastruktur jalan yang berada di dalam kawasan permukiman untuk melayani kebutuhan transportasi lokal masyarakat.",
    link: "/peta-interaktif/jalan-lingkungan",
  },
  {
    image: "/slider/jembatan_lingkungan.png",
    title: "Jembatan Lingkungan",
    description:
      "Informasi jembatan lingkungan yang menghubungkan berbagai daerah di Kubu Raya.",
    brandingDescription:
      "Jembatan lingkungan merupakan infrastruktur penghubung yang memfasilitasi aksesibilitas antar wilayah permukiman.",
    link: "/peta-interaktif/jembatan",
  },
  {
    image: "/slider/drainase_lingkungan.png",
    title: "Drainase Lingkungan",
    description:
      "Sistem drainase terintegrasi untuk mengelola air permukaan di kawasan permukiman.",
    brandingDescription:
      "Drainase lingkungan adalah sistem pengelolaan air permukaan yang berfungsi untuk mengalirkan dan mengendalikan air hujan di kawasan permukiman.",
    link: "/peta-interaktif/drainase",
  },
  {
    image: "/slider/kawasan_permukiman.png",
    title: "Kawasan Permukiman",
    description:
      "Peta interaktif kawasan permukiman untuk perencanaan tata ruang yang lebih baik.",
    brandingDescription:
      "Kawasan permukiman adalah wilayah yang digunakan untuk tempat tinggal atau hunian beserta sarana pendukungnya.",
    link: "/peta-interaktif/kawasan",
  },
  {
    image: "/slider/rumah_tidak_layak_huni.png",
    title: "Rumah Tidak Layak Huni",
    description:
      "Identifikasi dan pemetaan rumah tidak layak huni untuk program perbaikan perumahan.",
    brandingDescription:
      "Rumah tidak layak huni adalah bangunan tempat tinggal yang tidak memenuhi syarat kesehatan, kenyamanan, dan keselamatan.",
    link: "/peta-interaktif/rumah",
  },
]);

// Data refs
const statsData = ref<any>(null);
const dokumentasiKegiatanHome = ref<any[]>([]);
const dokumentasiInfrastrukturHome = ref<any[]>([]);
const roadLengthKm = ref<string>("0");

// CountUp instances for Tentang section
let tentangRoadLengthCounter: any = null;
let tentangDrainaseCounter: any = null;
let tentangJembatanCounter: any = null;
let tentangPerumahanCounter: any = null;
let tentangRumahCounter: any = null;

// Flag to track if animation has been played
const tentangAnimationPlayed = ref(false);

// Helper function to format date
const formatUploadDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} minggu lalu`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} bulan lalu`;
  }
  const years = Math.floor(diffDays / 365);
  return `${years} tahun lalu`;
};

// Helper functions for YouTube
const extractYouTubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const getYouTubeThumbnail = (url: string) => {
  const videoId = extractYouTubeVideoId(url);
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;
};

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return "";
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return "";
  return `https://www.youtube.com/embed/${videoId}`;
};

const openYouTubeFancybox = (url: string, title: string) => {
  if (typeof window !== "undefined" && (window as any).Fancybox) {
    const videoUrl = getYouTubeEmbedUrl(url);
    const videoTitle = title || "Video Dokumentasi";

    (window as any).Fancybox.show(
      [
        {
          src: videoUrl,
          type: "iframe",
          caption: videoTitle,
        },
      ],
      {
        Toolbar: {
          display: {
            left: ["infobar"],
            middle: [],
            right: ["close"],
          },
        },
        closeButton: "top",
        click: "close",
        wheel: "close",
        keyboard: {
          Escape: "close",
        },
      }
    );
  } else {
    // Fallback: open in new tab if Fancybox is not available
    window.open(url, "_blank");
  }
};

const formatJenisInfrastruktur = (jenis: string) => {
  return jenis.replace(/_/g, " ");
};

// Load dokumentasi infrastruktur from API - all categories, newest first
const loadDokumentasiInfrastruktur = async () => {
  try {
    // Load all categories without filter, limit 4 (1 row x 4 columns)
    const { data, error } = await useContentApi().getDokumentasiInfrastruktur({
      limit: 4,
    });

    if (error) {
      console.error("Error loading dokumentasi infrastruktur:", error);
      dokumentasiInfrastrukturHome.value = [];
      return;
    }

    // Data is already sorted by dibuatPada desc from API
    dokumentasiInfrastrukturHome.value = (data as any[]) || [];
  } catch (error) {
    console.error("Error loading dokumentasi infrastruktur:", error);
    dokumentasiInfrastrukturHome.value = [];
  }
};

// Transform data for display - already sorted by newest first from API
const filteredVideos = computed(() => {
  if (
    !dokumentasiInfrastrukturHome.value ||
    !Array.isArray(dokumentasiInfrastrukturHome.value)
  ) {
    return [];
  }

  return dokumentasiInfrastrukturHome.value.map((item: any) => {
    let title = formatJenisInfrastruktur(item.jenisInfrastruktur);

    // Add road info for Jalan Lingkungan
    if (item.roadInfo && item.roadInfo.namaJalan) {
      title += ` - ${item.roadInfo.namaJalan}`;
      if (item.roadInfo.kecamatan) {
        title += ` - ${item.roadInfo.kecamatan}`;
      }
      if (item.roadInfo.desa) {
        title += ` - ${item.roadInfo.desa}`;
      }
    } else if (item.noRuas) {
      title += ` - ${item.noRuas}`;
    }

    return {
      id: item.id,
      category: formatJenisInfrastruktur(item.jenisInfrastruktur),
      title,
      description: `Video dokumentasi ${formatJenisInfrastruktur(
        item.jenisInfrastruktur
      ).toLowerCase()} dengan nomor ruas ${item.noRuas || ""}`,
      youtubeUrl: item.linkYoutube || "",
      thumbnail: getYouTubeThumbnail(item.linkYoutube || ""),
      duration: "Video",
      roadInfo: item.roadInfo || null,
      uploadDate: formatUploadDate(item.dibuatPada || item.diperbaruiPada),
    };
  });
});

// Function to open SIMANTAP pages
const openSimantap = (type: string) => {
  const routeMap: Record<string, string> = {
    jalan: "/peta-interaktif/jalan-lingkungan",
    jembatan: "/peta-interaktif/jembatan",
    drainase: "/peta-interaktif/drainase",
    kawasan: "/peta-interaktif/kawasan",
    rumah: "/peta-interaktif/rumah",
    aspirasi: "/peta-interaktif/aspirasi",
  };

  const route = routeMap[type] || "/peta-interaktif/jalan-lingkungan";
  navigateTo(route);
};

// Initialize CountUp instances for Tentang section
const initializeTentangCounters = () => {
  if (typeof window !== "undefined") {
    tentangRoadLengthCounter = new CountUp("tentangRoadLengthCounter", 0, {
      duration: 1.2,
      useEasing: true,
      useGrouping: true,
      separator: ",",
    });

    tentangDrainaseCounter = new CountUp("tentangDrainaseCounter", 0, {
      duration: 1.2,
      useEasing: true,
      useGrouping: true,
      separator: ",",
    });

    tentangJembatanCounter = new CountUp("tentangJembatanCounter", 0, {
      duration: 1.2,
      useEasing: true,
      useGrouping: true,
      separator: ",",
    });

    tentangPerumahanCounter = new CountUp("tentangPerumahanCounter", 0, {
      duration: 1.2,
      useEasing: true,
      useGrouping: true,
      separator: ",",
    });

    tentangRumahCounter = new CountUp("tentangRumahCounter", 0, {
      duration: 1.2,
      useEasing: true,
      useGrouping: true,
      separator: ",",
    });
  }
};

// Start counter animations sequentially
const startTentangCounters = () => {
  // Prevent animation from playing multiple times
  if (tentangAnimationPlayed.value) return;

  // Mark animation as played
  tentangAnimationPlayed.value = true;

  // Reset counters to 0 first
  if (tentangRoadLengthCounter) tentangRoadLengthCounter.reset();
  if (tentangDrainaseCounter) tentangDrainaseCounter.reset();
  if (tentangJembatanCounter) tentangJembatanCounter.reset();
  if (tentangPerumahanCounter) tentangPerumahanCounter.reset();
  if (tentangRumahCounter) tentangRumahCounter.reset();

  // Get road length value
  const roadLengthValue = parseInt(roadLengthKm.value) || 0;

  // Start animations sequentially with smooth transitions
  // Stat 1: Start immediately (0ms)
  setTimeout(() => {
    if (tentangRoadLengthCounter && roadLengthValue > 0) {
      tentangRoadLengthCounter.update(roadLengthValue);
    }
  }, 0);

  // Stat 2: Start with slight overlap (300ms)
  setTimeout(() => {
    if (tentangDrainaseCounter) {
      tentangDrainaseCounter.update(0);
    }
  }, 300);

  // Stat 3: Start with slight overlap (600ms)
  setTimeout(() => {
    if (tentangJembatanCounter) {
      tentangJembatanCounter.update(0);
    }
  }, 600);

  // Stat 4: Start with slight overlap (900ms)
  setTimeout(() => {
    if (tentangPerumahanCounter) {
      tentangPerumahanCounter.update(0);
    }
  }, 900);

  // Stat 5: Start with slight overlap (1200ms)
  setTimeout(() => {
    if (tentangRumahCounter) {
      tentangRumahCounter.update(0);
    }
  }, 1200);
};

// Setup Intersection Observer for Tentang stats
const setupTentangStatsObserver = () => {
  if (typeof window === "undefined") return;

  const statsElement = document.querySelector(
    "#tentangStatsRow"
  ) as HTMLElement;
  if (!statsElement) return;

  // Create intersection observer
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.3, // Trigger when 30% of the element is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !tentangAnimationPlayed.value) {
        // Element is visible, start counter animation after AOS delay
        // AOS delay is 200ms, so we wait a bit more to ensure AOS is done
        setTimeout(() => {
          startTentangCounters();
        }, 500);
      }
    });
  }, options);

  // Start observing the stats element
  observer.observe(statsElement);

  // Check if element is already visible (for desktop)
  setTimeout(() => {
    if (!tentangAnimationPlayed.value) {
      const rect = statsElement.getBoundingClientRect();
      const isPartiallyVisible =
        rect.top <
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom > 0;

      if (isPartiallyVisible) {
        setTimeout(() => {
          startTentangCounters();
        }, 500);
      }
    }
  }, 1000);
};

// Initialize data
onMounted(async () => {
  // Initialize AOS
  AOS.init({
    duration: 1000,
    easing: "ease-out-cubic",
    once: false,
    mirror: true,
    offset: 100,
  });

  // Fetch stats for hero section
  // NOTE: Data belum tersedia untuk selain jalan lingkungan, tidak request API, tetap tampilkan 0
  // Set default values to 0 (tidak request API karena data belum tersedia)
  statsData.value = {
    jalan: { totalPanjangKm: 0 },
    jembatan: { totalPanjangKm: 0 },
    drainase: { totalPanjangKm: 0 },
    kawasan: { totalPanjangKm: 0 },
    rumah: { totalPanjangKm: 0 },
  };
  roadLengthKm.value = "0";

  // Fetch dokumentasi kegiatan (limit 16 for 4 rows x 4 columns)
  const { data: dokumentasi } = await getDokumentasiKegiatan({ limit: 16 });
  if (dokumentasi && Array.isArray(dokumentasi)) {
    // Add uploadDate to each item
    dokumentasiKegiatanHome.value = dokumentasi.map((item: any) => ({
      ...item,
      uploadDate: formatUploadDate(item.dibuatPada || item.diperbaruiPada),
    }));
  }

  // Fetch dokumentasi infrastruktur (limit 4 for 1 row x 4 columns)
  await loadDokumentasiInfrastruktur();

  // Initialize Tentang section counters
  initializeTentangCounters();

  // Setup intersection observer for Tentang stats (with delay to ensure DOM is ready)
  setTimeout(() => {
    setupTentangStatsObserver();
  }, 500);

  // Wait for Fancybox to be loaded from CDN
  nextTick(() => {
    // Check if Fancybox is already loaded
    if (typeof window !== "undefined" && (window as any).Fancybox) {
      console.log("Fancybox initialized");
      return;
    }

    // Wait for script to load
    const checkFancybox = setInterval(() => {
      if (typeof window !== "undefined" && (window as any).Fancybox) {
        console.log("Fancybox loaded and initialized");
        clearInterval(checkFancybox);
      }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkFancybox);
      if (typeof window !== "undefined" && !(window as any).Fancybox) {
        console.warn("Fancybox failed to load");
      }
    }, 5000);
  });
});
</script>

<style scoped>
/* Hero Slider Styles */
:deep(.hero-swiper) {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}

:deep(.hero-swiper .swiper-wrapper) {
  height: 100%;
}

:deep(.hero-swiper .swiper-slide) {
  height: 100%;
  position: relative;
}

.hero-slide {
  width: 100%;
  height: 100%;
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

/* Hero Content Animations */
.hero-content-wrapper {
  min-height: auto;
}

/* Thumbnail Container */
.hero-thumbnail-container {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  height: 64px;
  flex-wrap: nowrap;
}

@media (max-width: 1023px) {
  .hero-thumbnail-container {
    gap: 8px;
    height: 48px;
  }
}

.hero-title-text {
  animation: slideInFromLeft 0.8s ease-out;
  background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes slideInFromLeft {
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.hero-subtitle {
  animation: fadeIn 1s ease-out 0.2s backwards;
}

.hero-description {
  animation: fadeIn 1s ease-out 0.3s backwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Interactive Button with Ripple Effect */
.hero-button {
  position: relative;
  overflow: hidden;
}

.hero-button::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.hero-button:hover::before {
  width: 300px;
  height: 300px;
}

.hero-button:active {
  transform: scale(0.98);
}

.ripple-effect {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transform: scale(0);
  animation: ripple 0.6s ease-out;
  pointer-events: none;
  z-index: 1;
}

@keyframes ripple {
  to {
    transform: scale(2);
    opacity: 0;
  }
}

/* Thumbnail Hover Effects */
.hero-thumbnail {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 80px;
  height: 64px;
  display: inline-block;
  flex-shrink: 0;
  box-sizing: border-box;
}

@media (max-width: 1023px) {
  .hero-thumbnail {
    width: 60px;
    height: 48px;
  }
}

.hero-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-thumbnail:hover img {
  opacity: 0.9;
}

.hero-thumbnail::after {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.1)
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hero-thumbnail:hover::after {
  opacity: 1;
}

/* Line clamp utility */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Progress Bar Animation */
.hero-progress-bar {
  animation: progressBar 5s linear;
  width: 0%;
}

@keyframes progressBar {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

.hero-progress-indicator {
  animation: progressIndicator 5s linear;
  width: 0%;
}

@keyframes progressIndicator {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Card Glow Effect on Hover */
.bg-white.rounded-2xl:hover {
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.15);
}

/* Enhanced Card Borders */
.border-gray-100 {
  position: relative;
}

.border-gray-100::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1),
    rgba(147, 51, 234, 0.1)
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.border-gray-100:hover::before {
  opacity: 1;
}

/* Backdrop Filter for Better Readability */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Image Zoom Effect */
.group:hover img {
  transform: scale(1.1);
  transition: transform 0.5s ease;
}

/* Category Badge Pulse */
@keyframes badgePulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
  }
}

.bg-blue-600.text-white.px-3.py-1:hover {
  animation: badgePulse 2s infinite;
}

/* Loading Animation for Images */
img {
  transition: opacity 0.3s ease;
}

img[src=""] {
  opacity: 0.5;
}

/* Enhanced Category Tabs */
button.rounded-lg {
  position: relative;
  overflow: hidden;
}

button.rounded-lg::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

button.rounded-lg:hover::after {
  width: 300px;
  height: 300px;
}

/* Gradient Border Animation */
@keyframes borderGlow {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

/* Performance Optimization */
.transform {
  transform: translateZ(0);
  will-change: transform;
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Swiper custom styles */
.news-swiper {
  padding: 20px 0 50px;
}

.news-swiper :deep(.swiper-pagination-bullet) {
  background: white;
  opacity: 0.5;
  width: 10px;
  height: 10px;
  transition: all 0.3s ease;
}

.news-swiper :deep(.swiper-pagination-bullet-active) {
  background: white;
  opacity: 1;
  width: 30px;
  border-radius: 5px;
}
</style>
