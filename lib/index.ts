import type { AstroIntegration } from 'astro';

import { vitePluginStoryblokInit } from "./vite-plugin-storyblok-init.js";
import { vitePluginStoryblokComponents } from "./vite-plugin-storyblok-components.js";

import { renderRichText as origRenderRichText } from "@storyblok/js";

import type {
  StoryblokClient,
  ISbConfig,
  RichtextResolver,
  ISbRichtext,
  SbRichTextOptions,
} from "./types";

export {
  storyblokEditable,
  loadStoryblokBridge,
  //RichTextSchema,
} from "@storyblok/js";

// TODO find a way to type this correctly 
//let storyblokApiInstance: StoryblokClient = null 

export function useStoryblokApi() {
  if (!globalThis.storyblokApiInstance) {
    console.error("storyblokApiInstance has not been initialized correctly");
  }
  return globalThis.storyblokApiInstance;
}

export function renderRichText(data: ISbRichtext, options?: SbRichTextOptions) {
  const resolverInstance: RichtextResolver = globalThis.storyblokApiInstance.richTextResolver;
  if (!resolverInstance) {
    console.error(
      "Please initialize the Storyblok SDK before calling the renderRichText function"
    );
    return;
  }
  return origRenderRichText(data, options, resolverInstance);
}

export interface IntegrationOptions {
  /**
  * The access token from your space.
  */
  accessToken: string;
  /**
  *  If you want to use your own method to fetch data from Storyblok, you can disable this behavior by setting `useCustomApi` to `true`, resulting in an optimized final bundle.
  */
  useCustomApi?: false;
  /**
   * Set custom API options here (cache, region, and more). All options are documented [here](https://github.com/storyblok/storyblok-js-client#class-storyblok).
   */
  apiOptions?: ISbConfig;
  /**
   * A boolean to enable/disable the Storyblok JavaScript Bridge. Enabled by default.
   */
  bridge?: boolean;
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
}

// TODO find better way to set defaults
export default function storyblokIntegration(options: IntegrationOptions = {accessToken: '', useCustomApi: false, apiOptions: {}, bridge: true, components: {}}): AstroIntegration {
  return {
    name: "@storyblok/astro",
    hooks: {
      "astro:config:setup": ({ injectScript, updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              vitePluginStoryblokInit(
                options.accessToken,
                options.useCustomApi,
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

        // TODO get rid of this
        //const enableBridge: boolean = options.bridge ?? true;

        if (options.bridge) {
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

export * from "./types";