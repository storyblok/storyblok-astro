/**
 * Custom Vite plugin by Tony Sull (https://github.com/tony-sull)
 */
import camelcase from "camelcase";
import type { Plugin } from "vite";
import type { Components } from "index";

export function vitePluginStoryblokComponents(
  componentsDir: string,
  components?: Components,
  enableFallbackComponent?: boolean,
  customFallbackComponent?: string
): Plugin {
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
        /**
         * Handle registered components
         */
        const imports: string[] = [];
        let outputComponents: object = {};
        const excludedKeys: string[] = [];
        for await (const [key, value] of Object.entries(components)) {
          console.dir(components);
          console.log(
            "component keys in vite module: " + Object.keys(components)
          );
          let filename: string = "";
          if (typeof value === "string") {
            filename = value.endsWith(".astro") ? value : value + ".astro";
            outputComponents[camelcase(key)] = { component: camelcase(key) };
          } else {
            filename = value.component;
            //console.log("client " + value.client);
            outputComponents[camelcase(key)] = {
              component: camelcase(key),
              client: value.client,
            };
          }

          //console.log(filename);

          const resolvedId = await this.resolve(
            `/${componentsDir}/${filename}`
          );

          //console.log(resolvedId);

          /**
           * if the component cannot be resolved
           */
          if (!resolvedId) {
            if (enableFallbackComponent) {
              /**
               * if showFallbackComponent is enabled, the current component key needs to be excluded from the imports
               * otherwise the attempted import would result in an error
               */
              excludedKeys.push(key);
            } else {
              /**
               * if it is not enabled, throw a specific error here
               */
              throw new Error(
                `Component could not be found for blok "${key}"! Does "${
                  "/" + componentsDir + "/" + value
                }.astro" exist?`
              );
            }
          } else {
            /**
             * if the component can be resolved, add it to the imports array
             * important: convert blok names to camel case for valid import names
             * StoryblokComponent.astro needs to do the same when resolving components!
             */
            imports.push(`import ${camelcase(key)} from "${resolvedId.id}"`);
          }
        }

        /**
         * Handle custom fallback component
         */

        let fallbackComponentKey: string = "";

        if (enableFallbackComponent) {
          fallbackComponentKey = ",FallbackComponent";
          if (customFallbackComponent) {
            /**
             * resolve custom FallbackComponent defined in astro.config.mjs
             */
            const fallbackComponentResolvedId = await this.resolve(
              "/" + componentsDir + "/" + customFallbackComponent + ".astro"
            );

            if (!fallbackComponentResolvedId) {
              throw new Error(
                `Custom fallback component could not be found. Does "${
                  "/" + componentsDir + "/" + customFallbackComponent
                }.astro" exist?`
              );
            }

            imports.push(
              `import FallbackComponent from "${fallbackComponentResolvedId.id}"`
            );
          } else {
            /**
             * import default FallbackComponent bundled with @storyblok/astro
             */
            imports.push(
              `import FallbackComponent from '@storyblok/astro/FallbackComponent.astro'`
            );
          }
        }

        if (!Object.values(components).length) {
          /**
           * If no components are registered in astro.config.mjs, either export just the fallback component (default or custom), or throw an error.
           */
          if (enableFallbackComponent) {
            return `${
              imports[0]
            }; export default {${fallbackComponentKey.replace(",", "")}}`;
          }
          throw new Error(
            `Currently, no Storyblok components are registered in astro.config.mjs.\nPlease register your components or enable the fallback component.\nDetailed information can be found here: https://github.com/storyblok/storyblok-astro`
          );
        } else {
          console.log("outputComponents: ");
          console.dir(outputComponents);
          let testOutput: string = `export default {`;
          let i = 0;
          for (const [key, value] of Object.entries(outputComponents)) {
            testOutput += `{${key}:{component:${key}`;
            testOutput += value.client ? `,client:${value.client}}}` : `}`;
            // TODO: comma
            testOutput +=
              i < Object.keys(outputComponents).length - 1 ? `,` : ``;
            i++;
          }
          testOutput += `}`;

          console.log(testOutput);
          /* const output = `${imports.join(";")};export default {${Object.keys(
            components
          )
            .filter((key) => !excludedKeys.includes(key))
            .map((key) => camelcase(key))
            .join(",")}${fallbackComponentKey}}`; */

          const output = `${imports.join(
            ";"
          )};${outputComponents}${fallbackComponentKey}}`;
          //console.log(output);
          return output;
        }
      }
    },
  };
}
