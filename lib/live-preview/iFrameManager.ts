import { fetchAstroPage } from "./fetchAstroPage.ts";

/**
 * Creates the initial iFrame and appends it to the document body.
 * This iFrame is used to load and display the initial content fetched from the Astro page.
 */
export async function setupPreviewIFrameManager() {
  const iframeSwapper: any = document.querySelector("iframe-swapper");
  iframeSwapper.addIframe({ srcdoc: await fetchAstroPage() });
}

/**
 * Updates the content of the preview iFrame.
 * A new iFrame is created with updated content based on the provided story.
 * The new iFrame, upon loading, will replace the existing one.
 *
 * @param {Object} story - The story data used to update the iFrame content.
 */
export async function updatePage(story) {
  const iframeSwapper: any = document.querySelector("iframe-swapper");
  iframeSwapper.addIframe({ srcdoc: await fetchAstroPage(story) });
}
