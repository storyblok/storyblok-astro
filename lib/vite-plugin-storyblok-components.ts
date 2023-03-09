/**
 * Custom Vite plugin by Tony Sull (https://github.com/tony-sull)
 */
import camelcase from "camelcase";

export function vitePluginStoryblokComponents(components?: object) {
  const virtualModuleId = "virtual:storyblok-components";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "vite-plugin-storyblok-components",
    async resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const imports = [];
        for await (const [key, value] of Object.entries(components)) {
          const resolvedId = await this.resolve("/src/" + value + ".astro");

          if (!resolvedId) {
            throw new Error(
              `Component could not be found for blok "${key}"! Does "/src/${value}.astro" exist?`
            );
          }
          /**
           * convert blok names to camel case for valid import names
           * StoryblokComponent.astro needs to do the same when resolving components!
           */
          imports.push(`import ${camelcase(key)} from "${resolvedId.id}"`);
        }

        return `${imports.join(";")};export default {${Object.keys(components)
          .map((key) => camelcase(key))
          .join(",")}}`;
      }
    },
  };
}
