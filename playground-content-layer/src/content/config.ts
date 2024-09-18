import { storyblokLoader } from "@storyblok/astro";
import { defineCollection } from "astro:content";

const storyblokCollection = defineCollection({
  loader: storyblokLoader({
    accessToken: "OsvNv534kS2nivAAj1EPVgtt",
    version: "published",
  }),
});

export const collections = {
  storyblok: storyblokCollection,
};
