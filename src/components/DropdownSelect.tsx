import { useEffect, useRef, useState } from 'react';
import './DropdownSelect.css';

export type DropdownOption = { value: string; label: string };

type DropdownSelectProps = {
	label: string;
	name: string;
	options: DropdownOption[];
	value: string;
	onChange: (value: string) => void;
};

/**
 The team's own dropdown. The native select could not be styled the way the
 design wanted, so this one is built from divs and a list.
 */
export function DropdownSelect({ label, name, options, value, onChange }: DropdownSelectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const selected = options.find((option) => option.value === value) ?? options[0];

	// Close the menu on a click outside.
	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	}, []);

	return (
		<div className="dropdown" ref={rootRef}>
			<span className="dropdown__label">{label}</span>
			<div className="dropdown__trigger" onClick={() => setIsOpen(!isOpen)}>
				{selected.label}
				<svg className="dropdown__chevron" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
					<path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
				</svg>
			</div>
			{isOpen && (
				<ul className="dropdown__menu">
					{options.map((option) => (
						<li key={option.value} className="dropdown__option" data-selected={option.value === value} onClick={() => { onChange(option.value); setIsOpen(false); }}>
							{option.label}
						</li>
					))}
				</ul>
			)}
			<input type="hidden" name={name} value={value} />
		</div>
	);
}
