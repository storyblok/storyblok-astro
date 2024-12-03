import type { StoryblokClient } from "@storyblok/js";

declare module "virtual:*" {
  const component: any;
  export default component;
}

declare global {
  var storyblokApiInstance: StoryblokClient | undefined;
}

export {};
