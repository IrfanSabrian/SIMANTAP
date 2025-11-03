// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  css: [
    "~/assets/css/main.css",
    "~/assets/css/google-translate.css",
    "~/assets/css/page-transitions.css",
  ],
  devServer: {
    port: 3000,
  },
  tailwindcss: {
    cssPath: "~/assets/css/main.css",
  },
  // Build optimization for Vercel deployment
  build: {},
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Separate node_modules into chunks based on package
            if (id.includes("node_modules")) {
              // Chart.js
              if (id.includes("chart.js")) {
                return "vendor-charts";
              }
              // Element Plus
              if (id.includes("element-plus")) {
                return "vendor-ui";
              }
              // FontAwesome
              if (id.includes("@fortawesome")) {
                return "vendor-icons";
              }
              // (Intentionally do not force-split PDF/Document libraries)
              // Fancybox
              if (id.includes("@fancyapps")) {
                return "vendor-fancybox";
              }
              // Other utils
              if (
                id.includes("file-saver") ||
                id.includes("countup") ||
                id.includes("aos")
              ) {
                return "vendor-utils";
              }
              // All other node_modules
              return "vendor";
            }
          },
        },
      },
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,
      // Enable minification
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    optimizeDeps: {
      include: ["chart.js", "element-plus"],
    },
  },
  nitro: {
    devProxy: process.env.NUXT_PUBLIC_API_BASE_URL
      ? {
          "/api": {
            target: process.env.NUXT_PUBLIC_API_BASE_URL,
            changeOrigin: true,
          },
        }
      : {},
  },
  app: {
    head: {
      title: "SIMANTAP KUBU RAYA",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "Sistem Informasi Manajemen Tata Permukiman - Kabupaten Kubu Raya",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/sijali-logo.svg",
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://js.arcgis.com/4.28/esri/themes/light/main.css",
        },
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css",
        },
      ],
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js",
          defer: true,
        },
        {
          src: "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit",
          defer: true,
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      arcgisApiKey:
        process.env.NUXT_PUBLIC_ARCGIS_API_KEY || "your-api-key-here",
      // SIMANTAP Backend API
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      apiUrl: process.env.NUXT_PUBLIC_API_URL,
      appName: process.env.NUXT_PUBLIC_APP_NAME || "SIMANTAP",
      appVersion: process.env.NUXT_PUBLIC_APP_VERSION || "1.0.0",
      appDescription:
        process.env.NUXT_PUBLIC_APP_DESCRIPTION ||
        "Sistem Informasi Manajemen Tata Permukiman - Kabupaten Kubu Raya",
      mapCenterLat: parseFloat(
        process.env.NUXT_PUBLIC_MAP_CENTER_LAT || "-0.5"
      ),
      mapCenterLng: parseFloat(
        process.env.NUXT_PUBLIC_MAP_CENTER_LNG || "109.3"
      ),
      mapZoom: parseInt(process.env.NUXT_PUBLIC_MAP_ZOOM || "10"),
      cloudinaryCloudName:
        process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your_cloud_name",
      cloudinaryFolder: process.env.NUXT_PUBLIC_CLOUDINARY_FOLDER || "SIMANTAP",
    },
  },
});
