import { defineConfig } from "astro/config";
import storyblok from "@storyblok/astro";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [
    storyblok({
      accessToken: "hjfIuqpPLxaJIYlgCAylKgtt",
      componentsDir: "app",
      components: {
        page: "storyblok/Page",
        feature: "storyblok/subfolder/Feature",
        grid: "storyblok/Grid",
        teaser: "storyblok/Teaser",
      },
    }),
    tailwind(),
  ],
});
