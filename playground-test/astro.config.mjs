import { defineConfig } from "astro/config";
import storyblok from "@storyblok/astro";
import tailwind from "@astrojs/tailwind";
// import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  integrations: [
    storyblok({
      accessToken: "hjfIuqpPLxaJIYlgCAylKgtt",
      componentsDir: "app",
      enableFallbackComponent: true,
      customFallbackComponent: "storyblok/CustomFallback",
      components: {
        page: "storyblok/Page",
        feature: "storyblok/subfolder/Feature",
        grid: "storyblok/Grid",
        teaser: "storyblok/Teaser",
        richtext: "storyblok/RichText",
        embedded_blok: "storyblok/EmbeddedBlok",
      },
    }),
    tailwind(),
  ],
  // vite: {
  //   plugins: [basicSsl()],
  //   server: {
  //     https: true,
  //   },
  // },
});
