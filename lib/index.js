import { vitePluginStoryblokInit } from "./vite-plugin-storyblok-init.js";
import { vitePluginStoryblokComponents } from "./vite-plugin-storyblok-components.js";

import { renderRichText as origRenderRichText } from "@storyblok/js";

export {
  storyblokEditable,
  loadStoryblokBridge,
  RichTextSchema,
} from "@storyblok/js";

export function useStoryblokApi() {
  if (!globalThis.storyblokApiInstance) {
    console.error("storyblokApiInstance has not been initialized correctly");
  }
  return storyblokApiInstance;
}

export function renderRichText(data, options) {
  const resolverInstance = globalThis.storyblokApiInstance.richTextResolver;
  if (!resolverInstance) {
    console.error(
      "Please initialize the Storyblok SDK before calling the renderRichText function"
    );
    return;
  }
  return origRenderRichText(data, options, resolverInstance);
}

export default function storyblokIntegration(options) {
  return {
    name: "@storyblok/astro",
    hooks: {
      "astro:config:setup": ({ config, injectScript, updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              vitePluginStoryblokInit(
                options.accessToken,
                options.use,
                options.apiOptions
              ),
              vitePluginStoryblokComponents(options.components),
            ],
          },
        });

        injectScript(
          "page-ssr",
          `
          import { storyblokApiInstance } from "virtual:storyblok-init";
          globalThis.storyblokApiInstance = storyblokApiInstance;
          `
        );

        const enableBridge = options.bridge || false;

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
