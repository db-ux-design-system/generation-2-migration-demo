import {
	DBAccordion,
	DBAccordionItem,
	DBBreadcrumb,
	DBBreadcrumbItem,
	DBButton,
	DBCard,
	DBCheckbox,
	DBDialog,
	DBDialogFooter,
	DBDialogHeader,
	DBHeadingH1,
	DBHeadingH2,
	DBHeadingH3,
	DBLink,
	DBNotification,
	DBSection,
	DBTabItem,
	DBTabList,
	DBTabPanel,
	DBTable,
	DBTableBody,
	DBTableDataCell,
	DBTableHead,
	DBTableHeaderCell,
	DBTableRow,
	DBTabs,
	DBSelect,
	DBTag
} from '@db-ux/react-core-components';
import { useState } from 'react';
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

type SortOrder = 'departure' | 'duration' | 'price';

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

const filters = [
	{ id: 'filter-direct', label: 'Direct only' },
	{ id: 'filter-ice', label: 'ICE only' },
	{ id: 'filter-saver', label: 'Saver fares' }
];

type ConnectionCardProps = {
	connection: Connection;
	onSelect: (connection: Connection) => void;
};

function ConnectionCard({ connection, onSelect }: ConnectionCardProps) {
	const headingId = `connection-${connection.id}`;
	return (
		<DBCard>
			{/* DBCard is a flex column. The two-column layout lives on an inner wrapper. */}
			<div className="connection-card">
				<div className="connection-card__details">
					<DBHeadingH3 id={headingId} visualSize="h2">
						{connection.departure} – {connection.arrival}
					</DBHeadingH3>
					<p className="connection-card__meta">
						{connection.duration} · {connection.changes === 0 ? 'direct' : `${connection.changes} change`}
					</p>
					<p className="connection-card__tags">
						<DBTag semantic="informational">{connection.train}</DBTag>
						{connection.status === 'on-time' ? (
							<DBTag semantic="successful">On time</DBTag>
						) : (
							<DBTag semantic="warning">+5 min</DBTag>
						)}
					</p>
				</div>
				<div className="connection-card__offer">
					<p className="connection-card__price">
						<span className="connection-card__price-label">from</span> {connection.price}
					</p>
					<DBButton variant="outlined" aria-describedby={headingId} onClick={() => onSelect(connection)}>
						Select
					</DBButton>
				</div>
			</div>
		</DBCard>
	);
}

/**
 Confirmation dialog for the selected connection.

 Generation 2 opened a native <dialog> with showModal() in an effect.
 DBDialog is controlled by the `open` prop and closes on Escape, on the
 backdrop and with the close button of DBDialogHeader.
 */
function SelectionDialog({ connection, onClose }: { connection?: Connection; onClose: () => void }) {
	return (
		<DBDialog
			open={Boolean(connection)}
			containerSize="small"
			onClose={onClose}
			header={
				<DBDialogHeader closeButtonText="Close">
					<DBHeadingH2 visualSize="h4">Your selection</DBHeadingH2>
				</DBDialogHeader>
			}
			footer={
				<DBDialogFooter>
					<DBButton variant="outlined" onClick={onClose}>
						Cancel
					</DBButton>
					<DBButton variant="brand" onClick={onClose}>
						Continue
					</DBButton>
				</DBDialogFooter>
			}
		>
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
		</DBDialog>
	);
}

export function ResultsPage({ request }: { request: SearchRequest }) {
	const [selected, setSelected] = useState<Connection | undefined>();
	const [sortOrder, setSortOrder] = useState<SortOrder>('departure');
	// Generation 2 unchecked the chips through the DOM. With components the state lives in React.
	const [activeFilters, setActiveFilters] = useState<string[]>([]);

	function toggleFilter(id: string, isChecked: boolean) {
		setActiveFilters((current) => (isChecked ? [...current, id] : current.filter((filter) => filter !== id)));
	}

	return (
		<DBSection width="medium" spacing="medium" aria-labelledby="results-heading">
			<DBBreadcrumb aria-label="Breadcrumb">
				<DBBreadcrumbItem>
					<a href="#search">Search</a>
				</DBBreadcrumbItem>
				<DBBreadcrumbItem>
					<a href="#results" aria-current="page">
						Connections
					</a>
				</DBBreadcrumbItem>
			</DBBreadcrumb>

			<DBHeadingH1 id="results-heading">
				{request.from} → {request.to}
			</DBHeadingH1>
			<p className="results-summary">
				{formatDate(request.date)} · {formatTravellers(request.passengers)} ·{' '}
				{request.travelClass === '1' ? '1st' : '2nd'} class
			</p>

			{/* The framed in-content look of Generation 2 is the standalone variant. */}
			<DBNotification semantic="informational" variant="standalone" className="results-notice">
				Construction work between Fulda and Erfurt. Plan 10 minutes extra.
			</DBNotification>

			<div className="filter-tags" role="group" aria-label="Filter connections">
				{filters.map((filter) => (
					<DBTag key={filter.id} showCheckState>
						<DBCheckbox
							id={filter.id}
							checked={activeFilters.includes(filter.id)}
							onChange={(event) => toggleFilter(filter.id, event.target.checked)}
						>
							{filter.label}
						</DBCheckbox>
					</DBTag>
				))}
				{/* Self-built ActionButton, variant ghost. */}
				<DBButton
					variant="ghost"
					size="small"
					disabled={activeFilters.length === 0}
					onClick={() => setActiveFilters([])}
				>
					Reset filters
				</DBButton>
			</div>

			{/* Self-built DropdownSelect: a div with onClick and a list, without role, label or keyboard support. */}
			<div className="results-toolbar">
				<DBSelect
					id="sort"
					name="sort"
					label="Sort by"
					value={sortOrder}
					onChange={(event) => setSortOrder(event.target.value as SortOrder)}
				>
					<option value="departure">Departure</option>
					<option value="duration">Travel time</option>
					<option value="price">Price</option>
				</DBSelect>
			</div>

			<DBTabs>
				<DBTabList>
					<DBTabItem>Outbound</DBTabItem>
					<DBTabItem>Return</DBTabItem>
				</DBTabList>
				<DBTabPanel>
					<div className="connection-list">
						{sortConnections(outbound, sortOrder).map((connection) => (
							<ConnectionCard key={connection.id} connection={connection} onSelect={setSelected} />
						))}
					</div>
				</DBTabPanel>
				<DBTabPanel>
					<div className="connection-list">
						{sortConnections(returnTrips, sortOrder).map((connection) => (
							<ConnectionCard key={connection.id} connection={connection} onSelect={setSelected} />
						))}
					</div>
				</DBTabPanel>
			</DBTabs>

			<DBHeadingH2 visualSize="h3" className="results-subheading">
				Compare fares
			</DBHeadingH2>
			<DBTable captionPlain={`Fares for ${request.travelClass === '1' ? '1st' : '2nd'} class, price per person`}>
				<DBTableHead>
					<DBTableRow>
						<DBTableHeaderCell scope="col">Fare</DBTableHeaderCell>
						<DBTableHeaderCell scope="col" horizontalAlignment="end">
							Price from
						</DBTableHeaderCell>
						<DBTableHeaderCell scope="col">Train binding</DBTableHeaderCell>
						<DBTableHeaderCell scope="col">Cancellation</DBTableHeaderCell>
						<DBTableHeaderCell scope="col">Seat reservation</DBTableHeaderCell>
					</DBTableRow>
				</DBTableHead>
				<DBTableBody>
					{fares.map((fare) => (
						<DBTableRow key={fare.name}>
							<DBTableHeaderCell scope="row">{fare.name}</DBTableHeaderCell>
							<DBTableDataCell horizontalAlignment="end">{fare.price}</DBTableDataCell>
							<DBTableDataCell>{fare.trainBinding}</DBTableDataCell>
							<DBTableDataCell>{fare.cancellation}</DBTableDataCell>
							<DBTableDataCell>{fare.seat}</DBTableDataCell>
						</DBTableRow>
					))}
				</DBTableBody>
			</DBTable>

			<DBHeadingH2 visualSize="h3" className="results-subheading">
				Good to know
			</DBHeadingH2>
			<DBAccordion>
				<DBAccordionItem headlinePlain="Travelling with children">
					Children under 6 travel free. Children from 6 to 14 travel free with a parent or grandparent if they are
					listed on the ticket.
				</DBAccordionItem>
				<DBAccordionItem headlinePlain="Bike transport">
					Bike spaces are limited. Reserve a space together with your ticket.
				</DBAccordionItem>
			</DBAccordion>

			<p className="results-actions">
				{/* Generation 2 showed a pen icon here. The Link has no icon props in Generation 3. */}
				<DBLink href="#search">Change search</DBLink>
				<DBButton variant="filled" iconTrailing="arrow_right">
					Later connections
				</DBButton>
			</p>

			<SelectionDialog connection={selected} onClose={() => setSelected(undefined)} />
		</DBSection>
	);
}
