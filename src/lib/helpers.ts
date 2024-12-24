import type {
  ISbRichtext,
  ISbStoriesParams,
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

export async function useStoryblok(
  slug: string,
  apiOptions: ISbStoriesParams = {},
  _: StoryblokBridgeConfigV2 = {},
  Astro: AstroGlobal
) {
  if (!globalThis.storyblokApiInstance) {
    throw new Error('storyblokApiInstance has not been initialized correctly');
  }
  let story: ISbStoryData | null = null;
  if (Astro && Astro.locals._storyblok_preview_data) {
    story = Astro.locals._storyblok_preview_data;
  } else {
    const { data } = await globalThis?.storyblokApiInstance?.get(
      slug,
      apiOptions
    );
    story = data.story;
  }
  return story;
}

export function renderRichText(
  data?: ISbRichtext,
  options?: SbRichTextOptions
) {
  const resolverInstance: RichTextResolver | undefined =
    globalThis?.storyblokApiInstance?.richTextResolver;
  if (!resolverInstance) {
    throw new Error(
      'Please initialize the Storyblok SDK before calling the renderRichText function'
    );
  }
  return origRenderRichText(data, options, resolverInstance);
}
