import type { ISbConfig } from "./types";
import type { Plugin } from "vite";
import { storyblokInit, apiPlugin } from "@storyblok/js";
export function vitePluginStoryblokInit(
  accessToken: string,
  useCustomApi: boolean,
  apiOptions: ISbConfig
): Plugin {
  const virtualModuleId = "virtual:storyblok-init";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;
  globalThis.apiPlugin = apiPlugin;
  globalThis.storyblokInit = storyblokInit;

  return {
    name: "vite-plugin-storyblok-init",
    async resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return `
          const { storyblokApi } = globalThis.storyblokInit({
            accessToken: "${accessToken}",
            use: ${useCustomApi ? "[]" : "[globalThis.apiPlugin]"},
            apiOptions: ${JSON.stringify(apiOptions)},
          });
          export const storyblokApiInstance = storyblokApi;
        `;
      }
    },
  };
}