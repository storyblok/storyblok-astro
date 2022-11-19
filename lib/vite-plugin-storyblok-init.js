export function vitePluginStoryblokInit(accessToken, use, apiOptions) {
  const virtualModuleId = "virtual:storyblok-init";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "vite-plugin-storyblok-init",
    async resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        let init = `import { storyblokInit } from "@storyblok/js";`;
        if (use) {
          init += `import customApiPlugin from "${use}"; const plugin = [customApiPlugin];`;
        } else {
          init += `import { apiPlugin } from "@storyblok/js"; const plugin = [apiPlugin]`;
        }
        init += `
          const { storyblokApi } = storyblokInit({
            accessToken: "${accessToken}",
            use: plugin,
            apiOptions: ${JSON.stringify(apiOptions)},
          });
          export const storyblokApiInstance = storyblokApi;
        `;

        return init;
      }
    },
  };
}
