import { defineConfig } from "vite";
import path from "path";

const name = "storyblok-astro";

export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: path.resolve(__dirname, "index.js"),
        name: "storyblokAstro",
        fileName: (format) => (format === "es" ? `${name}.mjs` : `${name}.js`),
      },
      rollupOptions: {
        output: {
          globals: {
            axios: "axios",
          },
        },
        external: ["axios"], // FIX: temporary till we remove axios dependency in storyblok-js-client
      },
    },
  };
});
