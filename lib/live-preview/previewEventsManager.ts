// TODO: important from iframe-swapper
//import { updatePage } from "./iFrameManager";

/**
 * Sets up event listeners to handle messages for a preview environment.
 * This function listens for 'message' events and handles them based on their origin and content.
 * Mainly, it handles messages from Storyblok and forwards them to the preview iFrame and vice versa.
 */
export function setupPreviewEventsManager() {
  window.addEventListener(
    "message",
    async (event) => {
      if (event.origin !== "https://app.storyblok.com") {
        console.log("⏫ forwarding message: nested iFrame → Storyblok", event);
        // @TODO: Improve security
        window.parent.postMessage(event.data, "*");
      } else {
        console.log("⏬ forwarding message: Storyblok → nested iFrame", event);

        if (event.data.action === "input") {
          //await updatePage(event.data.story);
        } else if (["published", "unpublished"].includes(event.data.action)) {
          location.reload();
        }

        const allIframes = document.body.querySelectorAll("iframe");
        const iframe = allIframes[allIframes.length - 1];
        // @TODO: Improve security
        iframe.contentWindow.postMessage(event.data, "*");
      }
    },
    false
  );
}
