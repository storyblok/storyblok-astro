import { vitePluginInitStoryblok } from "./vite-plugin-init-storyblok.js";
import { vitePluginStoryblokComponents } from "./vite-plugin-storyblok-components.js";

import {
  storyblokInit,
  apiPlugin,
  renderRichText as origRenderRichText,
} from "@storyblok/js";

export {
  storyblokEditable,
  loadStoryblokBridge,
  RichTextSchema,
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
      "astro:config:setup": ({ injectScript, updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              vitePluginInitStoryblok(options.accessToken, options.apiOptions),
              vitePluginStoryblokComponents(options.components),
            ],
          },
        });

        const ssr = options.ssr ?? false;

        if (!ssr) {
          initStoryblok(options.accessToken, options.use, options.apiOptions);
        } else {
          injectScript("page-ssr", "import 'virtual:init-storyblok'");
        }

        const enableBridge = options.bridge ?? true;

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
