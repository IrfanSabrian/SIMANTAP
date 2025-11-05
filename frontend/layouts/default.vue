<template>
  <div>
    <!-- Hidden Google Translate Element -->
    <div id="google_translate_element" style="display: none"></div>

    <Navbar />
    <main>
      <slot />
    </main>
    <Footer />
    <Toast />
  </div>
</template>

<style>
/* Hide Google Translate toolbar and branding */
.goog-te-banner-frame.skiptranslate,
.goog-te-gadget-icon {
  display: none !important;
}

body {
  top: 0 !important;
}

/* Hide the Google Translate select dropdown */
.goog-te-combo {
  display: none !important;
}

/* Style for translated content */
.translated-ltr {
  margin-top: 0 !important;
}

/* Remove Google Translate top frame */
#goog-gt-tt,
.goog-te-balloon-frame {
  display: none !important;
}

.goog-text-highlight {
  background: none !important;
  box-shadow: none !important;
}
</style>

<script setup lang="ts">
import Toast from "~/components/Toast.vue";
// Default layout with Navbar and Footer
</script>

