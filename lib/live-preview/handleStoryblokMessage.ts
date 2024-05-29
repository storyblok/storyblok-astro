let timeout;

export async function handleStoryblokMessage(event) {
  const { action, story } = event || {};

  if (action === "input" && story) {
    // Debounce the getNewHTMLBody function
    const debouncedGetNewHTMLBody = async () => {
      const t0 = performance.now();
      const newBody = await getNewHTMLBody(story);
      const t1 = performance.now();
      console.log(`getNewHTMLBody took ${t1 - t0} milliseconds.`);
      const currentBody = document.body;
      if (newBody.outerHTML === currentBody.outerHTML) return;
      // Get current focused element in Storyblok
      const focusedElem = document.querySelector('[data-blok-focused="true"]');
      updateDOMWithNewBody(currentBody, newBody, focusedElem);
      const t2 = performance.now();
      console.log(`updateDOMWithNewBody took ${t2 - t1} milliseconds.`);
      console.log(`total time took ${t2 - t0} milliseconds.`);
    };

    // Execute the debounced function after a delay
    const debounceDelay = 1500; // Adjust the delay as needed
    clearTimeout(timeout);
    timeout = setTimeout(debouncedGetNewHTMLBody, debounceDelay);
  }

  if (["published", "change"].includes(event?.data?.action)) {
    location.reload();
  }
}

// export async function handleStoryblokMessage(event) {
//   const t0 = performance.now();
//   const { action, story } = event || {};
//   //in the case of input event
//   if (action === "input" && story) {
//     const newBody = await getNewHTMLBody(story);
//     const t1 = performance.now();
//     console.log(`getNewHTMLBody took ${t1 - t0} milliseconds.`);
//     const currentBody = document.body;
//     if (newBody.outerHTML === currentBody.outerHTML) return;
//     //Get current focused element in storyblok
//     const focusedElem = document.querySelector('[data-blok-focused="true"]');
//     updateDOMWithNewBody(currentBody, newBody, focusedElem);
//     const t2 = performance.now();
//     console.log(`updateDOMWithNewBody took ${t2 - t1} milliseconds.`);
//     console.log(`total time took ${t2 - t0} milliseconds.`);
//   } else if (["published", "change"].includes(event?.data?.action)) {
//     location.reload();
//   }
// }
function updateDOMWithNewBody(currentBody, newBody, focusedElem) {
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
      console.log("Doing partial replace");
      focusedElem.replaceWith(newDomFocusElem);
    }
  } else {
    //We can make this part even better
    // const allStoryblokElem =
    //   document.querySelectorAll('[data-blok-uid]')
    // console.log({ allStoryblokElem })

    console.log("Doing full replace");
    currentBody.replaceWith(newBody);
  }
}

async function getNewHTMLBody(story) {
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
