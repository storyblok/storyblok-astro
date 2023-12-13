import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import vue from "@astrojs/vue";
import react from "@astrojs/react";
import storyblok from "@storyblok/astro";
import tailwind from "@astrojs/tailwind";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  integrations: [
    svelte(),
    vue(),
    react(),
    storyblok({
      accessToken: "OsvNv534kS2nivAAj1EPVgtt",
      apiOptions: {
        cache: { clear: "auto", type: "memory" },
      },
      enableFallbackComponent: true,
      components: {
        //interactive: { component: "InteractiveComponent.vue", client: "idle" },
        page: "storyblok/Page",
        feature: "storyblok/Feature",
        grid: "storyblok/Grid",
        teaser: "storyblok/Teaser",
        vue_counter: {
          component: "storyblok/vue/Counter.vue",
          client: "idle",
        },
        svelte_counter: "storyblok/SvelteCounter",
        react_counter: "storyblok/ReactCounter",
        "new-component": "storyblok/NewComponent",
      },
    }),
    tailwind(),
  ],
  vite: {
    plugins: [basicSsl()],
    server: {
      https: true,
    },
  },
});
