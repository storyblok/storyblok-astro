import type { ISbStoriesParams, StoryblokBridgeConfigV2 } from "@storyblok/js";

export interface RawCodeItem {
  options?: {
    apiOptions?: ISbStoriesParams;
    bridgeOptions?: StoryblokBridgeConfigV2;
  };
}
export function generateFinalBridgeObject(
  rawCode: RawCodeItem[]
): StoryblokBridgeConfigV2 {
  let mergedOptions = {
    resolveRelations: [],
  };

  function addToResolveRelations(
    resolveRelations: string[] | string | undefined
  ) {
    if (resolveRelations) {
      if (Array.isArray(resolveRelations)) {
        mergedOptions.resolveRelations.push(...resolveRelations);
      } else {
        mergedOptions.resolveRelations.push(resolveRelations);
      }
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
