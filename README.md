# Generation 2 migration demo

A small train booking app built with **DB UX Design System – Generation 2 (aka DB UI)**. It is the starting point for the migration sessions: you migrate it to **Generation 3** yourself, with an AI agent and the [DB UX MCP Server](https://www.npmjs.com/package/@db-ux/mcp-server) doing the groundwork.

> [!IMPORTANT]
> This repository is a demo. The Generation 2 packages are outdated on purpose and are not updated. Dependabot is disabled for this repository, so security alerts for these dependencies are expected and not handled. Do not use this code as a template for production.

## What's inside

Two pages, seven source files:

| File                     | Content                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| `src/App.tsx`            | Header with brand, main navigation and meta link, page switch via URL hash                     |
| `src/SearchPage.tsx`     | Search form: inputs, select, radios, checkbox, toggle, textarea, buttons                       |
| `src/ResultsPage.tsx`    | Results: breadcrumb, notification, filter chips, tabs, cards, tags, accordion, link            |
| `src/styles.css`         | App styles with hard-coded values, old color tokens, `box-shadow` and `opacity`                |
| `src/main.tsx`           | Entry point, loads the Generation 2 CSS                                                        |
| `src/MigrationHint.tsx`  | Demo-only "Migration hint" button that explains the pitfall next to it                         |
| `src/hints.ts`           | Texts for the hints. Written in plain words, so the scanner does not report this file          |

The code mixes both ways Generation 2 was used in real projects:

- **CSS classes** from `@db-ui/core`: `elm-*`, `cmp-*` and `rea-*`
- **React wrappers** from `@db-ui/react-elements`: `DbButton`, `DbInput`, … (Web Components from `@db-ui/elements` under the hood)

Screenshots of the Generation 2 state: [search](docs/screenshots/generation-2-search.png), [results](docs/screenshots/generation-2-results.png).

## Pitfalls built into the demo

Every pitfall has a **Migration hint** button next to it in the app.

| Pitfall                                     | Why it needs your attention                                                                         |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Header with main navigation                 | Becomes the Shell with a Control Panel. Choosing Desktop, Mobile or Flat Icon is a layout decision  |
| Form fields as React wrappers               | Renamed components and props (`description`, `input_id`, `htmlid`), toggle becomes Switch          |
| Native select with CSS classes              | Turns into the Select component                                                                     |
| Button variants, sizes and icon-only button | Variants are renamed, sizes are gone (use Density), icon-only uses `noText`                         |
| Old icon names                              | Many icons are renamed, for example `search` → `magnifying_glass`                                   |
| Custom CSS and inline styles                | Pixel values, old color tokens, `box-shadow` and `opacity` bypass theming, Density and Dark Mode    |
| Breadcrumb, notification, chips, tabs       | Different component structure or props in Generation 3                                              |
| Cards and accordion                         | Content moves into children, each disclosure becomes an Accordion Item                              |

## Prerequisites

- Node.js 26 (see `.nvmrc`), npm 11
- [Kiro](https://kiro.dev) or VS Code with GitHub Copilot
- For the DB look in Generation 3: the asset keys `ASSET_PASSWORD` and `ASSET_INIT_VECTOR` from the [Marketingportal](https://marketingportal.extranet.deutschebahn.com/marketingportal/Design-Anwendungen/db-ux-design-system/resources/db-theme) (DB and contractors only). Without them the app works with the default theme.

## Run the Generation 2 app

```sh
nvm use
npm ci
npm run dev
```

Open <http://localhost:5173>.

## Migrate it yourself

### 1. Create your own branch

```sh
git switch -c migration-<your-name>
```

### 2. Connect the MCP server

The configuration is already in the repository:

- **Kiro:** `.kiro/settings/mcp.json`. Open the MCP Server view in the Kiro panel and check that `db-ux` is connected.
- **GitHub Copilot in VS Code:** `.vscode/mcp.json`. Run "MCP: List Servers" from the command palette and start `db-ux`.

Ask the agent "Which DB UX tools do you have?" to confirm the connection.

### 3. Scan before you change anything

Let the agent create a migration plan first:

```text
Scan every file in src/ and package.json with scan_generation_2_migration
and summarize the findings per file. Do not change any code yet.
```

### 4. Install the Generation 3 packages

```sh
npm uninstall @db-ui/core @db-ui/react-elements
npm install --save-exact @db-ux/react-core-components @db-ux/db-theme
```

For the DB look, put the asset keys into a `.env` file in the project root (it is git-ignored), then allow the install scripts that decrypt fonts and icons:

```sh
npm install-scripts approve @db-ux/db-theme @db-ux/db-theme-fonts @db-ux/db-theme-icons
npm install
```

npm 11 blocks install scripts of dependencies by default. Without the approval, the fonts and icons stay encrypted.

### 5. Migrate file by file

Start with `main.tsx`, then `styles.css`, then the pages. For each file:

```text
Migrate src/SearchPage.tsx to DB UX Design System Generation 3 for React
with the migrate_component prompt. Keep the behavior, verify the result
with verify_migrated_code and list everything you could not migrate.
```

Review every change. The agent maps components, props, tokens and icons, but some decisions stay with you:

- **Layout:** which Control Panel variant the Shell uses
- **Visual intent:** whether a hard-coded value was a design decision or a workaround
- **Behavior:** form handling and events, because the Web Components did part of it for you

### 6. Check the result

```sh
npm run build
npm run dev
```

Open the migration hints again: each one names what should have changed.

### 7. Compare with the reference

The branch [`generation-3`](../../tree/generation-3) contains a migrated and manually reviewed version.

```sh
git diff generation-3 -- src
```

## After the session

- [Migration from DB UI](https://db-ux-design-system.github.io/documentation/learn/migration) on the Design System platform
- [Migration Guides](https://db-ux-design-system.github.io/documentation/releases/migration-guides) for each major version of Generation 3

## License

The source code is licensed under Apache 2.0. DB specific design assets like fonts, icons and the logo are covered by the DB Designs License, see [LICENSE](LICENSE).
