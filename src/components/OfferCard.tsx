import type { ReactNode } from 'react';
import './OfferCard.css';

type OfferCardProps = {
	image: string;
	title: string;
	text: string;
	price: string;
	badge?: string;
	/** Actions in the footer, for example a button. */
	children?: ReactNode;
};

/** The team's own teaser card for offers, with image, badge and price. */
export function OfferCard({ image, title, text, price, badge, children }: OfferCardProps) {
	return (
		<article className="offer-card">
			<img className="offer-card__image" src={image} alt="" />
			<div className="offer-card__body">
				{badge && <span className="offer-card__badge">{badge}</span>}
				<h3 className="offer-card__title">{title}</h3>
				<p className="offer-card__text">{text}</p>
			</div>
			<div className="offer-card__footer">
				<span className="offer-card__price">from {price}</span>
				{children}
			</div>
		</article>
	);
}
