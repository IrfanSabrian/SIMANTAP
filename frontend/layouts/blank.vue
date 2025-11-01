<template>
  <div>
    <!-- No Google Translate for login page -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Blank layout without Navbar, Footer, and Google Translate (for login page)
// Login page is always in Indonesian

// Ensure language is set to Indonesian for login page
if (typeof window !== "undefined") {
  // Set cookie to Indonesian
  document.cookie = "googtrans=/id/id; path=/; max-age=31536000";
  localStorage.setItem("preferredLanguage", "id");
}
</script>
