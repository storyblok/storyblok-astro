import type { ISbStoriesParams, StoryblokBridgeConfigV2 } from '@storyblok/js';
import { generateFinalBridgeObject } from '../utils/generateFinalBridgeObject';
import { parseAstRawCode } from '../utils/parseAstCode';
import type { Plugin, ViteDevServer } from 'vite';

let previousRawCode: RawCode = [];

export interface RawCodeItem {
  url: string;
  options?: RawCodeItemOptions;
}

export type RawCode = RawCodeItem[];

export interface RawCodeItemOptions {
  apiOptions?: ISbStoriesParams;
  bridgeOptions?: StoryblokBridgeConfigV2;
}
export function vitePluginStoryblokBridge(
  experimentalLivePreview: boolean,
  output: string,
): Plugin {
  const virtualModuleId = 'virtual:storyblok-bridge';
  const resolvedVirtualModuleId = `\0${virtualModuleId}`;
  if (!experimentalLivePreview || output !== 'server') {
    return {
      name: 'vite-plugin-storyblok-bridge',
      resolveId(id: string) {
        if (id === virtualModuleId) {
          return resolvedVirtualModuleId;
        }
      },
      load(id: string) {
        if (id === resolvedVirtualModuleId) {
          return `export const bridgeOptions = null`;
        }
      },
    };
  }
  let rawCode: RawCode = [];
  let _server: ViteDevServer | null = null;
  let restartTimeout: NodeJS.Timeout;

  return {
    name: 'vite-plugin-storyblok-bridge',
    async resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async transform(code, id) {
      const notPagesFolder
        = id.includes('node_modules') && !id.includes('/pages/');
      if (notPagesFolder) {
        return;
      }
      if (!code.includes('useStoryblok')) {
        return;
      }
      const moduleInfo = this.getModuleInfo(id);
      if (!moduleInfo?.meta?.astro) {
        return;
      }
      const [, ...routeArray] = id.split('src/pages/');
      const url = routeArray.join('/').replace('.astro', '');
      const options = parseAstRawCode(this.parse(code));
      if (previousRawCode.length) {
        rawCode = previousRawCode.filter(i => i.url !== url);
      }
      rawCode.push({
        url,
        options,
      });
      if (!_server) {
        return;
      }
      if (restartTimeout) {
        clearTimeout(restartTimeout);
      }
      restartTimeout = setTimeout(() => {
        if (alreadyHaveThisUrl(previousRawCode, rawCode)) {
          return;
        }
        if (previousRawCode.length !== 0) {
          _server?.restart();
          console.info('Bridge options updated. Restarting...');
        }
        previousRawCode = [...rawCode];
      }, 1000);
    },
    async load(id: string) {
      if (id === resolvedVirtualModuleId) {
        /**
         * Crrently we are merging all the bridge options to be one
         * in the future we need to find a way to make it work per
         * route basis
         */
        return `export const bridgeOptions = ${JSON.stringify(generateFinalBridgeObject(rawCode))}`;
      }
    },
    configureServer(server) {
      _server = server;
    },
  };
}

function alreadyHaveThisUrl(a: RawCode = [], b: RawCode = []) {
  return b.every(({ url, options }) => {
    const aCopy = a.find(e => e?.url === url);
    return aCopy && JSON.stringify(options) === JSON.stringify(aCopy.options);
  });
}
