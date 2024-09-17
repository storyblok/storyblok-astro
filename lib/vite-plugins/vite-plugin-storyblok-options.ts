import type { Plugin } from "vite";

export function vitePluginStoryblokOptions(options: object) {
  const virtualModuleId = `virtual:storyblok-options`;
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "vite-plugin-storyblok-options",
    async resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(options)}`;
      }
    },
  };
}
