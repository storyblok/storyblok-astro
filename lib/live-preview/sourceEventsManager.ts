/**
 * Overrides message routing as the StoryblokBridge expects messages to be sent to `https://app.storyblok.com`.
 */

export function setupSourceEventsManager() {
  const originalPostMessage = window.parent.postMessage;
  const storyblokOrigin = "https://app.storyblok.com";

  window.parent.postMessage = function (message, targetOrigin) {
    // Override only if targetOrigin includes 'app.storyblok.com'
    if (targetOrigin.includes(storyblokOrigin)) {
      // TODO: Improve security
      originalPostMessage(message, "*");
    } else {
      // Use the original postMessage for other origins
      originalPostMessage(message, targetOrigin);
    }
  };
}
