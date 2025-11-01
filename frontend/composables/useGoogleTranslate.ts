import { ref } from "vue";

// Global state for language
const currentLanguage = ref<"id" | "en">("id");
const isInitialized = ref(false);

export const useGoogleTranslate = () => {
  const initGoogleTranslate = () => {
    // Initialize Google Translate
    if (typeof window !== "undefined") {
      // Check cookies for existing language preference
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("googtrans="));

      if (cookieValue) {
        const langCode = cookieValue.split("=")[1];
        if (langCode === "/id/en") {
          currentLanguage.value = "en";
        } else {
          currentLanguage.value = "id";
        }
      } else {
        // Check localStorage as fallback
        const savedLang = localStorage.getItem("preferredLanguage") as
          | "id"
          | "en";
        if (savedLang) {
          currentLanguage.value = savedLang;
        }
      }

      // Set up the initialization function
      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google && (window as any).google.translate) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: "id",
              includedLanguages: "id,en",
              layout: (window as any).google.translate.TranslateElement
                .InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            "google_translate_element"
          );
          isInitialized.value = true;

          // DON'T auto-trigger changeLanguage on init
          // Just read the state from cookies
          console.log(
            "Google Translate initialized with language:",
            currentLanguage.value
          );
        }
      };

      // If Google Translate is already loaded, initialize it
      if ((window as any).google && (window as any).google.translate) {
        (window as any).googleTranslateElementInit();
      }
    }
  };

  const changeLanguage = (lang: "id" | "en") => {
    if (typeof window === "undefined") return;

    // Prevent infinite loop - check if already in target language
    const currentCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("googtrans="));

    const targetCookie = lang === "en" ? "/id/en" : "/id/id";

    if (currentCookie && currentCookie.includes(targetCookie)) {
      console.log(`Already in ${lang.toUpperCase()}, skipping reload`);
      currentLanguage.value = lang;
      return; // Already in this language, don't reload
    }

    currentLanguage.value = lang;

    // Set cookies for Google Translate
    const domain = window.location.hostname;
    const cookieValue = targetCookie;

    // Set cookie for current domain and all subdomains
    document.cookie = `googtrans=${cookieValue}; path=/; max-age=31536000`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain}; max-age=31536000`;

    // Also set the cookie without domain for localhost
    document.cookie = `googtrans=${cookieValue}; path=/`;

    // Save preference to localStorage
    localStorage.setItem("preferredLanguage", lang);

    // Check if Google Translate is initialized
    const selectElement = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement;

    if (selectElement) {
      // Google Translate is ready, trigger change
      selectElement.value = lang;
      const event = new Event("change", { bubbles: true });
      selectElement.dispatchEvent(event);
    }

    // Force reload immediately to apply translation
    // This is the most reliable way for Google Translate
    console.log(`Switching to ${lang.toUpperCase()}, reloading page...`);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const toggleLanguage = () => {
    const newLang = currentLanguage.value === "id" ? "en" : "id";
    console.log(`Toggle language from ${currentLanguage.value} to ${newLang}`);
    changeLanguage(newLang);
  };

  return {
    currentLanguage,
    isInitialized,
    initGoogleTranslate,
    changeLanguage,
    toggleLanguage,
  };
};

