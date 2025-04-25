import type {
  ISbRichtext,
  ISbStoryData,
  RichTextResolver,
  SbRichTextOptions,
  StoryblokBridgeConfigV2,
  StoryblokClient,
} from '../types';
import type { AstroGlobal } from 'astro';
import { renderRichText as origRenderRichText } from '@storyblok/js';

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

export function renderRichText(
  data?: ISbRichtext,
  options?: SbRichTextOptions,
) {
  const resolverInstance: RichTextResolver | undefined
    = globalThis?.storyblokApiInstance?.richTextResolver;
  if (!resolverInstance) {
    throw new Error(
      'Please initialize the Storyblok SDK before calling the renderRichText function',
    );
  }
  return origRenderRichText(data, options, resolverInstance);
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
