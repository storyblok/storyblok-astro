import type { ISbStoryData } from "@storyblok/js";

export async function syncContentUpdate(event: { story: ISbStoryData }) {
  const { story } = event || {};
  await fetch(location.origin + "/_refresh", {
    method: "POST",
    body: JSON.stringify(story),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
