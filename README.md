# Slayed Shopify Starter Theme

## Shopify CLI

To easily log into your preferred store and theme, create a `shopify.theme.toml` in the root directory and define your environement details.

Example:

```toml
[environments.development]
store = "slayed-starter"
theme = "123123123"

[environments.staging]
store = "smmtoutdoor"
theme = "123123123"
ignore = ["templates/*", "config/*"]

[environments.production]
store = "slayed-starter"
theme = "123123123"
```

### Commands

| Command       | Purpose           | Notes  |
| ------------- |:-------------:| -----:|
| `npm run start`   | Develop with local dev server with live reload| See [Development Themes](https://shopify.dev/docs/themes/tools/cli#development-themes) |
| `npm run deploy`     | Build and push to Shopify theme (interactive)      |   $12 |
| `npm run deploy:dev` | Build and push to development environment theme (non-interactive)     | Uses **shopify.theme.toml** config |
| `npm run deploy:staging` | Build and push to staging environment theme (non-interactive)  | Does overrite remote themes section/theme content |
| `npm run deploy:new` | Build and publish to new theme on Shopify (interactive) |     |

For all other NPM scripts and Shopify CLI theme commands reference **package.json** and [Shopify CLI commands for themes](https://shopify.dev/docs/themes/tools/cli/commands)

> As of Apr 27, 2023:
> Shopify CLI is yet to be as feature filled as most would like. Configuring the dev
> server to do things like not open a new window on initial run around available out of
> the box. See the above link to see all that it can do.
