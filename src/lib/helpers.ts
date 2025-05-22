import type {
  ISbStoryData,
  StoryblokBridgeConfigV2,
  StoryblokClient,
} from '../types';
import type { AstroGlobal } from 'astro';

export function useStoryblokApi(): StoryblokClient {
  if (!globalThis?.storyblokApiInstance) {
    throw new Error('storyblokApiInstance has not been initialized correctly');
  }
  return globalThis.storyblokApiInstance;
}

// TODO: should we pass the Astro object to this function or only the locals object?
export async function getLiveStory(Astro: Readonly<AstroGlobal>) {
  let story: ISbStoryData | null = null;
  if (Astro && Astro.locals._storyblok_preview_data) {
    story = Astro.locals._storyblok_preview_data;
  }
  return story;
}

export function initStoryblokBridge(
  config: boolean | StoryblokBridgeConfigV2,
): string {
  if (typeof config === 'object') {
    const bridgeConfig = JSON.stringify(config);
    return `const storyblokInstance = new StoryblokBridge(${bridgeConfig});`;
  }
  return 'const storyblokInstance = new StoryblokBridge();';
}
