/// <reference types="vite/client" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    _storyblok_preview_data?: any;
  }
}

declare module 'virtual:storyblok-init' {
  import type { StoryblokClient } from '@storyblok/js';

  export const storyblokApiInstance: StoryblokClient | undefined;
}
declare module 'virtual:storyblok-components' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

  const components: Record<string, AstroComponentFactory>;
  export default components;
}
declare module 'virtual:storyblok-options' {
  import type { IntegrationOptions } from '@storyblok/astro';

  const options: IntegrationOptions;
  export default options;
}
