/* eslint-disable */
import type { ISbStoryData, StoryblokClient } from '@storyblok/js';

declare module 'virtual:*' {
  const component: any;
  export default component;
}

export {};

declare global {
  var storyblokApiInstance: StoryblokClient | undefined;
}
