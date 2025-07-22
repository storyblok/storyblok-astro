> [!IMPORTANT]
> **📦 Package Migration Notice**
> 
> This package has been migrated to the [Storyblok monorepo](https://github.com/storyblok/monoblok). 
> 
> **⚠️ This repository has been archived and is no longer maintained. Development has moved to the monorepo.**
> 
> **New Location**: You can now find this package at [packages/astro](https://github.com/storyblok/monoblok/tree/main/packages/astro)
> 
> Please visit the monorepo for the latest updates, issues, and contributions.

<div align="center">
	<a  href="https://www.storyblok.com?utm_source=github.com&utm_medium=readme&utm_campaign=storyblok-astro" align="center">
		<img src="https://a.storyblok.com/f/88751/1500x500/7974d6bc34/storyblok-astro.png#1" width="300" height="100" alt="Storyblok + Astro">
	</a>
	<h1 align="center">@storyblok/astro</h1>
	<p align="center">Astro integration for the <a href="http://www.storyblok.com?utm_source=github.com&utm_medium=readme&utm_campaign=storyblok-astro" target="_blank">Storyblok</a> Headless CMS.</p> <br />
</div>

<p align="center">
  <a href="https://npmjs.com/package/@storyblok/astro">
    <img src="https://img.shields.io/npm/v/@storyblok/astro/latest.svg?style=flat-square" alt="Storyblok Astro" />
  </a>
  <a href="https://npmjs.com/package/@storyblok/astro" rel="nofollow">
    <img src="https://img.shields.io/npm/dt/@storyblok/astro.svg?style=flat-square" alt="npm">
  </a>
  </p>

<p align="center">
  <a href="https://discord.gg/jKrbAMz">
   <img src="https://img.shields.io/discord/700316478792138842?label=Join%20Our%20Discord%20Community&style=appveyor&logo=discord&color=09b3af">
   </a>
  <a href="https://twitter.com/intent/follow?screen_name=storyblok">
    <img src="https://img.shields.io/badge/Follow-%40storyblok-09b3af?style=appveyor&logo=twitter" alt="Follow @Storyblok" />
  </a><br/>
  <a href="https://app.storyblok.com/#!/signup?utm_source=github.com&utm_medium=readme&utm_campaign=storyblok-astro">
    <img src="https://img.shields.io/badge/Try%20Storyblok-Free-09b3af?style=appveyor&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAHqADAAQAAAABAAAAHgAAAADpiRU/AAACRElEQVRIDWNgGGmAEd3D3Js3LPrP8D8WXZwSPiMjw6qvPoHhyGYwIXNAbGpbCjbzP0MYuj0YFqMroBV/wCxmIeSju64eDNzMBJUxvP/9i2Hnq5cM1devMnz984eQsQwETeRhYWHgIcJiXqC6VHlFBjUeXgav40cIWkz1oLYXFmGwFBImaDFBHyObcOzdW4aSq5eRhRiE2dgYlpuYoYSKJi8vw3GgWnyAJIs/AuPu4scPGObd/fqVQZ+PHy7+6udPOBsXgySLDfn5GRYYmaKYJcXBgWLpsx8/GPa8foWiBhuHJIsl2DkYQqWksZkDFgP5PObcKYYff//iVAOTIDlx/QPqRMb/YSYBaWlOToZIaVkGZmAZSQiQ5OPtwHwacuo4iplMQEu6tXUZMhSUGDiYmBjylFQYvv/7x9B04xqKOnQOyT5GN+Df//8M59ASXKyMHLoyDD5JPtbj42OYrm+EYgg70JfuYuIoYmLs7AwMjIzA+uY/zjAnyWJpDk6GOFnCvrn86SOwmsNtKciVFAc1ileBHFDC67lzG10Yg0+SjzF0ownsf/OaofvOLYaDQJoQIGix94ljv1gIZI8Pv38zPvj2lQWYf3HGKbpDCFp85v07NnRN1OBTPY6JdRSGxcCw2k6sZuLVMZ5AV4s1TozPnGGFKbz+/PE7IJsHmC//MDMyhXBw8e6FyRFLv3Z0/IKuFqvFyIqAzd1PwBzJw8jAGPfVx38JshwlbIygxmYY43/GQmpais0ODDHuzevLMARHBcgIAQAbOJHZW0/EyQAAAABJRU5ErkJggg==" alt="Follow @Storyblok" />
  </a>
</p>

## Kickstart a new project

Are you eager to dive into coding? **[Follow these steps to kickstart a new project with Storyblok and Astro](https://www.storyblok.com/technologies?utm_source=github.com&utm_medium=readme&utm_campaign=storyblok-astro#astro)**, and get started in just a few minutes!

## Ultimate Tutorial

Are you looking for a hands-on, step-by-step tutorial? The **[Astro Ultimate Tutorial](https://www.storyblok.com/tp/the-storyblok-astro-ultimate-tutorial?utm_source=github.com&utm_medium=readme&utm_campaign=storyblok-astro)** has you covered! It provides comprehensive instructions on building a complete, multilingual website using Storyblok and Astro from start to finish.

## Installation

Install `@storyblok/astro`:

```bash
npm install @storyblok/astro
# yarn add @storyblok/astro
# See below for pnpm
```

> [!NOTE]  
> With pnpm, hoist Storyblok dependencies publicly with `.npmrc`. For more information, please refer to the [pnpm documentation](https://pnpm.io/npmrc).

Add the following code to `astro.config.mjs` and replace the `accessToken` with the preview API token of your Storyblok space.

```js
import { defineConfig } from "astro/config";
import { storyblok } from "@storyblok/astro";

export default defineConfig({
  integrations: [
    storyblok({
      accessToken: "<your-access-token>",
    }),
  ],
});
```

> [!WARNING]
> This SDK uses the Fetch API under the hood. If your environment doesn't support it, you need to install a polyfill like [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch). More info on [storyblok-js-client docs](https://github.com/storyblok/storyblok-js-client#fetch-use-polyfill-if-needed---version-5).

### Options

When you initialize the integration, you can pass all [_@storyblok/js_ options](https://github.com/storyblok/storyblok-js#features-and-api).

```js
// Defaults
storyblok({
  accessToken: "<your-access-token>",
  bridge: true,
  livePreview: false,
  apiOptions: {}, // storyblok-js-client options
  components: {},
  componentsDir: "src",
  enableFallbackComponent: false,
  customFallbackComponent: "",
  useCustomApi: false,
});
```

> [!NOTE]  
> By default, the `apiPlugin` from `@storyblok/js` is loaded. If you want to use your own method to fetch data from Storyblok, you can disable this behavior by setting `useCustomApi` to `true`, resulting in an optimized final bundle.

#### Region parameter

Possible values:

- `eu` (default): For spaces created in the EU
- `us`: For spaces created in the US
- `ca`: For spaces created in Canada
- `ap`: For spaces created in Australia
- `cn`: For spaces created in China

Full example for a space created in the US:

```js
storyblok({
  accessToken: "<your-access-token>",
  apiOptions: {
    region: "us",
  },
});
```

> [!WARNING]
> The `region` parameter **must** be specified unless the space was created in the EU.

## Getting started

### 1. Creating and linking your components to the Storyblok Visual Editor

Link your Astro components to their equivalents created in Storyblok with the following steps.

First, load the components globally by specifying their name and their path in `astro.config.mjs`:

```js
components: {
  page: "storyblok/Page",
  feature: "storyblok/Feature",
  grid: "storyblok/Grid",
  teaser: "storyblok/Teaser",
},
```

> [!NOTE]  
> The `src` folder is automatically added to the beginning of the path, so in this example your Astro components should be located here:
>
> - `src/storyblok/Page.astro`
> - `src/storyblok/Feature.astro`
> - `src/storyblok/Grid.astro`
> - `src/storyblok/Teaser.astro`
>
> You can choose any other folder in the `src` directory for your Astro components.

> [!NOTE]
> If you prefer to use a different folder than `src`, you can specify one using the `componentsDir` option:
>
> ```js
> storyblok({
>   componentsDir: "app",
> });
> ```
>
> Now, your Storyblok components can be located anywhere in the `app` folder, e.g. `page: "storyblok/Page"` for `app/storyblok/Page.astro` or `page: "Page"` for `app/Page.astro`.

For each component, use the `storyblokEditable()` function on its root element, passing the `blok` property that they receive:

```jsx
---
import { storyblokEditable } from "@storyblok/astro";

const { blok } = Astro.props
---

<div {...storyblokEditable(blok)}>
  <h2>{blok.headline}</h2>
</div>
```

Finally, you can use the provided `<StoryblokComponent>` for nested components; it will automatically render them (if they are registered globally):

```jsx
---
import { storyblokEditable } from "@storyblok/astro";
import StoryblokComponent from "@storyblok/astro/StoryblokComponent.astro";

const { blok } = Astro.props
---

<main {...storyblokEditable(blok)}>
  {blok.body?.map(blok => {return <StoryblokComponent blok={blok} />})}
</main>
```

> [!NOTE]  
> The `blok` is the actual blok data coming from [Storyblok's Content Delivery API](https://www.storyblok.com/docs/api/content-delivery/v2?utm_source=github.com&utm_medium=readme&utm_campaign=storyblok-astro).

#### Using fallback components

By default, `@storyblok/astro` throws an error if a component is not implemented. Setting `enableFallbackComponent` to `true` bypasses that behavior, rendering a fallback component in the frontend instead. You can also use a custom fallback component by (for example) setting `customFallbackComponent: "storyblok/MyCustomFallback"`.

#### Using partial hydration

If you want to use partial hydration with any of the [frameworks supported by Astro](https://docs.astro.build/en/guides/integrations-guide/#article), follow these steps:

1. [Install the official Astro integration for your desired framework](https://docs.astro.build/en/guides/integrations-guide/#automatic-integration-setup)
2. Create an Astro component that serves as a wrapper and utilizes the most suitable [client directive](https://docs.astro.build/en/reference/directives-reference/#client-directives)
3. Create the actual component in Vue, Svelte, React or any other supported framework

For working examples, please refer to the [Live Demo on Stackblitz](https://stackblitz.com/edit/astro-sdk-demo).

### 2. Getting Storyblok Stories and using the Storyblok Bridge

#### Fetching one Story

Use the `useStoryblokApi` function to have access to an instance of `storyblok-js-client`:

```jsx
---
import { useStoryblokApi } from "@storyblok/astro";
import StoryblokComponent from "@storyblok/astro/StoryblokComponent.astro";

const storyblokApi = useStoryblokApi();
const { data } = await storyblokApi.get("cdn/stories/home", {
  version: "draft",
});

const story = data.story;
---

<StoryblokComponent blok={story.content} />
```

> [!NOTE]  
> The available methods are described in the [storyblok-js-client](https://github.com/storyblok/storyblok-js-client#method-storyblokget) repository.

#### Dynamic Routing

In order to dynamically generate Astro pages based on the Stories in your Storyblok Space, you can use the [Storyblok Links API](https://www.storyblok.com/docs/api/content-delivery/v2#core-resources/links/links) and the Astro [`getStaticPaths()` function](https://docs.astro.build/en/reference/api-reference/#getstaticpaths) similar to this example:

```jsx
---
import { useStoryblokApi } from "@storyblok/astro";
import StoryblokComponent from "@storyblok/astro/StoryblokComponent.astro";

export async function getStaticPaths() {
  const storyblokApi = useStoryblokApi();

  const { data } = await storyblokApi.getAll("cdn/links", {
    version: "draft",
  });
  let links = data.links;
  links = Object.values(links);

  return links.map((link) => {
    return {
      params: { slug: link.slug },
    };
  });
}

const { slug } = Astro.params;

const storyblokApi = useStoryblokApi();

const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
  version: "draft",
});

const story = data.story;
---

<StoryblokComponent blok={story.content} />
```

### Using the Storyblok Bridge

The Storyblok Bridge is enabled by default. If you would like to disable it or enable it conditionally (e.g. depending on the environment) you can set the `bridge` parameter to `true` or `false` in `astro.config.mjs`:

You can also provide a `StoryblokBridgeConfigV2` configuration object to the `bridge` parameter.

```ts
bridge: {
  customParent?: string,
  preventClicks?: boolean, // Defaults to false.
  resolveRelations?: strings[],
  resolveLinks?: string
}
```

- `customParent` is used to provide a custom URL for the Storyblok editor iframe.
- `preventClicks` prevents the default behaviour of clicks when inside the Storyblok editor.
- `resolveRelations` may be needed to resolve the same relations that are already resolved in the API requests via the `resolve_relations` parameter.
- `resolveLinks` may be needed to resolve link fields.

> [!NOTE]  
> `resolveRelations` and `resolveLinks` will only become effective if the live preview feature is used (`getLiveStory()`).

The provided options will be used when initializing the Storyblok Bridge. You can find more information about the Storyblok Bridge and its configuration options on the [In Depth Storyblok Bridge guide](https://www.storyblok.com/docs/guide/in-depth/storyblok-latest-js-v2?utm_source=github.com&utm_medium=readme&utm_campaign=storyblok-astro).

If you want to deploy a dedicated preview environment with the Bridge enabled, allowing users of the Storyblok CMS to see their changes being reflected on the frontend directly without having to rebuild the static site, you can enable Server Side Rendering for that particular use case. More information can be found in the [Astro Docs](https://docs.astro.build/en/guides/server-side-rendering/).

## Enabling Live Preview for Storyblok's Visual Editor

The Astro SDK provides a live preview feature, designed to offer real-time editing capabilities for an enhanced user experience in Storyblok's Visual Editor.

> [!NOTE]  
> To utilize the Astro Storyblok Live feature, Astro must be configured to run in SSR mode.

To activate the live preview feature, follow these steps:

1. Set `livePreview` to `true` in your `astro.config.mjs` file.

```js
//astro.config.mjs
export default defineConfig({
  integrations: [
    storyblok({
      accessToken: "OsvN..",
      livePreview: true,
    }),
  ],
  output: "server", // Astro must be configured to run in SSR mode
});
```

2. Additionally, use `getLiveStory` on your Astro pages.

```jsx
//pages/[...slug].astro
---
import { getLiveStory, useStoryblokApi } from '@storyblok/astro';
import StoryblokComponent from "@storyblok/astro/StoryblokComponent.astro";

const { slug } = Astro.params;
let story = null;

const liveStory = await getLiveStory(Astro);
if (liveStory) {
  story = liveStory;
} else {
  const sbApi = useStoryblokApi();
  const { data } = await sbApi.get(`cdn/stories/${slug || 'home'}`, {
    version: 'draft',
    resolve_relations: ['featured-articles.posts'],
  });
  story = data?.story;
}
// If you are using `resolve_relations` or `resolve_links`, you must also pass them to the Bridge configuration in `astro.config.mjs`.  
---

<StoryblokComponent blok={story.content} />
```
## Dom update event

```js
//page.astro

<script>
document.addEventListener('storyblok-live-preview-updated', () => {
  // Here is the callback we could run code every time the body is updated via live preview
  console.log('Live preview: body updated');
  // Example regenerated all your css
});
</script>
```

## Rendering Rich Text 

> [!NOTE]
> The `@storyblok/astro` now provides the exports for the new `richTextResolver` API from `@storyblok/js`. Until a dedicated `StoryblokRichText.astro` is developed, we recommend using the vanilla solution below.

```jsx
---
import { richTextResolver } from "@storyblok/astro";

const renderedRichText = richTextResolver({
  // options like custom resolvers
}).render(doc);
---

<div set:html={renderedRichText}></div>
```

To learn more about the new `richTextResolver` API, please refer to the [storyblok-richtext docs](https://github.com/storyblok/richtext).

Or use the `renderRichText` function to render rich text.

```jsx
---
import { renderRichText } from "@storyblok/astro";

const renderedRichText = renderRichText(data, options);
---

<div set:html={renderedRichText}></div>
```

## API

### useStoryblokApi()

Returns the instance of the `storyblok-js-client`.

## The Storyblok JavaScript SDK Ecosystem

![A visual representation of the Storyblok JavaScript SDK Ecosystem](https://a.storyblok.com/f/88751/2400x1350/be4a4a4180/sdk-ecosystem.png/m/1200x0)

## Acknowledgements

### Astro

We extend our deepest gratitude to the [Astro](https://astro.build/) team, especially Tony Sullivan, [Matthew Philips](https://x.com/matthewcp), and [Nate Moore](https://x.com/n_moore), for their unwavering support in enhancing this integration. Your partnership is immensely valued.

### Virtual Identity

Our heartfelt thanks go to [Virtual Identity](https://www.virtual-identity.com/), one of our closest agency partners. The live preview feature owes its existence to the ingenuity and innovation of their team. Special recognition goes to their developer [Mario Hamann](https://github.com/mariohamann) for his pivotal live preview POC and continuous support.

## Further Resources

- [Quick Start](https://www.storyblok.com/technologies?utm_source=github.com&utm_medium=readme&utm_campaign=storyblok-astro)
- [API Documentation](https://www.storyblok.com/docs/api?utm_source=github.com&utm_medium=readme&utm_campaign=storyblok-astro)
- [Developer Tutorials](https://www.storyblok.com/tutorials?utm_source=github.com&utm_medium=readme&utm_campaign=storyblok-astro)
- [Developer Guides](https://www.storyblok.com/docs/guide/introduction?utm_source=github.com&utm_medium=readme&utm_campaign=storyblok-astro)
- [FAQs](https://www.storyblok.com/faqs?utm_source=github.com&utm_medium=readme&utm_campaign=storyblok-astro)

## Support

- Bugs or Feature Requests? [Submit an issue](/../../issues/new);
- Do you have questions about this SDK? Or would you like to join the growing community of `@storyblok/astro` users? [Join the Astro Discord Community](https://discord.com/channels/830184174198718474/1002802280267001858)
- Do you have questions about Storyblok or do you need help? [Join the Storyblok Discord Community](https://discord.gg/jKrbAMz).

## Contributing

Please review our [Contributing Guidelines](https://github.com/storyblok/.github/blob/master/contributing.md) and [Code of Conduct](https://www.storyblok.com/trust-center?utm_source=github.com&utm_medium=readme&utm_campaign=storyblok-astro#code-of-conduct) before contributing.  

This project employs [semantic-release](https://semantic-release.gitbook.io/semantic-release/) to generate new versions based on commit messages, following the Angular Commit Message Convention.  

When using playgrounds during development, ensure the build is running in watch mode for an efficient workflow.
