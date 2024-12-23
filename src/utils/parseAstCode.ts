import mergeWith from 'lodash.mergewith';
import type { ISbStoriesParams, StoryblokBridgeConfigV2 } from '@storyblok/js';
import type { RawCodeItemOptions } from '../vite-plugins/vite-plugin-storyblok-bridge';
import type { Rollup } from 'vite';
import type { SpreadElement } from 'typescript';

/**
 * Parses through the Abstract Syntax Tree (AST) code to locate the 'useStoryblok' function and its properties.
 * This functionality is crucial for generating a virtual module that can be utilized during the initialization of the Storyblok bridge.
 */

export function parseAstRawCode(astCode: Rollup.ProgramNode) {
  let obj: RawCodeItemOptions = {};

  function customizer(_: any, srcValue: any) {
    if (
      srcValue?.type === 'AwaitExpression'
      && srcValue.argument.type === 'CallExpression'
      && srcValue.argument.callee.type === 'Identifier'
      && srcValue.argument.callee.name === 'useStoryblok'
    ) {
      const props = srcValue.argument.arguments;
      if (props && props[1].type === 'ObjectExpression') {
        const apiOptions = getAstPropToObj(props[1].properties);
        obj = {
          ...obj,
          apiOptions,
        };
      }
      if (props && props[2].type === 'ObjectExpression') {
        const bridgeOptions = getAstPropToObj(props[2].properties);
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

function getAstPropToObj(properties: (SpreadElement | any)[]) {
  const option: ISbStoriesParams | StoryblokBridgeConfigV2 = {};

  return properties.reduce((options, property) => {
    if (property.type !== 'Property') {
      return options;
    }
    const { key, value } = property;
    const { type } = value;
    if (key.type !== 'Identifier') {
      return options;
    }

    if (type === 'Literal') {
      options[key.name] = value.value;
    }
    else if (type === 'ArrayExpression') {
      const arrayValues = value.elements.reduce(
        (acc: any, element: { type: string; value: any }) => {
          if (element.type === 'Literal' && element.value) {
            return [...acc, element.value];
          }
          return acc;
        },
        [],
      );
      options[key.name] = arrayValues;
    }
    return options;
  }, option);
}
