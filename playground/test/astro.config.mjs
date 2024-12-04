import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import vue from "@astrojs/vue";
import react from "@astrojs/react";
import storyblok from "@storyblok/astro";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [
    svelte(),
    vue(),
    react(),
    storyblok({
      accessToken: "hjfIuqpPLxaJIYlgCAylKgtt",
      apiOptions: {
        cache: { clear: "auto", type: "memory" },
      },
      enableFallbackComponent: true,
      customFallbackComponent: "storyblok/CustomFallback",
      components: {
        page: "storyblok/Page",
        feature: "storyblok/subfolder/Feature",
        grid: "storyblok/Grid",
        teaser: "storyblok/Teaser",
        vue_counter: "storyblok/VueCounter",
        svelte_counter: "storyblok/SvelteCounter",
        react_counter: "storyblok/ReactCounter",
        "new-component": "storyblok/NewComponent",
        "featured-articles": "storyblok/FeaturedArticles",
        richtext: "storyblok/RichText",
        embedded_blok: "storyblok/EmbeddedBlok",
      },
    }),
    tailwind(),
  ],
});
