import type { StoryblokBridgeConfigV2 } from "@storyblok/js";
import type { RawCode } from "../vite-plugins/vite-plugin-storyblok-bridge";

export function generateFinalBridgeObject(rawCode: RawCode) {
  let mergedOptions: StoryblokBridgeConfigV2 = {
    resolveRelations: [],
  };

  function addToResolveRelations(resolveRelations?: string[] | string) {
    if (resolveRelations && Array.isArray(mergedOptions.resolveRelations)) {
      mergedOptions.resolveRelations.push(
        ...(Array.isArray(resolveRelations)
          ? resolveRelations
          : [resolveRelations])
      );
    }
  }

  for (const item of rawCode) {
    if (item.options) {
      const { apiOptions, bridgeOptions } = item.options;
      addToResolveRelations(apiOptions?.resolve_relations);
      if (bridgeOptions) {
        const { resolveRelations, ...rest } = bridgeOptions;
        addToResolveRelations(resolveRelations);
        Object.assign(mergedOptions, rest);
      }
    }
  }
  mergedOptions.resolveRelations = [...new Set(mergedOptions.resolveRelations)];

  return mergedOptions;
}
