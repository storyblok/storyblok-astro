import { defineConfig } from "astro/config";
import storyblok from "@storyblok/astro";
import tailwind from "@astrojs/tailwind";
import basicSsl from "@vitejs/plugin-basic-ssl";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [
    storyblok({
      accessToken: "igfBcJoK0sIocwod9qd2Pwtt",
      apiOptions: {
        cache: {
          clear: "auto",
          type: "memory",
        },
      },
      useCustomApi: false,
      bridge: true,
      components: {
        page: "storyblok/Page",
        feature: "storyblok/Feature",
        grid: "storyblok/Grid",
        teaser: "storyblok/Teaser",
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
