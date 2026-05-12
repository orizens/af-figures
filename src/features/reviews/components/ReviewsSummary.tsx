interface ReviewsSummaryProps {
	totalReviews: number;
	pagesLoaded: number;
	isFetching: boolean;
	q: string;
	rating: number[] | undefined;
}

export function ReviewsSummary({
	totalReviews,
	pagesLoaded,
	isFetching,
	q,
	rating,
}: ReviewsSummaryProps): React.ReactElement {

	const hasFilters = q !== "" || (rating !== undefined && rating.length > 0);
	const reviewsLabel = hasFilters
		? `Showing ${totalReviews.toLocaleString()} reviews`
		: "All Reviews";
	const pagesLabel = pagesLoaded > 0 ? `${pagesLoaded} page${pagesLoaded === 1 ? "" : "s"} loaded` : "";
	const label = pagesLabel ? `${reviewsLabel} · ${pagesLabel}` : reviewsLabel;

	return (
		<p
			role="status"
			aria-label={label}
			aria-busy={isFetching}
			className="text-sm text-[var(--color-text-muted)]"
		>
			{label}
		</p>
	);
}
