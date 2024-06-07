import mergeWith from "lodash.mergewith";
import type { ISbStoriesParams, StoryblokBridgeConfigV2 } from "@storyblok/js";
import type { RawCodeOptions } from "../vite-plugins/vite-plugin-storyblok-bridge";
import type { Rollup } from "vite";

export function parseAstRawCode(astCode: Rollup.ProgramNode) {
  let obj: RawCodeOptions = {};

  function customizer(_: any, srcValue: any) {
    if (
      srcValue?.type === "AwaitExpression" &&
      srcValue?.argument?.callee?.name === "useStoryblok"
    ) {
      const props = srcValue?.argument?.arguments;
      if (props && props[1]?.type === "ObjectExpression") {
        const apiOptions = getAstPropToObj(props[1]?.properties || []);
        obj = {
          ...obj,
          apiOptions,
        };
      }
      if (props && props[2]?.type === "ObjectExpression") {
        const bridgeOptions = getAstPropToObj(props[2]?.properties || []);

        obj = {
          ...obj,
          bridgeOptions,
        };
      }
    }
  }

  mergeWith({}, astCode, customizer);
  return obj;
}

function getAstPropToObj(
  properties: {
    key: {
      name: string;
    };
    value: any;
  }[]
) {
  const option: ISbStoriesParams | StoryblokBridgeConfigV2 = {};

  return properties.reduce((options, { key, value }) => {
    const { type } = value;
    options[key.name] =
      type === "Literal"
        ? value.value
        : type === "ArrayExpression"
          ? value.elements.map((v) => v.value)
          : value.value;
    return options;
  }, option);
}
