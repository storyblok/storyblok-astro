import type { StoryblokBridgeConfigV2 } from "../types";

export function initStoryblokBridge(
  config: boolean | StoryblokBridgeConfigV2
): string {
  if (typeof config === "object") {
    const bridgeConfig = JSON.stringify(config);
    return `const storyblokInstance = new StoryblokBridge(${bridgeConfig});`;
  }
  return "const storyblokInstance = new StoryblokBridge();";
}
