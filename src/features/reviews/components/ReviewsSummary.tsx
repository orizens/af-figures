import { useSearch } from "@tanstack/react-router";

interface ReviewsSummaryProps {
	totalReviews: number;
	isFetching: boolean;
}

export function ReviewsSummary({
	totalReviews,
	isFetching,
}: ReviewsSummaryProps): React.ReactElement {
	const { q, rating } = useSearch({ from: "/" });

	const hasFilters = q !== "" || (rating !== undefined && rating.length > 0);
	const label = hasFilters
		? `Showing ${totalReviews.toLocaleString()} reviews`
		: "All Reviews";

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
