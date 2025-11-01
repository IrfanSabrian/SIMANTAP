<template>
  <div>
    <!-- No Google Translate for dashboard page -->
    <!-- No Navbar here - dashboard page has its own navbar -->
    <main>
      <slot />
    </main>
    <!-- No Footer for dashboard -->
  </div>
</template>

<script setup lang="ts">
// Dashboard layout without Navbar (dashboard page has its own), Footer, and Google Translate
// Dashboard page is always in Indonesian

// Ensure language is set to Indonesian for dashboard page
if (typeof window !== "undefined") {
  // Set cookie to Indonesian
  document.cookie = "googtrans=/id/id; path=/; max-age=31536000";
  localStorage.setItem("preferredLanguage", "id");
}
</script>
