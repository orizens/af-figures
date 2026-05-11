import type { Review } from "@/shared/types/reviews";
import { formatReviewDate } from "@/shared/utils/formatDate";

interface ReviewCardProps {
	review: Review;
}

const STORE_LABELS: Record<string, string> = {
	apple: "App Store",
	google_play: "Google Play",
	amazon: "Amazon",
};

const AVATAR_COLORS = [
	"#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
	"#0ea5e9", "#14b8a6", "#10b981", "#f59e0b",
];

function getAvatarColor(name: string): string {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}
	return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/);
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getRatingAccent(stars: string): string {
	const value = parseFloat(stars);
	if (value >= 4) return "var(--color-rating-high)";
	if (value >= 3) return "var(--color-rating-mid)";
	return "var(--color-rating-low)";
}

// --- Sub-components ---

interface StarRatingProps {
	stars: string;
	id: string;
}

function StarRating({ stars, id }: StarRatingProps): React.ReactElement {
	const value = parseFloat(stars);
	const rounded = Math.round(value);

	return (
		<span role="img" aria-label={`${rounded} out of 5 stars`} className="flex gap-0.5">
			{Array.from({ length: 5 }, (_, i) => (
				<svg
					key={`star-${id}-${i}`}
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill={i < rounded ? "var(--color-star-filled)" : "var(--color-star-empty)"}
					aria-hidden="true"
				>
					<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
				</svg>
			))}
		</span>
	);
}

interface HeaderProps {
	author: string;
	date: string;
	stars: string;
	id: string;
}

function Header({ author, date, stars, id }: HeaderProps): React.ReactElement {
	const initials = getInitials(author);
	const avatarColor = getAvatarColor(author);

	return (
		<div className="flex items-center gap-3">
			<span
				className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 select-none"
				style={{ backgroundColor: avatarColor }}
				aria-hidden="true"
			>
				{initials}
			</span>
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium text-[var(--color-text)] truncate leading-tight">
					{author}
				</p>
				<time dateTime={date} className="text-xs text-[var(--color-text-muted)]">
					{formatReviewDate(date)}
				</time>
			</div>
			<StarRating stars={stars} id={id} />
		</div>
	);
}

interface TitleProps {
	title: string;
}

function Title({ title }: TitleProps): React.ReactElement {
	return (
		<h3 className="font-semibold text-[var(--color-text)] text-sm leading-snug">
			{title}
		</h3>
	);
}

interface BodyProps {
	text: string;
}

function Body({ text }: BodyProps): React.ReactElement {
	return (
		<p className="text-[var(--color-text-secondary)] text-sm leading-relaxed line-clamp-4 flex-1">
			{text}
		</p>
	);
}

interface FooterProps {
	store: string;
	version: string | null;
	hasResponse: boolean;
}

function Footer({ store, version, hasResponse }: FooterProps): React.ReactElement {
	const storeLabel = STORE_LABELS[store] ?? store;

	return (
		<footer className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-surface-raised)] border-t border-[var(--color-border)]">
			<span className="text-xs text-[var(--color-text-muted)] font-medium px-2 py-0.5 rounded-full bg-[var(--color-border)]">
				{storeLabel}
			</span>
			{version && (
				<span className="text-xs text-[var(--color-text-muted)]">
					v{version}
				</span>
			)}
			{hasResponse && (
				<span className="ml-auto text-xs text-[var(--color-rating-high)] font-medium flex items-center gap-1">
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
						<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
					</svg>
					Responded
				</span>
			)}
		</footer>
	);
}

// --- Main component ---

export function ReviewCard({ review }: ReviewCardProps): React.ReactElement {
	const accentColor = getRatingAccent(review.stars);

	return (
		<article
			role="article"
			aria-label={`${review.title} by ${review.author}`}
			className="bg-[var(--color-surface)] rounded-[var(--radius-card)] flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
			style={{
				boxShadow: "var(--shadow-card)",
				borderLeft: `3px solid ${accentColor}`,
			}}
			onMouseEnter={(e) => {
				(e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card-hover)";
			}}
			onMouseLeave={(e) => {
				(e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)";
			}}
		>
			<div className="flex flex-col gap-3 p-4 flex-1">
				<ReviewCard.Header
					author={review.author}
					date={review.date}
					stars={review.stars}
					id={`star-rating-${review.id}`}
				/>
				<ReviewCard.Title title={review.title} />
				<ReviewCard.Body text={review.review} />
			</div>
			<ReviewCard.Footer
				store={review.store}
				version={review.version}
				hasResponse={review.has_response}
			/>
		</article>
	);
}

ReviewCard.Header = Header;
ReviewCard.Title = Title;
ReviewCard.Body = Body;
ReviewCard.Footer = Footer;
