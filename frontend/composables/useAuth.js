import { ref, computed } from "vue";

// Global state
const user = ref(null);
const isAuthenticated = ref(false);

export const useAuth = () => {
  // Initialize auth state from localStorage
  const initAuth = () => {
    const storedUser = localStorage.getItem("simantap_user");
    const storedToken = localStorage.getItem("simantap_token");

    if (storedUser && storedToken) {
      try {
        user.value = JSON.parse(storedUser);
        isAuthenticated.value = true;
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        logout();
      }
    }
  };

  // Login function
  const login = (userData) => {
    user.value = userData;
    isAuthenticated.value = true;
  };

  // Logout function
  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("simantap_user");
    localStorage.removeItem("simantap_token");
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!user.value || !user.value.permissions) return false;
    return user.value.permissions.includes(permission);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user.value) return false;
    return user.value.role === role;
  };

  // Get user display name
  const getUserName = computed(() => {
    return user.value?.name || user.value?.username || "Guest";
  });

  // Get user role display
  const getUserRole = computed(() => {
    const roleMap = {
      admin: "Administrator",
      user: "User",
      guest: "Guest",
    };
    return roleMap[user.value?.role] || "Unknown";
  });

  // Check if user can access data layers
  const canAccessLayers = computed(() => {
    return hasPermission("view_all") || hasPermission("view_public");
  });

  // Check if user can edit data
  const canEditData = computed(() => {
    return hasPermission("edit_all") || hasPermission("edit_own");
  });

  // Check if user can delete data
  const canDeleteData = computed(() => {
    return hasPermission("delete_all");
  });

  // Check if user can manage other users
  const canManageUsers = computed(() => {
    return hasPermission("manage_users");
  });

  return {
    // State
    user,
    isAuthenticated,

    // Methods
    initAuth,
    login,
    logout,
    hasPermission,
    hasRole,

    // Computed
    getUserName,
    getUserRole,
    canAccessLayers,
    canEditData,
    canDeleteData,
    canManageUsers,
  };
};
