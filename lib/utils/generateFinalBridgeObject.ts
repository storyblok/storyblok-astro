export function generateFinalBridgeObject(rawCode: any) {
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
