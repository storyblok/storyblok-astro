import { defineMiddleware } from "astro/middleware";
/**
 * Middleware designed by Mario Hamann | Virtual Identity
 */
export const onRequest = defineMiddleware(async ({ locals, request }, next) => {
  // Process initial GET request from Storyblok to /storyblok-preview route
  if (request["method"] === "GET") {
    const url = new URL(request.url);

    const isPreviewRoute = url.pathname.startsWith("/storyblok-preview");
    const isAlreadyRedirected = url.searchParams.has(
      "_storyblok_preview_prevent_redirect"
    );
    const isStoryblokRequest = [
      "_storyblok",
      "_storyblok_tk[space_id]",
      "_storyblok_tk[timestamp]",
      "_storyblok_tk[token]",
    ].every((param) => url.searchParams.has(param));

    // Prepare redirect and prevent infinite loop
    if (!isPreviewRoute && !isAlreadyRedirected && isStoryblokRequest) {
      url.pathname = "/storyblok-preview" + url.pathname;
      url.searchParams.set("_storyblok_preview_prevent_redirect", "");
      return Response.redirect(url.href);
    }
  }
  // Process data coming via POST request from /storyblok-preview route
  else if (request["method"] === "POST") {
    const requestBody = await request.json();
    // is_storyblok_preview is set in `fetchAstroPage` in `src/js/preview/fetchAstroPage.js`
    if (requestBody && requestBody["is_storyblok_preview"]) {
      locals["_storyblok_preview_data"] = requestBody;
    }
  }
  return next();
});
