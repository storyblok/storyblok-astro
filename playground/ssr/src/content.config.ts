import { defineCollection } from 'astro:content';
import { storyblokLoader } from '@storyblok/astro';

const storyblokCollection = defineCollection({
  loader: storyblokLoader({
    STORYBLOK_TOKEN: 'OsvNv534kS2nivAAj1EPVgtt',
    version: 'draft',
  }),
});

export const collections = {
  storyblok: storyblokCollection,
};
