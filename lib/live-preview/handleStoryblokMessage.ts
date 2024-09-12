import type { ISbStoryData } from "@storyblok/js";

let timeout: NodeJS.Timeout;
/**
 * Our current tests indicate that the post request section
 * is the bottleneck in terms of time consumption.
 * We should explore alternative methods to optimize
 * this process and improve efficiency.
 */
export async function handleStoryblokMessage(event: {
  action: string;
  story: ISbStoryData;
}) {
  const { action, story } = event || {};

  if (action === "input" && story) {
    // Debounce the getNewHTMLBody function
    const debouncedGetNewHTMLBody = async () => {
      const newBody = await getNewHTMLBody(story);
      const currentBody = document.body;
      if (newBody.outerHTML === currentBody.outerHTML) return;
      // Get current focused element in Storyblok
      const focusedElem = document.querySelector('[data-blok-focused="true"]');
      updateDOMWithNewBody(currentBody, newBody, focusedElem);
    };
    const debounceDelay = 500; // Adjust the delay as needed
    clearTimeout(timeout);
    timeout = setTimeout(debouncedGetNewHTMLBody, debounceDelay);
  }

  if (["published", "change"].includes(event?.action)) {
    location.reload();
  }
}

function updateDOMWithNewBody(
  currentBody: HTMLElement,
  newBody: HTMLElement,
  focusedElem: Element | null
) {
  if (focusedElem) {
    //Get the [data-blok-uid] of the focused element in storyblok
    const focusedElementID = focusedElem.getAttribute("data-blok-uid");
    //Now find the same element by above [data-blok-uid] in our new virtual HTML page
    const newDomFocusElem = newBody.querySelector(
      `[data-blok-uid="${focusedElementID}"]`
    );
    if (newDomFocusElem) {
      // Add the [data-blok-focused] attribute to the above element
      newDomFocusElem.setAttribute("data-blok-focused", "true");
      // console.log("Doing partial replace");
      focusedElem.replaceWith(newDomFocusElem);
    }
  } else {
    // console.log("Doing full replace");
    currentBody.replaceWith(newBody);
  }
}

async function getNewHTMLBody(story: ISbStoryData) {
  //TODO How to handel (50x, 405, etc.)
  const result = await fetch(location.href, {
    method: "POST",
    body: JSON.stringify({
      ...story,
      is_storyblok_preview: true,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const html = await result.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body;
}
