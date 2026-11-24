import { DbButton, DbLink, DbTab, DbTabBar } from '@db-ui/react-elements';
import { useEffect, useRef, useState } from 'react';
import { ActionButton } from './components/ActionButton';
import { DropdownSelect } from './components/DropdownSelect';
import type { SearchRequest } from './SearchPage';

const dateFormat = new Intl.DateTimeFormat('en-GB', {
	weekday: 'short',
	day: 'numeric',
	month: 'short',
	year: 'numeric',
	timeZone: 'UTC'
});

/** "2026-12-01" -> "Tue, 1 Dec 2026"; falls back to the raw value if it is not a date. */
function formatDate(isoDate: string): string {
	const date = new Date(`${isoDate}T00:00:00Z`);
	return Number.isNaN(date.getTime()) ? isoDate : dateFormat.format(date);
}

function formatTravellers(count: string): string {
	return count === '1' ? '1 traveller' : `${count} travellers`;
}

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

type SortOrder = 'departure' | 'duration' | 'price';

const sortOptions = [
	{ value: 'departure', label: 'Departure' },
	{ value: 'duration', label: 'Travel time' },
	{ value: 'price', label: 'Price' }
];

/** Sorts a copy of the connections. Times, durations and prices have fixed formats, so text comparison works. */
function sortConnections(connections: Connection[], order: SortOrder): Connection[] {
	const key = (connection: Connection) =>
		order === 'price'
			? connection.price.padStart(8, '0')
			: order === 'duration'
				? connection.duration
				: connection.departure;
	return [...connections].sort((a, b) => key(a).localeCompare(key(b)));
}

/** Unchecks the filter chips. The chips are plain inputs, so this works on the DOM. */
function resetFilters() {
	for (const chip of document.querySelectorAll<HTMLInputElement>('.filter-chips input')) {
		chip.checked = false;
	}
}

type ConnectionCardProps = {
	connection: Connection;
	onSelect: (connection: Connection) => void;
};

function ConnectionCard({ connection, onSelect }: ConnectionCardProps) {
	const headingId = `connection-${connection.id}`;
	return (
		<div className="cmp-card connection-card">
			<figure>
				<figcaption className="connection-card__layout">
					<div className="connection-card__details">
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
					</div>
					<div className="connection-card__offer">
						<p className="connection-card__price">
							<span className="connection-card__price-label">from</span> {connection.price}
						</p>
						<button
							type="button"
							className="elm-button"
							data-variant="secondary-outline"
							aria-describedby={headingId}
							onClick={() => onSelect(connection)}
						>
							Select
						</button>
					</div>
				</figcaption>
			</figure>
		</div>
	);
}

type Fare = {
	name: string;
	price: string;
	trainBinding: string;
	cancellation: string;
	seat: string;
};

const fares: Fare[] = [
	{ name: 'Super Saver', price: '17.99 €', trainBinding: 'Selected train only', cancellation: 'Not possible', seat: 'Extra charge' },
	{ name: 'Saver', price: '29.99 €', trainBinding: 'Selected train only', cancellation: 'Voucher, 10 € fee', seat: 'Extra charge' },
	{ name: 'Flex', price: '89.90 €', trainBinding: 'Any train of the day', cancellation: 'Free until the day before', seat: 'Extra charge' }
];

/**
 Confirmation dialog for the selected connection.

 Uses the native <dialog> element with the Generation 2 dialog styles.
 showModal() traps focus and closes on Escape; the browser returns focus to
 the "Select" button on close.
 */
function SelectionDialog({ connection, onClose }: { connection?: Connection; onClose: () => void }) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (connection && dialog && !dialog.open) {
			dialog.showModal();
		}
	}, [connection]);

	return (
		<dialog ref={dialogRef} className="cmp-dialog selection-dialog" aria-labelledby="selection-heading" onClose={onClose}>
			<header>
				<h2 id="selection-heading" className="elm-headline">
					Your selection
				</h2>
				<button type="button" className="elm-button is-close" onClick={() => dialogRef.current?.close()}>
					Close
				</button>
			</header>
			<main>
				{connection && (
					<>
						<p>
							<strong>
								{connection.departure} – {connection.arrival}
							</strong>{' '}
							· {connection.train} · {connection.duration}
						</p>
						<p>from {connection.price} per person. The final price depends on the fare you choose in the next step.</p>
					</>
				)}
			</main>
			<footer>
				<button type="button" className="elm-button" data-variant="secondary-outline" onClick={() => dialogRef.current?.close()}>
					Cancel
				</button>
				<button type="button" className="elm-button" data-variant="brand-primary" onClick={() => dialogRef.current?.close()}>
					Continue
				</button>
			</footer>
		</dialog>
	);
}

export function ResultsPage({ request }: { request: SearchRequest }) {
	const [selected, setSelected] = useState<Connection | undefined>();
	const [sortOrder, setSortOrder] = useState<SortOrder>('departure');

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

			<h1 id="results-heading" className="elm-headline" data-size="large">
				{request.from} → {request.to}
			</h1>
			<p className="results-summary">
				{formatDate(request.date)} · {formatTravellers(request.passengers)} ·{' '}
				{request.travelClass === '1' ? '1st' : '2nd'} class
			</p>

			{/* In-content notice: the "hovering" wrapper turns the full-width status bar into a framed box. */}
			<section data-variant="hovering" className="results-notice">
				<div className="cmp-notification" data-type="informative" data-icon="info" role="status">
					<em>Information:</em> Construction work between Fulda and Erfurt. Plan 10 minutes extra.
				</div>
			</section>

			<div className="filter-chips" role="group" aria-label="Filter connections">
				<input type="checkbox" className="elm-chip" id="filter-direct" />
				<label htmlFor="filter-direct">Direct only</label>
				<input type="checkbox" className="elm-chip" id="filter-ice" />
				<label htmlFor="filter-ice">ICE only</label>
				<input type="checkbox" className="elm-chip" id="filter-saver" />
				<label htmlFor="filter-saver">Saver fares</label>
				<ActionButton variant="ghost" size="sm" onClick={resetFilters}>
					Reset filters
				</ActionButton>
			</div>

			<div className="results-toolbar">
				<DropdownSelect
					label="Sort by"
					name="sort"
					options={sortOptions}
					value={sortOrder}
					onChange={(value) => setSortOrder(value as SortOrder)}
				/>
			</div>

			<DbTabBar>
				<DbTab id="tab-outbound" name="direction" label="Outbound" active>
					<div className="connection-list">
						{sortConnections(outbound, sortOrder).map((connection) => (
							<ConnectionCard key={connection.id} connection={connection} onSelect={setSelected} />
						))}
					</div>
				</DbTab>
				<DbTab id="tab-return" name="direction" label="Return">
					<div className="connection-list">
						{sortConnections(returnTrips, sortOrder).map((connection) => (
							<ConnectionCard key={connection.id} connection={connection} onSelect={setSelected} />
						))}
					</div>
				</DbTab>
			</DbTabBar>

			<h2 className="results-subheading">Compare fares</h2>
			<div className="fare-table-wrapper">
				<table className="cmp-table fare-table" data-border="horizontal">
					<caption>Fares for {request.travelClass === '1' ? '1st' : '2nd'} class, price per person</caption>
					<thead>
						<tr>
							<th scope="col">Fare</th>
							<th scope="col" data-align="right">
								Price from
							</th>
							<th scope="col">Train binding</th>
							<th scope="col">Cancellation</th>
							<th scope="col">Seat reservation</th>
						</tr>
					</thead>
					<tbody>
						{fares.map((fare) => (
							<tr key={fare.name}>
								<th scope="row">{fare.name}</th>
								<td data-align="right">{fare.price}</td>
								<td>{fare.trainBinding}</td>
								<td>{fare.cancellation}</td>
								<td>{fare.seat}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<h2 className="results-subheading">Good to know</h2>
			<details className="cmp-accordion">
				<summary>Travelling with children</summary>
				<p>Children under 6 travel free. Children from 6 to 14 travel free with a parent or grandparent if they are listed on the ticket.</p>
			</details>
			<details className="cmp-accordion">
				<summary>Bike transport</summary>
				<p>Bike spaces are limited. Reserve a space together with your ticket.</p>
			</details>

			<p className="results-actions">
				<DbLink href="#search" icon="edit">
					Change search
				</DbLink>
				<DbButton type="button" variant="secondary-solid" iconafter="arrow-forward">
					Later connections
				</DbButton>
			</p>

			<SelectionDialog connection={selected} onClose={() => setSelected(undefined)} />
		</section>
	);
}
