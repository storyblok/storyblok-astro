import type { Plugin } from "vite";
import { parseAstRawCode } from "./parseAstCode";
let previousRawCode = [];

export function vitePluginStoryblokBridge(): Plugin {
  let rawCode = [];
  const virtualModuleId = "virtual:storyblok-bridge";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;
  let _server = null;
  let restartTimeout = null;

  return {
    name: "vite-plugin-storyblok-bridge",
    async resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async transform(code, id) {
      if (id.includes("node_modules") && !id.includes("/pages/")) return;
      if (!code.includes("useStoryblok")) return;
      const moduleInfo = this.getModuleInfo(id);
      if (!moduleInfo.meta?.astro) return;
      const [, ...routeArray] = id.split("src/pages/");
      const url = routeArray.join("/");
      const bridgeOptions = parseAstRawCode(this.parse(code));
      if (previousRawCode.length) {
        rawCode = previousRawCode.filter((i) => i.url !== url);
      }
      rawCode.push({
        url,
        bridgeOptions,
      });
      if (!_server) return;
      if (restartTimeout) {
        clearTimeout(restartTimeout);
      }
      restartTimeout = setTimeout(() => {
        if (alreadyHaveThisUrl(previousRawCode, rawCode)) return;
        if (previousRawCode.length !== 0) {
          _server.restart();
          console.info("Updating bridge options...");
        }
        previousRawCode = [...rawCode];
      }, 1000);
    },
    async load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return `export const bridgeOptions = ${JSON.stringify(rawCode)}`;
      }
    },
    configureServer(server) {
      _server = server;
    },
  };
}

interface ParsedCodeObj {
  url: string;
  bridgeOptions: any;
}

// function alreadyHaveThisUrl(a: ParsedCodeObj[] = [], b: ParsedCodeObj[] = []) {
//   const arrayA = new Set(a.map(({ url }) => url));
//   const arrayB = new Set(b.map(({ url }) => url));

//   return [...arrayB].every((url) => arrayA.has(url));
// }

function alreadyHaveThisUrl(a: ParsedCodeObj[] = [], b: ParsedCodeObj[] = []) {
  return b.every(({ url, bridgeOptions }) => {
    const aCopy = a.find((e) => e?.url === url);
    return (
      aCopy &&
      JSON.stringify(bridgeOptions) === JSON.stringify(aCopy.bridgeOptions)
    );
  });
}
