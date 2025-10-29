<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
  >
    <!-- Navbar -->
    <nav
      class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90"
    >
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Mobile Menu Button & Logo -->
          <div class="flex items-center space-x-3">
            <!-- Hamburger Button (Mobile) -->
            <button
              @click="sidebarOpen = !sidebarOpen"
              class="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  v-if="!sidebarOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <!-- Logo & Title -->
            <img
              src="~/assets/images/sijali-logo.svg"
              alt="SIJALI Logo"
              class="h-10 w-10"
            />
            <div class="hidden sm:block">
              <h1
                class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                Dashboard SIJALI
              </h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Sistem Informasi Jalan Lingkungan
              </p>
            </div>
          </div>

          <!-- User Info Badge -->
          <div class="flex items-center space-x-2">
            <div
              class="hidden sm:flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg"
            >
              <svg
                class="w-4 h-4 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ user?.username || "User" }}
              </span>
              <span
                class="text-xs px-2 py-0.5 rounded-full"
                :class="
                  user?.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                "
              >
                {{ user?.role || "USER" }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content with Sidebar -->
    <div class="flex relative">
      <!-- Mobile Sidebar Overlay -->
      <div
        v-if="sidebarOpen"
        @click="sidebarOpen = false"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
      ></div>

      <!-- Sidebar -->
      <aside
        :class="[
          'fixed lg:sticky top-16 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg h-[calc(100vh-4rem)] z-40 transition-transform duration-300 ease-in-out flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ]"
      >
        <nav class="p-3 space-y-1 overflow-y-auto flex-1">
          <!-- Menu Dashboard (Top) -->
          <button
            @click="
              activeTab = 'dashboard';
              sidebarOpen = false;
            "
            :class="[
              'w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm',
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
            ]"
          >
            <svg
              class="w-4 h-4 flex-shrink-0"
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
            <span class="font-medium">Dashboard</span>
          </button>

          <!-- Menu Profil (Accordion) -->
          <div class="mt-2">
            <button
              @click="profilMenuOpen = !profilMenuOpen"
              class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div class="flex items-center space-x-2">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span class="text-xs font-semibold uppercase tracking-wider"
                  >Profil</span
                >
              </div>
              <svg
                :class="[
                  'w-4 h-4 transition-transform duration-200',
                  profilMenuOpen ? 'rotate-180' : '',
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- Profil Submenu -->
            <div
              v-show="profilMenuOpen"
              class="mt-1 space-y-1 pl-3 overflow-hidden transition-all duration-200"
            >
              <button
                @click="
                  activeTab = 'profil-berita';
                  sidebarOpen = false;
                "
                :class="[
                  'w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm',
                  activeTab === 'profil-berita'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <svg
                  class="w-4 h-4 flex-shrink-0"
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
                <span>Kelola Berita</span>
              </button>

              <button
                @click="
                  activeTab = 'profil-dokumentasi-kegiatan';
                  sidebarOpen = false;
                "
                :class="[
                  'w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm',
                  activeTab === 'profil-dokumentasi-kegiatan'
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <svg
                  class="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Dokumentasi Kegiatan</span>
              </button>

              <button
                @click="
                  activeTab = 'profil-dokumentasi-infrastruktur';
                  sidebarOpen = false;
                "
                :class="[
                  'w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm',
                  activeTab === 'profil-dokumentasi-infrastruktur'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <svg
                  class="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span>Dokumentasi Infrastruktur</span>
              </button>

              <button
                @click="
                  activeTab = 'profil-dokumen-ppid';
                  sidebarOpen = false;
                "
                :class="[
                  'w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm',
                  activeTab === 'profil-dokumen-ppid'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <svg
                  class="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span>Dokumen PPID</span>
              </button>
            </div>
          </div>

          <!-- Menu Data (Accordion) -->
          <div class="mt-2">
            <button
              @click="dataMenuOpen = !dataMenuOpen"
              class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div class="flex items-center space-x-2">
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
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  />
                </svg>
                <span class="text-xs font-semibold uppercase tracking-wider"
                  >Data</span
                >
              </div>
              <svg
                :class="[
                  'w-4 h-4 transition-transform duration-200',
                  dataMenuOpen ? 'rotate-180' : '',
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- Data Submenu -->
            <div
              v-show="dataMenuOpen"
              class="mt-1 space-y-1 pl-3 overflow-hidden transition-all duration-200"
            >
              <button
                @click="
                  activeTab = 'jalan';
                  sidebarOpen = false;
                "
                :class="[
                  'w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm',
                  activeTab === 'jalan'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <svg
                  class="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                >
                  <path
                    d="M147.6,141v-0.5l-3.1-41.5c-0.1-1.1-0.6-2.1-1.4-2.9c-0.9-0.8-1.9-1.2-3-1.2h-24.1c-1.1,0-2.1,0.4-3,1.2c-0.9,0.8-1.3,1.8-1.4,2.9l-3.1,41.5v0.5c-0.1,1,0.3,1.9,1,2.6c0.8,0.7,1.7,1,2.7,1h31.6c1,0,1.9-0.3,2.7-1C147.3,142.9,147.7,142,147.6,141L147.6,141z M246,201.5c0,6.3-2,9.5-6,9.5h-91.3c1.1,0,2.1-0.4,2.8-1.2c0.8-0.8,1.1-1.8,1-2.9l-2.6-33.2c-0.1-1.1-0.6-2.1-1.4-2.9c-0.9-0.8-1.9-1.2-3-1.2h-35.3c-1.1,0-2.1,0.4-3,1.2c-0.9,0.8-1.3,1.8-1.4,2.9l-2.6,33.2c-0.1,1.1,0.3,2.1,1,2.9c0.8,0.8,1.7,1.2,2.8,1.2H16c-4,0-6-3.2-6-9.5c0-4.7,1.1-9.7,3.4-15.1L67.4,51.1c0.7-1.6,1.8-3.1,3.4-4.3c1.6-1.2,3.2-1.8,4.9-1.8h43.9c-1.1,0-2.1,0.4-3,1.2c-0.9,0.8-1.3,1.8-1.4,2.9l-1.9,24.9c-0.1,1.2,0.3,2.2,1,3c0.8,0.8,1.7,1.2,2.8,1.2h21.5c1.1,0,2.1-0.4,2.8-1.2c0.8-0.8,1.1-1.8,1-3l-2-24.9c-0.1-1.1-0.6-2.1-1.4-2.9s-1.9-1.2-3-1.2h44c1.7,0,3.4,0.6,4.9,1.8c1.6,1.2,2.7,2.6,3.4,4.3l54.1,135.4C244.9,191.9,246,196.9,246,201.5L246,201.5z"
                  />
                </svg>
                <span>Jalan Lingkungan</span>
              </button>

              <button
                @click="
                  activeTab = 'jembatan';
                  sidebarOpen = false;
                "
                :class="[
                  'w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm',
                  activeTab === 'jembatan'
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <svg
                  class="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                >
                  <path
                    d="M238.6,201.7c-1,0-5.3,0-7.4,0h-19.9c-12.2-34.4-44.8-59-83.4-59c-38.5,0-71.2,24.7-83.4,59H24.8c-2.1,0-6.4,0-7.4,0c-4.1,0-7.4-3.3-7.4-7.4V187v-73.7c0-8.1,6.6-14.8,14.8-14.8h7.4V69H17.4c-4.1,0-7.4-3.3-7.4-7.4c0-4.1,3.3-7.4,7.4-7.4h221.2c4.1,0,7.4,3.3,7.4,7.4c0,4.1-3.3,7.4-7.4,7.4h-14.7v29.5h7.4c8.1,0,14.8,6.6,14.8,14.8V187v7.4C246,198.4,242.7,201.7,238.6,201.7z M76.4,69H46.9v29.5h29.5V69z M120.6,69H91.1v29.5h29.5V69z M164.9,69h-29.5v29.5h29.5V69z M209.1,69h-29.5v29.5h29.5V69z"
                  />
                </svg>
                <span>Jembatan Lingkungan</span>
              </button>

              <button
                @click="
                  activeTab = 'drainase';
                  sidebarOpen = false;
                "
                :class="[
                  'w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm',
                  activeTab === 'drainase'
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <svg
                  class="w-4 h-4 flex-shrink-0"
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
                <span>Drainase Lingkungan</span>
              </button>

              <button
                @click="
                  activeTab = 'kawasan';
                  sidebarOpen = false;
                "
                :class="[
                  'w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm',
                  activeTab === 'kawasan'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <svg
                  class="w-4 h-4 flex-shrink-0"
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
                <span>Kawasan Permukiman</span>
              </button>

              <button
                @click="
                  activeTab = 'rumah';
                  sidebarOpen = false;
                "
                :class="[
                  'w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm',
                  activeTab === 'rumah'
                    ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <svg
                  class="w-4 h-4 flex-shrink-0"
                  viewBox="0 -32 576 576"
                  fill="currentColor"
                >
                  <path
                    d="M288 114.96L69.47 307.71c-1.62 1.46-3.69 2.14-5.47 3.35V496c0 8.84 7.16 16 16 16h149.23L192 439.19l104.11-64-60.16-119.22L384 392.75l-104.11 64L319.81 512H496c8.84 0 16-7.16 16-16V311.1c-1.7-1.16-3.72-1.82-5.26-3.2L288 114.96zm282.69 121.32L512 184.45V48c0-8.84-7.16-16-16-16h-64c-8.84 0-16 7.16-16 16v51.69L314.75 10.31C307.12 3.45 297.56.01 288 0s-19.1 3.41-26.7 10.27L5.31 236.28c-6.57 5.91-7.12 16.02-1.21 22.6l21.4 23.82c5.9 6.57 16.02 7.12 22.6 1.21L277.42 81.63c6.05-5.33 15.12-5.33 21.17 0L527.91 283.9c6.57 5.9 16.69 5.36 22.6-1.21l21.4-23.82c5.9-6.57 5.36-16.69-1.22-22.59z"
                  />
                </svg>
                <span>Rumah Tidak Layak Huni</span>
              </button>
            </div>
          </div>

          <!-- Menu Laporan & Analisis -->
          <div
            class="pt-2 mt-2 mb-1 border-t border-gray-200 dark:border-gray-700"
          >
            <p
              class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-1"
            >
              Laporan & Analisis
            </p>
          </div>
          <button
            @click="
              activeTab = 'laporan';
              sidebarOpen = false;
            "
            :class="[
              'w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm',
              activeTab === 'laporan'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
            ]"
          >
            <svg
              class="w-4 h-4 flex-shrink-0"
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
            <span class="font-medium">Laporan</span>
          </button>

          <button
            @click="
              activeTab = 'analisis';
              sidebarOpen = false;
            "
            :class="[
              'w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm',
              activeTab === 'analisis'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
            ]"
          >
            <svg
              class="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span class="font-medium">Analisis</span>
          </button>

          <!-- Menu Admin -->
          <div
            v-if="user?.role === 'ADMIN'"
            class="pt-2 mt-2 mb-1 border-t border-gray-200 dark:border-gray-700"
          >
            <p
              class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-1"
            >
              Admin
            </p>
          </div>
          <button
            v-if="user?.role === 'ADMIN'"
            @click="
              activeTab = 'users';
              sidebarOpen = false;
            "
            :class="[
              'w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm',
              activeTab === 'users'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
            ]"
          >
            <svg
              class="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span class="font-medium">Manajemen User</span>
          </button>
        </nav>

        <!-- Logout Button (Fixed Bottom) -->
        <div
          class="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3"
        >
          <button
            @click="handleLogout"
            class="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
          >
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main
        class="flex-1 min-w-0 w-full lg:w-auto py-4 sm:py-6 px-2 sm:px-4 lg:px-6 lg:ml-0"
      >
        <div class="sm:px-0 max-w-full">
          <!-- Welcome Card -->
          <div
            v-if="isDashboardTab"
            class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-6 text-white transform hover:scale-[1.01] transition-transform duration-200"
          >
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                  Selamat Datang, {{ user?.username || "User" }}! 👋
                </h2>
                <p class="text-sm sm:text-base text-blue-100">
                  Anda login sebagai
                  <span class="font-bold">{{ user?.role || "USER" }}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Statistics Cards -->
          <div
            v-if="isDashboardTab && loading"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6"
          >
            <div
              v-for="i in 3"
              :key="i"
              class="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-6 h-32"
            ></div>
          </div>
          <div
            v-else-if="isDashboardTab"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6"
          >
            <!-- Total Jalan Card -->
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Total Panjang Jalan
                </h3>
                <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <svg
                    class="w-8 h-8 text-blue-600 dark:text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
              </div>
              <p class="text-4xl font-bold text-gray-900 dark:text-white">
                {{ (stats.totalLength / 1000)?.toFixed(2) || 0 }} km
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Total {{ stats.totalRoads?.toLocaleString() || 0 }} jalan
              </p>
            </div>

            <!-- Kondisi Baik Card -->
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Panjang Kondisi Baik
                </h3>
                <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <svg
                    class="w-8 h-8 text-green-600 dark:text-green-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <p class="text-4xl font-bold text-gray-900 dark:text-white">
                {{ ((conditionStats.baikLength || 0) / 1000)?.toFixed(2) }} km
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {{
                  getPercentage(conditionStats.baikLength, stats.totalLength)
                }}% dari total
              </p>
            </div>

            <!-- Perlu Perbaikan Card -->
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Panjang Perlu Perbaikan
                </h3>
                <div class="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                  <svg
                    class="w-8 h-8 text-red-600 dark:text-red-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
              <p class="text-4xl font-bold text-gray-900 dark:text-white">
                {{ ((conditionStats.rusakLength || 0) / 1000)?.toFixed(2) }} km
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {{
                  getPercentage(conditionStats.rusakLength, stats.totalLength)
                }}% dari total
              </p>
            </div>
          </div>

          <!-- Content Areas -->
          <div>
            <!-- Dashboard Section -->
            <div v-show="activeTab === 'dashboard'" class="space-y-6">
              <AduanList />
            </div>

            <!-- Profil - Kelola Berita Section -->
            <div v-show="activeTab === 'profil-berita'" class="space-y-6">
              <!-- Header Banner -->
              <div
                class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
              >
                <h2
                  class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Kelola Berita
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                  Manajemen berita dan artikel untuk website profil Kabupaten
                  Kubu Raya
                </p>
              </div>
              <BeritaManagement />
            </div>

            <!-- Profil - Dokumentasi Kegiatan Section -->
            <div
              v-show="activeTab === 'profil-dokumentasi-kegiatan'"
              class="space-y-6"
            >
              <!-- Header Banner -->
              <div
                class="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 border-l-4 border-pink-500"
              >
                <h2
                  class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Dokumentasi Kegiatan
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                  Kelola dokumentasi foto dan informasi kegiatan dinas di
                  Kabupaten Kubu Raya
                </p>
              </div>
              <DokumentasiKegiatanManagement />
            </div>

            <!-- Profil - Dokumentasi Infrastruktur Section -->
            <div
              v-show="activeTab === 'profil-dokumentasi-infrastruktur'"
              class="space-y-6"
            >
              <!-- Header Banner -->
              <div
                class="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 border-l-4 border-orange-500"
              >
                <h2
                  class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Dokumentasi Infrastruktur
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                  Manajemen dokumentasi pembangunan dan pemeliharaan
                  infrastruktur di Kabupaten Kubu Raya
                </p>
              </div>
              <DokumentasiInfrastrukturManagement />
            </div>

            <!-- Profil - Dokumen PPID Section -->
            <div v-show="activeTab === 'profil-dokumen-ppid'" class="space-y-6">
              <!-- Header Banner -->
              <div
                class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 border-l-4 border-green-500"
              >
                <h2
                  class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Dokumen PPID
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                  Kelola dokumen informasi publik (PPID) untuk transparansi
                  pemerintahan Kabupaten Kubu Raya
                </p>
              </div>
              <DokumenPpidManagement />
            </div>

            <!-- Jalan Lingkungan Section -->
            <div v-show="activeTab === 'jalan'" class="space-y-6">
              <!-- Header Banner -->
              <div
                class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
              >
                <h2
                  class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Data Jalan Lingkungan
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                  Kelola dan monitor data infrastruktur jalan lingkungan di
                  Kabupaten Kubu Raya
                </p>
              </div>

              <div
                class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6"
              >
                <div class="flex justify-between items-center mb-6">
                  <h3
                    class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white"
                  >
                    Jalan Lingkungan
                  </h3>
                </div>

                <!-- Search, Filter and Actions -->
                <div class="mb-4 flex flex-col lg:flex-row gap-4">
                  <!-- Search Input with Icon -->
                  <div class="flex-1 relative">
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                      <svg
                        class="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Cari nama jalan atau nomor ruas..."
                      class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <!-- Filter Kecamatan -->
                  <div class="relative min-w-[200px]">
                    <select
                      v-model="filterKecamatan"
                      class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white w-full"
                      :disabled="!kecamatanList.length"
                    >
                      <option value="">Semua Kecamatan</option>
                      <option
                        v-for="kec in kecamatanList"
                        :key="kec"
                        :value="kec"
                      >
                        {{ kec }}
                      </option>
                    </select>
                    <div
                      v-if="!kecamatanList.length"
                      class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg"
                    >
                      <div
                        class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"
                      ></div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex gap-2">
                    <button
                      @click="showGeoJSONImportModal = true"
                      class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 min-w-[140px]"
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
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                        />
                      </svg>
                      <span>Import GeoJSON</span>
                    </button>
                    <button
                      @click="toggleSelectMode"
                      :class="[
                        'px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 min-w-[100px]',
                        selectMode
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                          : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700',
                      ]"
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{{ selectMode ? "Kembali" : "Select" }}</span>
                    </button>
                  </div>
                </div>

                <!-- Select Mode Info and Actions -->
                <div
                  v-if="selectMode"
                  class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <span
                        class="text-sm font-medium text-blue-800 dark:text-blue-200"
                      >
                        {{ selectedRoadsCount }} data dipilih
                      </span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <button
                        v-if="hasSelectedRoads"
                        @click="exportSelectedRoads"
                        class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors flex items-center space-x-1"
                      >
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
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>Export GeoJSON</span>
                      </button>
                      <button
                        v-if="hasSelectedRoads"
                        @click="deleteSelectedRoads"
                        class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors flex items-center space-x-1"
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Roads Table -->
                <div
                  class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <table
                    class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                    style="table-layout: fixed"
                  >
                    <thead class="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          v-if="selectMode"
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-gray-50 dark:bg-gray-700 z-10"
                          style="width: 50px; min-width: 50px"
                        >
                          <input
                            type="checkbox"
                            :checked="isAllSelected"
                            @change="toggleSelectAll"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          No
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          FID
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          No Ruas
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          No Prov
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          No Kab
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          No Kec
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          No Desa
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          No Jalan
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[200px]"
                        >
                          Nama Jalan
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          Kecamatan
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          Desa
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          Panjang (m)
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          Lebar (m)
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          Tahun
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          Kondisi
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          Nilai
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          Bobot
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          UTM X Awal
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          UTM Y Awal
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          Pangkalan Awal
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          UTM X Akhir
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          UTM Y Akhir
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          Pangkalan Akhir
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[200px]"
                        >
                          Keterangan
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          Dokumentasi
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                    >
                      <tr v-if="loadingRoads">
                        <td
                          colspan="26"
                          class="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                        >
                          <div
                            class="flex items-center justify-center space-x-2"
                          >
                            <div
                              class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"
                            ></div>
                            <span>Memuat data...</span>
                          </div>
                        </td>
                      </tr>
                      <tr v-else-if="filteredRoads.length === 0">
                        <td
                          colspan="25"
                          class="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                        >
                          Tidak ada data
                        </td>
                      </tr>
                      <tr
                        v-else
                        v-for="(road, index) in paginatedRoads"
                        :key="road.id"
                        @click="
                          selectMode
                            ? toggleRoadSelection(road.id)
                            : viewRoad(road)
                        "
                        :class="[
                          'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                          selectMode ? 'cursor-pointer' : 'cursor-pointer',
                          selectedRoads.has(road.id)
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : '',
                        ]"
                      >
                        <!-- Checkbox -->
                        <td
                          v-if="selectMode"
                          :class="[
                            'px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 sticky left-0 z-10',
                            selectedRoads.has(road.id)
                              ? 'bg-blue-50 dark:bg-blue-900/20'
                              : 'bg-white dark:bg-gray-800',
                          ]"
                          style="width: 50px; min-width: 50px"
                        >
                          <input
                            type="checkbox"
                            :checked="selectedRoads.has(road.id)"
                            @click.stop="toggleRoadSelection(road.id)"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <!-- No -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 font-medium"
                        >
                          {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                        </td>
                        <!-- FID -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                        >
                          {{
                            road.fid !== undefined && road.fid !== null
                              ? road.fid
                              : "-"
                          }}
                        </td>
                        <!-- No Ruas -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                        >
                          {{ road.No_Ruas || road.noRuas || "-" }}
                        </td>
                        <!-- No Prov -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-center"
                        >
                          {{ road.No_Prov || road.noProv || "-" }}
                        </td>
                        <!-- No Kab -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-center"
                        >
                          {{ road.No_Kab || road.noKab || "-" }}
                        </td>
                        <!-- No Kec -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-center"
                        >
                          {{ road.No_Kec || road.noKec || "-" }}
                        </td>
                        <!-- No Desa -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-center"
                        >
                          {{ road.No_Desa || road.noDesa || "-" }}
                        </td>
                        <!-- No Jalan -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                        >
                          {{ road.No_Jalan || road.noJalan || "-" }}
                        </td>
                        <!-- Nama Jalan -->
                        <td
                          class="px-3 py-3 text-sm text-gray-900 dark:text-gray-300 font-medium"
                        >
                          {{
                            road.Nama_Jalan ||
                            road.namaJalan ||
                            road.Nama ||
                            road.nama ||
                            "-"
                          }}
                        </td>
                        <!-- Kecamatan -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                        >
                          {{ road.kecamatan || "-" }}
                        </td>
                        <!-- Desa -->
                        <td
                          class="px-3 py-3 text-sm text-gray-900 dark:text-gray-300"
                        >
                          {{ road.desa || "-" }}
                        </td>
                        <!-- Panjang -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-right"
                        >
                          {{
                            road.Panjang_M?.toFixed(2) ||
                            road.panjangM?.toFixed(2) ||
                            "-"
                          }}
                        </td>
                        <!-- Lebar -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-right"
                        >
                          {{
                            road.Lebar_m_?.toFixed(2) ||
                            road.lebarM?.toFixed(2) ||
                            "-"
                          }}
                        </td>
                        <!-- Tahun -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-center"
                        >
                          {{ road.Tahun || road.tahun || "-" }}
                        </td>
                        <!-- Kondisi -->
                        <td class="px-3 py-3 whitespace-nowrap">
                          <span
                            :class="
                              getKondisiBadge(
                                road.Kondisi ||
                                  road.kondisi ||
                                  road.Keterangan ||
                                  road.keterangan
                              )
                            "
                            class="px-2 py-1 text-xs font-semibold rounded-full"
                          >
                            {{
                              road.Kondisi ||
                              road.kondisi ||
                              road.Keterangan ||
                              road.keterangan ||
                              "-"
                            }}
                          </span>
                        </td>
                        <!-- Nilai -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-right"
                        >
                          {{
                            road.Nilai?.toFixed(2) ||
                            road.nilai?.toFixed(2) ||
                            "-"
                          }}
                        </td>
                        <!-- Bobot -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-center"
                        >
                          {{ road.Bobot || road.bobot || "-" }}
                        </td>
                        <!-- UTM X Awal -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-right font-mono"
                        >
                          {{
                            road.UTM_X_AWAL?.toFixed(4) ||
                            road.utmXAwal?.toFixed(4) ||
                            "-"
                          }}
                        </td>
                        <!-- UTM Y Awal -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-right font-mono"
                        >
                          {{
                            road.UTM_Y_AWAL?.toFixed(4) ||
                            road.utmYAwal?.toFixed(4) ||
                            "-"
                          }}
                        </td>
                        <!-- Pangkalan Awal -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                        >
                          {{ road.Pngnl_Awal || road.pngnlAwal || "-" }}
                        </td>
                        <!-- UTM X Akhir -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-right font-mono"
                        >
                          {{
                            road.UTM_X_AKHI?.toFixed(4) ||
                            road.utmXAkhi?.toFixed(4) ||
                            "-"
                          }}
                        </td>
                        <!-- UTM Y Akhir -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-right font-mono"
                        >
                          {{
                            road.UTM_Y_AKHI?.toFixed(4) ||
                            road.utmYAkhi?.toFixed(4) ||
                            "-"
                          }}
                        </td>
                        <!-- Pangkalan Akhir -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                        >
                          {{ road.Pngnl_Akhi || road.pngnlAkhi || "-" }}
                        </td>
                        <!-- Keterangan -->
                        <td class="px-3 py-3 whitespace-nowrap">
                          <span
                            v-if="road.Keterangan || road.keterangan"
                            :class="
                              getKondisiBadge(
                                road.Keterangan || road.keterangan
                              )
                            "
                            class="px-2 py-1 text-xs font-semibold rounded-full"
                          >
                            {{ road.Keterangan || road.keterangan }}
                          </span>
                          <span v-else class="text-gray-500 dark:text-gray-400"
                            >-</span
                          >
                        </td>
                        <!-- Dokumentasi -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                        >
                          {{ road.dokumentasi || "null" }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Pagination -->
                <div class="flex items-center justify-between">
                  <div class="text-sm text-gray-700 dark:text-gray-300">
                    Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
                    {{
                      Math.min(currentPage * itemsPerPage, filteredRoads.length)
                    }}
                    dari {{ filteredRoads.length }} data
                  </div>
                  <div class="flex space-x-2">
                    <button
                      @click="currentPage--"
                      :disabled="currentPage === 1"
                      class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      @click="currentPage++"
                      :disabled="currentPage >= totalPages"
                      class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Jembatan Lingkungan Section -->
            <div v-show="activeTab === 'jembatan'" class="space-y-6">
              <!-- Header Banner -->
              <div
                class="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 border-l-4 border-cyan-500"
              >
                <h2
                  class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Data Jembatan Lingkungan
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                  Kelola dan monitor data infrastruktur jembatan lingkungan di
                  Kabupaten Kubu Raya
                </p>
              </div>

              <div
                class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
              >
                <div class="max-w-md mx-auto">
                  <div
                    class="p-4 bg-cyan-100 dark:bg-cyan-900/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center"
                  >
                    <svg
                      class="w-10 h-10 text-cyan-600 dark:text-cyan-400"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                    >
                      <path
                        d="M238.6,201.7c-1,0-5.3,0-7.4,0h-19.9c-12.2-34.4-44.8-59-83.4-59c-38.5,0-71.2,24.7-83.4,59H24.8c-2.1,0-6.4,0-7.4,0c-4.1,0-7.4-3.3-7.4-7.4V187v-73.7c0-8.1,6.6-14.8,14.8-14.8h7.4V69H17.4c-4.1,0-7.4-3.3-7.4-7.4c0-4.1,3.3-7.4,7.4-7.4h221.2c4.1,0,7.4,3.3,7.4,7.4c0,4.1-3.3,7.4-7.4,7.4h-14.7v29.5h7.4c8.1,0,14.8,6.6,14.8,14.8V187v7.4C246,198.4,242.7,201.7,238.6,201.7z M76.4,69H46.9v29.5h29.5V69z M120.6,69H91.1v29.5h29.5V69z M164.9,69h-29.5v29.5h29.5V69z M209.1,69h-29.5v29.5h29.5V69z"
                      />
                    </svg>
                  </div>
                  <h3
                    class="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                  >
                    Jembatan Lingkungan
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 mb-6">
                    Fitur ini akan segera tersedia untuk mengelola data jembatan
                    lingkungan di Kabupaten Kubu Raya.
                  </p>
                  <div
                    class="bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4"
                  >
                    <p class="text-sm text-cyan-700 dark:text-cyan-300">
                      <strong>Fitur yang akan tersedia:</strong><br />
                      • Data jembatan lingkungan<br />
                      • Kondisi dan status jembatan<br />
                      • Peta lokasi jembatan<br />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Drainase Lingkungan Section -->
            <div v-show="activeTab === 'drainase'" class="space-y-6">
              <!-- Header Banner -->
              <div
                class="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 border-l-4 border-teal-500"
              >
                <h2
                  class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Data Drainase Lingkungan
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                  Kelola dan monitor data sistem drainase lingkungan di
                  Kabupaten Kubu Raya
                </p>
              </div>

              <div
                class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
              >
                <div class="max-w-md mx-auto">
                  <div
                    class="p-4 bg-teal-100 dark:bg-teal-900/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center"
                  >
                    <svg
                      class="w-10 h-10 text-teal-600 dark:text-teal-400"
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
                  <h3
                    class="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                  >
                    Drainase Lingkungan
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 mb-6">
                    Fitur ini akan segera tersedia untuk mengelola data drainase
                    lingkungan di Kabupaten Kubu Raya.
                  </p>
                  <div
                    class="bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800 rounded-lg p-4"
                  >
                    <p class="text-sm text-teal-700 dark:text-teal-300">
                      <strong>Fitur yang akan tersedia:</strong><br />
                      • Data drainase lingkungan<br />
                      • Kondisi dan status drainase<br />
                      • Peta jaringan drainase<br />
                      • Laporan kondisi drainase
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Kawasan Permukiman Section -->
            <div v-show="activeTab === 'kawasan'" class="space-y-6">
              <!-- Header Banner -->
              <div
                class="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 border-l-4 border-emerald-500"
              >
                <h2
                  class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Data Kawasan Permukiman
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                  Kelola dan monitor data kawasan permukiman di Kabupaten Kubu
                  Raya
                </p>
              </div>

              <div
                class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
              >
                <div class="max-w-md mx-auto">
                  <div
                    class="p-4 bg-emerald-100 dark:bg-emerald-900/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center"
                  >
                    <svg
                      class="w-10 h-10 text-emerald-600 dark:text-emerald-400"
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
                  <h3
                    class="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                  >
                    Kawasan Permukiman
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 mb-6">
                    Fitur ini akan segera tersedia untuk mengelola data kawasan
                    permukiman di Kabupaten Kubu Raya.
                  </p>
                  <div
                    class="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4"
                  >
                    <p class="text-sm text-emerald-700 dark:text-emerald-300">
                      <strong>Fitur yang akan tersedia:</strong><br />
                      • Data kawasan permukiman<br />
                      • Status dan kondisi kawasan<br />
                      • Peta zonasi permukiman<br />
                      • Laporan perkembangan kawasan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rumah Tidak Layak Huni Section -->
            <div v-show="activeTab === 'rumah'" class="space-y-6">
              <!-- Header Banner -->
              <div
                class="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 border-l-4 border-rose-500"
              >
                <h2
                  class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Data Rumah Tidak Layak Huni
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                  Kelola dan monitor data rumah tidak layak huni di Kabupaten
                  Kubu Raya
                </p>
              </div>

              <div
                class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
              >
                <div class="max-w-md mx-auto">
                  <div
                    class="p-4 bg-rose-100 dark:bg-rose-900/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center"
                  >
                    <svg
                      class="w-10 h-10 text-rose-600 dark:text-rose-400"
                      viewBox="0 -32 576 576"
                      fill="currentColor"
                    >
                      <path
                        d="M288 114.96L69.47 307.71c-1.62 1.46-3.69 2.14-5.47 3.35V496c0 8.84 7.16 16 16 16h149.23L192 439.19l104.11-64-60.16-119.22L384 392.75l-104.11 64L319.81 512H496c8.84 0 16-7.16 16-16V311.1c-1.7-1.16-3.72-1.82-5.26-3.2L288 114.96zm282.69 121.32L512 184.45V48c0-8.84-7.16-16-16-16h-64c-8.84 0-16 7.16-16 16v51.69L314.75 10.31C307.12 3.45 297.56.01 288 0s-19.1 3.41-26.7 10.27L5.31 236.28c-6.57 5.91-7.12 16.02-1.21 22.6l21.4 23.82c5.9 6.57 16.02 7.12 22.6 1.21L277.42 81.63c6.05-5.33 15.12-5.33 21.17 0L527.91 283.9c6.57 5.9 16.69 5.36 22.6-1.21l21.4-23.82c5.9-6.57 5.36-16.69-1.22-22.59z"
                      />
                    </svg>
                  </div>
                  <h3
                    class="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                  >
                    Rumah Tidak Layak Huni
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 mb-6">
                    Fitur ini akan segera tersedia untuk mengelola data rumah
                    tidak layak huni di Kabupaten Kubu Raya.
                  </p>
                  <div
                    class="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800 rounded-lg p-4"
                  >
                    <p class="text-sm text-rose-700 dark:text-rose-300">
                      <strong>Fitur yang akan tersedia:</strong><br />
                      • Data rumah layak tidak hunian<br />
                      • Status dan kondisi rumah<br />
                      • Peta distribusi rumah<br />
                      • Laporan statistik perumahan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Laporan Section -->
            <div v-show="activeTab === 'laporan'" class="space-y-6">
              <!-- Header Banner -->
              <div
                class="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
              >
                <h2
                  class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Generator Laporan
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                  Buat dan download laporan komprehensif data infrastruktur
                  Kabupaten Kubu Raya
                </p>
              </div>

              <!-- Report Generator -->
              <ReportGenerator
                :stats="stats"
                :condition-stats="conditionStats"
                :kecamatan-stats="kecamatanStats"
                :material-stats="materialStats"
                @download-report="handleDownloadReport"
              />
            </div>

            <!-- Users Management Section -->
            <div v-show="activeTab === 'users'" class="space-y-6">
              <!-- Header Banner -->
              <div
                class="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
              >
                <h2
                  class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Manajemen User
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                  Kelola pengguna dan hak akses sistem SIJALI Kabupaten Kubu
                  Raya
                </p>
              </div>

              <div
                class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div
                  class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <h3
                      class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white"
                    >
                      Manajemen User
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Kelola data pengguna sistem SIJALI
                    </p>
                  </div>
                  <div class="flex space-x-2">
                    <button
                      v-if="!userSelectMode"
                      @click="openAddUserModal"
                      class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
                    >
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
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      <span>Tambah User</span>
                    </button>
                    <button
                      v-if="!userSelectMode"
                      @click="toggleUserSelectMode"
                      class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
                    >
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span>Hapus</span>
                    </button>
                    <div v-else class="flex space-x-2">
                      <button
                        @click="confirmDeleteUsers"
                        :disabled="selectedUsers.size === 0"
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span>Hapus ({{ selectedUsers.size }})</span>
                      </button>
                      <button
                        @click="cancelUserSelectMode"
                        class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
                      >
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        <span>Batal</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Users Table -->
                <div class="overflow-x-auto">
                  <table
                    class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                    style="table-layout: fixed"
                  >
                    <thead class="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          v-if="userSelectMode"
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-gray-50 dark:bg-gray-700 z-10"
                          style="width: 50px; min-width: 50px"
                        >
                          <input
                            type="checkbox"
                            :checked="isAllUsersSelected"
                            @change="toggleSelectAllUsers"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          Username
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          Email
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          Role
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          Dibuat
                        </th>
                        <th
                          class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          Diperbarui
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                    >
                      <!-- Loading State -->
                      <tr v-if="loadingUsers">
                        <td
                          :colspan="userSelectMode ? 6 : 5"
                          class="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                        >
                          <div
                            class="flex items-center justify-center space-x-2"
                          >
                            <svg
                              class="animate-spin h-5 w-5 text-purple-600"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                              ></circle>
                              <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span>Memuat data user...</span>
                          </div>
                        </td>
                      </tr>

                      <!-- No Data State -->
                      <tr v-else-if="users.length === 0">
                        <td
                          :colspan="userSelectMode ? 6 : 5"
                          class="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                        >
                          <div class="flex flex-col items-center space-y-2">
                            <svg
                              class="w-12 h-12 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                              />
                            </svg>
                            <p class="text-sm">Belum ada data user</p>
                            <p class="text-xs text-gray-400">
                              Klik "Tambah User" untuk menambah user pertama
                            </p>
                          </div>
                        </td>
                      </tr>

                      <!-- Users Data -->
                      <tr
                        v-else
                        v-for="(user, index) in users"
                        :key="user.id"
                        @click="
                          userSelectMode
                            ? toggleUserSelection(user.id)
                            : openEditUserModal(user)
                        "
                        :class="[
                          'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                          userSelectMode ? 'cursor-pointer' : 'cursor-pointer',
                          selectedUsers.has(user.id)
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : '',
                        ]"
                      >
                        <!-- Checkbox -->
                        <td
                          v-if="userSelectMode"
                          :class="[
                            'px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 sticky left-0 z-10',
                            selectedUsers.has(user.id)
                              ? 'bg-blue-50 dark:bg-blue-900/20'
                              : 'bg-white dark:bg-gray-800',
                          ]"
                          style="width: 50px; min-width: 50px"
                        >
                          <input
                            type="checkbox"
                            :checked="selectedUsers.has(user.id)"
                            @click.stop="toggleUserSelection(user.id)"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <!-- Username -->
                        <td class="px-3 py-3 whitespace-nowrap">
                          <div
                            class="text-sm font-medium text-gray-900 dark:text-white"
                          >
                            {{ user.username || "-" }}
                          </div>
                        </td>
                        <!-- Email -->
                        <td class="px-3 py-3 whitespace-nowrap">
                          <div class="text-sm text-gray-900 dark:text-white">
                            {{ user.email || "-" }}
                          </div>
                        </td>
                        <!-- Role -->
                        <td class="px-3 py-3 whitespace-nowrap">
                          <span
                            :class="[
                              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                              user.role === 'ADMIN'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                            ]"
                          >
                            {{ user.role || "USER" }}
                          </span>
                        </td>
                        <!-- Created At -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                        >
                          {{
                            user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(
                                  "id-ID"
                                )
                              : "-"
                          }}
                        </td>
                        <!-- Updated At -->
                        <td
                          class="px-3 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                        >
                          {{
                            user.updatedAt
                              ? new Date(user.updatedAt).toLocaleDateString(
                                  "id-ID"
                                )
                              : "-"
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Analisis Section -->
            <div v-show="activeTab === 'analisis'" class="space-y-6">
              <!-- Header Banner -->
              <div
                class="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 border-l-4 border-orange-500"
              >
                <h2
                  class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Analisis Data Jalan Lingkungan
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                  Dashboard analisis komprehensif untuk data infrastruktur jalan
                  di Kabupaten Kubu Raya
                </p>
              </div>

              <AnalysisDashboard
                :stats="stats"
                :condition-stats="conditionStats"
                :kecamatan-stats="kecamatanStats"
                :year-stats="yearStats"
                :material-stats="materialStats"
                :kecamatan-list="kecamatanList"
              />
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modals -->
    <!-- Add/Edit Road Modal -->
    <Teleport to="body">
      <div
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            @click="closeRoadModal"
          ></div>
          <div
            class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
          >
            <div
              class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
            >
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {{
                  showAddModal
                    ? "Tambah Jalan Lingkungan"
                    : "Edit Jalan Lingkungan"
                }}
              </h3>
              <form @submit.prevent="saveRoad" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Nama Jalan</label
                    >
                    <input
                      v-model="roadForm.namaJalan"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >No Ruas</label
                    >
                    <input
                      v-model="roadForm.noRuas"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Kecamatan</label
                    >
                    <input
                      v-model="roadForm.kecamatan"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Desa</label
                    >
                    <input
                      v-model="roadForm.desa"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Panjang (m)</label
                    >
                    <input
                      v-model.number="roadForm.panjangM"
                      type="number"
                      step="0.01"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Lebar (m)</label
                    >
                    <input
                      v-model.number="roadForm.lebarM"
                      type="number"
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Kondisi</label
                    >
                    <select
                      v-model="roadForm.kondisi"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Pilih Kondisi</option>
                      <option value="Baik">Baik</option>
                      <option value="Rusak Ringan">Rusak Ringan</option>
                      <option value="Rusak Sedang">Rusak Sedang</option>
                      <option value="Rusak Berat">Rusak Berat</option>
                    </select>
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Tahun</label
                    >
                    <input
                      v-model="roadForm.tahun"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div class="md:col-span-2">
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Keterangan</label
                    >
                    <textarea
                      v-model="roadForm.keterangan"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    ></textarea>
                  </div>
                  <div class="md:col-span-2">
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Dokumentasi (Link YouTube)</label
                    >
                    <input
                      v-model="roadForm.dokumentasi"
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div class="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    @click="closeRoadModal"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {{ showAddModal ? "Tambah" : "Simpan" }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- View Road Modal -->
    <Teleport to="body">
      <div
        v-if="showViewModal"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            @click="showViewModal = false"
          ></div>
          <div
            class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
          >
            <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Detail Jalan
              </h3>
              <div v-if="selectedRoad" class="space-y-3">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <span class="font-semibold">Nama Jalan:</span>
                    {{ selectedRoad.namaJalan || "-" }}
                  </div>
                  <div>
                    <span class="font-semibold">No Ruas:</span>
                    {{ selectedRoad.noRuas || "-" }}
                  </div>
                  <div>
                    <span class="font-semibold">Kecamatan:</span>
                    {{ selectedRoad.kecamatan || "-" }}
                  </div>
                  <div>
                    <span class="font-semibold">Desa:</span>
                    {{ selectedRoad.desa || "-" }}
                  </div>
                  <div>
                    <span class="font-semibold">Panjang:</span>
                    {{ selectedRoad.panjangM?.toFixed(2) || "-" }} m
                  </div>
                  <div>
                    <span class="font-semibold">Lebar:</span>
                    {{ selectedRoad.lebarM?.toFixed(2) || "-" }} m
                  </div>
                  <div>
                    <span class="font-semibold">Kondisi:</span>
                    {{ selectedRoad.kondisi || selectedRoad.keterangan || "-" }}
                  </div>
                  <div>
                    <span class="font-semibold">Tahun:</span>
                    {{ selectedRoad.tahun || "-" }}
                  </div>
                  <div class="col-span-2">
                    <span class="font-semibold">Keterangan:</span>
                    {{ selectedRoad.keterangan || "-" }}
                  </div>
                  <div class="col-span-2">
                    <span class="font-semibold">Dokumentasi:</span>
                    <div v-if="selectedRoad.dokumentasi" class="mt-2">
                      <div
                        class="w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                      >
                        <iframe
                          :src="getYouTubeEmbedUrl(selectedRoad.dokumentasi)"
                          class="w-full h-48"
                          frameborder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowfullscreen
                        ></iframe>
                      </div>
                    </div>
                    <span v-else class="text-gray-500 dark:text-gray-400"
                      >Tidak ada dokumentasi</span
                    >
                  </div>
                </div>
              </div>
              <div class="flex justify-end mt-6">
                <button
                  @click="showViewModal = false"
                  class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- User Detail Modal -->
    <UserDetailModal
      :visible="showAddUserModal || showEditUserModal"
      :user="selectedUserForEdit"
      :isEditMode="showEditUserModal"
      @close="closeUserModal"
      @save="handleUserSave"
    />

    <!-- Road Detail Modal -->
    <RoadDetailModal
      :visible="showRoadDetailModal"
      :road="selectedRoad"
      @close="showRoadDetailModal = false"
      @save="handleRoadSave"
      @update="handleRoadUpdate"
    />

    <!-- GeoJSON Import Modal -->
    <GeoJSONImportModal
      :visible="showGeoJSONImportModal"
      @close="showGeoJSONImportModal = false"
      @import="handleGeoJSONImport"
    />

    <!-- Toast Notifications -->
    <Toast />

    <!-- Confirmation Modal -->
    <ConfirmationModal
      :visible="showConfirmModal"
      :title="confirmModalData.title"
      :message="confirmModalData.message"
      :confirm-text="confirmModalData.confirmText"
      :cancel-text="confirmModalData.cancelText"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import AduanList from "~/components/AduanList.vue";
import RoadDetailModal from "~/components/RoadDetailModal.vue";
import UserDetailModal from "~/components/UserDetailModal.vue";
import GeoJSONImportModal from "~/components/GeoJSONImportModal.vue";
import AnalysisDashboard from "~/components/AnalysisDashboard.vue";
import ReportGenerator from "~/components/ReportGenerator.vue";
import BeritaManagement from "~/components/BeritaManagement.vue";
import DokumentasiKegiatanManagement from "~/components/DokumentasiKegiatanManagement.vue";
import DokumentasiInfrastrukturManagement from "~/components/DokumentasiInfrastrukturManagement.vue";
import DokumenPpidManagement from "~/components/DokumenPpidManagement.vue";
import Toast from "~/components/Toast.vue";
import ConfirmationModal from "~/components/ConfirmationModal.vue";
import { useReportGenerator } from "~/composables/useReportGenerator.js";
import { useToast } from "~/composables/useToast.js";

// Dynamic import for Chart.js to reduce initial bundle size
let Chart = null;
let ChartComponents = null;

const loadChartJS = async () => {
  if (!Chart) {
    const chartModule = await import("chart.js");
    Chart = chartModule.Chart;
    ChartComponents = {
      ArcElement: chartModule.ArcElement,
      BarElement: chartModule.BarElement,
      CategoryScale: chartModule.CategoryScale,
      LinearScale: chartModule.LinearScale,
      Title: chartModule.Title,
      Tooltip: chartModule.Tooltip,
      Legend: chartModule.Legend,
      DoughnutController: chartModule.DoughnutController,
    };

    // Register Chart.js components
    Chart.register(
      ChartComponents.ArcElement,
      ChartComponents.BarElement,
      ChartComponents.CategoryScale,
      ChartComponents.LinearScale,
      ChartComponents.Title,
      ChartComponents.Tooltip,
      ChartComponents.Legend,
      ChartComponents.DoughnutController
    );
  }
  return { Chart, ChartComponents };
};

// Set page title
useHead({
  title: "Dashboard - SIJALI",
  meta: [
    {
      name: "description",
      content: "Dashboard Sistem Informasi Jalan Lingkungan",
    },
  ],
});

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();

// Check if we're on the dashboard tab
const isDashboardTab = computed(() => {
  return activeTab.value === "dashboard";
});
const API_BASE =
  config.public.apiBaseUrl || "https://sijali-production.up.railway.app";

// User state
const user = ref(null);
const token = ref(null);

// UI State
const activeTab = ref("dashboard");
const sidebarOpen = ref(false);
const profilMenuOpen = ref(false); // Accordion state for Profil menu - default closed
const dataMenuOpen = ref(false); // Accordion state for Data menu - default closed
const loading = ref(true);
const loadingRoads = ref(true);
const loadingUsers = ref(false);

// Data state
const stats = ref({});
const conditionStats = ref({});
const roads = ref([]);
const users = ref([]);
const kecamatanList = ref([]);
const kecamatanStats = ref([]);
const yearStats = ref([]);
const materialStats = ref([]);

// Filter state
const searchQuery = ref("");
const filterKecamatan = ref("");

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Modal state
const showAddModal = ref(false);
const showEditModal = ref(false);
const showViewModal = ref(false);
const showRoadDetailModal = ref(false);
const showGeoJSONImportModal = ref(false);
const showAddUserModal = ref(false);
const showEditUserModal = ref(false);
const showConfirmModal = ref(false);
const confirmModalData = ref({
  title: "",
  message: "",
  confirmText: "Ya",
  cancelText: "Tidak",
  onConfirm: null,
});
const modalKey = ref(0);

// Report state
const { downloadReport } = useReportGenerator();

// Toast notification
const toast = useToast();

// Confirmation modal functions
const showConfirmation = (
  title,
  message,
  onConfirm,
  confirmText = "Ya",
  cancelText = "Tidak"
) => {
  confirmModalData.value = {
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
  };
  showConfirmModal.value = true;
};

const handleConfirm = () => {
  if (confirmModalData.value.onConfirm) {
    confirmModalData.value.onConfirm();
  }
  showConfirmModal.value = false;
};

const handleCancel = () => {
  showConfirmModal.value = false;
};

// YouTube URL helper functions
const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";

  // Extract video ID from various YouTube URL formats
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return "";

  return `https://www.youtube.com/embed/${videoId}`;
};

const extractYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Select mode state
const selectMode = ref(false);
const selectedRoads = ref(new Set());

// User select mode state
const userSelectMode = ref(false);
const selectedUsers = ref(new Set());

// Computed properties for select mode
const selectedRoadsCount = computed(() => selectedRoads.value.size);
const isAllSelected = computed(() => {
  return (
    roads.value.length > 0 &&
    roads.value.every((road) => selectedRoads.value.has(road.id))
  );
});
const hasSelectedRoads = computed(() => selectedRoads.value.size > 0);

// Computed properties for user select mode
const selectedUsersCount = computed(() => selectedUsers.value.size);
const isAllUsersSelected = computed(() => {
  return (
    users.value.length > 0 &&
    users.value.every((user) => selectedUsers.value.has(user.id))
  );
});
const hasSelectedUsers = computed(() => selectedUsers.value.size > 0);

// Form state
const roadForm = ref({
  namaJalan: "",
  noRuas: "",
  kecamatan: "",
  desa: "",
  panjangM: null,
  lebarM: null,
  kondisi: "",
  tahun: "",
  keterangan: "",
  dokumentasi: "",
});

const userForm = ref({
  username: "",
  email: "",
  password: "",
  role: "USER",
});

const selectedRoad = ref(null);
const editingRoadId = ref(null);
const editingUserId = ref(null);
const selectedUser = ref(null);

// Computed
const filteredRoads = computed(() => {
  // Ensure roads data is loaded
  if (!roads.value || !Array.isArray(roads.value)) {
    return [];
  }

  let filtered = roads.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (road) =>
        (road.Nama_Jalan || road.namaJalan || road.Nama || road.nama || "")
          .toLowerCase()
          .includes(query) ||
        (road.No_Ruas || road.noRuas || "").toLowerCase().includes(query) ||
        (road.Kecamatan || road.kecamatan || "")
          .toLowerCase()
          .includes(query) ||
        (road.Desa || road.desa || "").toLowerCase().includes(query)
    );
  }

  if (filterKecamatan.value) {
    filtered = filtered.filter((road) => {
      const roadKecamatan = road.Kecamatan || road.kecamatan || "";
      const filterValue = filterKecamatan.value || "";

      // Handle both exact match and partial match for better compatibility
      const exactMatch =
        roadKecamatan.toLowerCase() === filterValue.toLowerCase();
      const partialMatch = roadKecamatan
        .toLowerCase()
        .includes(filterValue.toLowerCase());

      // Debug logging for troubleshooting
      if (process.client && !exactMatch && !partialMatch && roadKecamatan) {
        console.log("Kecamatan filter mismatch:", {
          roadKecamatan,
          filterValue,
          exactMatch,
          partialMatch,
        });
      }

      return exactMatch || partialMatch;
    });
  }

  return filtered;
});

const paginatedRoads = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredRoads.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredRoads.value.length / itemsPerPage.value);
});

const selectedUserForEdit = computed(() => {
  return selectedUser.value;
});

// Methods
const getPercentage = (value, total) => {
  if (!total) return 0;
  return ((value / total) * 100).toFixed(1);
};

const getKondisiBadge = (kondisi) => {
  const kondisiUpper = kondisi?.toUpperCase() || "";
  const badges = {
    BAIK: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    SEDANG:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    RUSAK: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  // Check if kondisi contains keywords
  if (kondisiUpper.includes("BAIK") || kondisiUpper.includes("BAGUS")) {
    return badges.BAIK;
  } else if (kondisiUpper.includes("RUSAK") || kondisiUpper.includes("BURUK")) {
    return badges.RUSAK;
  } else if (
    kondisiUpper.includes("SEDANG") ||
    kondisiUpper.includes("CUKUP")
  ) {
    return badges.SEDANG;
  }

  return (
    badges[kondisiUpper] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  );
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// API Calls
const fetchStats = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/jalan/stats/summary`);
    const data = await response.json();

    if (data.success) {
      stats.value = data.data;

      // Process condition stats - check both kondisi and conditionStats
      const conditions = data.data.conditionStats || [];

      // Try to find stats from kondisi field first using flexible matching
      let baik = 0;
      let sedang = 0;
      let rusak = 0;
      let baikLength = 0;
      let sedangLength = 0;
      let rusakLength = 0;

      conditions.forEach((c) => {
        const kondisiUpper = c.kondisi?.toUpperCase() || "";
        const count = c._count?.kondisi || 0;
        const length = c._sum?.panjangM || 0;

        // Match using the same logic as getKondisiBadge
        if (kondisiUpper.includes("BAIK") || kondisiUpper.includes("BAGUS")) {
          baik += count;
          baikLength += length;
        } else if (
          kondisiUpper.includes("RUSAK") ||
          kondisiUpper.includes("BURUK")
        ) {
          rusak += count;
          rusakLength += length;
        } else if (
          kondisiUpper.includes("SEDANG") ||
          kondisiUpper.includes("CUKUP")
        ) {
          sedang += count;
          sedangLength += length;
        } else if (kondisiUpper === "BAIK") {
          baik += count;
          baikLength += length;
        } else if (kondisiUpper === "RUSAK") {
          rusak += count;
          rusakLength += length;
        } else if (kondisiUpper === "SEDANG") {
          sedang += count;
          sedangLength += length;
        }
      });

      // Separate rusak into rusakRingan and rusakBerat
      let rusakRingan = 0;
      let rusakBerat = 0;
      let rusakRinganLength = 0;
      let rusakBeratLength = 0;

      // If no data from kondisi, fetch from keterangan stats
      if (baik === 0 && sedang === 0 && rusak === 0) {
        try {
          const keteranganResponse = await fetch(
            `${API_BASE}/api/jalan/stats/keterangan`
          );
          const keteranganData = await keteranganResponse.json();

          if (keteranganData.success) {
            const keteranganStats = keteranganData.data || [];

            // Map keterangan to kondisi categories
            console.log("Processing keterangan stats:", keteranganStats);
            keteranganStats.forEach((stat) => {
              const ket = stat.keterangan?.toUpperCase() || "";
              const count = stat._count.keterangan || 0;
              const length = stat._sum?.panjangM || 0;

              console.log("Processing keterangan:", { ket, count, length });

              if (ket.includes("BAIK") || ket.includes("BAGUS")) {
                baik += count;
                baikLength += length;
              } else if (ket.includes("RUSAK RINGAN")) {
                console.log("Found RUSAK RINGAN in keterangan:", {
                  count,
                  length,
                });
                rusakRingan += count;
                rusakRinganLength += length;
              } else if (ket.includes("RUSAK BERAT")) {
                console.log("Found RUSAK BERAT in keterangan:", {
                  count,
                  length,
                });
                rusakBerat += count;
                rusakBeratLength += length;
              } else if (ket.includes("RUSAK") || ket.includes("BURUK")) {
                // If just "RUSAK" without specification, assume it's rusak ringan
                console.log(
                  "Found generic RUSAK in keterangan (assuming ringan):",
                  { count, length }
                );
                rusakRingan += count;
                rusakRinganLength += length;
              } else if (ket.includes("SEDANG") || ket.includes("CUKUP")) {
                sedang += count;
                sedangLength += length;
              }
            });
          }
        } catch (error) {
          console.error("Error fetching keterangan stats:", error);
        }
      }

      // Process conditions from kondisi field
      console.log("Processing conditions from kondisi field:", conditions);
      conditions.forEach((condition) => {
        const kondisi = condition.kondisi || condition.keterangan || "";
        const count =
          condition._count.kondisi || condition._count.keterangan || 0;
        const length = condition._sum.panjangM || 0;

        const kondisiUpper = kondisi.toUpperCase();
        console.log("Processing condition:", {
          kondisi,
          kondisiUpper,
          count,
          length,
        });

        if (kondisiUpper.includes("RUSAK RINGAN")) {
          console.log("Found RUSAK RINGAN:", { count, length });
          rusakRingan += count;
          rusakRinganLength += length;
        } else if (kondisiUpper.includes("RUSAK BERAT")) {
          console.log("Found RUSAK BERAT:", { count, length });
          rusakBerat += count;
          rusakBeratLength += length;
        } else if (
          kondisiUpper.includes("RUSAK") &&
          !kondisiUpper.includes("RINGAN") &&
          !kondisiUpper.includes("BERAT")
        ) {
          // If just "RUSAK" without specification, assume it's rusak ringan
          console.log("Found generic RUSAK (assuming ringan):", {
            count,
            length,
          });
          rusakRingan += count;
          rusakRinganLength += length;
        }
      });

      console.log("Final condition stats:", {
        baik,
        sedang,
        rusakRingan,
        rusakBerat,
        baikLength,
        sedangLength,
        rusakRinganLength,
        rusakBeratLength,
      });

      conditionStats.value = {
        baik,
        sedang,
        rusak: rusakRingan + rusakBerat, // Total rusak for backward compatibility
        rusakRingan,
        rusakBerat,
        baikLength,
        sedangLength,
        rusakLength: rusakRinganLength + rusakBeratLength, // Total rusak length
        rusakRinganLength,
        rusakBeratLength,
      };
    }
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
};

const fetchRoads = async () => {
  try {
    loadingRoads.value = true;
    const response = await fetch(`${API_BASE}/api/jalan?limit=10000`);
    const data = await response.json();

    if (data.success) {
      roads.value = data.data;
    }
  } catch (error) {
    console.error("Error fetching roads:", error);
  } finally {
    loadingRoads.value = false;
  }
};

const fetchFilterOptions = async () => {
  try {
    const kecResponse = await fetch(`${API_BASE}/api/jalan/filters/kecamatan`);
    const kecData = await kecResponse.json();

    if (kecData.success) {
      kecamatanList.value = kecData.data;
    }
  } catch (error) {
    console.error("Error fetching filter options:", error);
  }
};

const fetchAnalysisData = async () => {
  try {
    // Fetch kecamatan stats
    const kecamatanResponse = await fetch(
      `${API_BASE}/api/jalan/stats/kecamatan-kondisi`
    );
    const kecamatanData = await kecamatanResponse.json();
    if (kecamatanData.success) {
      kecamatanStats.value = kecamatanData.data;
    }

    // Fetch year stats
    const yearResponse = await fetch(`${API_BASE}/api/jalan/stats/summary`);
    const yearData = await yearResponse.json();
    if (yearData.success) {
      yearStats.value = yearData.data.yearStats || [];
    }

    // Fetch material stats
    const materialResponse = await fetch(
      `${API_BASE}/api/jalan/stats/material-kondisi`
    );
    const materialData = await materialResponse.json();
    if (materialData.success) {
      materialStats.value = materialData.data;
    }
  } catch (error) {
    console.error("Error fetching analysis data:", error);
  }
};

const fetchUsers = async () => {
  if (user.value?.role !== "ADMIN") {
    return;
  }

  try {
    loadingUsers.value = true;
    const response = await fetch(`${API_BASE}/api/auth/users`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    const data = await response.json();

    if (data.success) {
      users.value = data.data;
    } else {
      console.error("Gagal fetch users:", data.message);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    loadingUsers.value = false;
  }
};

// CRUD Operations - Roads
const viewRoad = (road) => {
  selectedRoad.value = road;
  showRoadDetailModal.value = true;
};

const editRoad = (road) => {
  editingRoadId.value = road.id;
  roadForm.value = { ...road };
};

const deleteRoad = async (road) => {
  showConfirmation(
    "Konfirmasi Hapus",
    `Hapus jalan lingkungan "${road.namaJalan || road.nama}"?`,
    async () => {
      try {
        const response = await fetch(`${API_BASE}/api/jalan/${road.id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          toast.success("Data berhasil dihapus!");
          await fetchRoads();
          await fetchStats();
        } else {
          toast.error("Gagal menghapus data: " + data.error);
        }
      } catch (error) {
        console.error("Error deleting road:", error);
        toast.error("Terjadi kesalahan saat menghapus data");
      }
    }
  );
};

const saveRoad = async () => {
  try {
    const url = showEditModal.value
      ? `${API_BASE}/api/jalan/${editingRoadId.value}`
      : `${API_BASE}/api/jalan`;

    const method = showEditModal.value ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roadForm.value),
    });

    const data = await response.json();

    if (data.success) {
      toast.success(
        showEditModal.value
          ? "Data berhasil diupdate!"
          : "Data berhasil ditambahkan!"
      );
      closeRoadModal();
      await fetchRoads();
      await fetchStats();
    } else {
      toast.error("Gagal menyimpan data: " + data.error);
    }
  } catch (error) {
    console.error("Error saving road:", error);
    toast.error("Terjadi kesalahan saat menyimpan data");
  }
};

const closeRoadModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  editingRoadId.value = null;
  roadForm.value = {
    namaJalan: "",
    noRuas: "",
    kecamatan: "",
    desa: "",
    panjangM: null,
    lebarM: null,
    kondisi: "",
    tahun: "",
    keterangan: "",
  };
};

// CRUD Operations - Users

const deleteUser = async (userItem) => {
  showConfirmation(
    "Konfirmasi Hapus User",
    `Hapus user "${userItem.username}"?`,
    async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/auth/users/${userItem.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          toast.success("User berhasil dihapus!");
          await fetchUsers();
        } else {
          toast.error("Gagal menghapus user: " + data.message);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Terjadi kesalahan saat menghapus user");
      }
    }
  );
};

// User selection functions
const toggleUserSelectMode = () => {
  userSelectMode.value = true;
  selectedUsers.value.clear();
};

const cancelUserSelectMode = () => {
  userSelectMode.value = false;
  selectedUsers.value.clear();
};

const toggleUserSelection = (userId) => {
  if (selectedUsers.value.has(userId)) {
    selectedUsers.value.delete(userId);
  } else {
    selectedUsers.value.add(userId);
  }
};

const toggleSelectAllUsers = () => {
  if (isAllUsersSelected.value) {
    selectedUsers.value.clear();
  } else {
    users.value.forEach((user) => selectedUsers.value.add(user.id));
  }
};

const confirmDeleteUsers = () => {
  if (selectedUsers.value.size === 0) return;

  const selectedUserNames = users.value
    .filter((user) => selectedUsers.value.has(user.id))
    .map((user) => user.username)
    .join(", ");

  showConfirmation(
    "Konfirmasi Hapus Multiple User",
    `Anda yakin ingin menghapus user (${selectedUserNames})?`,
    () => {
      deleteSelectedUsers();
    }
  );
};

const deleteSelectedUsers = async () => {
  try {
    const deletePromises = Array.from(selectedUsers.value).map((userId) =>
      fetch(`${API_BASE}/api/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
    );

    const responses = await Promise.all(deletePromises);
    const results = await Promise.all(responses.map((r) => r.json()));

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.length - successCount;

    if (successCount > 0) {
      toast.success(`${successCount} user berhasil dihapus!`);
      await fetchUsers();
    }

    if (failCount > 0) {
      toast.error(`${failCount} user gagal dihapus!`);
    }

    cancelUserSelectMode();
  } catch (error) {
    console.error("Error deleting users:", error);
    toast.error("Terjadi kesalahan saat menghapus user");
  }
};

const handleUserSave = async (userData) => {
  try {
    const url = showEditUserModal.value
      ? `${API_BASE}/api/auth/users/${editingUserId.value}`
      : `${API_BASE}/api/auth/register`;

    const method = showEditUserModal.value ? "PUT" : "POST";

    // Only send password if it's filled
    const payload = { ...userData };
    if (showEditUserModal.value && !payload.password) {
      delete payload.password;
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.success) {
      toast.success(
        showEditUserModal.value
          ? "User berhasil diupdate!"
          : "User berhasil ditambahkan!"
      );
      closeUserModal();
      await fetchUsers();
    } else {
      toast.error("Gagal menyimpan user: " + data.message);
    }
  } catch (error) {
    console.error("Error saving user:", error);
    toast.error("Terjadi kesalahan saat menyimpan user");
  }
};

const handleRoadSave = async (roadData) => {
  try {
    const response = await fetch(
      `${API_BASE}/api/jalan/${selectedRoad.value.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(roadData),
      }
    );

    const data = await response.json();

    if (data.success) {
      toast.success("Data jalan berhasil diupdate!");
      showRoadDetailModal.value = false;
      await fetchRoads();
      await fetchStats();
    } else {
      toast.error("Gagal menyimpan data jalan: " + data.message);
    }
  } catch (error) {
    console.error("Error saving road:", error);
    toast.error("Terjadi kesalahan saat menyimpan data jalan");
  }
};

const handleRoadUpdate = async (updatedRoad) => {
  try {
    // Update the selected road data with new GeoJSON information
    selectedRoad.value = updatedRoad;
    toast.success("Data berhasil diperbarui dari GeoJSON!");
  } catch (error) {
    console.error("Error updating road:", error);
    toast.error("Terjadi kesalahan saat memperbarui data");
  }
};

const handleGeoJSONImport = async (importedData) => {
  try {
    const config = useRuntimeConfig();
    const API_BASE =
      config.public.apiBaseUrl || "https://sijali-production.up.railway.app";
    const token = localStorage.getItem("token");

    // Convert GeoJSON features to road data format
    const roadsData = importedData.map((feature) => ({
      No_Ruas: feature.No_Ruas || feature.noRuas || "",
      Nama_Jalan:
        feature.Nama_Jalan ||
        feature.namaJalan ||
        feature.Nama ||
        feature.nama ||
        "",
      Kecamatan: feature.Kecamatan || feature.kecamatan || "",
      Desa: feature.Desa || feature.desa || "",
      Panjang_M: feature.Panjang_M || feature.panjangM || 0,
      Lebar_m_: feature.Lebar_m_ || feature.lebarM || 0,
      Kondisi: feature.Kondisi || feature.kondisi || "",
      Keterangan: feature.Keterangan || feature.keterangan || "",
      No_Jalan: feature.No_Jalan || feature.noJalan || "",
      Tahun: feature.Tahun || feature.tahun || new Date().getFullYear(),
      Nilai: feature.Nilai || feature.nilai || 0,
      Bobot: feature.Bobot || feature.bobot || 0,
      No_Prov: feature.No_Prov || feature.noProv || "",
      No_Kab: feature.No_Kab || feature.noKab || "",
      No_Kec: feature.No_Kec || feature.noKec || "",
      No_Desa: feature.No_Desa || feature.noDesa || "",
      FID: feature.FID || feature.fid || "",
      Shape_Leng: feature.Shape_Leng || feature.shapeLeng || 0,
      Pngnl_Awal: feature.Pngnl_Awal || feature.pngnlAwal || "",
      Pngnl_Akhi: feature.Pngnl_Akhi || feature.pngnlAkhi || "",
      geometry: feature.geometry,
      coordinates: feature.coordinates,
    }));

    // Send to API
    const response = await fetch(`${API_BASE}/api/jalan/bulk-import`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ roads: roadsData }),
    });

    const data = await response.json();

    if (data.success) {
      toast.success(`Berhasil mengimport ${importedData.length} data jalan!`);
      showGeoJSONImportModal.value = false;
      await fetchRoads();
      await fetchStats();
    } else {
      toast.error("Gagal mengimport data: " + data.message);
    }
  } catch (error) {
    console.error("Error importing GeoJSON:", error);
    toast.error("Terjadi kesalahan saat mengimport data GeoJSON");
  }
};

// Select mode functions
const toggleSelectMode = () => {
  selectMode.value = !selectMode.value;
  if (!selectMode.value) {
    selectedRoads.value.clear();
  }
};

const toggleRoadSelection = (roadId) => {
  if (selectedRoads.value.has(roadId)) {
    selectedRoads.value.delete(roadId);
  } else {
    selectedRoads.value.add(roadId);
  }
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    // Unselect all
    selectedRoads.value.clear();
  } else {
    // Select all
    roads.value.forEach((road) => selectedRoads.value.add(road.id));
  }
};

const exportSelectedRoads = async () => {
  if (!hasSelectedRoads.value) return;

  try {
    const selectedRoadsList = roads.value.filter((road) =>
      selectedRoads.value.has(road.id)
    );

    // Convert to GeoJSON format
    const geojson = {
      type: "FeatureCollection",
      features: selectedRoadsList.map((road) => ({
        type: "Feature",
        properties: {
          No_Ruas: road.No_Ruas || road.noRuas,
          Nama_Jalan:
            road.Nama_Jalan || road.namaJalan || road.Nama || road.nama,
          Kecamatan: road.Kecamatan || road.kecamatan,
          Desa: road.Desa || road.desa,
          Panjang_M: road.Panjang_M || road.panjangM,
          Lebar_m_: road.Lebar_m_ || road.lebarM,
          Kondisi: road.Kondisi || road.kondisi,
          Keterangan: road.Keterangan || road.keterangan,
          No_Jalan: road.No_Jalan || road.noJalan,
          Tahun: road.Tahun || road.tahun,
          Nilai: road.Nilai || road.nilai,
          Bobot: road.Bobot || road.bobot,
          No_Prov: road.No_Prov || road.noProv,
          No_Kab: road.No_Kab || road.noKab,
          No_Kec: road.No_Kec || road.noKec,
          No_Desa: road.No_Desa || road.noDesa,
          FID: road.FID || road.fid,
          Shape_Leng: road.Shape_Leng || road.shapeLeng,
          Pngnl_Awal: road.Pngnl_Awal || road.pngnlAwal,
          Pngnl_Akhi: road.Pngnl_Akhi || road.pngnlAkhi,
        },
        geometry: road.geometry || {
          type: "LineString",
          coordinates: road.coordinates || [],
        },
      })),
    };

    // Download as file
    const dataStr = JSON.stringify(geojson, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `roads_export_${
      new Date().toISOString().split("T")[0]
    }.geojson`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(
      `Berhasil mengexport ${selectedRoadsList.length} data jalan!`
    );
  } catch (error) {
    console.error("Error exporting roads:", error);
    toast.error("Terjadi kesalahan saat mengexport data");
  }
};

const deleteSelectedRoads = async () => {
  if (!hasSelectedRoads.value) return;

  const selectedRoadsList = roads.value.filter((road) =>
    selectedRoads.value.has(road.id)
  );
  const roadNames = selectedRoadsList
    .map(
      (road) => road.No_Ruas || road.noRuas || road.Nama_Jalan || road.namaJalan
    )
    .join(", ");

  showConfirmation(
    "Konfirmasi Hapus Multiple Data",
    `Anda yakin ingin hapus data (${roadNames})?`,
    async () => {
      try {
        const config = useRuntimeConfig();
        const API_BASE =
          config.public.apiBaseUrl ||
          "https://sijali-production.up.railway.app";
        const token = localStorage.getItem("token");

        // Delete each selected road
        for (const roadId of selectedRoads.value) {
          const response = await fetch(`${API_BASE}/api/jalan/${roadId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to delete road ${roadId}`);
          }
        }

        toast.success(
          `Berhasil menghapus ${selectedRoads.value.size} data jalan!`
        );
        selectedRoads.value.clear();
        await fetchRoads();
        await fetchStats();
      } catch (error) {
        console.error("Error deleting roads:", error);
        toast.error("Terjadi kesalahan saat menghapus data");
      }
    }
  );
};

const openAddUserModal = () => {
  // Tutup modal terlebih dahulu jika ada yang terbuka
  showAddUserModal.value = false;
  showEditUserModal.value = false;

  // Clear all user-related data
  editingUserId.value = null;
  selectedUser.value = null;

  // Ubah modalKey untuk force re-render
  modalKey.value += 1;

  // Gunakan nextTick untuk memastikan DOM sudah terupdate
  nextTick(() => {
    showAddUserModal.value = true;
  });
};

const openEditUserModal = (userItem) => {
  // Tutup modal terlebih dahulu jika ada yang terbuka
  showAddUserModal.value = false;
  showEditUserModal.value = false;

  // Set data user yang akan diedit
  editingUserId.value = userItem.id;
  selectedUser.value = { ...userItem }; // Store a copy of the user data

  // Ubah modalKey untuk force re-render
  modalKey.value += 1;

  // Gunakan nextTick untuk memastikan DOM sudah terupdate
  nextTick(() => {
    showEditUserModal.value = true;
  });
};

const closeUserModal = () => {
  showAddUserModal.value = false;
  showEditUserModal.value = false;
  editingUserId.value = null;
  selectedUser.value = null; // Clear selected user

  // Ubah modalKey untuk force re-render saat dibuka lagi
  modalKey.value += 1;
};

const handleLogout = () => {
  localStorage.removeItem("sijali_token");
  localStorage.removeItem("sijali_user");
  router.push("/login");
};

const initCharts = async () => {
  // Load Chart.js dynamically
  await loadChartJS();

  // Destroy existing charts
  destroyCharts();

  // Wait for nextTick to ensure canvas elements are rendered
  nextTick(() => {
    // Chart 1: Pie Chart - Kondisi Jalan
    if (kondisiChart.value) {
      kondisiChartInstance = new Chart(kondisiChart.value, {
        type: "doughnut",
        data: {
          labels: ["Baik", "Sedang", "Rusak"],
          datasets: [
            {
              data: [
                conditionStats.value.baik || 0,
                conditionStats.value.sedang || 0,
                conditionStats.value.rusak || 0,
              ],
              backgroundColor: [
                "rgba(34, 197, 94, 0.8)", // green-500
                "rgba(251, 191, 36, 0.8)", // yellow-500
                "rgba(239, 68, 68, 0.8)", // red-500
              ],
              borderColor: [
                "rgba(34, 197, 94, 1)",
                "rgba(251, 191, 36, 1)",
                "rgba(239, 68, 68, 1)",
              ],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 15,
                font: {
                  size: 12,
                },
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.parsed || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    }

    // Chart 2: Bar Chart - Jalan per Kecamatan
    if (kecamatanChart.value) {
      // Group roads by kecamatan
      const kecamatanCount = {};
      roads.value.forEach((road) => {
        const kec = road.kecamatan || "Lainnya";
        kecamatanCount[kec] = (kecamatanCount[kec] || 0) + 1;
      });

      const labels = Object.keys(kecamatanCount);
      const data = Object.values(kecamatanCount);

      kecamatanChartInstance = new Chart(kecamatanChart.value, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Jumlah Jalan",
              data: data,
              backgroundColor: "rgba(59, 130, 246, 0.8)", // blue-500
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }

    // Chart 3: Bar Chart - Panjang Jalan per Kecamatan
    if (panjangChart.value) {
      // Group total length by kecamatan
      const kecamatanLength = {};
      roads.value.forEach((road) => {
        const kec = road.kecamatan || "Lainnya";
        kecamatanLength[kec] =
          (kecamatanLength[kec] || 0) + (road.panjangM || 0);
      });

      const labels = Object.keys(kecamatanLength);
      const data = Object.values(kecamatanLength).map((v) =>
        (v / 1000).toFixed(2)
      ); // Convert to km

      panjangChartInstance = new Chart(panjangChart.value, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Panjang (km)",
              data: data,
              backgroundColor: "rgba(168, 85, 247, 0.8)", // purple-500
              borderColor: "rgba(168, 85, 247, 1)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }

    // Chart 4: Stacked Bar - Kondisi per Kecamatan
    if (stackedChart.value) {
      // Group by kecamatan and kondisi
      const kecamatanKondisi = {};
      roads.value.forEach((road) => {
        const kec = road.kecamatan || "Lainnya";
        const kondisi = road.kondisi || road.keterangan || "Unknown";

        if (!kecamatanKondisi[kec]) {
          kecamatanKondisi[kec] = { baik: 0, sedang: 0, rusak: 0 };
        }

        const kondisiUpper = kondisi.toUpperCase();
        if (kondisiUpper.includes("BAIK") || kondisiUpper.includes("BAGUS")) {
          kecamatanKondisi[kec].baik++;
        } else if (
          kondisiUpper.includes("RUSAK") ||
          kondisiUpper.includes("BURUK")
        ) {
          kecamatanKondisi[kec].rusak++;
        } else if (
          kondisiUpper.includes("SEDANG") ||
          kondisiUpper.includes("CUKUP")
        ) {
          kecamatanKondisi[kec].sedang++;
        }
      });

      const labels = Object.keys(kecamatanKondisi);
      const baikData = labels.map((kec) => kecamatanKondisi[kec].baik);
      const sedangData = labels.map((kec) => kecamatanKondisi[kec].sedang);
      const rusakData = labels.map((kec) => kecamatanKondisi[kec].rusak);

      stackedChartInstance = new Chart(stackedChart.value, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Baik",
              data: baikData,
              backgroundColor: "rgba(34, 197, 94, 0.8)",
              borderColor: "rgba(34, 197, 94, 1)",
              borderWidth: 2,
            },
            {
              label: "Sedang",
              data: sedangData,
              backgroundColor: "rgba(251, 191, 36, 0.8)",
              borderColor: "rgba(251, 191, 36, 1)",
              borderWidth: 2,
            },
            {
              label: "Rusak",
              data: rusakData,
              backgroundColor: "rgba(239, 68, 68, 0.8)",
              borderColor: "rgba(239, 68, 68, 1)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 10,
              },
            },
          },
        },
      });
    }
  });
};

// Report methods

const handleDownloadReport = async (reportInfo) => {
  try {
    // Show loading state
    console.log("Sedang memproses laporan...");

    const reportData = {
      reportInfo: reportInfo,
      data: reportInfo.data,
    };

    const result = await downloadReport(reportData, reportInfo.format);

    if (result.success) {
      // Show success message
      console.log(`Laporan berhasil didownload: ${result.filename}`);
      toast.success("Laporan berhasil didownload!");
    } else {
      console.error("Error downloading report:", result.error);
      toast.error("Gagal mendownload laporan. Silakan coba lagi.");
    }
  } catch (error) {
    console.error("Error handling download:", error);
    toast.error("Terjadi kesalahan saat mendownload laporan.");
  }
};

// Watch for tab changes
watch(activeTab, async (newTab) => {
  if (newTab === "users" && user.value?.role === "ADMIN") {
    await fetchUsers();
  } else if (newTab === "analisis") {
    // Refresh analysis data when switching to analisis tab
    await fetchAnalysisData();
  }
});

// Lifecycle
onMounted(async () => {
  // Check authentication
  token.value = localStorage.getItem("sijali_token");
  const userData = localStorage.getItem("sijali_user");

  if (!token.value) {
    router.push("/login");
    return;
  }

  if (userData) {
    user.value = JSON.parse(userData);
  }

  // Load data
  loading.value = true;

  // Load filter options first, then other data
  await fetchFilterOptions();
  await Promise.all([fetchStats(), fetchRoads(), fetchAnalysisData()]);

  if (user.value?.role === "ADMIN") {
    await fetchUsers();
  }

  loading.value = false;
});

// Cleanup on unmount
onUnmounted(() => {
  // Cleanup if needed
});
</script>

<style scoped>
/* Custom Scrollbar for Sidebar */
aside nav::-webkit-scrollbar {
  width: 6px;
}

aside nav::-webkit-scrollbar-track {
  background: transparent;
}

aside nav::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

aside nav::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* Dark mode scrollbar */
.dark aside nav::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
}

.dark aside nav::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.7);
}

/* Firefox scrollbar */
aside nav {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

.dark aside nav {
  scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
}

/* Table container scrollbar */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(59, 130, 246, 0.5) rgba(243, 244, 246, 0.5);
}

.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(243, 244, 246, 0.5);
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.7);
}

/* Dark mode table scrollbar */
.dark .overflow-x-auto {
  scrollbar-color: rgba(59, 130, 246, 0.6) rgba(31, 41, 55, 0.5);
}

.dark .overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.5);
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.6);
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.8);
}
</style>
