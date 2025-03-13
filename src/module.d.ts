import type { StoryblokClient } from '@storyblok/js';

declare global {
  /* eslint-disable */
  var storyblokApiInstance: StoryblokClient | undefined;
}
