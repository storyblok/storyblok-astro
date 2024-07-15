import { vitePluginStoryblokInit } from "./vite-plugins/vite-plugin-storyblok-init";
import { vitePluginStoryblokComponents } from "./vite-plugins/vite-plugin-storyblok-components";
import { vitePluginStoryblokOptions } from "./vite-plugins/vite-plugin-storyblok-options";
import {
  RichTextResolver,
  renderRichText as origRenderRichText,
} from "@storyblok/js";
import sanitizeHtml from 'sanitize-html';
import { defu } from 'defu';

import type { AstroGlobal, AstroIntegration } from "astro";
import type {
  ISbConfig,
  ISbRichtext,
  ISbStoriesParams,
  ISbStoryData,
  SbRichTextOptions,
  StoryblokBridgeConfigV2,
  StoryblokClient,
} from "./types";
import { vitePluginStoryblokBridge } from "./vite-plugins/vite-plugin-storyblok-bridge";
export { handleStoryblokMessage } from "./live-preview/handleStoryblokMessage";

export {
  storyblokEditable,
  loadStoryblokBridge,
  RichTextResolver,
  RichTextSchema,
} from "@storyblok/js";


// Default sanitize options
const defaultSanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
};


export function useStoryblokApi(): StoryblokClient {
  if (!globalThis.storyblokApiInstance) {
    console.error("storyblokApiInstance has not been initialized correctly");
  }
  return globalThis.storyblokApiInstance;
}

export async function useStoryblok(
  slug: string,
  apiOptions: ISbStoriesParams = {},
  bridgeOptions: StoryblokBridgeConfigV2 = {},
  Astro: AstroGlobal
) {
  if (!globalThis.storyblokApiInstance) {
    console.error("storyblokApiInstance has not been initialized correctly");
  }
  let story: ISbStoryData = null;
  if (Astro && Astro.locals["_storyblok_preview_data"]) {
    story = Astro.locals["_storyblok_preview_data"];
  } else {
    const { data } = await globalThis.storyblokApiInstance.get(
      slug,
      apiOptions,
      bridgeOptions
    );
    story = data.story;
  }
  return story;
}

export function renderRichText(
  data?: ISbRichtext,
  options?: SbRichTextOptions,
  sanitizeOptions?: sanitizeHtml.IOptions
) {
  const resolverInstance: RichTextResolver =
    globalThis.storyblokApiInstance.richTextResolver;
  if (!resolverInstance) {
    console.error(
      "Please initialize the Storyblok SDK before calling the renderRichText function"
    );
    return;
  }

  const original = origRenderRichText(data, options, resolverInstance);
  const mergedSanitizeOptions = defu(sanitizeOptions, defaultSanitizeOptions);
  return sanitizeHtml(original, mergedSanitizeOptions)
}
export type IntegrationOptions = {
  /**
   * The access token from your space.
   */
  accessToken: string;
  /**
   *  If you want to use your own method to fetch data from Storyblok, you can disable this behavior by setting `useCustomApi` to `true`, resulting in an optimized final bundle.
   */
  useCustomApi?: boolean;
  /**
   * Set custom API options here (cache, region, and more). All options are documented [here](https://github.com/storyblok/storyblok-js-client#class-storyblok).
   */
  apiOptions?: ISbConfig;
  /**
   * A boolean to enable/disable the Storyblok JavaScript Bridge or provide a StoryblokBridgeConfigV2 configuration object. Enabled by default.
   */
  bridge?: boolean | StoryblokBridgeConfigV2;
  /**
   * An object containing your Astro components to their Storyblok equivalents.
   * Example:
   * ```js
   * components: {
   *   page: "storyblok/Page",
   *   feature: "storyblok/Feature",
   *   grid: "storyblok/Grid",
   *   teaser: "storyblok/Teaser",
   * },
   * ```
   */
  components?: object;
  /**
   * The directory containing your Astro components are. Defaults to "src".
   */
  componentsDir?: string;
  /**
   * Show a fallback component in your frontend if a component is not registered properly.
   */
  enableFallbackComponent?: boolean;
  /**
   * Provide a path to a custom fallback component, e.g. "storyblok/customFallback".
   * Please note: the path takes into account the `componentsDir` option.
   */
  customFallbackComponent?: string;
  /**
   * A boolean to enable/disable the Experimental Live Preview feature. Disabled by default.
   */
  livePreview?: boolean;
};

export default function storyblokIntegration(
  options: IntegrationOptions
): AstroIntegration {
  const resolvedOptions = {
    useCustomApi: false,
    bridge: true,
    componentsDir: "src",
    enableFallbackComponent: false,
    livePreview: false,
    ...options,
  };
  return {
    name: "@storyblok/astro",
    hooks: {
      "astro:config:setup": ({
        injectScript,
        updateConfig,
        addDevToolbarApp,
        addMiddleware,
        config,
      }) => {
        updateConfig({
          vite: {
            plugins: [
              vitePluginStoryblokInit(
                resolvedOptions.accessToken,
                resolvedOptions.useCustomApi,
                resolvedOptions.apiOptions
              ),
              vitePluginStoryblokComponents(
                resolvedOptions.componentsDir,
                resolvedOptions.components,
                resolvedOptions.enableFallbackComponent,
                resolvedOptions.customFallbackComponent
              ),
              vitePluginStoryblokOptions(resolvedOptions),
              vitePluginStoryblokBridge(
                resolvedOptions.livePreview,
                config.output
              ),
            ],
          },
        });
        if (resolvedOptions.livePreview && config?.output !== "server") {
          throw new Error(
            "To utilize the Astro Storyblok Live feature, Astro must be configured to run in SSR mode. Please disable this feature or switch Astro to SSR mode."
          );
        }
        injectScript(
          "page-ssr",
          `
          import { storyblokApiInstance } from "virtual:storyblok-init";
          globalThis.storyblokApiInstance = storyblokApiInstance;
          `
        );

        // This is only enabled if experimentalLivePreview is disabled and bridge is enabled.

        if (resolvedOptions.bridge && !resolvedOptions.livePreview) {
          let initBridge: string = "";

          if (typeof resolvedOptions.bridge === "object") {
            const bridgeConfigurationOptions = { ...resolvedOptions.bridge };
            initBridge = `const storyblokInstance = new StoryblokBridge(${JSON.stringify(
              bridgeConfigurationOptions
            )});`;
          } else {
            initBridge = "const storyblokInstance = new StoryblokBridge()";
          }

          injectScript(
            "page",
            `
              import { loadStoryblokBridge } from "@storyblok/astro";
              loadStoryblokBridge().then(() => {
                const { StoryblokBridge, location } = window;
                ${initBridge}

                storyblokInstance.on(["published", "change"], (event) => {
                  if (!event.slugChanged) {
                    location.reload(true);
                  } 
                });
              });
            `
          );
        }

        // This is only enabled if experimentalLivePreview feature is on
        if (resolvedOptions.livePreview) {
          injectScript(
            "page",
            `
              import { loadStoryblokBridge, handleStoryblokMessage } from "@storyblok/astro";
              import { bridgeOptions }  from "virtual:storyblok-bridge";
              console.info("The Storyblok Astro live preview feature is currently in an experimental phase, and its API is subject to change in the future.")
              loadStoryblokBridge().then(() => {
                const { StoryblokBridge, location } = window;
                if(bridgeOptions){
                  const storyblokInstance = new StoryblokBridge(bridgeOptions);
                  storyblokInstance.on(["published", "change", "input"], handleStoryblokMessage);
                };
              });
            `
          );
          addMiddleware({
            entrypoint: "@storyblok/astro/middleware.ts",
            order: "pre",
          });
        }
        addDevToolbarApp("@storyblok/astro/toolbarApp.ts");
      },
    },
  };
}

export * from "./types";

// Export sanitize-html and its defaults
export { sanitizeHtml, sanitizeHtml as sanitizeHtmlDefaults };