# Slayed Shopify Starter Theme

## Shopify CLI

To easily log into your preferred store and theme, create a `shopify.theme.toml` in the root directory and define your environement details.

Example:

```toml
[environments.development]
store = "slayed-starter"
theme = "123123123"

[environments.staging]
store = "slayed-starter"
theme = "123123123"
ignore = ["templates/*", "config/*"]

[environments.production]
store = "slayed-starter"
theme = "123123123"
```

### Commands

| Command       | Purpose           | Notes  |
| ------------- |:-------------:| :-----:|
| `npm run start`   | Develop with local dev server with live reload| See [Development Themes](https://shopify.dev/docs/themes/tools/cli#development-themes) |
| `npm run deploy`     | Build and push to Shopify theme (interactive)      | Command produces a menu to choose theme and confirm. This CAN overwrite the live theme! |
| `npm run deploy:dev` | Build and push to development environment theme (non-interactive)     | Uses **shopify.theme.toml** config |
| `npm run deploy:staging` | Build and push to staging environment theme (non-interactive)  | Does overrite remote themes section/theme content |
| `npm run deploy:new` | Build and publish to new theme on Shopify (interactive) |     |

For all other NPM scripts and Shopify CLI theme commands reference **package.json** and [Shopify CLI commands for themes](https://shopify.dev/docs/themes/tools/cli/commands)

> As of Apr 27, 2023:
> Shopify CLI is yet to be as feature filled as most would like. Configuring the dev
> server to do things like not open a new window on initial run around available out of
> the box. See the above link to see all that it can do.

## Styling Slayed

The standard Tailwind boilerplate is provided.

Additionally, **src/css/global.css** can be used for global styles and is not tree-shaken. Layers and @apply can also be used in this file. This is made possible via [@tailwindcss/nesting](https://www.npmjs.com/package/@tailwindcss/nesting).

## Javascript

Set your project namespace variable within **src/main.js**.

### Alpine.js
[Alpine.js](https://alpinejs.dev/start-here) is included and Alpine magic properties, components, stores, and directives directories exist in **src/alpine**. The modules are auto-registered within **src/main.js**. Reference some of the existing files as to how to export your Alpine modules.

### Vue.js
See **Shopify Theme Lab**'s [example](https://github.com/uicrooks/shopify-theme-lab/blob/main/src/main.js) of how they register Vue.js.

### Static Assets
Static asset files MUST contain the **static** keyword or they will be overritten during the build process. Ex: `myfile.static.jpg`. This is unchanged, only reimplemented for Vite, from [Shopify Theme Labs Assets](https://uicrooks.github.io/shopify-theme-lab-docs/guide/assets.html#static-files).

## Included Goodies

### Predictive Search
The Shopify provided predictive search is already included and just needed to be enabled in the themes customizer. To prevent it from being rendered remove the reference from **theme.liquid**.

### Prodify
Prodify is a Slayed rework of the Shopify Dawn theme's custom element logic for handling variant changes, **HATEOAS**-style content swapping, and more.

The unminified script is found at **shopify/assets/prodify.static.js** and its required attributes are already applied within **shopify/sections/main-product.liquid**.

## Roadmap

- Prodify as NPM module.
- Improve README to include liquid AJAX Cart
