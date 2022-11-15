import { storyblokInit, apiPlugin } from "@storyblok/js";

export function vitePluginInitStoryblok(accessToken, apiOptions) {
  const virtualModuleId = "virtual:init-storyblok";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "vite-plugin-init-storyblok",
    async resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        return `
          import { storyblokInit, apiPlugin } from "@storyblok/js";
          const { storyblokApi } = storyblokInit({
            accessToken: "${accessToken}",
            use: [apiPlugin],
            apiOptions: ${JSON.stringify(apiOptions)},
          });
          export const storyblokApiInstance = storyblokApi;
        `;
      }
    },
  };
}
