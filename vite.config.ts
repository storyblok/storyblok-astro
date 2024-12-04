import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        name: "storyblokAstro",
        fileName: (format) => `storyblok-astro.${format}.js`,
      },
    },
    plugins: [
      dts(),
      viteStaticCopy({
        targets: [
          { src: "src/live-preview/middleware.ts", dest: "live-preview" },
          { src: "src/dev-toolbar/toolbarApp.ts", dest: "dev-toolbar" },
          {
            src: [
              "src/components/StoryblokComponent.astro",
              "src/components/FallbackComponent.astro",
            ],
            dest: "components",
          },
        ],
      }),
    ],
  };
});
