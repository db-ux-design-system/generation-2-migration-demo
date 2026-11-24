import type { MouseEvent, ReactNode } from 'react';
import './ActionButton.css';

type ActionButtonProps = {
	children: ReactNode;
	variant?: 'primary' | 'secondary' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	/** Shows an arrow after the label. */
	withArrow?: boolean;
	type?: 'button' | 'submit';
	disabled?: boolean;
	onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
	'aria-describedby'?: string;
};

/**
 The team's own button, built before the design system had the variants we
 needed. Used for the offer cards and the filter reset.
 */
export function ActionButton({
	children,
	variant = 'primary',
	size = 'md',
	withArrow = false,
	type = 'button',
	disabled,
	onClick,
	'aria-describedby': describedBy
}: ActionButtonProps) {
	return (
		<button type={type} className={`action-button action-button--${variant} action-button--${size}`} disabled={disabled} onClick={onClick} aria-describedby={describedBy}>
			{children}
			{withArrow && (
				<svg className="action-button__arrow" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
					<path d="M3 8h9M8 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
				</svg>
			)}
		</button>
	);
}
