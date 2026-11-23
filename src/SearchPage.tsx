import {
	DBButton,
	DBCheckbox,
	DBHeadingH1,
	DBInput,
	DBLoadingIndicator,
	DBRadio,
	DBSection,
	DBSelect,
	DBSwitch,
	DBTextarea
} from '@db-ux/react-core-components';
import { useEffect, useRef, useState, type FormEvent } from 'react';

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
		<DBSection width="medium" spacing="medium" aria-labelledby="search-heading">
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
					{/* DBLoadingIndicator is a status live region with its own label. */}
					{isSearching && (
						<DBLoadingIndicator variant="circular" size="small" indeterminate label="Searching for connections…" />
					)}
				</div>
			</form>
		</DBSection>
	);
}
