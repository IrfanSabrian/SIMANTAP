<template>
  <div :class="containerClass">
    <div class="text-center">
      <!-- Spinner -->
      <div
        :class="[
          'animate-spin rounded-full border-b-2 mx-auto',
          sizeClass,
          colorClass,
          message ? 'mb-4' : '',
        ]"
      ></div>
      <!-- Message -->
      <p v-if="message" :class="messageClass">{{ message }}</p>
      <p v-if="subMessage" :class="subMessageClass">{{ subMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string;
  subMessage?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "blue" | "primary" | "white";
  fullScreen?: boolean;
  overlay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  message: "Memuat...",
  subMessage: "",
  size: "md",
  color: "blue",
  fullScreen: false,
  overlay: false,
});

const sizeClass = computed(() => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };
  return sizes[props.size];
});

const colorClass = computed(() => {
  const colors = {
    blue: "border-blue-600",
    primary: "border-blue-600",
    white: "border-white",
  };
  return colors[props.color];
});

const containerClass = computed(() => {
  const classes = ["flex", "items-center", "justify-center"];
  
  if (props.fullScreen) {
    classes.push("fixed inset-0 z-50");
    if (props.overlay) {
      classes.push("bg-white/90 dark:bg-gray-800/90");
    }
  } else if (props.size === "sm") {
    // For small inline spinners
    classes.push("py-0");
  } else {
    classes.push("py-12");
  }
  
  return classes.join(" ");
});

const messageClass = computed(() => {
  return [
    "text-gray-600",
    "dark:text-gray-400",
    props.size === "sm" ? "text-sm" : "text-base",
  ].join(" ");
});

const subMessageClass = computed(() => {
  return [
    "text-sm text-gray-500",
    "dark:text-gray-400",
    "mt-2",
  ].join(" ");
});
</script>

