import { storyblokLoader } from "@storyblok/astro";
import { defineCollection } from "astro:content";

const blogCollection = defineCollection({
  loader: storyblokLoader({
    STORYBLOK_TOKEN: "OsvNv534kS2nivAAj1EPVgtt",
    version: "draft",
  }),
});

export const collections = {
  blog: blogCollection,
};
