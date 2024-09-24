import type { Loader } from "astro/loaders";
import { storyblokInit, apiPlugin, type ISbConfig } from "@storyblok/js";

interface StoryblokLoaderConfig {
  accessToken: string;
  apiOptions?: ISbConfig;
  version: "draft" | "published";
}

export function storyblokLoader(config: StoryblokLoaderConfig): Loader {
  const { storyblokApi } = storyblokInit({
    accessToken: config.accessToken,
    apiOptions: config.apiOptions,
    use: [apiPlugin],
  });
  return {
    name: "story-loader",
    load: async ({ store, meta, logger, refreshContextData }) => {
      if (!storyblokApi) {
        throw new Error(`storyblokApi is not loaded`);
      }
      // Handle updated stories
      if (refreshContextData?.story) {
        logger.info("Syncing... story updated in Storyblok");
        const updatedStory = refreshContextData.story as any; // Improve type if possible
        store.set({
          data: updatedStory,
          id: updatedStory.uuid,
        });
        return; // Early return to avoid unnecessary processing
      }
      logger.info("Loading stories");

      const storedLastPublishedAt = meta.get("lastPublishedAt");
      const otherParams =
        storedLastPublishedAt && config.version === "published"
          ? { published_at_gt: storedLastPublishedAt }
          : {};

      const stories = await storyblokApi?.getAll("cdn/stories", {
        version: config.version,
        ...otherParams,
      });
      console.log("total = ", stories.length);

      // Clear the store before repopulating
      logger.info("Clearing store");

      if (config.version === "draft") {
        store.clear();
      }

      let latestPublishedAt = storedLastPublishedAt
        ? new Date(storedLastPublishedAt)
        : null;

      for (const story of stories) {
        const publishedAt = story.published_at
          ? new Date(story.published_at)
          : null;
        if (
          publishedAt &&
          (!latestPublishedAt || publishedAt > latestPublishedAt)
        ) {
          latestPublishedAt = publishedAt;
        }
        store.set({
          data: story,
          id: story.uuid,
        });

        // Update meta if new stories are found
        if (latestPublishedAt) {
          meta.set("lastPublishedAt", latestPublishedAt.toISOString());
        }
      }
    },
  };
}
