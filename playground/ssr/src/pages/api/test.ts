import type { APIRoute } from "astro";

export const GET: APIRoute = ({ request }) => {
  return new Response(
    JSON.stringify({
      path: new URL(request.url).pathname,
    })
  );
};
export const POST: APIRoute = async ({ request }) => {
  return new Response(
    JSON.stringify({
      body: await request.json(),
    })
  );
};
