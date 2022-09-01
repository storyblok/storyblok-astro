import { vitePluginStoryblok } from "./vite-plugin-storyblok.js";

import { storyblokInit, apiPlugin } from "@storyblok/js";

export {
  storyblokEditable,
  loadStoryblokBridge,
  renderRichText,
} from "@storyblok/js";

function initStoryblok(accessToken, use, apiOptions) {
  const { storyblokApi } = storyblokInit({
    accessToken: accessToken,
    use: use || [apiPlugin],
    apiOptions: { ...apiOptions },
  });

  globalThis.storyblokApiInstance = storyblokApi;
}

export function useStoryblokApi() {
  if (!globalThis.storyblokApiInstance) {
    console.error("storyblokApiInstance has not been initialized correctly");
  }

  return globalThis.storyblokApiInstance;
}

export default function storyblokIntegration(options) {
  return {
    name: "@storyblok/astro",
    hooks: {
      "astro:config:setup": ({ injectScript, updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [vitePluginStoryblok(options.components)],
          },
        });

        initStoryblok(options.accessToken, options.use, options.apiOptions);

        const enableBridge = options.bridge || true;

        if (enableBridge) {
          injectScript(
            "page",
            `
          import { loadStoryblokBridge } from "@storyblok/astro";
          loadStoryblokBridge().then(() => {
            const { StoryblokBridge, location } = window;
            const storyblokInstance = new StoryblokBridge();

            storyblokInstance.on(["published", "change"], (event) => {
              if (!event.slugChanged) {
                location.reload(true);
              } 
            });
          });
          `
          );
        }
      },
    },
  };
}
