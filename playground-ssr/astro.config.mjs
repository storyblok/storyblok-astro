import { defineConfig } from "astro/config";
import storyblok from "@storyblok/astro";
import tailwind from "@astrojs/tailwind";
import basicSsl from "@vitejs/plugin-basic-ssl";
import vercel from "@astrojs/vercel/serverless";
import svelte from "@astrojs/svelte";
import vue from "@astrojs/vue";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [
    svelte(),
    vue(),
    react(),
    storyblok({
      accessToken: "OsvNv534kS2nivAAj1EPVgtt",
      apiOptions: {
        cache: {
          clear: "auto",
          type: "memory",
        },
      },
      useCustomApi: false,
      bridge: true,
      enableFallbackComponent: true,
      experimentalLivePreview: true,
      components: {
        page: "storyblok/Page",
        feature: "storyblok/Feature",
        grid: "storyblok/Grid",
        teaser: "storyblok/Teaser",
        vue_counter: "storyblok/VueCounter",
        svelte_counter: "storyblok/SvelteCounter",
        react_counter: "storyblok/ReactCounter",
        "featured-articles": "storyblok/FeaturedArticles",
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
  output: "server",
  adapter: vercel(),
  /**
   * Note: to build an SSR test environment using the WIP version, host generated package on Git, e.g. git+https://github.com/manuelschroederdev/storyblok-astro-dist
   */
});
