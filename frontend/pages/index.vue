<template>
  <div>
    <!-- Hero Section -->
    <section
      id="home"
      class="relative min-h-screen flex items-center justify-center overflow-hidden py-16 md:py-0"
    >
      <!-- Background -->
      <div class="absolute inset-0">
        <div
          class="w-full h-full bg-cover bg-center bg-no-repeat"
          style="background-image: url('/bg.png')"
        >
          <div class="absolute inset-0 bg-black/50"></div>
        </div>
      </div>

      <!-- Content -->
      <div class="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto pt-8 sm:pt-12 lg:pt-16">
          <!-- Text Content -->
          <div class="text-left mb-16 sm:mb-20 lg:mb-24">
            <h1
              class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-4 sm:mb-6 tracking-wide hero-title-animation"
              style="color: #18eef7"
            >
              Selamat Datang di Website Resmi
            </h1>
            <h2
              class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight hero-subtitle-animation max-w-6xl"
            >
              Bidang Perumahan dan Kawasan Permukiman<br />
              Dinas PUPRPRKP Kabupaten Kubu Raya
            </h2>
          </div>

          <!-- Stats Cards -->
          <div class="max-w-4xl">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <!-- Stat 1 -->
              <div
                class="glass-card rounded-lg p-2 sm:p-3 border border-white/20 shadow-lg hero-card-animation"
                style="animation-delay: 0.2s"
              >
                <div class="flex items-center gap-2 sm:gap-3 mb-2">
                  <div
                    class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg shadow-md flex-shrink-0"
                  >
                    <svg
                      class="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                    >
                      <path
                        d="M127,60.7c-1.2,0.5-71.2,53.6-71.2,54c0,0.7,2.2,1,9.5,1h7.3v38.7v38.8l1.2,1.2c1.1,1.1,1.5,1.2,5.5,1.2h4.3v-25.9c0-25.4,0-25.9,1-27.2l1-1.3h16.5c14.1,0,16.6,0.1,17.5,0.8l1.1,0.7v26.5v26.4H151h30.4l1.2-1.2l1.2-1.2v-38.8v-38.7h7.8c4.4,0,8.1-0.2,8.5-0.5c0.9-0.6,1.5-0.1-14.8-12.4l-12.6-9.5l0-14.9c0-11-0.2-15.2-0.6-16.1l-0.6-1.2L160,60.9c-10.1-0.1-11.6,0-12.4,0.7c-0.7,0.7-0.9,1.7-1,6.3l-0.1,5.4l-8.3-6.2C130.2,61,128.5,60.1,127,60.7z M171.7,142.4c1,1.2,1,1.9,1,13v11.7l-1.2,1.2l-1.2,1.2h-16.4c-15.7,0-16.4,0-17.3-1c-0.9-0.9-1-1.6-1-13.4c0-12.4,0-12.5,1.1-13.2c0.9-0.7,3.4-0.8,17.5-0.8h16.5L171.7,142.4z"
                      ></path>
                      <path
                        d="M29.3,106.9C18.7,115,10,121.8,10,122.1s2,0.5,4.4,0.6l4.3,0.1v21.5c0,12.7,0.2,21.8,0.5,22.2c0.4,0.6,3.6,0.7,24.4,0.7h24l0.1-23.7l0.1-23.7H55.1c-10.8,0-12.7-0.1-12.7-0.7c0-0.4,4.8-4.4,10.6-9c5.8-4.6,10.4-8.5,10.3-8.7c-0.7-1.2-12.5-9.5-13.4-9.5C49.3,92.1,40.1,98.7,29.3,106.9z"
                      ></path>
                      <path
                        d="M198.7,96.7c-3.3,2.5-6.1,4.7-6.2,4.8c0,0,4.8,3.9,10.7,8.6c6,4.7,10.8,8.9,10.8,9.2c0,0.6-2,0.7-12.7,0.7h-12.7l0.1,23.7l0.1,23.7l23,0.1c15.3,0,23.3,0,23.9-0.4c0.9-0.5,1-1.2,1-22.4v-21.9h4.5c2.5,0,4.7-0.2,4.8-0.4c0.4-0.6-38.7-30.1-40.1-30.2C205,92.1,203.2,93.2,198.7,96.7z"
                      ></path>
                    </svg>
                  </div>
                  <div class="text-left">
                    <div
                      class="text-xl sm:text-2xl font-bold text-white leading-none"
                    >
                      {{ animatedKawasan }}
                    </div>
                    <div
                      class="text-xs text-blue-200 uppercase tracking-wide font-medium mt-0.5"
                    >
                      Kawasan
                    </div>
                  </div>
                </div>
                <div class="text-xs sm:text-sm font-semibold text-white">
                  Kawasan Permukiman
                </div>
                <div class="text-xs text-white/70 hidden sm:block">
                  Kawasan yang telah dikelola
                </div>
              </div>

              <!-- Stat 2 -->
              <div
                class="glass-card rounded-lg p-2 sm:p-3 border border-white/20 shadow-lg hero-card-animation"
                style="animation-delay: 0.3s"
              >
                <div class="flex items-center gap-2 sm:gap-3 mb-2">
                  <div
                    class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg shadow-md flex-shrink-0"
                  >
                    <svg
                      class="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                    >
                      <path
                        d="M238.6,201.7c-1,0-5.3,0-7.4,0h-19.9c-12.2-34.4-44.8-59-83.4-59c-38.5,0-71.2,24.7-83.4,59H24.8c-2.1,0-6.4,0-7.4,0c-4.1,0-7.4-3.3-7.4-7.4V187v-73.7c0-8.1,6.6-14.8,14.8-14.8h7.4V69H17.4c-4.1,0-7.4-3.3-7.4-7.4c0-4.1,3.3-7.4,7.4-7.4h221.2c4.1,0,7.4,3.3,7.4,7.4c0,4.1-3.3,7.4-7.4,7.4h-14.7v29.5h7.4c8.1,0,14.8,6.6,14.8,14.8V187v7.4C246,198.4,242.7,201.7,238.6,201.7z M76.4,69H46.9v29.5h29.5V69z M120.6,69H91.1v29.5h29.5V69z M164.9,69h-29.5v29.5h29.5V69z M209.1,69h-29.5v29.5h29.5V69z"
                      ></path>
                    </svg>
                  </div>
                  <div class="text-left">
                    <div
                      class="text-xl sm:text-2xl font-bold text-white leading-none"
                    >
                      {{ animatedJembatan }}
                    </div>
                    <div
                      class="text-xs text-green-200 uppercase tracking-wide font-medium mt-0.5"
                    >
                      Unit
                    </div>
                  </div>
                </div>
                <div class="text-xs sm:text-sm font-semibold text-white">
                  Jembatan Lingkungan
                </div>
                <div class="text-xs text-white/70 hidden sm:block">
                  Total jembatan yang terbangun
                </div>
              </div>

              <!-- Stat 3 -->
              <div
                class="glass-card rounded-lg p-2 sm:p-3 border border-white/20 shadow-lg hero-card-animation"
                style="animation-delay: 0.4s"
              >
                <div class="flex items-center gap-2 sm:gap-3 mb-2">
                  <div
                    class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-lg shadow-md flex-shrink-0"
                  >
                    <svg
                      class="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                    >
                      <path
                        d="M147.6,141v-0.5l-3.1-41.5c-0.1-1.1-0.6-2.1-1.4-2.9c-0.9-0.8-1.9-1.2-3-1.2h-24.1c-1.1,0-2.1,0.4-3,1.2c-0.9,0.8-1.3,1.8-1.4,2.9l-3.1,41.5v0.5c-0.1,1,0.3,1.9,1,2.6c0.8,0.7,1.7,1,2.7,1h31.6c1,0,1.9-0.3,2.7-1C147.3,142.9,147.7,142,147.6,141L147.6,141z M246,201.5c0,6.3-2,9.5-6,9.5h-91.3c1.1,0,2.1-0.4,2.8-1.2c0.8-0.8,1.1-1.8,1-2.9l-2.6-33.2c-0.1-1.1-0.6-2.1-1.4-2.9c-0.9-0.8-1.9-1.2-3-1.2h-35.3c-1.1,0-2.1,0.4-3,1.2c-0.9,0.8-1.3,1.8-1.4,2.9l-2.6,33.2c-0.1,1.1,0.3,2.1,1,2.9c0.8,0.8,1.7,1.2,2.8,1.2H16c-4,0-6-3.2-6-9.5c0-4.7,1.1-9.7,3.4-15.1L67.4,51.1c0.7-1.6,1.8-3.1,3.4-4.3c1.6-1.2,3.2-1.8,4.9-1.8h43.9c-1.1,0-2.1,0.4-3,1.2c-0.9,0.8-1.3,1.8-1.4,2.9l-1.9,24.9c-0.1,1.2,0.3,2.2,1,3c0.8,0.8,1.7,1.2,2.8,1.2h21.5c1.1,0,2.1-0.4,2.8-1.2c0.8-0.8,1.1-1.8,1-3l-2-24.9c-0.1-1.1-0.6-2.1-1.4-2.9s-1.9-1.2-3-1.2h44c1.7,0,3.4,0.6,4.9,1.8c1.6,1.2,2.7,2.6,3.4,4.3l54.1,135.4C244.9,191.9,246,196.9,246,201.5L246,201.5z"
                      ></path>
                    </svg>
                  </div>
                  <div class="text-left">
                    <div
                      class="text-xl sm:text-2xl font-bold text-white leading-none"
                    >
                      {{ animatedJalan }} km
                    </div>
                    <div
                      class="text-xs text-orange-200 uppercase tracking-wide font-medium mt-0.5"
                    >
                      Dipetakan
                    </div>
                  </div>
                </div>
                <div class="text-xs sm:text-sm font-semibold text-white">
                  Jalan Lingkungan
                </div>
                <div class="text-xs text-white/70 hidden sm:block">
                  Panjang jalan yang telah dipetakan
                </div>
              </div>

              <!-- Stat 4 -->
              <div
                class="glass-card rounded-lg p-2 sm:p-3 border border-white/20 shadow-lg hero-card-animation"
                style="animation-delay: 0.5s"
              >
                <div class="flex items-center gap-2 sm:gap-3 mb-2">
                  <div
                    class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg shadow-md flex-shrink-0"
                  >
                    <svg
                      class="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                    >
                      <path d="M10,210.5h236v16.8H10V210.5L10,210.5z"></path>
                      <path
                        d="M90.8,28.8H18v9.9h60.1v70.4H18v9.9h72.8L90.8,28.8L90.8,28.8z"
                      ></path>
                      <path
                        d="M106.2,119.1c-0.4,20.8,0,87.4,0,87.4h67c0,0-2.2-76.5-9.5-96.9c-7.3-20.4-28.8-59.7-69.6-65.5v60.4C94.1,104.5,106.9,105.2,106.2,119.1z"
                      ></path>
                    </svg>
                  </div>
                  <div class="text-left">
                    <div
                      class="text-xl sm:text-2xl font-bold text-white leading-none"
                    >
                      {{ animatedDrainase }}
                    </div>
                    <div
                      class="text-xs text-purple-200 uppercase tracking-wide font-medium mt-0.5"
                    >
                      Unit
                    </div>
                  </div>
                </div>
                <div class="text-xs sm:text-sm font-semibold text-white">
                  Drainase Lingkungan
                </div>
                <div class="text-xs text-white/70 hidden sm:block">
                  Total drainase yang terbangun
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 2: Berita -->
    <section
      id="berita"
      class="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
      style="
        background: linear-gradient(
          to bottom,
          #0f1931 0%,
          #1e3a8a 40%,
          #ffffff 100%
        );
        background-image: url('/bg-berita.svg'),
          linear-gradient(to bottom, #0f1931 0%, #1e3a8a 40%, #ffffff 100%);
        background-size: 60%, cover;
        background-position: center center;
        background-repeat: no-repeat;
      "
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          class="mb-8 flex items-center justify-between"
          data-aos="fade-right"
        >
          <h2
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white relative inline-block"
          >
            Berita Terkini
            <div
              class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-transparent rounded-full"
            ></div>
          </h2>

          <!-- View All News Button (moved to top right) -->
          <NuxtLink
            to="/berita"
            class="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-yellow-400 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
            data-aos="fade-left"
          >
            Lihat Semua Berita
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

        <!-- News Slider with Swiper -->
        <div v-if="beritaList.length > 0" class="relative" data-aos="fade-up">
          <swiper
            :modules="swiperModules"
            :slides-per-view="1"
            :space-between="20"
            :pagination="{ clickable: true }"
            :autoplay="{ delay: 5000, disableOnInteraction: false }"
            :rewind="true"
            :breakpoints="{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }"
            class="news-swiper"
          >
            <swiper-slide v-for="item in beritaList.slice(0, 6)" :key="item.id">
              <div
                class="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group h-56"
                @click="navigateTo(`/berita-detail?slug=${item.slug}`)"
              >
                <!-- Thumbnail Background -->
                <img
                  :src="getThumbnail(item)"
                  :alt="item.judul"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />

                <!-- Overlay on Hover -->
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6"
                >
                  <!-- Kategori dan tanggal -->
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="text-sm text-blue-400 font-medium">{{
                      item.kategori || "Berita"
                    }}</span>
                    <span class="text-sm text-gray-300">•</span>
                    <span class="text-sm text-gray-300">{{
                      formatRelativeDate(item.tanggalPublikasi)
                    }}</span>
                  </div>
                  <!-- Judul -->
                  <h3 class="text-lg font-bold text-white mb-2 line-clamp-2">
                    {{ item.judul }}
                  </h3>
                  <!-- Excerpt -->
                  <p class="text-gray-200 text-sm leading-relaxed line-clamp-3">
                    {{ getExcerpt(item.konten, 100) }}
                  </p>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>

        <!-- Empty state jika tidak ada berita -->
        <div v-else class="text-center py-8 bg-white rounded-2xl">
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
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <p class="text-gray-500">Belum ada berita tersedia</p>
        </div>
      </div>
    </section>

    <!-- Dokumentasi Section (Infrastruktur & Kegiatan) -->
    <section
      id="dokumentasi"
      class="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden"
    >
      <!-- Decorative background -->
      <div
        class="absolute top-10 left-10 w-96 h-96 bg-gray-100 rounded-full opacity-20 blur-3xl"
      ></div>
      <div
        class="absolute bottom-10 right-10 w-96 h-96 bg-gray-100 rounded-full opacity-20 blur-3xl"
      ></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Left Column: Dokumentasi (75% width) -->
          <div class="lg:col-span-3">
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

            <!-- Category Tabs -->
            <div class="mb-8 overflow-x-auto">
              <div
                class="flex space-x-2 justify-start sm:justify-center min-w-max sm:min-w-0 pb-2"
              >
                <button
                  v-for="category in infraCategories"
                  :key="category.id"
                  @click="selectedCategory = category.id"
                  :class="[
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 whitespace-nowrap',
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  ]"
                >
                  {{ category.name }}
                </button>
              </div>
            </div>

            <!-- Video Grid - Limit 3 for homepage -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="(video, index) in filteredVideos"
                :key="video.id"
                class="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                data-aos="zoom-in"
                :data-aos-delay="index * 100"
              >
                <div
                  @click="
                    video.youtubeUrl
                      ? openYouTubeFancybox(video.youtubeUrl, video.title)
                      : null
                  "
                  :class="[
                    'block relative aspect-video bg-gray-200',
                    video.youtubeUrl
                      ? 'cursor-pointer'
                      : 'cursor-not-allowed opacity-60',
                  ]"
                >
                  <!-- Thumbnail -->
                  <img
                    v-if="video.thumbnail"
                    :src="video.thumbnail"
                    :alt="video.title"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full bg-gray-300 flex items-center justify-center"
                  >
                    <div class="text-center">
                      <svg
                        class="w-16 h-16 mx-auto text-gray-400 mb-2"
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
                      <p class="text-sm text-gray-500">Video tidak tersedia</p>
                    </div>
                  </div>

                  <!-- Play Button Overlay -->
                  <div
                    class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center hover:bg-opacity-50 transition-all duration-200"
                  >
                    <div
                      class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
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

                  <!-- Duration Badge -->
                  <div
                    class="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded"
                  >
                    {{ video.duration }}
                  </div>
                </div>

                <!-- Video Info -->
                <div class="p-4">
                  <h3 class="font-bold text-gray-900 mb-2 line-clamp-2">
                    {{ video.title }}
                  </h3>
                  <p class="text-sm text-gray-600 line-clamp-2">
                    {{ video.description }}
                  </p>
                  <div class="mt-3 flex items-center text-xs text-gray-500">
                    <svg
                      class="w-4 h-4 mr-1"
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
                    <span>{{ video.category }}</span>
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

              <!-- Kegiatan Cards Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="(kegiatan, index) in dokumentasiKegiatanHome"
                  :key="kegiatan.id"
                  @click="
                    navigateTo(
                      `/dokumentasi-kegiatan-detail?slug=${kegiatan.slug}`
                    )
                  "
                  class="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer border border-gray-100"
                  data-aos="fade-up"
                  :data-aos-delay="index * 100"
                >
                  <!-- Image dengan placeholder -->
                  <div class="relative h-48 overflow-hidden">
                    <img
                      :src="getThumbnail(kegiatan)"
                      :alt="kegiatan.judul"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                    />
                    <div
                      class="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold"
                    >
                      {{ kegiatan.kategori || "Kegiatan" }}
                    </div>
                  </div>

                  <!-- Content -->
                  <div class="p-6">
                    <div class="flex items-center text-sm text-gray-500 mb-2">
                      <svg
                        class="w-4 h-4 mr-2"
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
                    <h3
                      class="text-lg font-bold text-gray-900 mb-2 line-clamp-2"
                    >
                      {{ kegiatan.judul }}
                    </h3>
                    <p class="text-gray-600 text-sm line-clamp-3">
                      {{ kegiatan.deskripsi }}
                    </p>
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
          <!-- End of Left Column -->

          <!-- Right Column: Peta dan Aduan Infrastruktur (25% width) -->
          <div class="lg:col-span-1">
            <div class="mb-6 sticky top-24" data-aos="fade-left">
              <h2
                class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 relative inline-block"
              >
                Peta dan Aduan Infrastruktur
                <div
                  class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-transparent rounded-full"
                ></div>
              </h2>

              <!-- Infrastructure Cards -->
              <div class="space-y-4 mt-6">
                <!-- Jalan Lingkungan -->
                <div
                  class="bg-white rounded-xl shadow-lg cursor-pointer overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  @click="openSijali('jalan')"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div class="p-4 flex items-center">
                    <div
                      class="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-blue-100 rounded-lg"
                    >
                      <img
                        src="/assets/images/sijali-logo.svg"
                        alt="Jalan Lingkungan"
                        class="w-8 h-8"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                      />
                      <svg
                        class="w-8 h-8 text-blue-600 hidden"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div class="ml-3 flex-1">
                      <h3 class="text-sm font-bold text-gray-900 mb-1">
                        Jalan Lingkungan
                      </h3>
                      <p class="text-gray-600 text-xs leading-relaxed">
                        Layanan pengaduan jalan
                      </p>
                    </div>
                    <div class="flex-shrink-0 text-blue-600">
                      <svg
                        class="w-4 h-4"
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
                    </div>
                  </div>
                </div>

                <!-- Jembatan Lingkungan -->
                <div
                  class="bg-white rounded-xl shadow-lg cursor-pointer overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  @click="openSijali('jembatan')"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div class="p-4 flex items-center">
                    <div
                      class="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-blue-100 rounded-lg"
                    >
                      <img
                        src="/assets/images/sijali-logo.svg"
                        alt="Jembatan Lingkungan"
                        class="w-8 h-8"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                      />
                      <svg
                        class="w-8 h-8 text-blue-600 hidden"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div class="ml-3 flex-1">
                      <h3 class="text-sm font-bold text-gray-900 mb-1">
                        Jembatan Lingkungan
                      </h3>
                      <p class="text-gray-600 text-xs leading-relaxed">
                        Monitoring jembatan
                      </p>
                    </div>
                    <div class="flex-shrink-0 text-blue-600">
                      <svg
                        class="w-4 h-4"
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
                    </div>
                  </div>
                </div>

                <!-- Drainase Lingkungan -->
                <div
                  class="bg-white rounded-xl shadow-lg cursor-pointer overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  @click="openSijali('drainase')"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div class="p-4 flex items-center">
                    <div
                      class="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-blue-100 rounded-lg"
                    >
                      <img
                        src="/assets/images/sijali-logo.svg"
                        alt="Drainase Lingkungan"
                        class="w-8 h-8"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                      />
                      <svg
                        class="w-8 h-8 text-blue-600 hidden"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div class="ml-3 flex-1">
                      <h3 class="text-sm font-bold text-gray-900 mb-1">
                        Drainase Lingkungan
                      </h3>
                      <p class="text-gray-600 text-xs leading-relaxed">
                        Sistem drainase
                      </p>
                    </div>
                    <div class="flex-shrink-0 text-blue-600">
                      <svg
                        class="w-4 h-4"
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
                    </div>
                  </div>
                </div>

                <!-- Kawasan Permukiman -->
                <div
                  class="bg-white rounded-xl shadow-lg cursor-pointer overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  @click="openSijali('kawasan')"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <div class="p-4 flex items-center">
                    <div
                      class="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-blue-100 rounded-lg"
                    >
                      <img
                        src="/assets/images/sijali-logo.svg"
                        alt="Kawasan Permukiman"
                        class="w-8 h-8"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                      />
                      <svg
                        class="w-8 h-8 text-blue-600 hidden"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div class="ml-3 flex-1">
                      <h3 class="text-sm font-bold text-gray-900 mb-1">
                        Kawasan Permukiman
                      </h3>
                      <p class="text-gray-600 text-xs leading-relaxed">
                        Pengelolaan kawasan
                      </p>
                    </div>
                    <div class="flex-shrink-0 text-blue-600">
                      <svg
                        class="w-4 h-4"
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
                    </div>
                  </div>
                </div>

                <!-- Rumah Tidak Layak Huni -->
                <div
                  class="bg-white rounded-xl shadow-lg cursor-pointer overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  @click="openSijali('rumah')"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  <div class="p-4 flex items-center">
                    <div
                      class="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-blue-100 rounded-lg"
                    >
                      <img
                        src="/assets/images/sijali-logo.svg"
                        alt="Rumah Tidak Layak Huni"
                        class="w-8 h-8"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                      />
                      <svg
                        class="w-8 h-8 text-blue-600 hidden"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div class="ml-3 flex-1">
                      <h3 class="text-sm font-bold text-gray-900 mb-1">
                        Rumah Tidak Layak Huni
                      </h3>
                      <p class="text-gray-600 text-xs leading-relaxed">
                        Program perbaikan rumah
                      </p>
                    </div>
                    <div class="flex-shrink-0 text-blue-600">
                      <svg
                        class="w-4 h-4"
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
                    </div>
                  </div>
                </div>

                <!-- Aspirasi Masyarakat -->
                <div
                  class="bg-white rounded-xl shadow-lg cursor-pointer overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  @click="openSijali('aspirasi')"
                  data-aos="fade-up"
                  data-aos-delay="600"
                >
                  <div class="p-4 flex items-center">
                    <div
                      class="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-blue-100 rounded-lg"
                    >
                      <img
                        src="/assets/images/sijali-logo.svg"
                        alt="Aspirasi Masyarakat"
                        class="w-8 h-8"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                      />
                      <svg
                        class="w-8 h-8 text-blue-600 hidden"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div class="ml-3 flex-1">
                      <h3 class="text-sm font-bold text-gray-900 mb-1">
                        Aspirasi Masyarakat
                      </h3>
                      <p class="text-gray-600 text-xs leading-relaxed">
                        Wadah aspirasi
                      </p>
                    </div>
                    <div class="flex-shrink-0 text-blue-600">
                      <svg
                        class="w-4 h-4"
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import AOS from "aos";
import "aos/dist/aos.css";

const config = useRuntimeConfig();
// Use SIJALI's useContentApi instead of useWebProfilApi
const { baseURL } = useContentApi();
// baseURL already includes /api if needed, so we use it directly
const API_URL = baseURL;

// API composables
const { getBerita, getDokumentasiKegiatan, getStats } = useContentApi();
const { getThumbnail, handleImageError } = useImagePlaceholder();
const { formatRelativeDate } = useDateFormat();
const { getExcerpt } = useTextUtils();

// Swiper modules
const swiperModules = [Pagination, Autoplay];

// Data refs
const statsData = ref<any>(null);
const beritaList = ref<any[]>([]);
const dokumentasiKegiatanHome = ref<any[]>([]);
const dokumentasiInfrastrukturHome = ref<any[]>([]);

// Animated counter refs
const animatedKawasan = ref(0);
const animatedJembatan = ref(0);
const animatedJalan = ref(0);
const animatedDrainase = ref(0);

// CountUp animation function
const animateValue = (
  start: number,
  end: number,
  duration: number,
  callback: (value: number) => void
) => {
  const startTime = performance.now();
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (end - start) * easeOutQuart);
    callback(current);
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  requestAnimationFrame(animate);
};

// Start animations when stats data is loaded
const startCountUpAnimations = () => {
  if (!statsData.value) return;

  animateValue(
    0,
    statsData.value.infrastruktur?.kawasanPermukiman || 0,
    2000,
    (val) => {
      animatedKawasan.value = val;
    }
  );

  animateValue(
    0,
    statsData.value.infrastruktur?.jembatanLingkungan || 0,
    2000,
    (val) => {
      animatedJembatan.value = val;
    }
  );

  animateValue(0, statsData.value.jalan?.totalPanjangKm || 0, 2000, (val) => {
    animatedJalan.value = val;
  });

  animateValue(
    0,
    statsData.value.infrastruktur?.drainaseLingkungan || 0,
    2000,
    (val) => {
      animatedDrainase.value = val;
    }
  );
};

// Dokumentasi Infrastruktur data
const selectedCategory = ref("Jalan_Lingkungan");

const infraCategories = [
  { id: "Jalan_Lingkungan", name: "Jalan Lingkungan", shortId: "jalan" },
  {
    id: "Jembatan_Lingkungan",
    name: "Jembatan Lingkungan",
    shortId: "jembatan",
  },
  {
    id: "Drainase_Lingkungan",
    name: "Drainase Lingkungan",
    shortId: "drainase",
  },
  { id: "Kawasan_Permukiman", name: "Kawasan Permukiman", shortId: "kawasan" },
  {
    id: "Rumah_Tidak_Layak_Huni",
    name: "Rumah Tidak Layak Huni",
    shortId: "rumah",
  },
];

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

// Load dokumentasi infrastruktur from API
const loadDokumentasiInfrastruktur = async () => {
  try {
    // Use the composable method instead of direct fetch
    const { data, error } = await useContentApi().getDokumentasiInfrastruktur({
      jenisInfrastruktur: selectedCategory.value,
      limit: 3,
    });

    if (error) {
      console.error("Error loading dokumentasi infrastruktur:", error);
      dokumentasiInfrastrukturHome.value = [];
      return;
    }

    dokumentasiInfrastrukturHome.value = (data as any[]) || [];
  } catch (error) {
    console.error("Error loading dokumentasi infrastruktur:", error);
    dokumentasiInfrastrukturHome.value = [];
  }
};

// Transform data for display
const filteredVideos = computed(() => {
  if (
    !dokumentasiInfrastrukturHome.value ||
    !Array.isArray(dokumentasiInfrastrukturHome.value)
  ) {
    return [];
  }

  return dokumentasiInfrastrukturHome.value
    .map((item: any) => {
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
      };
    })
    .slice(0, 3); // Limit to 3 videos for homepage
});

// Watch for category changes
watch(selectedCategory, () => {
  loadDokumentasiInfrastruktur();
});

// Function to open SIJALI in new tab
const openSijali = (type: string) => {
  window.open("https://sijali.vercel.app", "_blank");
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
  const { data: stats } = await getStats();
  if (stats) {
    statsData.value = stats;
    // Start countup animations after data is loaded
    setTimeout(() => {
      startCountUpAnimations();
    }, 300);
  }

  // Fetch latest news (limit 6)
  const { data: berita } = await getBerita({ limit: 6 });
  if (berita && Array.isArray(berita)) {
    beritaList.value = berita;
  }

  // Fetch dokumentasi kegiatan (limit 3)
  const { data: dokumentasi } = await getDokumentasiKegiatan({ limit: 3 });
  if (dokumentasi && Array.isArray(dokumentasi)) {
    dokumentasiKegiatanHome.value = dokumentasi;
  }

  // Fetch dokumentasi infrastruktur (limit 3)
  await loadDokumentasiInfrastruktur();

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
/* Glassmorphism Effect */
.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
}

/* Hero Section Animations */
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

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.hero-title-animation {
  animation: fadeInRight 1s ease-out;
}

.hero-subtitle-animation {
  animation: fadeInRight 1s ease-out 0.2s backwards;
}

.hero-card-animation {
  animation: scaleIn 0.6s ease-out backwards;
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

.border-white\/30 {
  animation: borderGlow 3s ease-in-out infinite;
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
