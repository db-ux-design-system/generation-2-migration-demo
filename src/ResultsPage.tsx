import { DbButton, DbLink, DbNotification, DbTab, DbTabBar } from '@db-ui/react-elements';
import { MigrationHint } from './MigrationHint';
import type { SearchRequest } from './SearchPage';

type Connection = {
	id: string;
	departure: string;
	arrival: string;
	duration: string;
	train: string;
	changes: number;
	price: string;
	status: 'on-time' | 'delayed';
};

const outbound: Connection[] = [
	{ id: 'o1', departure: '07:58', arrival: '12:02', duration: '4 h 04 min', train: 'ICE 1091', changes: 0, price: '39.99 €', status: 'on-time' },
	{ id: 'o2', departure: '09:13', arrival: '13:35', duration: '4 h 22 min', train: 'ICE 597', changes: 1, price: '29.99 €', status: 'delayed' },
	{ id: 'o3', departure: '10:58', arrival: '15:02', duration: '4 h 04 min', train: 'ICE 1093', changes: 0, price: '49.99 €', status: 'on-time' }
];

const returnTrips: Connection[] = [
	{ id: 'r1', departure: '16:29', arrival: '20:31', duration: '4 h 02 min', train: 'ICE 1098', changes: 0, price: '45.99 €', status: 'on-time' },
	{ id: 'r2', departure: '18:04', arrival: '22:40', duration: '4 h 36 min', train: 'ICE 696', changes: 1, price: '27.99 €', status: 'on-time' }
];

function ConnectionCard({ connection }: { connection: Connection }) {
	const headingId = `connection-${connection.id}`;
	return (
		<div className="cmp-card connection-card">
			<figure>
				<figcaption>
					<h3 id={headingId} className="connection-card__times">
						{connection.departure} – {connection.arrival}
					</h3>
					<p className="connection-card__meta">
						{connection.duration} · {connection.changes === 0 ? 'direct' : `${connection.changes} change`}
					</p>
					<p className="connection-card__tags">
						<span className="elm-tag" data-variant="informative" data-size="small">
							{connection.train}
						</span>
						{connection.status === 'on-time' ? (
							<span className="elm-tag" data-variant="success" data-size="small">
								On time
							</span>
						) : (
							<span className="elm-tag" data-variant="warning" data-size="small">
								+5 min
							</span>
						)}
					</p>
					<p className="connection-card__price">from {connection.price}</p>
					<button
						type="button"
						className="elm-button"
						data-variant="secondary-outline"
						aria-describedby={headingId}
					>
						Select
					</button>
				</figcaption>
			</figure>
		</div>
	);
}

export function ResultsPage({ request }: { request: SearchRequest }) {
	return (
		<section className="booking-section" aria-labelledby="results-heading">
			<nav className="cmp-breadcrumb" aria-label="Breadcrumb">
				<ol>
					<li>
						<a className="elm-link" href="#search">
							Search
						</a>
					</li>
					<li>
						<a className="elm-link" href="#results" aria-current="page">
							Connections
						</a>
					</li>
				</ol>
			</nav>
			<MigrationHint id="breadcrumb" />

			<h1 id="results-heading" className="elm-headline" data-size="large">
				{request.from} → {request.to}
			</h1>
			<p className="results-summary">
				{request.date} · {request.passengers} traveller(s) · {request.travelClass === '1' ? '1st' : '2nd'} class
			</p>

			<DbNotification type="informative" variant="status">
				Construction work between Fulda and Erfurt. Plan 10 minutes extra.
			</DbNotification>
			<MigrationHint id="notification" />

			<div className="filter-chips" role="group" aria-label="Filter connections">
				<input type="checkbox" className="elm-chip" id="filter-direct" />
				<label htmlFor="filter-direct">Direct only</label>
				<input type="checkbox" className="elm-chip" id="filter-ice" />
				<label htmlFor="filter-ice">ICE only</label>
				<input type="checkbox" className="elm-chip" id="filter-saver" />
				<label htmlFor="filter-saver">Saver fares</label>
			</div>
			<MigrationHint id="chips" />

			<DbTabBar>
				<DbTab id="tab-outbound" name="direction" label="Outbound" active>
					<div className="connection-list">
						{outbound.map((connection) => (
							<ConnectionCard key={connection.id} connection={connection} />
						))}
					</div>
				</DbTab>
				<DbTab id="tab-return" name="direction" label="Return">
					<div className="connection-list">
						{returnTrips.map((connection) => (
							<ConnectionCard key={connection.id} connection={connection} />
						))}
					</div>
				</DbTab>
			</DbTabBar>
			<MigrationHint id="tabs" />
			<MigrationHint id="card" />

			<h2 className="results-subheading">Good to know</h2>
			<details className="cmp-accordion">
				<summary>Ticket conditions</summary>
				<p>Saver fares are bound to the selected train. Flex fares can be used on any train of the day.</p>
			</details>
			<details className="cmp-accordion">
				<summary>Bike transport</summary>
				<p>Bike spaces are limited. Reserve a space together with your ticket.</p>
			</details>
			<MigrationHint id="accordion" />

			<p className="results-actions">
				<DbLink href="#search" icon="edit">
					Change search
				</DbLink>
				<DbButton type="button" variant="secondary-solid" iconafter="arrow-forward">
					Continue to booking
				</DbButton>
			</p>
			<MigrationHint id="link" />
		</section>
	);
}
