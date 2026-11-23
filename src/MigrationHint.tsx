import { useId, useState, type KeyboardEvent } from 'react';
import { hints, type HintId } from './hints';

/**
 Demo-only disclosure that explains a migration pitfall.

 Generation 2 has no tooltip, so this is a plain button that toggles a note.
 Escape closes it again while focus stays on the button.
 */
export function MigrationHint({ id }: { id: HintId }) {
	const [isOpen, setIsOpen] = useState(false);
	const panelId = useId();
	const hint = hints[id];

	function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
		if (event.key === 'Escape') {
			setIsOpen(false);
		}
	}

	return (
		<div className="migration-hint" onKeyDown={handleKeyDown}>
			<button
				type="button"
				className="elm-button"
				data-variant="tertiary-plain"
				data-size="small"
				data-icon="info"
				aria-expanded={isOpen}
				aria-controls={panelId}
				onClick={() => setIsOpen(!isOpen)}
			>
				Migration hint<span className="visually-hidden">: {hint.title}</span>
			</button>
			<div id={panelId} className="migration-hint__panel" hidden={!isOpen}>
				<strong>{hint.title}.</strong> {hint.text}
			</div>
		</div>
	);
}
