/**
 Migration hints shown in the demo next to each pitfall.

 Kept in a separate file on purpose: the texts describe Generation 2 patterns
 in plain words only, so `scan_generation_2_migration` does not report this
 file. Do not paste class names, tags, package names or token names here.
 */
export const hints = {
	header: {
		title: 'Header and main navigation',
		text: 'Generation 3 replaces the header area and the main navigation with the Shell and a Control Panel. The agent cannot decide the layout for you: choose Control Panel Desktop, Mobile or Flat Icon yourself. Header and Navigation still exist in Generation 3 but are deprecated.'
	},
	breadcrumb: {
		title: 'Breadcrumb',
		text: 'The Breadcrumb becomes a component with Breadcrumb Items instead of a plain list of links. Long trails collapse automatically (maxItems), so check whether the page still needs every level.'
	},
	formFields: {
		title: 'Form fields',
		text: 'The React wrappers are renamed (lowercase "b" becomes "DB"). Props change: description becomes message and is always visible, input_id and htmlid become id, the toggle becomes Switch. The select is native markup here and turns into the Select component.'
	},
	button: {
		title: 'Button',
		text: 'Variants are renamed (brand-primary becomes brand, secondary-outline becomes outlined, tertiary-plain becomes ghost). The sizes large and regular are gone, use Density instead. Icon-only buttons use noText.'
	},
	icons: {
		title: 'Icon names',
		text: 'Many icons have new names and use underscores, for example search becomes magnifying_glass and edit becomes pen. Always check the names with list_icons instead of guessing.'
	},
	customCss: {
		title: 'Custom CSS and inline styles',
		text: 'Hard-coded pixel values, old color tokens, box-shadow values and opacity tricks bypass theming, Density and Dark Mode. Replace them with semantic tokens and move inline styles into CSS.'
	},
	notification: {
		title: 'Notification',
		text: 'The type moves to the semantic prop: informative becomes informational, success becomes successful, error becomes critical.'
	},
	chips: {
		title: 'Filter chips',
		text: 'Chip and Tag are merged in Generation 3. An interactive filter becomes a Tag that contains a checkbox.'
	},
	tabs: {
		title: 'Tabs',
		text: 'The tab bar built from radio inputs becomes Tabs, made of a Tab List, Tab Items and Tab Panels.'
	},
	card: {
		title: 'Card',
		text: 'The Card loses its image and header props. Content is passed as children, and interactive cards use behavior="interactive".'
	},
	accordion: {
		title: 'Accordion',
		text: 'Each disclosure becomes an Accordion Item, grouped in an Accordion. summary becomes headline.'
	},
	link: {
		title: 'Link',
		text: 'The Link has no icon props in Generation 3. Use a different pattern if the icon carries meaning.'
	}
} as const;

export type HintId = keyof typeof hints;
