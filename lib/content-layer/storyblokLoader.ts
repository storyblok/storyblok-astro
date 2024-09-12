import type { Loader } from "astro/loaders";
import { storyblokInit, apiPlugin } from "@storyblok/js";

interface StoryblokLoaderConfig {
  STORYBLOK_TOKEN: string;
  version: "draft" | "published";
}

export function storyblokLoader(config: StoryblokLoaderConfig): Loader {
  const { storyblokApi } = storyblokInit({
    accessToken: config.STORYBLOK_TOKEN,
    use: [apiPlugin],
  });
  return {
    name: "story-loader",
    load: async ({ store, meta, logger, refreshContextData }) => {
      if (!storyblokApi) {
        throw new Error(`storyblokApi is not loaded`);
      }
      if (refreshContextData?.story) {
        logger.info("Syncing story updated in Storyblok");
        const updatedStory = refreshContextData?.story as any;
        store.set({
          data: updatedStory,
          id: updatedStory?.uuid,
        });
      }
      logger.info("Loading stories");
      const lastSynced = meta.get("lastSynced");
      // Don't sync more than once 2 minute
      if (lastSynced && Date.now() - Number(lastSynced) < 1000 * 120) {
        logger.info("Skipping sync");
        return;
      }
      const stories = await storyblokApi?.getAll("cdn/stories", {
        version: config.version || "draft",
      });
      store.clear();
      for (const story of stories) {
        store.set({
          data: story,
          id: story.uuid,
        });
      }
      meta.set("lastSynced", String(Date.now()));
    },
  };
}
