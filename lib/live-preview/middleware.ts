import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async ({ locals, request }, next) => {
  // TODO: remove perf logs
  const start = performance.now();
  
  if (request["method"] === "POST") {
    const requestBody = await request.json();
    if (requestBody && requestBody["is_storyblok_preview"]) {
      locals["_storyblok_preview_data"] = requestBody;
    }
  }
  const end = performance.now();
  console.log(`Middleware execution time ${end - start}ms`);
  return next();
});
