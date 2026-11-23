import { useEffect, useState } from 'react';
import logo from '@db-ui/core/dist/images/db_logo.svg';
import { MigrationHint } from './MigrationHint';
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
		<>
			<header className="rea-header">
				<div className="cmp-brand">
					<a href="#search" title="Booking home">
						<img src={logo} alt="DB" className="elm-image is-logo" />
					</a>
					<span className="is-site-name">Booking</span>
				</div>
				<nav className="cmp-mainnavigation" aria-label="Main navigation">
					<input type="checkbox" id="toggle_mainnavigation" />
					<label htmlFor="toggle_mainnavigation" title="Toggle main navigation" className="is-site-name">
						Booking
					</label>
					<ul>
						<li>
							<a className="elm-link" href="#search" aria-current={page === 'search' ? 'page' : undefined}>
								Search
							</a>
						</li>
						<li>
							<a className="elm-link" href="#results" aria-current={page === 'results' ? 'page' : undefined}>
								Connections
							</a>
						</li>
					</ul>
				</nav>
				<div className="rea-meta">
					<a className="elm-link" href="#search" data-icon="account">
						Log in
					</a>
				</div>
			</header>

			<main className="rea-main">
				<MigrationHint id="header" />
				{page === 'search' ? (
					<SearchPage initial={request} onSearch={handleSearch} />
				) : (
					<ResultsPage request={request} />
				)}
			</main>
		</>
	);
}
