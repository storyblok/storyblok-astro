import { defineMiddleware } from 'astro/middleware';

export const onRequest = defineMiddleware(async ({ locals, request }, next) => {
  if (request.method === 'POST') {
    const url = new URL(request.url);
    // First do a basic check if its coming from within storyblok
    const isStoryblokRequest
      = url.searchParams.has('_storyblok')
      && url.searchParams.has('_storyblok_c');

    if (isStoryblokRequest) {
      try {
        // Create a copy of the request
        const requestBody = await request.clone().json();
        if (requestBody && requestBody.is_storyblok_preview) {
          locals._storyblok_preview_data = requestBody;
        }
      }
      catch (error) {
        console.error('Error reading request body:', error);
      }
    }
  }
  return next();
});
