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

## Live Demo

If you are in a hurry, check out our official **[live demo](https://stackblitz.com/edit/astro-sdk-demo)** on StackBlitz.

## Usage

> If you are first-time user of Storyblok, read the [Getting Started](https://www.storyblok.com/docs/guide/getting-started?utm_source=github.com&utm_medium=readme&utm_campaign=storyblok-astro) guide to get a project ready in less than 5 minutes.

## Installation

Install `@storyblok/astro`:

```bash
npm install @storyblok/astro
# yarn add @storyblok/astro
# See below for pnpm
```

> **Note**  
> With pnpm, hoist Storyblok dependencies publicly with `.npmrc`. For more information, check pnpm documentation on [here](https://pnpm.io/npmrc).

Add the following code to `astro.config.mjs` and replace the `accessToken` with the preview API token of your Storyblok space.

```js
import { defineConfig } from "astro/config";
import storyblok from "@storyblok/astro";

export default defineConfig({
  integrations: [
    storyblok({
      accessToken: "<your-access-token>",
    }),
  ],
});
```

> **Warning**  
> This SDK uses the Fetch API under the hood. If your environment doesn't support it, you need to install a polyfill like [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch). More info on [storyblok-js-client docs](https://github.com/storyblok/storyblok-js-client#fetch-use-polyfill-if-needed---version-5).

### Options

When you initialize the integration, you can pass all [_@storyblok/js_ options](https://github.com/storyblok/storyblok-js#features-and-api).

```js
// Defaults
storyblok({
  accessToken: "<your-access-token>",
  bridge: true,
  apiOptions: {}, // storyblok-js-client options
  components: {},
  componentsDir: "src",
  enableFallbackComponent: false,
  customFallbackComponent: "",
  useCustomApi: false,
});
```

> **Note**  
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

> **Warning**  
> For spaces created in the United States or China, the `region` parameter **must** be specified.

## Getting started

### 1. Creating and linking your components to the Storyblok Visual Editor

In order to link your Astro components to their equivalents you created in Storyblok:

First, you need to load them globally by specifying their name and their path in `astro.config.mjs`:

```js
components: {
  page: "storyblok/Page",
  feature: "storyblok/Feature",
  grid: "storyblok/Grid",
  teaser: "storyblok/Teaser",
},
```

> **Note**  
> The `src` folder is automatically added to the beginning of the path, so in this example your Astro components should be located here:
>
> - `src/storyblok/Page.astro`
> - `src/storyblok/Feature.astro`
> - `src/storyblok/Grid.astro`
> - `src/storyblok/Teaser.astro`
>
> You can choose any other folder in the `src` directory for your Astro components.

> **Note**
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

Finally, you can use the provided `<StoryblokComponent>` for nested components; it will automatically render them (if they have been registered globally beforehand):

```jsx
---
import { storyblokEditable } from "@storyblok/astro";
import StoryblokComponent from "@storyblok/astro/StoryblokComponent.astro";

const { blok } = Astro.props
---

<main {...storyblokEditable(blok)}>
  {blok.body?.map(blok => {return <StoryblokComponent blok="{blok}" />})}
</main>
```

> **Note**  
> The `blok` is the actual blok data coming from [Storblok's Content Delivery API](https://www.storyblok.com/docs/api/content-delivery/v2?utm_source=github.com&utm_medium=readme&utm_campaign=storyblok-astro).

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

<StoryblokComponent blok="{story.content}" />
```

> **Note**  
> The available methods are described in the [storyblok-js-client] repository(https://github.com/storyblok/storyblok-js-client#method-storyblokget)

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

<StoryblokComponent blok="{story.content}" />
```

### Using the Storyblok Bridge

The Storyblok Bridge is enabled by default. If you would like to disable it or enable it conditionally (e.g. depending on the environment) you can set the `bridge` parameter to `true` or `false` in `astro.config.mjs`:

> **Note**  
> Since Astro is not a reactive JavaScript framework and renders everything as HTML, the Storyblok Bridge will not provide real-time editing as you may know it from other frameworks. However, it automatically refreshes the site for you whenever you save or publish a story.

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

> **Note**  
> `resolveRelations` and `resolveLinks` will not have any effect in Astro, since the Storyblok Bridge is configured to reload the page. Thus, all the requests needed will be performed after the reload.

The provided options will be used when initializing the Storyblok Bridge. You can find more information about the Storyblok Bridge and its configuration options on the [In Depth Storyblok Bridge guide](https://www.storyblok.com/docs/guide/in-depth/storyblok-latest-js-v2?utm_source=github.com&utm_medium=readme&utm_campaign=storyblok-astro).

If you want to deploy a dedicated preview environment with the Bridge enabled, allowing users of the Storyblok CMS to see their changes being reflected on the frontend directly without having to rebuild the static site, you can enable Server Side Rendering for that particular use case. More information can be found in the [Astro Docs](https://docs.astro.build/en/guides/server-side-rendering/).

### Rendering Rich Text

> **Note**  
> While @storyblok/astro provides basic richtext rendering capabilities, for advanced use cases, it is highly recommended to use [storyblok-rich-text-astro-renderer](https://github.com/NordSecurity/storyblok-rich-text-astro-renderer).

You can easily render rich text by using either the `renderRichText` function or the `<RichTextRenderer />` component, both of which are included in `@storyblok/astro`.
Use `renderRichText`, which only supports parsing and returning native HTML tags, if you are not embedding `bloks` in your rich text. Then you can use the [`set:html` directive](https://docs.astro.build/en/reference/directives-reference/#sethtml):

```jsx
---
import { renderRichText } from "@storyblok/astro";

const { blok } = Astro.props

const renderedRichText = renderRichText(blok.text)
---

<div set:html="{renderedRichText}"></div>
```

Use the `<RichTextRenderer />` component if you are embedding `bloks` in your rich text:

```jsx
---
import RichTextRenderer from "@storyblok/astro/RichTextRenderer.astro";

const { blok } = Astro.props
---

<RichTextRenderer richTextData={blok.richtext} />
```

You can also set a **custom Schema and component resolver** by passing the options as the second parameter of the `renderRichText` function:

```jsx
import { RichTextSchema, renderRichText } from "@storyblok/astro";
import cloneDeep from "clone-deep";

const mySchema = cloneDeep(RichTextSchema); // you can make a copy of the default RichTextSchema
// ... and edit the nodes and marks, or add your own.
// Check the base RichTextSchema source here https://github.com/storyblok/storyblok-js-client/blob/v4/source/schema.js

const { blok } = Astro.props;

const renderedRichText = renderRichText(blok.text, {
  schema: mySchema,
  resolver: (component, blok) => {
    switch (component) {
      case "my-custom-component":
        return `<div class="my-component-class">${blok.text}</div>`;
        break;
      default:
        return `Component ${component} not found`;
    }
  },
});
```

The same can be done with the `<RichTextRenderer />` component by passing along the options via the `richTextOptions` prop:

```jsx
---
import { RichTextSchema } from "@storyblok/astro";
import RichTextRenderer from "@storyblok/astro/RichTextRenderer.astro";

import cloneDeep from "clone-deep";

const mySchema = cloneDeep(RichTextSchema); // you can make a copy of the default RichTextSchema
// ... and edit the nodes and marks, or add your own.
// Check the base RichTextSchema source here https://github.com/storyblok/storyblok-js-client/blob/v4/source/schema.js

const { blok } = Astro.props;

const options = {
  schema: mySchema,
  resolver: (component, blok) => {
    switch (component) {
      case "my-custom-component":
        return `<div class="my-component-class">${blok.text}</div>`;
        break;
      default:
        return `Component ${component} not found`;
    }
  },
};
---

<RichTextRenderer richTextData={blok.richtext} richTextOptions={options} />

```

> **Note**  
> Please be aware that the `<RichTextRenderer />` component is **not** supported when using Astro v1. Make sure to use Astro v2 or v3.

## API

### useStoryblokApi()

Returns the instance of the `storyblok-js-client`.

## Enabling Live Preview for Storyblok's Visual Editor

> **Warning**  
> This feature is currently experimental and optional. You may encounters bugs or performance issues.

The Astro SDK now provides a live preview feature, designed to offer real-time editing capabilities for an enhanced user experience in Storyblok's Visual Editor.

To activate the experimental live preview feature, follow these steps:

1. Set `livePreview` to `true` within your `astro.config.mjs` file.

```js
//astro.config.mjs
export default defineConfig({
  integrations: [
    storyblok({
      accessToken: "OsvN..",
      livePreview: true,
    }),
  ],
});
```

2. Additionally, please use `useStoryblok` on your Astro pages for story fetching. This replaces the previously used `useStoryblokApi` method.

```jsx
//pages/[...slug].astro
---
import { useStoryblok } from "@storyblok/astro";
import StoryblokComponent from "@storyblok/astro/StoryblokComponent.astro";

const { slug } = Astro.params;

const story = await useStoryblok(
  // The slug to fetch
  `cdn/stories/${slug === undefined ? "home" : slug}`,
  // The API options
  {
    version: "draft",
  },
  // The Bridge options (optional, if an empty object, null, or false are set, the API options will be considered automatically as far as applicable)
  {},
  // The Astro object (essential for the live preview functionality)
  Astro
);
---

<StoryblokComponent blok={story.content} />
```

## The Storyblok JavaScript SDK Ecosystem

![A visual representation of the Storyblok JavaScript SDK Ecosystem](https://a.storyblok.com/f/88751/2400x1350/be4a4a4180/sdk-ecosystem.png/m/1200x0)

## Acknowledgements

A huge thank you goes to the Astro Team. In particular to [Tony Sullivan](https://github.com/tony-sull), who has provided extraordinary support and made _automagically_ rendering Storyblok components a reality.

## Related Links

- **[Live Demo on Stackblitz](https://stackblitz.com/edit/astro-sdk-demo)**
- **[Storyblok CLI](https://github.com/storyblok/storyblok)**: A simple CLI for scaffolding Storyblok projects.

## More Resources

### Support

- Bugs or Feature Requests? [Submit an issue](/../../issues/new);
- Do you have questions about this SDK? Or would you like to join the growing community of `@storyblok/astro` users? [Join the Astro Discord Community](https://discord.com/channels/830184174198718474/1002802280267001858)
- Do you have questions about Storyblok or do you need help? [Join the Storyblok Discord Community](https://discord.gg/jKrbAMz).

### Contributing

Please see our [contributing guidelines](https://github.com/storyblok/.github/blob/master/contributing.md) and our [code of conduct](https://www.storyblok.com/trust-center#code-of-conduct?utm_source=github.com&utm_medium=readme&utm_campaign=storyblok-astro).
This project uses [semantic-release](https://semantic-release.gitbook.io/semantic-release/) for generating new versions by using commit messages. We use the Angular Convention to name the commits.
