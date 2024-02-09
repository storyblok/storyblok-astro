export const fetchAstroPage = async (content: any = null) => {
  const replaceWith =
    window.location.pathname === "/storyblok-preview/" ? "" : "/";
  const result = await fetch(
    window.location.href.replace("/storyblok-preview", replaceWith), // for nested pages
    content
      ? {
          method: "POST",
          body: JSON.stringify({
            ...content,
            is_storyblok_preview: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      : { method: "GET" }
  );

  const html = await result.text();

  return html;
};
