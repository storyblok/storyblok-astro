import StoryblokClient from "storyblok-js-client";

const customApiPlugin = (options) => {
  const { apiOptions } = options;

  if (!apiOptions.accessToken) {
    console.error(
      "You need to provide an access token to interact with Storyblok API. Read https://www.storyblok.com/docs/api/content-delivery#topics/authentication"
    );
    return;
  }

  console.log("custom plugin being loaded");

  const storyblokApi = new StoryblokClient(apiOptions);
  return { storyblokApi };
};

export default customApiPlugin;
