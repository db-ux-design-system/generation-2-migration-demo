# Migration pitfalls in this demo

The demo contains these pitfalls on purpose. Use this list to check the result of your migration: the agent handles most of them, some need a decision from you.

Each entry names the file and the place in the code. Line numbers are left out because they change during the migration.

The general rules behind these pitfalls are described in [Migration from DB UI](https://db-ux-design-system.github.io/documentation/learn/migration) on the Design System platform.

## Packages and setup

**`package.json`, `src/main.tsx`**

- `@db-ui/core` and `@db-ui/react-elements` are replaced by `@db-ux/react-core-components`. For the DB look, add `@db-ux/db-theme`.
- The single Generation 2 stylesheet becomes four imports in a fixed order: theme, foundations bundle, icons, components. The [general migration guide](https://github.com/db-ux-design-system/core-web/blob/main/docs/migration/db-ui/general-migration.md#required-css-imports--token-architecture) lists them.
- `vite.config.ts` disables CSS minification because `@db-ui/core` 3.3.7 ships an invalid selector. Remove the workaround after the migration.

## Header and navigation

**`src/App.tsx`, header**

- The header area, brand, main navigation and meta link become the **Shell** with a **Control Panel**.
- **Your decision:** Generation 3 offers Control Panel Desktop, Mobile and Flat Icon. Choose the variant that fits the layout. The agent cannot decide this for you.
- Header and Navigation still exist in Generation 3, but they are deprecated. Do not migrate to them.
- The logo image is part of the Control Panel Brand. There is no separate logo or image component.
- The main content area becomes Shell Content.

## Form

**`src/SearchPage.tsx`**

- **React wrappers:** `DbInput`, `DbButton`, `DbRadio`, `DbCheckbox` and `DbToggle` become `DBInput`, `DBButton`, `DBRadio`, `DBCheckbox` and `DBSwitch`.
- **Props:** `input_id` and `htmlid` become `id`. `description` becomes `message`, which is always visible. Set `showMessage={false}` to hide it.
- **Native select and textarea:** The select and textarea are plain markup with CSS classes. They become the Select and Textarea components, and the separate label becomes the `label` prop.
- **Headline:** The headline class becomes a semantic heading. Choose the level from the page outline, not from the visual size.
- **Button:** `brand-primary` becomes `brand`, `tertiary-plain` becomes `ghost`. The size `large` is gone, use Density instead. The icon-only swap button uses `noText`.
- **Behavior:** The swap button reads the inputs from the DOM, and the form reads its values with `FormData`. Check that both still work with the Generation 3 components.

**`src/SearchPage.tsx`, hint text below the headline**

- The inline `style` uses an old color token and pixel values. Move it to CSS and use semantic tokens.

## Results

**`src/ResultsPage.tsx`**

- **Breadcrumb:** The plain list of links becomes the Breadcrumb component with Breadcrumb Items. Long trails collapse automatically (`maxItems`).
- **Notification:** The notice is plain markup with `data-type="informative"` inside a `section data-variant="hovering"` wrapper. It becomes the Notification component with `semantic="informational"`. The wrapper has no counterpart: the in-content look is the default in Generation 3, so drop the wrapper. The visually hidden `<em>Information:</em>` is no longer needed either, because the component announces the semantic itself. Check this with a screen reader.
- **Filter chips:** Chip and Tag are merged. An interactive filter becomes a Tag that contains a checkbox.
  - **Capitalization:** Generation 2 capitalizes every word of a chip label with CSS (`text-transform: capitalize`). The code says "Direct only", the screen shows "Direct Only". After the migration the label appears as written. This is correct, even if it looks like a change in the before/after comparison.
  - **Selected state:** In Generation 2 the selected state is shown by color only. The Generation 3 Tag with a checkbox can show a check mark (`showCheckState`). Keep it on, so the state does not depend on color alone.
- **Tabs:** The tab bar becomes Tabs with a Tab List, Tab Items and Tab Panels.
- **Cards:** The card markup with `figure` and `figcaption` becomes a Card with its content as children. The "Select" button stays a separate button inside the card.
- **Tags:** The tag variants `informative`, `success` and `warning` move to `semantic`.
- **Accordion:** Each disclosure becomes an Accordion Item. Group them in an Accordion. `summary` becomes `headline`.
- **Link and button with icon:** The Link has no icon props in Generation 3. Drop the icon or use a different pattern if it carries meaning.
- **Fare table:** The native table with the table class becomes the Table component with Table Caption, Table Head, Table Body, Table Row, Table Header Cell and Table Data Cell. Keep the caption and the row headers (`scope="row"`), they make the table understandable for screen readers. The wrapper with `overflow-x: auto` is a workaround for small screens. Check whether the Table component already handles this.
- **Selection dialog:** The native `<dialog>` with the dialog class becomes the Dialog component with Dialog Header and Dialog Footer.
  - **Behavior:** The demo opens the dialog with `showModal()` in an effect and closes it with `close()`. In Generation 3 the `open` prop controls the dialog. Check that Escape, the close button and both footer buttons still close it.
  - **Focus:** Today the browser moves the focus back to the "Select" button on close. Check this again after the migration.
  - **Close button:** The text "Close" is hidden with a Generation 2 helper and replaced by an icon. Make sure the Generation 3 close button still has an accessible name.

## Search loading state

**`src/SearchPage.tsx`, submit button**

- The spinner is an SVG with the loading indicator class. It becomes the Loading Indicator component.
- The status text "Searching for connections…" sits in a `role="status"` paragraph next to the spinner. Keep an announcement for screen readers. Check whether the Loading Indicator brings its own label, so the text is not announced twice.
- The disabled submit button prevents a second search. Keep this behavior.

## Footer

**`src/App.tsx`, footer**

- The footer area becomes the Footer component inside the Shell.
- The legal links are a plain list with link classes. Check which part of the Footer (Footer Content or Footer Meta) they belong to.

## Running text

Generation 3 has Paragraph and Text Group components for running text. Generation 2 used plain `<p>` elements. You do not have to migrate them, but you can.

## Icons

**`src/App.tsx`, `src/SearchPage.tsx`, `src/ResultsPage.tsx`**

| Generation 2      | Generation 3         |
| ----------------- | -------------------- |
| `account`         | `person`             |
| `search`          | `magnifying_glass`   |
| `swap-horizontal` | `arrows_horizontal`  |
| `edit`            | `pen`                |
| `arrow-forward`   | `arrow_right`        |

Check every icon name with the `list_icons` tool instead of guessing.

## Custom CSS

**`src/styles.css`**

- **Spacing and type:** Pixel values for `padding`, `margin`, `gap` and `font-size` become spacing and type tokens.
- **Colors:** Old `db-color-*` tokens become semantic tokens. Background and text colors use different tokens.
- **White background:** The hard-coded `#fff` breaks Dark Mode. Use a background token.
- **Shadows:** `box-shadow` values become `--db-elevation-*` tokens. An interactive card can use the built-in hover elevation.
- **Opacity:** `opacity: 0.6` on the meta text simulates a lighter color. Use a semantic text token with lower emphasis instead.

> [!NOTE]
> `scan_generation_2_migration` does not report hard-coded values, props and variant values yet ([core-web#8869](https://github.com/db-ux-design-system/core-web/issues/8869)). Check these yourself.
