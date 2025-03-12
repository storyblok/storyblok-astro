import type { StoryblokClient } from '@storyblok/js';

declare global {
  let storyblokApiInstance: StoryblokClient | undefined;
}
