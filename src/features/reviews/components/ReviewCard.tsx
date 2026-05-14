import { StarIcon } from "@/components/StarIcon";
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

const AVATAR_CLASSES = [
	"bg-indigo-500",
	"bg-violet-500",
	"bg-pink-500",
	"bg-rose-500",
	"bg-sky-500",
	"bg-teal-500",
	"bg-emerald-500",
	"bg-amber-500",
];

function parseStars(stars: string): number {
	return parseFloat(stars);
}

function getAvatarClass(name: string): string {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}
	return AVATAR_CLASSES[Math.abs(hash) % AVATAR_CLASSES.length];
}

function getInitials(name: string): string {
	const trimmed = name.trim();
	if (!trimmed) return "?";
	const parts = trimmed.split(/\s+/);
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getRatingBorderClass(stars: string): string {
	const value = parseStars(stars);
	if (value >= 4) return "border-l-rating-high";
	if (value >= 3) return "border-l-rating-mid";
	return "border-l-rating-low";
}

// --- Sub-components ---

interface StarRatingProps {
	stars: string;
	id: string;
}

function StarRating({ stars, id }: StarRatingProps): React.ReactElement {
	const value = parseStars(stars);
	const rounded = Math.round(value);

	return (
		<span
			role="img"
			aria-label={`${rounded} out of 5 stars`}
			className="flex gap-0.5"
		>
			{Array.from({ length: 5 }, (_, i) => (
				<StarIcon
					key={`star-${id}-${i}`}
					fill={
						i < rounded ? "var(--color-star-filled)" : "var(--color-star-empty)"
					}
				/>
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
	const avatarClass = getAvatarClass(author);

	return (
		<div className="flex items-center gap-3">
			<span
				className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 select-none ${avatarClass}`}
				aria-hidden="true"
			>
				{initials}
			</span>
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium text-text truncate leading-tight">
					{author}
				</p>
				<time dateTime={date} className="text-xs text-text-muted">
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
		<h3 className="font-semibold text-text text-sm leading-snug">{title}</h3>
	);
}

interface BodyProps {
	text: string;
}

function Body({ text }: BodyProps): React.ReactElement {
	return (
		<p className="text-text-secondary text-sm leading-relaxed line-clamp-4 flex-1">
			{text}
		</p>
	);
}

interface TagsProps {
	tags: string[] | null;
	id: string;
}

function Tags({ tags, id }: TagsProps): React.ReactElement | null {
	if (!tags || tags.length === 0) return null;
	return (
		<ul className="flex flex-wrap gap-1.5" aria-label="Tags">
			{tags.map((tag, index) => (
				<li
					key={`tag-${id}-${index}`}
					className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
				>
					{tag}
				</li>
			))}
		</ul>
	);
}

interface FooterProps {
	store: string;
	version: string | null;
	hasResponse: boolean;
}

function Footer({
	store,
	version,
	hasResponse,
}: FooterProps): React.ReactElement {
	const storeLabel = STORE_LABELS[store] ?? store;

	return (
		<footer className="flex items-center gap-2 px-4 py-2.5 bg-surface-raised border-t border-border">
			<span className="text-xs text-text-muted font-medium px-2 py-0.5 rounded-full bg-border">
				{storeLabel}
			</span>
			{version && <span className="text-xs text-text-muted">v{version}</span>}
			{hasResponse && (
				<span className="ml-auto text-xs text-rating-high font-medium flex items-center gap-1">
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						aria-hidden="true"
					>
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
	const borderClass = getRatingBorderClass(review.stars);

	return (
		<article
			aria-label={`${review.title} by ${review.author}`}
			className={`bg-surface rounded-card flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 shadow-card hover:shadow-card-hover border-l-[3px] ${borderClass}`}
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
				<ReviewCard.Tags tags={review.tags} id={review.id} />
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
ReviewCard.Tags = Tags;
ReviewCard.Footer = Footer;
