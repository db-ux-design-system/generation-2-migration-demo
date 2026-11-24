import { DbButton, DbCheckbox, DbInput, DbRadio, DbToggle } from '@db-ui/react-elements';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import cologne from './assets/offers/cologne.svg';
import hamburg from './assets/offers/hamburg.svg';
import munich from './assets/offers/munich.svg';
import { ActionButton } from './components/ActionButton';
import { OfferCard } from './components/OfferCard';

/** Simulated response time of the connection search. */
const SEARCH_DELAY_MS = 1200;

export type SearchRequest = {
	from: string;
	to: string;
	date: string;
	passengers: string;
	travelClass: '1' | '2';
};

type SearchPageProps = {
	initial: SearchRequest;
	onSearch: (request: SearchRequest) => void;
};

type PopularConnection = { to: string; image: string; text: string; price: string; badge?: string };

const popularConnections: PopularConnection[] = [
	{ to: 'Hamburg Hbf', image: hamburg, text: 'Direct ICE every hour, about 3 h 40 min.', price: '19.99 €', badge: 'Saver fare' },
	{ to: 'München Hbf', image: munich, text: 'Fast connection via Nuremberg, about 3 h 15 min.', price: '29.99 €' },
	{ to: 'Köln Hbf', image: cologne, text: 'High-speed line, about 1 h 05 min.', price: '17.99 €', badge: 'Popular' }
];

/** Swaps the values of the two station inputs rendered by the Web Components. */
function swapStations() {
	const from = document.querySelector<HTMLInputElement>('#from');
	const to = document.querySelector<HTMLInputElement>('#to');
	if (from && to) {
		[from.value, to.value] = [to.value, from.value];
	}
}

export function SearchPage({ initial, onSearch }: SearchPageProps) {
	const [isSearching, setIsSearching] = useState(false);
	const timeoutRef = useRef<number | undefined>(undefined);

	useEffect(() => () => globalThis.clearTimeout(timeoutRef.current), []);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (isSearching) {
			return;
		}

		// @db-ui/elements renders without Shadow DOM, so the native inputs take part in the form.
		const data = new FormData(event.currentTarget);
		const request: SearchRequest = {
			from: String(data.get('from') ?? ''),
			to: String(data.get('to') ?? ''),
			date: String(data.get('date') ?? ''),
			passengers: String(data.get('passengers') ?? '1'),
			travelClass: data.get('class') === '1' ? '1' : '2'
		};

		setIsSearching(true);
		timeoutRef.current = globalThis.setTimeout(() => onSearch(request), SEARCH_DELAY_MS);
	}

	return (
		<section className="booking-section" aria-labelledby="search-heading">
			<h1 id="search-heading" className="elm-headline" data-size="large">
				Find a connection
			</h1>
			<p style={{ color: 'var(--db-color-cool-gray-500)', fontSize: '14px', marginBottom: '24px' }}>
				Fields marked with * are required.
			</p>

			<form className="search-form" onSubmit={handleSubmit}>
				<fieldset className="search-form__stations">
					<legend>Route</legend>
					<DbInput
						input_id="from"
						name="from"
						label="From *"
						description="Station, stop or address"
						value={initial.from}
						required
					/>
					<DbButton
						type="button"
						variant="tertiary-plain"
						icon="swap-horizontal"
						icononly
						tooltip="Swap stations"
						onClick={swapStations}
					>
						Swap stations
					</DbButton>
					<DbInput
						input_id="to"
						name="to"
						label="To *"
						description="Station, stop or address"
						value={initial.to}
						required
					/>
				</fieldset>

				<div className="search-form__row">
					<DbInput input_id="date" name="date" type="date" label="Date *" value={initial.date} required />
					<div className="search-form__field">
						<select className="elm-select" id="passengers" name="passengers" defaultValue={initial.passengers}>
							<option value="1">1 traveller</option>
							<option value="2">2 travellers</option>
							<option value="3">3 travellers</option>
							<option value="4">4 travellers</option>
						</select>
						<label className="elm-label" htmlFor="passengers">
							Travellers
						</label>
					</div>
				</div>

				<fieldset className="search-form__group">
					<legend>Class</legend>
					<DbRadio input_id="class-2" name="class" value="2" label="2nd class" checked={initial.travelClass === '2'} />
					<DbRadio input_id="class-1" name="class" value="1" label="1st class" checked={initial.travelClass === '1'} />
				</fieldset>

				<fieldset className="search-form__group">
					<legend>Options</legend>
					<DbCheckbox input_id="direct" name="direct" value="yes" label="Direct connections only" />
					<DbToggle htmlid="bike" name="bike">
						Bike transport
					</DbToggle>
				</fieldset>

				<div className="search-form__field">
					<label className="elm-label" htmlFor="notes">
						Notes for mobility assistance
					</label>
					<textarea className="elm-textarea" id="notes" name="notes" rows={3} />
				</div>

				<div className="search-form__submit">
					<DbButton type="submit" variant="brand-primary" size="large" icon="search" disabled={isSearching}>
						Search
					</DbButton>
					{/* The spinner itself is silent; the status text next to it is announced. */}
					<p className="search-form__status" role="status">
						{isSearching && (
							<>
								<svg className="elm-loadingindicator" data-size="s" viewBox="0 0 44 44" aria-hidden="true">
									<circle className="elm-loadingindicator__circle" cx="22" cy="22" fill="none" />
								</svg>
								Searching for connections…
							</>
						)}
					</p>
				</div>
			</form>

			<section className="popular-connections" aria-labelledby="popular-heading">
				<h2 id="popular-heading" className="popular-connections__heading">
					Popular connections from {initial.from}
				</h2>
				<div className="popular-connections__list">
					{popularConnections.map((connection) => (
						<OfferCard
							key={connection.to}
							image={connection.image}
							title={connection.to}
							text={connection.text}
							price={connection.price}
							badge={connection.badge}
						>
							<ActionButton
								variant="secondary"
								size="sm"
								withArrow
								onClick={() => onSearch({ ...initial, to: connection.to })}
							>
								Show trains
							</ActionButton>
						</OfferCard>
					))}
				</div>
			</section>
		</section>
	);
}
