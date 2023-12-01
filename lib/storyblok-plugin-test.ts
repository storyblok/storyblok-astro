import type { DevOverlayPlugin } from "astro";

export default {
  id: "storyblok-plugin",
  name: "Storyblok Plugin",
  icon: ``,
  init(canvas, eventTarget) {
    eventTarget.dispatchEvent(
      new CustomEvent("plugin-notification", {
        detail: {
          state: true,
        },
      })
    );
  },
};
