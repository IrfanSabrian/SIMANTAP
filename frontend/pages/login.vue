<template>
  <div
    class="min-h-screen flex items-center justify-center relative overflow-hidden"
  >
    <!-- Animated Background -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900"
    >
      <!-- Animated circles -->
      <div
        class="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
      ></div>
      <div
        class="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
      ></div>
      <div
        class="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
      ></div>
    </div>

    <!-- Login Container -->
    <div class="relative z-10 w-full max-w-md px-6">
      <!-- Card -->
      <div
        class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-8 transform transition-all duration-300 hover:shadow-blue-500/20"
      >
        <!-- Logo & Title Section -->
        <div class="text-center space-y-4">
          <!-- Logo with animation -->
          <div class="flex justify-center">
            <div class="relative">
              <div
                class="relative transform transition-transform duration-300 hover:scale-110"
              >
                <img
                  src="~/assets/images/sijali-logo.svg"
                  alt="SIMANTAP Logo"
                  class="h-20 w-20"
                />
              </div>
            </div>
          </div>

          <!-- Title -->
          <div>
            <h1
              class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2"
            >
              Selamat Datang
            </h1>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Silakan login untuk melanjutkan
            </p>
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Username Input -->
          <div class="space-y-2">
            <label
              for="username"
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Username
            </label>
            <div class="relative group">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <svg
                  class="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
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
              </div>
              <input
                id="username"
                v-model="formData.username"
                type="text"
                required
                autocomplete="username"
                class="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-gray-900 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400"
                placeholder="Masukkan username"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="space-y-2">
            <label
              for="password"
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div class="relative group">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <svg
                  class="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-gray-900 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400"
                placeholder="Masukkan password"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                :disabled="loading"
              >
                <svg
                  v-if="!showPassword"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  v-else
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 transform scale-95"
            enter-to-class="opacity-100 transform scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 transform scale-100"
            leave-to-class="opacity-0 transform scale-95"
          >
            <div
              v-if="errorMessage"
              class="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start space-x-3"
            >
              <svg
                class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <p class="text-sm text-red-800 dark:text-red-200 font-medium">
                {{ errorMessage }}
              </p>
            </div>
          </transition>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            <svg
              v-if="loading"
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
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
            <span>{{ loading ? "Memproses..." : "Masuk" }}</span>
            <svg
              v-if="!loading"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div
              class="w-full border-t border-gray-200 dark:border-gray-700"
            ></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span
              class="px-4 bg-white/95 dark:bg-gray-900/95 text-gray-500 dark:text-gray-400"
            >
              atau
            </span>
          </div>
        </div>

        <!-- Back to Home Link -->
        <NuxtLink
          to="/"
          class="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors group"
        >
          <svg
            class="w-4 h-4 transform transition-transform group-hover:-translate-x-1"
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
          <span>Kembali ke Beranda</span>
        </NuxtLink>
      </div>

      <!-- Footer -->
      <p class="text-center text-sm text-white/80 mt-6">
        © 2025 SIMANTAP KUBU RAYA - Sistem Informasi Manajemen Tata Permukiman
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

// Use blank layout (no navbar, no footer)
definePageMeta({
  layout: "blank",
});

// Set page title
useHead({
  title: "Login - SIMANTAP KUBU RAYA",
  meta: [
    {
      name: "description",
      content: "Login ke Sistem Informasi Manajemen Tata Permukiman",
    },
  ],
});

const router = useRouter();

// Form state
const formData = ref({
  username: "",
  password: "",
});

const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");

// Login handler
const handleLogin = async () => {
  errorMessage.value = "";
  loading.value = true;

  try {
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiUrl;
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.value.username,
        password: formData.value.password,
      }),
    });

    const result = await response.json();

    if (result.success) {
      // Save token and user data to localStorage
      localStorage.setItem("sijali_token", result.data.token);
      localStorage.setItem("sijali_user", JSON.stringify(result.data.user));

      // Redirect to dashboard
      await router.push("/dashboard");
    } else {
      errorMessage.value = result.message || "Login gagal. Silakan coba lagi.";
    }
  } catch (error) {
    console.error("Login error:", error);
    errorMessage.value =
      "Terjadi kesalahan saat menghubungi server. Silakan coba lagi.";
  } finally {
    loading.value = false;
  }
};

// Check if user is already logged in
onMounted(() => {
  // Ensure language is Indonesian for login page (no translate feature)
  if (typeof window !== "undefined") {
    document.cookie = "googtrans=/id/id; path=/; max-age=31536000";
    localStorage.setItem("preferredLanguage", "id");
  }

  const token = localStorage.getItem("sijali_token");
  if (token) {
    // Redirect to dashboard if already logged in
    router.push("/dashboard");
  }
});
</script>

<style scoped>
/* Blob animation */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Smooth transitions */
input:disabled {
  cursor: not-allowed;
}

/* Focus ring improvements */
input:focus {
  outline: none;
}
</style>
