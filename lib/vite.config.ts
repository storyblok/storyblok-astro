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
      commonjsOptions: {
        include: [/\@storyblok\/js/, /node_modules/],
      },
    },
    plugins: [
      dts({
        outDir: "dist/types",
      }) as unknown as Plugin,
    ],
    optimizeDeps: {
      include: ['@storyblok/astro > @storyblok/js', '@storyblok/astro'],
    },
  };
});
