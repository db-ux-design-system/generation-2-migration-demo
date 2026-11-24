import {
	DBBadge,
	DBButton,
	DBCard,
	DBCheckbox,
	DBHeadingH1,
	DBHeadingH2,
	DBHeadingH3,
	DBInput,
	DBLoadingIndicator,
	DBRadio,
	DBSection,
	DBSelect,
	DBSwitch,
	DBTextarea
} from '@db-ux/react-core-components';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import cologne from './assets/offers/cologne.svg';
import hamburg from './assets/offers/hamburg.svg';
import munich from './assets/offers/munich.svg';

/** Simulated response time of the connection search. */
const SEARCH_DELAY_MS = 1200;

export type SearchRequest = {
	from: string;
	to: string;
	date: string;
	passengers: string;
	travelClass: '1' | '2';
};

type PopularConnection = { to: string; image: string; text: string; price: string; badge?: string };

const popularConnections: PopularConnection[] = [
	{ to: 'Hamburg Hbf', image: hamburg, text: 'Direct ICE every hour, about 3 h 40 min.', price: '19.99 €', badge: 'Saver fare' },
	{ to: 'München Hbf', image: munich, text: 'Fast connection via Nuremberg, about 3 h 15 min.', price: '29.99 €' },
	{ to: 'Köln Hbf', image: cologne, text: 'High-speed line, about 1 h 05 min.', price: '17.99 €', badge: 'Popular' }
];

type SearchPageProps = {
	initial: SearchRequest;
	onSearch: (request: SearchRequest) => void;
};

export function SearchPage({ initial, onSearch }: SearchPageProps) {
	// Generation 2 swapped the stations by writing into the DOM. With React
	// components the fields are controlled, so the values live in state.
	const [from, setFrom] = useState(initial.from);
	const [to, setTo] = useState(initial.to);
	const [date, setDate] = useState(initial.date);
	const [passengers, setPassengers] = useState(initial.passengers);
	const [travelClass, setTravelClass] = useState(initial.travelClass);
	const [isSearching, setIsSearching] = useState(false);
	const timeoutRef = useRef<number | undefined>(undefined);

	useEffect(() => () => globalThis.clearTimeout(timeoutRef.current), []);

	function swapStations() {
		setFrom(to);
		setTo(from);
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (isSearching) {
			return;
		}

		setIsSearching(true);
		timeoutRef.current = globalThis.setTimeout(
			() => onSearch({ from, to, date, passengers, travelClass }),
			SEARCH_DELAY_MS
		);
	}

	return (
		<DBSection width="medium" aria-labelledby="search-heading">
			<DBHeadingH1 id="search-heading">Find a connection</DBHeadingH1>
			<p className="search-hint">Fields marked with * are required.</p>

			<form className="search-form" onSubmit={handleSubmit}>
				<fieldset className="search-form__stations">
					<legend>Route</legend>
					<DBInput
						id="from"
						name="from"
						label="From"
						message="Station, stop or address"
						value={from}
						onChange={(event) => setFrom(event.target.value)}
						required
					/>
					<DBButton type="button" variant="ghost" icon="arrows_horizontal" noText onClick={swapStations}>
						Swap stations
					</DBButton>
					<DBInput
						id="to"
						name="to"
						label="To"
						message="Station, stop or address"
						value={to}
						onChange={(event) => setTo(event.target.value)}
						required
					/>
				</fieldset>

				<div className="search-form__row">
					<DBInput
						id="date"
						name="date"
						type="date"
						label="Date"
						value={date}
						onChange={(event) => setDate(event.target.value)}
						required
					/>
					<DBSelect
						id="passengers"
						name="passengers"
						label="Travellers"
						value={passengers}
						onChange={(event) => setPassengers(event.target.value)}
					>
						<option value="1">1 traveller</option>
						<option value="2">2 travellers</option>
						<option value="3">3 travellers</option>
						<option value="4">4 travellers</option>
					</DBSelect>
				</div>

				<fieldset className="search-form__group">
					<legend>Class</legend>
					<DBRadio
						id="class-2"
						name="class"
						value="2"
						checked={travelClass === '2'}
						onChange={() => setTravelClass('2')}
					>
						2nd class
					</DBRadio>
					<DBRadio
						id="class-1"
						name="class"
						value="1"
						checked={travelClass === '1'}
						onChange={() => setTravelClass('1')}
					>
						1st class
					</DBRadio>
				</fieldset>

				<fieldset className="search-form__group">
					<legend>Options</legend>
					<DBCheckbox id="direct" name="direct" value="yes">
						Direct connections only
					</DBCheckbox>
					<DBSwitch id="bike" name="bike">
						Bike transport
					</DBSwitch>
				</fieldset>

				<DBTextarea id="notes" name="notes" label="Notes for mobility assistance" rows={3} />

				<div className="search-form__submit">
					<DBButton type="submit" variant="brand" icon="magnifying_glass" disabled={isSearching}>
						Search
					</DBButton>
					{/*
					 Screen readers announce a live region reliably only if it already exists
					 before its content changes. DBLoadingIndicator is a live region itself, but
					 it is only rendered while searching. So a status region that is always
					 present carries the text, and the spinner inside it stays silent.
					 */}
					<div className="search-form__status" role="status">
						{isSearching && (
							<>
								<DBLoadingIndicator
									variant="circular"
									size="small"
									label="Searching for connections…"
									showLabel={false}
									aria-hidden="true"
								/>
								Searching for connections…
							</>
						)}
					</div>
				</div>
			</form>

			<section className="popular-connections" aria-labelledby="popular-heading">
				<DBHeadingH2 id="popular-heading" visualSize="h3" className="popular-connections__heading">
					Popular connections from {from}
				</DBHeadingH2>
				<div className="popular-connections__list">
					{/* Self-built OfferCard: DBCard with the image in the content, DBBadge and DBButton. */}
					{popularConnections.map((connection) => (
						<DBCard key={connection.to} spacing="none" className="offer-card">
							<img className="offer-card__image" src={connection.image} alt="" />
							<div className="offer-card__body">
								{connection.badge && (
									<DBBadge semantic="successful" emphasis="strong">
										{connection.badge}
									</DBBadge>
								)}
								<DBHeadingH3 visualSize="h5">{connection.to}</DBHeadingH3>
								<p className="offer-card__text">{connection.text}</p>
							</div>
							<div className="offer-card__footer">
								<span className="offer-card__price">from {connection.price}</span>
								{/* Self-built ActionButton: secondary becomes outlined, size sm becomes small. */}
								<DBButton
									variant="outlined"
									size="small"
									iconTrailing="arrow_right"
									onClick={() => onSearch({ from, to: connection.to, date, passengers, travelClass })}
								>
									Show trains
								</DBButton>
							</div>
						</DBCard>
					))}
				</div>
			</section>
		</DBSection>
	);
}
