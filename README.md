# Generation 2 migration demo

A small train booking app built with **DB UX Design System – Generation 2 (aka DB UI)** and a few components the team built itself. It is the starting point for the migration sessions: you migrate it to **Generation 3** yourself, with an AI agent and the [DB UX MCP Server](https://www.npmjs.com/package/@db-ux/mcp-server) doing the groundwork.

> [!IMPORTANT]
> This repository is a demo. The Generation 2 packages are outdated on purpose and are not updated. Dependabot is disabled for this repository, so security alerts for these dependencies are expected and not handled. Do not use this code as a template for production.

## What's inside

Two pages and three self-built components:

| File                                | Content                                                                                         |
| ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| `src/App.tsx`                       | Header with brand, main navigation and meta link, footer, page switch via URL hash              |
| `src/SearchPage.tsx`                | Search form: inputs, select, radios, checkbox, toggle, textarea, buttons, loading state, offers |
| `src/ResultsPage.tsx`               | Results: breadcrumb, notification, chips, sorting, tabs, cards, tags, fare table, dialog        |
| `src/components/ActionButton.tsx`   | Self-built button with variants and sizes                                                       |
| `src/components/DropdownSelect.tsx` | Self-built select made of `div`s and a list                                                     |
| `src/components/OfferCard.tsx`      | Self-built teaser card with image, badge and price                                              |
| `src/styles.css`                    | App styles with hard-coded values, old color tokens, `box-shadow` and `opacity`                 |
| `src/main.tsx`                      | Entry point, loads the Generation 2 CSS                                                         |

The code mixes the three ways interfaces were built in real projects:

- **CSS classes** from `@db-ui/core`: `elm-*`, `cmp-*` and `rea-*`
- **React wrappers** from `@db-ui/react-elements`: `DbButton`, `DbInput`, … (Web Components from `@db-ui/elements` under the hood)
- **Self-built components** with hex colors, pixel values and Generation 2 base colors. There is no deterministic mapping for them, so the agent has to find out what each one is.

Screenshots of the Generation 2 state: [search](docs/screenshots/generation-2-search.png), [results](docs/screenshots/generation-2-results.png).

## What makes this migration interesting

The app code contains no hints, so you migrate it like a real project.

| Topic                                        | Why it needs your attention                                                                          |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Header with main navigation                  | Becomes the Shell with Control Panel Desktop and Mobile. Their position is a layout decision         |
| Form fields as React wrappers                | Renamed components and props (`description`, `input_id`, `htmlid`), toggle becomes Switch           |
| Native select with CSS classes               | Turns into the Select component                                                                      |
| Button variants, sizes and icon-only button  | Variants are renamed, sizes are gone (use Density), icon-only uses `noText`                          |
| Old icon names                               | Many icons are renamed, for example `search` → `magnifying_glass`                                    |
| Self-built button, select and card           | No mapping exists. The agent classifies them, ideally in the browser, and you confirm the result     |
| Custom CSS and inline styles                 | Pixel values, hex colors, old color tokens, `box-shadow` and `opacity` bypass theming and Dark Mode |
| Breadcrumb, notification, chips, tabs        | Different component structure or props in Generation 3                                               |
| Table, dialog, loading state, footer         | New structure with subcomponents, dialog behavior and focus, screen reader announcements             |

After the migration, the agent lists the open decisions and checks. The same list is on the Design System platform under [Check what the agent can't decide](https://db-ux-design-system.github.io/documentation/learn/migration#check-what-the-agent-cant-decide).

## Prerequisites

- Node.js 26 (see `.nvmrc`) with npm 11 or 12
- [Kiro](https://kiro.dev) or VS Code with GitHub Copilot
- Google Chrome, for the Chrome DevTools MCP that lets the agent look at the running app
- For Generation 3 with the DB Theme: the asset keys `ASSET_PASSWORD` and `ASSET_INIT_VECTOR` from the [Marketingportal](https://marketingportal.extranet.deutschebahn.com/marketingportal/Design-Anwendungen/db-ux-design-system/resources/db-theme) (DB and contractors only). Deep links into the Marketingportal don't work, so open the link again after you log in.

> [!IMPORTANT]
> `@db-ux/db-theme` ships its fonts, icons and images encrypted. Without the asset keys they stay encrypted, and the Generation 3 build fails. This also applies to the reference branch `generation-3`. See [step 4](#4-install-the-generation-3-packages) for the setup.

## Run the Generation 2 app

```sh
nvm use
npm ci
npm run dev
```

Open <http://localhost:5173>. Keep the app running during the migration, so the agent can inspect it.

## Migrate it yourself

### 1. Create your own branch

```sh
git switch -c migration-<your-name>
```

### 2. Connect the MCP servers

The configuration is already in the repository. It starts two servers:

- `db-ux`: the DB UX MCP Server with the migration tools and guides
- `chrome-devtools`: the [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp). It opens the app in a separate Chrome with a temporary profile, so the agent can take screenshots and read the accessibility tree of the self-built components.

Where the configuration lives:

- **Kiro:** `.kiro/settings/mcp.json`. Open the MCP Server view in the Kiro panel and check that both servers are connected. Read-only tools are approved automatically, everything else asks you first.
- **GitHub Copilot in VS Code:** `.mcp.json` in the project root. Run "MCP: List Servers" from the command palette and start both servers. `.vscode/mcp.json` stays for older VS Code setups.

The Chrome DevTools MCP officially supports Google Chrome only. To use Microsoft Edge instead, add `--executablePath=<path to msedge>` to its arguments, at your own risk.

Ask the agent "Which DB UX tools do you have?" to confirm the connection.

### 3. Plan and scan before you change anything

```text
I want to migrate this app to DB UX Design System Generation 3.
Start with plan_migration, ask me what you need to know, then scan every
file in src/ and package.json and summarize the findings per file.
Do not change any code yet.
```

`plan_migration` asks about the kind of application, the framework, what the interface is built with, the DB Theme and whether the app runs locally. It then returns the steps that fit. For the self-built components, the agent looks at them in the browser and shows you a table of what it thinks each one is. Check the table before you continue.

### 4. Install the Generation 3 packages

```sh
npm uninstall @db-ui/core @db-ui/react-elements
npm install --save-exact @db-ux/react-core-components @db-ux/db-theme
```

Create a `.env` file in the project root with the asset keys from the Marketingportal. The file is git-ignored, so never commit it.

```env
ASSET_PASSWORD=<value from the Marketingportal>
ASSET_INIT_VECTOR=<value from the Marketingportal>
```

The install scripts of the theme packages decrypt fonts, icons and images. npm 11 runs them and only warns. npm 12 blocks them until you allow them:

```sh
npm install-scripts approve @db-ux/db-theme @db-ux/db-theme-fonts @db-ux/db-theme-icons
npm rebuild @db-ux/db-theme @db-ux/db-theme-fonts @db-ux/db-theme-icons
```

Run the same `npm rebuild` command if you add or fix the `.env` after the install.

The decryption worked if `node_modules/@db-ux/db-theme-fonts/build/assets/` contains `.woff2` files and not only `.woff2.enc` files.

The DB Theme CSS references its assets as `@db-ux/...` paths. Add an alias in `vite.config.ts` so Vite can resolve them:

```ts
import * as path from 'node:path';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@db-ux': path.resolve('node_modules/@db-ux')
		}
	}
});
```

### 5. Migrate file by file

Start with `main.tsx`, then `styles.css`, then the self-built components, then the pages. For each file:

```text
Migrate src/SearchPage.tsx to DB UX Design System Generation 3 for React.
Follow the plan, keep the behavior, verify the result with
verify_migrated_code and end with the open decisions and checks.
```

Review every change. The agent maps components, props, tokens and icons, but some decisions stay with you:

- **Layout:** where the Control Panel sits
- **Self-built components:** whether the DB UX component the agent picked is the right one, and what happens to a component without an equivalent
- **Visual intent:** whether a hard-coded value was a design decision or a workaround
- **Behavior:** form handling and events, because the Web Components did part of it for you

### 6. Check the result

```sh
npm run build
npm run dev
```

Go through the open decisions and checks the agent listed. Compare the migrated pages with the [screenshots of the Generation 2 state](#whats-inside), or let the agent do it with the Chrome DevTools MCP.

### 7. Compare with the reference

The branch [`generation-3`](../../tree/generation-3) contains a migrated and manually reviewed version.

```sh
git diff generation-3 -- src
```

## After the session

- [Move from DB UI to Generation 3](https://db-ux-design-system.github.io/documentation/learn/migration) on the Design System platform
- [Migration Guides](https://db-ux-design-system.github.io/documentation/releases/migration-guides) for each major version of Generation 3

## License

The source code is licensed under Apache 2.0. DB specific design assets like fonts, icons and the logo are covered by the DB Designs License, see [LICENSE](LICENSE).
