import type { Review } from "@/shared/types/reviews";
import { formatReviewDate } from "@/shared/utils/formatDate";

interface ReviewCardProps {
	review: Review;
}

function StarRating({ stars }: { stars: string }): React.ReactElement {
	const value = Math.round(parseFloat(stars));
	const filled = "★".repeat(value);
	const empty = "☆".repeat(5 - value);

	return (
		<span
			role="img"
			aria-label={`${value} out of 5 stars`}
			className="text-[var(--color-star)] text-sm select-none"
		>
			{filled}
			<span className="text-gray-300">{empty}</span>
		</span>
	);
}

export function ReviewCard({ review }: ReviewCardProps): React.ReactElement {
	return (
		<article
			role="article"
			aria-label={`${review.title} by ${review.author}`}
			className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)] p-4 flex flex-col gap-2 hover:shadow-md transition-shadow"
		>
			<div className="flex items-start justify-between gap-2">
				<h3 className="font-semibold text-[var(--color-text)] text-sm leading-snug">
					{review.title}
				</h3>
				<StarRating stars={review.stars} />
			</div>

			<p className="text-[var(--color-text)] text-sm leading-relaxed line-clamp-4">
				{review.review}
			</p>

			<footer className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mt-1">
				<span>{review.author}</span>
				<time dateTime={review.date}>{formatReviewDate(review.date)}</time>
			</footer>
		</article>
	);
}
