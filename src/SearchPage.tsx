import { DbButton, DbCheckbox, DbInput, DbRadio, DbToggle } from '@db-ui/react-elements';
import type { FormEvent } from 'react';
import { MigrationHint } from './MigrationHint';

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

/** Swaps the values of the two station inputs rendered by the Web Components. */
function swapStations() {
	const from = document.querySelector<HTMLInputElement>('#from');
	const to = document.querySelector<HTMLInputElement>('#to');
	if (from && to) {
		[from.value, to.value] = [to.value, from.value];
	}
}

export function SearchPage({ initial, onSearch }: SearchPageProps) {
	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		// @db-ui/elements renders without Shadow DOM, so the native inputs take part in the form.
		const data = new FormData(event.currentTarget);
		onSearch({
			from: String(data.get('from') ?? ''),
			to: String(data.get('to') ?? ''),
			date: String(data.get('date') ?? ''),
			passengers: String(data.get('passengers') ?? '1'),
			travelClass: data.get('class') === '1' ? '1' : '2'
		});
	}

	return (
		<section className="booking-section" aria-labelledby="search-heading">
			<h1 id="search-heading" className="elm-headline" data-size="large">
				Find a connection
			</h1>
			<p style={{ color: 'var(--db-color-cool-gray-500)', fontSize: '14px', marginBottom: '24px' }}>
				Fields marked with * are required.
			</p>
			<MigrationHint id="customCss" />

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
				<MigrationHint id="formFields" />

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

				<DbButton type="submit" variant="brand-primary" size="large" icon="search">
					Search
				</DbButton>
				<MigrationHint id="button" />
				<MigrationHint id="icons" />
			</form>
		</section>
	);
}
