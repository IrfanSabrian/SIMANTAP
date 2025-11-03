<template>
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="closeModal"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
          Login SIMANTAP
        </h2>
        <button
          @click="closeModal"
          class="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="text-gray-500 dark:text-gray-400"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin">
        <div class="space-y-4">
          <!-- Username -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Username
            </label>
            <input
              v-model="loginForm.username"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Masukkan username"
            />
          </div>

          <!-- Password -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <div class="relative">
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Masukkan password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  v-if="showPassword"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                  />
                </svg>
                <svg
                  v-else
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="text-red-600 dark:text-red-400 text-sm"
          >
            {{ errorMessage }}
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <svg
              v-if="isLoading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            {{ isLoading ? "Memproses..." : "Login" }}
          </button>
        </div>
      </form>

      <!-- Demo Credentials -->
      <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          Demo Credentials:
        </h3>
        <div class="text-xs text-blue-700 dark:text-blue-400 space-y-1">
          <div><strong>Admin:</strong> admin / admin123</div>
          <div><strong>User:</strong> user / user123</div>
          <div><strong>Guest:</strong> guest / guest123</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const emit = defineEmits(["login-success", "close"]);

// Props
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
});

// State
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const loginForm = reactive({
  username: "",
  password: "",
});

// Demo users (in real app, this would be from backend)
const demoUsers = [
  {
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Administrator",
    permissions: ["view_all", "edit_all", "delete_all", "manage_users"],
  },
  {
    username: "user",
    password: "user123",
    role: "user",
    name: "Regular User",
    permissions: ["view_all", "edit_own"],
  },
  {
    username: "guest",
    password: "guest123",
    role: "guest",
    name: "Guest User",
    permissions: ["view_public"],
  },
];

// Methods
const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check credentials
    const user = demoUsers.find(
      (u) =>
        u.username === loginForm.username && u.password === loginForm.password
    );

    if (user) {
      // Store user data in localStorage
      const userData = {
        username: user.username,
        role: user.role,
        name: user.name,
        permissions: user.permissions,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem("sijali_user", JSON.stringify(userData));
      localStorage.setItem(
        "sijali_token",
        btoa(user.username + ":" + Date.now())
      );

      // Emit success event
      emit("login-success", userData);

      // Reset form
      loginForm.username = "";
      loginForm.password = "";
    } else {
      errorMessage.value = "Username atau password salah!";
    }
  } catch (error) {
    errorMessage.value = "Terjadi kesalahan saat login. Silakan coba lagi.";
  } finally {
    isLoading.value = false;
  }
};

const closeModal = () => {
  errorMessage.value = "";
  loginForm.username = "";
  loginForm.password = "";
  emit("close");
};
</script>
