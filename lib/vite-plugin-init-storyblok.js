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
        const { storyblokApi } = storyblokInit({
          accessToken: accessToken,
          use: [apiPlugin],
          apiOptions: { ...apiOptions },
        });

        const storyblokApiInstance = storyblokApi;

        console.log(storyblokApiInstance);

        return `export default ${storyblokApiInstance};`;
      }
    },
  };
}
