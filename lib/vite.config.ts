import { defineConfig, Plugin } from "vite";
import path from "path";
import dts from "vite-plugin-dts";

const name = "storyblok-astro";

export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: path.resolve(__dirname, "index.ts"),
        name: "storyblokAstro",
        fileName: (format) => (format === "es" ? `${name}.mjs` : `${name}.js`),
      },
    },
    plugins: [
      dts({
        outDir: "dist/types",
      }) as unknown as Plugin,
    ],
    optimizeDeps: {
      include: ['@storyblok/js'],
    },
  };
});
