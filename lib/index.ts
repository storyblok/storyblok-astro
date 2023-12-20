import { vitePluginStoryblokInit } from "./vite-plugins/vite-plugin-storyblok-init";
import { vitePluginStoryblokComponents } from "./vite-plugins/vite-plugin-storyblok-components";
import { vitePluginStoryblokOptions } from "./vite-plugins/vite-plugin-storyblok-options";
import {
  RichTextResolver,
  renderRichText as origRenderRichText,
} from "@storyblok/js";

import type { AstroIntegration } from "astro";
import type {
  ISbConfig,
  ISbRichtext,
  SbRichTextOptions,
  StoryblokBridgeConfigV2,
  StoryblokClient,
} from "./types";

export {
  storyblokEditable,
  loadStoryblokBridge,
  RichTextResolver,
  RichTextSchema,
} from "@storyblok/js";

export { setupSourceEventsManager } from "./live-preview/sourceEventsManager";
export { setupPreviewEventsManager } from "./live-preview/previewEventsManager";
export {
  setupPreviewIFrameManager,
  updatePage,
} from "./live-preview/iFrameManager";
export { fetchAstroPage } from "./live-preview/fetchAstroPage";

export function useStoryblokApi(): StoryblokClient {
  if (!globalThis.storyblokApiInstance) {
    console.error("storyblokApiInstance has not been initialized correctly");
  }
  return globalThis.storyblokApiInstance;
}

export function setupStoryblokManager(storyId: string) {
  // This block is needed to let Storyblok manager work, as it is looking for the parameter in the URL
  if (storyId) {
    // if location.search doesn't contain _storyblok, add it
    if (!location.search.includes("_storyblok")) {
      // if it doesn't contain any query params, add _storyblok
      if (!location.search) {
        location.search = `_storyblok=${storyId}`;
      } else {
        // if it contains other query params, add _storyblok after the first one
        location.search = location.search.replace(
          "?",
          `?_storyblok=${storyId}&`
        );
      }
    }
  }
}

export function renderRichText(
  data?: ISbRichtext,
  options?: SbRichTextOptions
) {
  const resolverInstance: RichTextResolver =
    globalThis.storyblokApiInstance.richTextResolver;
  if (!resolverInstance) {
    console.error(
      "Please initialize the Storyblok SDK before calling the renderRichText function"
    );
    return;
  }
  return origRenderRichText(data, options, resolverInstance);
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
};

export default function storyblokIntegration(
  options: IntegrationOptions
): AstroIntegration {
  const resolvedOptions = {
    useCustomApi: false,
    bridge: true,
    componentsDir: "src",
    enableFallbackComponent: false,
    ...options,
  };
  return {
    name: "@storyblok/astro",
    hooks: {
      "astro:config:setup": ({
        injectScript,
        updateConfig,
        addMiddleware,
        injectRoute,
        addDevToolbarApp,
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

        if (resolvedOptions.bridge) {
          let initBridge: string = "";

          if (typeof resolvedOptions.bridge === "object") {
            const bridgeConfigurationOptions = { ...resolvedOptions.bridge };
            initBridge = `const storyblokInstance = new StoryblokBridge(${JSON.stringify(
              bridgeConfigurationOptions
            )});`;
          } else {
            initBridge = "const storyblokInstance = new StoryblokBridge()";
          }

          // TODO: handle based on user preference (live preview boolean in Astro config)
          /* injectScript(
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
          ); */

          injectScript(
            "page",
            `
              import { loadStoryblokBridge } from "@storyblok/astro";
              loadStoryblokBridge().then(() => {
                const { StoryblokBridge, location } = window;
                ${initBridge}

                storyblokInstance.on(["published", "change", "input", "enterEditmode", "customEvent", "unpublished",], (event) => {
                  // TODO: check if events are necessary
                });
              });
            `
          );

          injectScript(
            "page",
            `
            import { setupSourceEventsManager } from "@storyblok/astro";
            console.log("setupSourceEventsManager");
            setupSourceEventsManager();
            `
          );
        }

        addMiddleware({
          entrypoint: "@storyblok/astro/middleware.ts",
          order: "pre",
        });

        injectRoute({
          pattern: "/storyblok-preview/[...path]",
          entrypoint: "@storyblok/astro/StoryblokPreview.astro",
        });

        addDevToolbarApp("@storyblok/astro/toolbarApp.ts");
      },
    },
  };
}

export * from "./types";
