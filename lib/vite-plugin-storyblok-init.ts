export function vitePluginStoryblokInit(accessToken, useCustomApi, apiOptions) {
  const virtualModuleId = "virtual:storyblok-init";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

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
          import { storyblokInit, apiPlugin } from "@storyblok/js";
          const { storyblokApi } = storyblokInit({
            accessToken: "${accessToken}",
            use: ${useCustomApi ? "[]" : "[apiPlugin]"},
            apiOptions: ${JSON.stringify(apiOptions)},
          });
          export const storyblokApiInstance = storyblokApi;  
        `;
      }
    },
  };
}
