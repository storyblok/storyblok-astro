import type { Loader } from 'astro/loaders';
import {
  apiPlugin,
  type ISbConfig,
  type ISbStoriesParams,
  storyblokInit,
} from '@storyblok/js';

interface StoryblokLoaderConfig {
  accessToken: string;
  version: 'draft' | 'published';
  useCustomApi?: boolean;
  apiOptions?: ISbConfig;
  storiesParams?: ISbStoriesParams;
}

export function storyblokLoader(config: StoryblokLoaderConfig): Loader {
  const { accessToken, useCustomApi, apiOptions, version, storiesParams }
    = config;
  const { storyblokApi } = storyblokInit({
    accessToken,
    use: useCustomApi ? [] : [apiPlugin],
    apiOptions,
  });
  return {
    name: 'story-loader',
    load: async ({ store, meta, logger, refreshContextData }) => {
      if (!storyblokApi) {
        throw new Error(`storyblokApi is not loaded`);
      }

      // Handle updated stories
      if (refreshContextData?.story) {
        logger.info('Syncing... story updated in Storyblok');
        const updatedStory = refreshContextData.story as any; // Improve type if possible
        store.set({
          data: updatedStory,
          id: updatedStory.uuid,
        });
        return; // Early return to avoid unnecessary processing
      }
      logger.info('Loading stories');
      const storedLastPublishedAt = meta.get('lastPublishedAt');
      const storedLastUpdatedAt = meta.get('lastUpdatedAt');
      const storedVersion = meta.get('version');

      // Determine fetch parameters
      const fetchParams: Record<string, string> = { version };

      if (storedLastPublishedAt && version === 'published') {
        fetchParams.published_at_gt = storedLastPublishedAt;
      }
      else if (storedLastUpdatedAt) {
        fetchParams.updated_at_gt = storedLastUpdatedAt;
      }
      if (storedVersion !== version) {
        logger.info('Version changed, clearing store');
        store.clear();
      }
      meta.set('version', version);
      const stories = await storyblokApi?.getAll('cdn/stories', {
        ...fetchParams,
        ...storiesParams,
      });

      logger.info(`Fetched ${stories.length} stories`);

      const toDateOrNull = (date?: string) => (date ? new Date(date) : null);

      let lastPublishedAt = toDateOrNull(storedLastPublishedAt);
      let lastUpdatedAt = toDateOrNull(storedLastUpdatedAt);

      for (const story of stories) {
        const publishedAt = toDateOrNull(story.published_at);
        const updatedAt = toDateOrNull(story.updated_at);
        const updateLastPublishedDate
          = publishedAt && (!lastPublishedAt || publishedAt > lastPublishedAt);
        const updateLastUpdatedDate
          = updatedAt && (!lastUpdatedAt || updatedAt > lastUpdatedAt);

        if (updateLastPublishedDate) {
          lastPublishedAt = publishedAt;
        }

        if (updateLastUpdatedDate) {
          lastUpdatedAt = updatedAt;
        }

        store.set({
          data: story,
          id: story.uuid,
        });

        // Update meta if new stories are found
        if (lastUpdatedAt) {
          meta.set('lastUpdatedAt', lastUpdatedAt.toISOString());
        }
        if (lastPublishedAt) {
          meta.set('lastPublishedAt', lastPublishedAt.toISOString());
        }
      }
    },
  };
}
