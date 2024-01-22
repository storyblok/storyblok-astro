import { defineMiddleware } from "astro/middleware";
/**
 * Middleware designed by Mario Hamann | Virtual Identity
 */
export const onRequest = defineMiddleware(async ({ locals, request }, next) => {
  function getValueFromRequest(value) {
    const symbols = Object.getOwnPropertySymbols(request);
    let output;

    for (const sym of symbols) {
      if (request[sym].hasOwnProperty([value])) {
        output = request[sym][value];
        break;
      }
    }
    return output;
  }

  function getRequestBody() {
    const body = getValueFromRequest("body");

    // Safely retrieves a nested property from an object
    function getNestedProperty(obj, ...props) {
      return props.reduce(
        (prev, prop) => (prev && prev[prop] ? prev[prop] : null),
        obj
      );
    }

    // Retrieve and process the 'source' property
    const source = getNestedProperty(body, "source");
    if (source) {
      const decoder = new TextDecoder();
      const decodedString = decoder.decode(source);
      return JSON.parse(decodedString);
    }

    return null;
  }

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
    const requestBody = getRequestBody();

    // is_storyblok_preview is set in `fetchAstroPage` in `src/js/preview/fetchAstroPage.js`
    if (requestBody && requestBody["is_storyblok_preview"]) {
      locals["_storyblok_preview_data"] = requestBody;
    }
  }
  return next();
});
