import type { StoryblokClient } from '@storyblok/js';

declare module 'virtual:*' {
  const component: any;
  export default component;
}

declare global {
  let storyblokApiInstance: StoryblokClient | undefined;
}

export {};
