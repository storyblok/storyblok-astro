/**
 * Custom Vite plugin by Tony Sull (https://github.com/tony-sull)
 */
export function vitePluginStoryblok(components) {
  const virtualModuleId = "virtual:storyblok-components";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "vite-plugin-storyblok",
    async resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        const imports = [];
        for await (const [key, value] of Object.entries(components)) {
          const { id } = await this.resolve("/src/" + value + ".astro");
          imports.push(`import ${key} from "${id}"`);
        }
        return `${imports.join(";")};export default {${Object.keys(
          components
        ).join(",")}}`;
      }
    },
  };
}
