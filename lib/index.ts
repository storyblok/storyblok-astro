import { vitePluginStoryblokInit } from "./vite-plugins/vite-plugin-storyblok-init";
import { vitePluginStoryblokComponents } from "./vite-plugins/vite-plugin-storyblok-components";
import { vitePluginStoryblokOptions } from "./vite-plugins/vite-plugin-storyblok-options";
import {
  RichTextResolver,
  renderRichText as origRenderRichText,
} from "@storyblok/js";

import type { AstroGlobal, AstroIntegration } from "astro";
import type {
  ISbConfig,
  ISbRichtext,
  ISbStoryData,
  SbRichTextOptions,
  StoryblokBridgeConfigV2,
  StoryblokClient,
} from "./types";
import { initStoryblokBridge } from "./utils/initStoryblokBridge";
import { storyblokLogo } from "./dev-toolbar/toolbarApp";
export { handleStoryblokMessage } from "./live-preview/handleStoryblokMessage";
export { syncContentUpdate } from "./content-layer/syncContentUpdate";
export { storyblokLoader } from "./content-layer/storyblokLoader";

export {
  storyblokEditable,
  loadStoryblokBridge,
  RichTextResolver,
  RichTextSchema,
} from "@storyblok/js";

export function useStoryblokApi(): StoryblokClient {
  if (!globalThis.storyblokApiInstance) {
    console.error("storyblokApiInstance has not been initialized correctly");
  }
  return globalThis.storyblokApiInstance;
}

export async function getLiveStory(Astro: AstroGlobal) {
  let story: ISbStoryData = null;
  if (Astro && Astro.locals["_storyblok_preview_data"]) {
    story = Astro.locals["_storyblok_preview_data"];
  }
  return story;
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
  /**
   * A boolean to enable/disable the Experimental Live Preview feature. Disabled by default.
   */
  livePreview?: boolean;
  /**
   * A boolean to enable/disable storyblok content layer.
   */
  contentLayer?: boolean;
};

export default function storyblokIntegration({
  useCustomApi = false,
  bridge = true,
  componentsDir = "src",
  enableFallbackComponent = false,
  livePreview = false,
  contentLayer = false,
  ...restOptions
}: IntegrationOptions): AstroIntegration {
  const resolvedOptions = {
    useCustomApi,
    bridge,
    componentsDir,
    enableFallbackComponent,
    livePreview,
    contentLayer,
    ...restOptions,
  };

  const initBridge = initStoryblokBridge(bridge);

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

        if (bridge && !livePreview) {
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
        if (livePreview) {
          injectScript(
            "page",
            `
              import { loadStoryblokBridge, handleStoryblokMessage } from "@storyblok/astro";
              console.info("The Storyblok Astro live preview feature is currently in an experimental phase, and its API is subject to change in the future.")
              loadStoryblokBridge().then(() => {
                const { StoryblokBridge, location } = window;
                ${initBridge}
                storyblokInstance.on(["published", "change", "input"], handleStoryblokMessage);
              });
            `
          );
          addMiddleware({
            entrypoint: "@storyblok/astro/middleware.ts",
            order: "pre",
          });
        }
        // This is only enabled if experimentalLivePreview feature is on
        if (contentLayer) {
          injectScript(
            "page",
            `
              import { loadStoryblokBridge, syncContentUpdate } from "@storyblok/astro";
              loadStoryblokBridge().then(() => {
                const { StoryblokBridge } = window;
                const storyblokInstance = new StoryblokBridge()
                storyblokInstance.on(["published", "change", "input"], syncContentUpdate);
              });
            `
          );
        }

        addDevToolbarApp({
          id: "storyblok",
          name: "Storyblok",
          icon: storyblokLogo,
          entrypoint: "@storyblok/astro/toolbarApp.ts",
        });
      },
      ...(contentLayer
        ? {
            "astro:server:setup": async ({ server, refreshContent }) => {
              // `server` is the Vite dev server instance
              server.middlewares.use("/_refresh", async (req, res) => {
                if (req.method !== "POST") {
                  res.writeHead(405, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ error: "Method Not Allowed" }));
                  return;
                }
                let body = [];
                req.on("data", (chunk) => body.push(chunk));
                req.on("end", async () => {
                  try {
                    const story = JSON.parse(Buffer.concat(body).toString());
                    await refreshContent?.({
                      context: { story },
                      loaders: ["story-loader"],
                    });
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({
                        message: "Content refreshed successfully",
                      })
                    );
                  } catch (error) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({
                        error: `Failed to refresh content: ${error.message}`,
                      })
                    );
                  }
                });
              });
            },
          }
        : {}),
    },
  };
}

export * from "./types";
