import type { ISbConfig, StoryblokBridgeConfigV2 } from '@storyblok/js';
import type { AstroIntegration } from 'astro';
import { storyblokLogo } from '../dev-toolbar/toolbarApp';
import { vitePluginStoryblokBridge } from '../vite-plugins/vite-plugin-storyblok-bridge';
import { vitePluginStoryblokComponents } from '../vite-plugins/vite-plugin-storyblok-components';
import { vitePluginStoryblokInit } from '../vite-plugins/vite-plugin-storyblok-init';
import { vitePluginStoryblokOptions } from '../vite-plugins/vite-plugin-storyblok-options';
import { initStoryblokBridge } from './helpers';

export interface IntegrationOptions {
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
  components?: Record<string, string>;
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
}

export default function storyblokIntegration(
  options: IntegrationOptions
): AstroIntegration {
  const resolvedOptions = {
    useCustomApi: false,
    bridge: true,
    componentsDir: 'src',
    enableFallbackComponent: false,
    livePreview: false,
    ...options,
  };
  const initBridge = initStoryblokBridge(resolvedOptions.bridge);

  return {
    name: '@storyblok/astro',
    hooks: {
      'astro:config:setup': ({
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
        if (resolvedOptions.livePreview && config?.output !== 'server') {
          throw new Error(
            'To utilize the Astro Storyblok Live feature, Astro must be configured to run in SSR mode. Please disable this feature or switch Astro to SSR mode.'
          );
        }
        injectScript(
          'page-ssr',
          `
            import { storyblokApiInstance } from "virtual:storyblok-init";
            globalThis.storyblokApiInstance = storyblokApiInstance;
            `
        );

        // This is only enabled if experimentalLivePreview is disabled and bridge is enabled.

        if (resolvedOptions.bridge && !resolvedOptions.livePreview) {
          injectScript(
            'page',
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
            'page',
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
            entrypoint: '@storyblok/astro/middleware.ts',
            order: 'pre',
          });
        }
        addDevToolbarApp({
          id: 'storyblok',
          name: 'Storyblok',
          icon: storyblokLogo,
          entrypoint: '@storyblok/astro/toolbarApp.ts',
        });
      },
    },
  };
}
