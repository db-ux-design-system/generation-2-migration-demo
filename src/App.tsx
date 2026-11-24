import {
	DBControlPanelActions2,
	DBControlPanelBrand,
	DBControlPanelDesktop,
	DBControlPanelMobile,
	DBControlPanelNavigation,
	DBControlPanelNavigationItem,
	DBFooter,
	DBFooterMeta,
	DBLink,
	DBShell,
	DBShellContent
} from '@db-ux/react-core-components';
import { useEffect, useState, type ReactNode } from 'react';
import { ResultsPage } from './ResultsPage';
import { SearchPage, type SearchRequest } from './SearchPage';

type Page = 'search' | 'results';

const defaultRequest: SearchRequest = {
	from: 'Frankfurt (Main) Hbf',
	to: 'Berlin Hbf',
	date: '2026-12-01',
	passengers: '1',
	travelClass: '2'
};

/** Reads the page from the URL hash so the browser back button works. */
function pageFromHash(): Page {
	return globalThis.location.hash === '#results' ? 'results' : 'search';
}

/** Navigation, brand and actions are shared by the desktop and the mobile Control Panel. */
function navigation(page: Page): ReactNode {
	return (
		<DBControlPanelNavigation aria-label="Main navigation">
			<DBControlPanelNavigationItem icon="magnifying_glass" active={page === 'search'} tooltip="Search">
				<a href="#search" aria-current={page === 'search' ? 'page' : undefined}>
					Search
				</a>
			</DBControlPanelNavigationItem>
			<DBControlPanelNavigationItem icon="timetable" active={page === 'results'} tooltip="Connections">
				<a href="#results" aria-current={page === 'results' ? 'page' : undefined}>
					Connections
				</a>
			</DBControlPanelNavigationItem>
		</DBControlPanelNavigation>
	);
}

/* Generation 2 linked the logo to the start page. The link wraps the brand, as in the brand example "As Link". */
const brand = (
	<a href="#search">
		<DBControlPanelBrand>Booking</DBControlPanelBrand>
	</a>
);

/*
 Generation 2 showed the login in the meta bar. In Generation 3 profile actions
 belong into actions2: desktop at the end of the Control Panel, mobile at the bottom of the drawer.
 */
const actions = (
	<DBControlPanelActions2>
		{/* Generation 2 showed a person icon here. The Link has no icon props in Generation 3. */}
		<DBLink href="#search">Log in</DBLink>
	</DBControlPanelActions2>
);

export function App() {
	const [page, setPage] = useState<Page>(pageFromHash);
	const [request, setRequest] = useState<SearchRequest>(defaultRequest);

	useEffect(() => {
		const handleHashChange = () => setPage(pageFromHash());
		globalThis.addEventListener('hashchange', handleHashChange);
		return () => globalThis.removeEventListener('hashchange', handleHashChange);
	}, []);

	function handleSearch(next: SearchRequest) {
		setRequest(next);
		globalThis.location.hash = 'results';
	}

	return (
		<DBShell controlPanelDesktopPosition="top">
			<DBControlPanelDesktop brand={brand} actions2={actions}>
				{navigation(page)}
			</DBControlPanelDesktop>
			<DBControlPanelMobile brand={brand} actions2={actions} drawerHeaderText="Booking" burgerMenuLabel="Open menu">
				{navigation(page)}
			</DBControlPanelMobile>
			<DBShellContent
				endSlot={
					<DBFooter width="medium">
						{/*
						 Legal links and the copyright notice belong into Footer Meta. DBFooter styles the
						 list itself; inline links in size small have no arrow, as in the footer example.
						 */}
						<DBFooterMeta copyright="2026 Deutsche Bahn AG">
							{/* Placeholder links: prevent "#" from resetting the page switch to the search page. */}
							<nav aria-label="Legal" onClick={(event) => event.preventDefault()}>
								<ul>
									<li>
										<DBLink variant="inline" size="small" href="#">Imprint</DBLink>
									</li>
									<li>
										<DBLink variant="inline" size="small" href="#">Privacy</DBLink>
									</li>
									<li>
										<DBLink variant="inline" size="small" href="#">Terms of transport</DBLink>
									</li>
									<li>
										<DBLink variant="inline" size="small" href="#">Accessibility statement</DBLink>
									</li>
								</ul>
							</nav>
						</DBFooterMeta>
					</DBFooter>
				}
			>
				{page === 'search' ? (
					<SearchPage initial={request} onSearch={handleSearch} />
				) : (
					<ResultsPage request={request} />
				)}
			</DBShellContent>
		</DBShell>
	);
}
